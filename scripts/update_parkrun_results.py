#!/usr/bin/env python3
"""
Fetch full parkrun history from parkrun.org.uk per-event parkrunner pages and
rewrite the generated block in content/parkrun.md (between HTML markers).

Requires: pip install -r scripts/requirements-parkrun.txt

Environment:
  PARKRUN_ID   parkrunner id (default: 11453050)
  PARKRUN_BASE default https://www.parkrun.org.uk
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

import urllib.parse

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
PARKRUN_MD = ROOT / "content" / "parkrun.md"
SUPPRESS_JSON = ROOT / "data" / "parkrun_suppress.json"
MARKER_START = "<!-- BEGIN PARKRUN_GENERATED -->"
MARKER_END = "<!-- END PARKRUN_GENERATED -->"

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
REQUEST_DELAY_SEC = 1.0
# Bar chart shows only the most recent N runs; markdown tables list the full history.
CHART_MAX_RUNS = 10


@dataclass(frozen=True)
class Run:
    when: datetime
    event_title: str  # e.g. "Vermuyden Way parkrun"
    location: str  # short place name for Location column
    time_str: str  # raw from site e.g. 40:02 or 1:17:00
    is_pb: bool


def _session() -> requests.Session:
    s = requests.Session()
    s.headers.update({"User-Agent": USER_AGENT, "Accept-Language": "en-GB,en;q=0.9"})
    return s


def fetch_html(session: requests.Session, url: str) -> str:
    r = session.get(url, timeout=45)
    r.raise_for_status()
    return r.text


def discover_event_urls(
    session: requests.Session, profile_url: str, parkrun_id: str
) -> list[str]:
    parsed_base = urllib.parse.urlparse(profile_url)
    base_origin = f"{parsed_base.scheme}://{parsed_base.netloc}"
    html = fetch_html(session, profile_url)
    soup = BeautifulSoup(html, "html.parser")
    found: set[str] = set()
    for a in soup.find_all("a", href=True):
        href = urllib.parse.urljoin(profile_url, a["href"])
        m = re.match(
            r"^https?://[^/]+/([^/]+)/parkrunner/(\d+)/?$",
            href,
        )
        if not m:
            continue
        slug, pid = m.group(1), m.group(2)
        if pid != parkrun_id or slug == "parkrunner":
            continue
        found.add(f"{base_origin}/{slug}/parkrunner/{pid}/")
    return sorted(found)


def parse_time_to_seconds(t: str) -> int | None:
    t = t.strip()
    if not t or t.upper() == "DNF":
        return None
    parts = t.split(":")
    try:
        if len(parts) == 2:
            m, s = int(parts[0]), int(parts[1])
            return m * 60 + s
        if len(parts) == 3:
            h, m, s = int(parts[0]), int(parts[1]), int(parts[2])
            return h * 3600 + m * 60 + s
    except ValueError:
        return None
    return None


def format_hms(seconds: int) -> str:
    h, rem = divmod(seconds, 3600)
    m, s = divmod(rem, 60)
    return f"{h}h {m:02d}m {s:02d}s"


def format_min_km(seconds: int) -> str:
    """Pace per km for a 5 km parkrun."""
    if seconds <= 0:
        return "—"
    sec_per_km = seconds / 5.0
    m = int(sec_per_km // 60)
    s = int(round(sec_per_km % 60))
    if s == 60:
        m += 1
        s = 0
    return f"{m:02d}m {s:02d}s"


def parse_event_page(session: requests.Session, url: str) -> list[Run]:
    html = fetch_html(session, url)
    soup = BeautifulSoup(html, "html.parser")
    runs: list[Run] = []
    for table in soup.find_all("table"):
        cap = table.find("caption")
        if not cap:
            continue
        cap_text = cap.get_text(" ", strip=True)
        if "All Results at" not in cap_text:
            continue
        place = cap_text.replace("All Results at", "").strip()
        event_title = f"{place} parkrun" if not place.lower().endswith("parkrun") else place
        thead = table.find("thead")
        if not thead:
            continue
        headers = [th.get_text(" ", strip=True).lower() for th in thead.find_all("th")]
        try:
            i_date = next(i for i, h in enumerate(headers) if "run date" in h)
            i_time = next(i for i, h in enumerate(headers) if h == "time")
        except StopIteration:
            continue
        pb_idx = None
        for i, h in enumerate(headers):
            if "pb" in h:
                pb_idx = i
                break
        tbody = table.find("tbody")
        if not tbody:
            continue
        for tr in tbody.find_all("tr"):
            cells = tr.find_all("td")
            if len(cells) <= max(i_date, i_time):
                continue
            date_cell = cells[i_date]
            ds = date_cell.get_text(" ", strip=True)
            # Prefer span.format-date
            span = date_cell.find("span", class_=re.compile("format-date"))
            if span:
                ds = span.get_text(strip=True)
            when = parse_run_date(ds)
            if not when:
                continue
            time_raw = cells[i_time].get_text(" ", strip=True)
            is_pb = False
            if pb_idx is not None and len(cells) > pb_idx:
                is_pb = "pb" in cells[pb_idx].get_text(" ", strip=True).lower()
            sec = parse_time_to_seconds(time_raw)
            if sec is None:
                continue
            runs.append(
                Run(
                    when=when,
                    event_title=event_title,
                    location=place,
                    time_str=time_raw,
                    is_pb=is_pb,
                )
            )
    return runs


def parse_run_date(ds: str) -> datetime | None:
    ds = ds.strip()
    m = re.match(r"^(\d{1,2})/(\d{1,2})/(\d{4})$", ds)
    if not m:
        return None
    d, mo, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
    try:
        return datetime(y, mo, d)
    except ValueError:
        return None


def format_date_long(d: datetime) -> str:
    return f"{d.day} {d.strftime('%B')} {d.year}"


def format_date_short_chart(d: datetime) -> str:
    """e.g. '22 Nov' or '1 Jan' (no leading zero on day)."""
    day = d.day
    mon = d.strftime("%b")
    return f"{day} {mon}"


def build_markdown_tables(runs: list[Run]) -> str:
    by_year: dict[int, list[Run]] = defaultdict(list)
    for r in runs:
        by_year[r.when.year].append(r)
    years = sorted(by_year.keys(), reverse=True)
    parts: list[str] = []
    for year in years:
        year_runs = sorted(by_year[year], key=lambda x: x.when, reverse=True)
        parts.append(f"### {year}\n")
        parts.append(
            "| Event/Run | Date | Location | Results | min/km |\n"
            "|-----------|------|----------|---------|--------|"
        )
        for r in year_runs:
            sec = parse_time_to_seconds(r.time_str)
            if sec is None:
                continue
            res = format_hms(sec)
            pace = format_min_km(sec)
            ev = r.event_title
            parts.append(
                f"| {ev} | {format_date_long(r.when)} | {r.location} | {res} | {pace} |"
            )
        parts.append("")
    return "\n".join(parts).rstrip() + "\n"


def build_chart_html(runs: list[Run]) -> str:
    """Bar chart: last CHART_MAX_RUNS runs, chronological; taller bar = slower time."""
    ordered = sorted(runs, key=lambda x: x.when)
    if not ordered:
        return (
            '<p style="color:#666;">No parkrun results were returned from the scraper.</p>\n'
        )
    chart_runs = ordered[-CHART_MAX_RUNS:]
    secs = []
    for r in chart_runs:
        s = parse_time_to_seconds(r.time_str)
        if s is not None:
            secs.append(s)
    if not secs:
        return '<p style="color:#666;">No finish times to chart.</p>\n'
    lo, hi = min(secs), max(secs)
    span = max(hi - lo, 1)

    def bar_height(s: int) -> int:
        # Map slowest -> ~210px, fastest -> ~120px (similar to previous manual chart)
        return int(120 + (s - lo) / span * 90)

    tds = []
    for r in chart_runs:
        s = parse_time_to_seconds(r.time_str)
        if s is None:
            continue
        h = bar_height(s)
        label = format_hms(s).replace("0h ", "")
        color = "#4CAF50" if r.is_pb else "#2196F3"
        day = format_date_short_chart(r.when)
        tds.append(
            f"""      <td style="text-align: center; padding: 5px; position: relative;">
        <div style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); font-weight: bold; font-size: 11px;">{label}</div>
        <div style="background: {color}; height: {h}px; margin: 0 auto; width: 60px; border-radius: 4px 4px 0 0;"></div>
        <div style="font-size: 10px; margin-top: 5px;">{day}</div>
      </td>"""
        )
    row_inner = "\n".join(tds)
    return f"""<div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; color: #333333;">
  <h3 style="margin-top: 0;">5k Parkrun Times</h3>
  <p style="font-size: 0.9em; margin-top: 0;">Most recent {CHART_MAX_RUNS} runs (left to right by date); official parkrun results (taller bar = slower time). Green bars are personal bests at that course.</p>
  <div class="table-responsive">
  <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 4px;">
    <tr style="vertical-align: bottom; height: 250px;">
{row_inner}
    </tr>
  </table>
  </div>
</div>
"""


def load_suppressions() -> set[tuple[str, str]]:
    """Return set of (event_title, YYYY-MM-DD) to drop from generated output."""
    if not SUPPRESS_JSON.is_file():
        return set()
    try:
        data = json.loads(SUPPRESS_JSON.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return set()
    out: set[tuple[str, str]] = set()
    for row in data.get("suppress", []):
        ev = (row.get("event") or "").strip()
        ds = (row.get("date") or "").strip()
        if ev and ds:
            out.add((ev, ds))
    return out


def replace_generated(md: str, generated: str) -> str:
    if MARKER_START not in md or MARKER_END not in md:
        raise SystemExit(
            f"Missing {MARKER_START} or {MARKER_END} in {PARKRUN_MD}"
        )
    pre, rest = md.split(MARKER_START, 1)
    _, post = rest.split(MARKER_END, 1)
    return pre + MARKER_START + "\n" + generated + "\n" + MARKER_END + post


def main() -> int:
    parkrun_id = os.environ.get("PARKRUN_ID", "11453050").strip()
    base = os.environ.get("PARKRUN_BASE", "https://www.parkrun.org.uk").rstrip("/")
    profile_url = f"{base}/parkrunner/{parkrun_id}/"

    session = _session()
    urls = discover_event_urls(session, profile_url, parkrun_id)
    if not urls:
        print("No per-event parkrunner URLs found; check PARKRUN_ID and profile page.", file=sys.stderr)
        return 1
    print(f"Found {len(urls)} event page(s)")

    all_runs: list[Run] = []
    for i, url in enumerate(urls):
        if i:
            time.sleep(REQUEST_DELAY_SEC)
        try:
            runs = parse_event_page(session, url)
        except requests.RequestException as e:
            print(f"WARN: {url}: {e}", file=sys.stderr)
            continue
        print(f"  {url}: {len(runs)} run(s)")
        all_runs.extend(runs)

    # De-dupe same event + date (keep one); apply data/parkrun_suppress.json
    suppress = load_suppressions()
    seen: set[tuple[str, str]] = set()
    unique: list[Run] = []
    for r in sorted(all_runs, key=lambda x: (x.when, x.event_title)):
        key = (r.event_title, r.when.date().isoformat())
        if key in seen:
            continue
        if key in suppress:
            continue
        seen.add(key)
        unique.append(r)

    chart = build_chart_html(unique)
    tables = build_markdown_tables(unique)
    generated = (
        "## Progress chart\n\n"
        + chart
        + "\n## Parkrun results\n\n"
        f"Official 5 km parkrun times from [parkrun.org.uk]"
        f"({base}/parkrunner/{parkrun_id}/). \n\n"
        + tables
    )

    text = PARKRUN_MD.read_text(encoding="utf-8")
    new_text = replace_generated(text, generated)
    PARKRUN_MD.write_text(new_text, encoding="utf-8", newline="\n")
    print(f"Wrote {len(unique)} unique runs to {PARKRUN_MD.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
