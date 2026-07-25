import assert from "node:assert/strict";
import test from "node:test";

import {
  buildToml,
  canonicalPath,
  fetchTopPaths,
} from "./run.mjs";

test("canonicalPath merges query variants and normalises post paths", () => {
  assert.equal(
    canonicalPath("/posts/2026/DotNet-5-to-10-features?ref=dailydev"),
    "/posts/2026/dotnet-5-to-10-features/",
  );
  assert.equal(
    canonicalPath("/posts/2025/merge-two-projects-into-one/index.html"),
    "/posts/2025/merge-two-projects-into-one/",
  );
  assert.equal(canonicalPath("https://example.com/post"), null);
  assert.equal(canonicalPath("/bad%ZZ"), null);
});

test("buildToml emits stable escaped data and automation metadata", () => {
  const toml = buildToml(
    [
      {
        title: 'A "quoted" post',
        url: "/posts/2026/quoted-post/",
      },
      {
        title: "Backslash \\\\ post",
        url: "/posts/2025/backslash-post/",
      },
      {
        title: "Third post",
        url: "/posts/2024/third-post/",
      },
    ],
    30,
  );

  assert.match(toml, /last 30 days/);
  assert.match(toml, /title = "A \\"quoted\\" post"/);
  assert.match(toml, /title = "Backslash \\\\\\\\ post"/);
  assert.equal((toml.match(/\[\[items\]\]/g) ?? []).length, 3);
  assert.ok(toml.endsWith("\n"));
});

test("fetchTopPaths sends the RUM query and returns path groups", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  globalThis.fetch = async (url, init) => {
    assert.equal(url, "https://api.cloudflare.com/client/v4/graphql");
    assert.equal(init.method, "POST");
    assert.equal(init.headers.Authorization, "Bearer test-token");

    const { query } = JSON.parse(init.body);
    assert.match(query, /rumPageloadEventsAdaptiveGroups/);
    assert.match(query, /accountTag: "a{32}"/);
    assert.match(query, /siteTag: "site-tag"/);
    assert.match(query, /orderBy: \[count_DESC\]/);

    return new Response(
      JSON.stringify({
        data: {
          viewer: {
            accounts: [
              {
                rumPageloadEventsAdaptiveGroups: [
                  {
                    count: 42,
                    dimensions: {
                      requestPath: "/posts/2026/example/",
                    },
                  },
                ],
              },
            ],
          },
        },
      }),
      { status: 200 },
    );
  };

  const groups = await fetchTopPaths({
    token: "test-token",
    accountTag: "a".repeat(32),
    siteTag: "site-tag",
    days: 30,
  });

  assert.deepEqual(groups, [
    {
      count: 42,
      dimensions: { requestPath: "/posts/2026/example/" },
    },
  ]);
});
