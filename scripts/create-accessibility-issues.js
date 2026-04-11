'use strict';

const fs = require('fs');
const https = require('https');

const GITHUB_TOKEN = (process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '').trim();
const BUILD_NUMBER = process.env.BUILD_NUMBER || 'unknown';
const REPO = process.env.REPO || 'funkysi1701/funkysi1701.github.io';
const SITE_URL = process.env.SITE_URL || 'https://blog-dev.funkysi1701.com';
const RESULTS_PATH = process.env.PA11Y_RESULTS_PATH || '/app/pa11y-results.json';

if (!GITHUB_TOKEN) {
  console.error(
    'GITHUB_TOKEN (or GH_TOKEN) is missing. Add a secret in Azure DevOps variable group Global named GITHUB_TOKEN, and map it under this task env: (see azure-pipelines.yml).'
  );
  process.exit(1);
}

function githubRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = {
      // Fine-grained PATs require Bearer; classic ghp_* works with Bearer too (GitHub REST docs).
      Authorization: 'Bearer ' + GITHUB_TOKEN,
      'User-Agent': 'Azure-Pipelines-Pa11y',
      Accept: 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (data) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(data);
    }
    const req = https.request(
      { hostname: 'api.github.com', path, method, headers },
      (res) => {
        let responseData = '';
        res.on('data', (chunk) => { responseData += chunk; });
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(responseData) });
          } catch (_) {
            resolve({ status: res.statusCode, body: responseData });
          }
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function ensureLabel() {
  const res = await githubRequest('GET', `/repos/${REPO}/labels/accessibility`, null);
  if (res.status === 404) {
    const createRes = await githubRequest('POST', `/repos/${REPO}/labels`, {
      name: 'accessibility',
      color: '0075ca',
      description: 'Accessibility issues detected by Pa11y',
    });
    if (createRes.status === 201) {
      console.log('Created "accessibility" label');
    } else {
      console.warn('Failed to create label:', createRes.status, JSON.stringify(createRes.body));
    }
  }
}

const PA11Y_ISSUE_TITLE_PREFIX = 'Accessibility: ';

function parsePa11yManagedCode(title) {
  if (typeof title !== 'string' || !title.startsWith(PA11Y_ISSUE_TITLE_PREFIX)) {
    return null;
  }
  return title.slice(PA11Y_ISSUE_TITLE_PREFIX.length).trim() || null;
}

async function getOpenAccessibilityIssues() {
  const perPage = 100;
  const out = [];
  let page = 1;

  while (true) {
    const res = await githubRequest(
      'GET',
      `/repos/${REPO}/issues?labels=accessibility&state=open&per_page=${perPage}&page=${page}`,
      null
    );

    if (res.status !== 200) {
      if (res.status === 401) {
        throw new Error(
          'GitHub API 401: invalid or expired token, or missing repo/issues access. Use a PAT with classic scope "repo" (private) or "public_repo" (public only), or a fine-grained token with Issues read/write on this repository. Ensure the Global variable GITHUB_TOKEN is set and this pipeline is allowed to use it.'
        );
      }
      throw new Error(`Failed to fetch open accessibility issues: ${res.status}`);
    }

    const issues = Array.isArray(res.body) ? res.body : [];
    for (const issue of issues) {
      if (issue.pull_request) {
        continue;
      }
      out.push({ number: issue.number, title: issue.title });
    }

    if (issues.length < perPage) {
      break;
    }

    page += 1;
  }

  return out;
}

function postIssueComment(issueNumber, body) {
  return githubRequest('POST', `/repos/${REPO}/issues/${issueNumber}/comments`, { body });
}

function closeIssue(issueNumber) {
  return githubRequest('PATCH', `/repos/${REPO}/issues/${issueNumber}`, { state: 'closed' });
}

/**
 * Close open "Accessibility: …" issues whose WCAG code was not reported as an error in this run.
 * Returns the closed count and the remaining open issues (those not closed).
 */
async function closeResolvedPa11yIssues(openIssues, errorCodesFound) {
  const toClose = openIssues.filter((issue) => {
    const code = parsePa11yManagedCode(issue.title);
    if (!code) {
      return false;
    }
    return !errorCodesFound.has(code);
  });

  let closed = 0;
  const closedNumbers = new Set();
  for (const issue of toClose) {
    const comment = [
      'Pa11y did not report this violation as an **error** in the latest full-site scan.',
      '',
      `- **Build**: ${BUILD_NUMBER}`,
      `- **Site**: ${SITE_URL}`,
      '',
      'Closing as resolved. Reopen if you still see the problem or if this was closed in error.',
    ].join('\n');

    const commentRes = await postIssueComment(issue.number, comment);
    if (commentRes.status !== 201) {
      console.warn(
        `Could not comment on #${issue.number} before close:`,
        commentRes.status,
        typeof commentRes.body === 'string' ? commentRes.body : JSON.stringify(commentRes.body)
      );
      continue;
    }

    const closeRes = await closeIssue(issue.number);
    if (closeRes.status === 200) {
      console.log(`Closed resolved issue #${issue.number}: ${issue.title}`);
      closed++;
      closedNumbers.add(issue.number);
    } else {
      console.warn(
        `Failed to close #${issue.number}:`,
        closeRes.status,
        typeof closeRes.body === 'string' ? closeRes.body : JSON.stringify(closeRes.body)
      );
    }
  }

  const remaining = openIssues.filter((i) => !closedNumbers.has(i.number));
  return { closed, remaining };
}

function wcagReferenceUrl(code) {
  // WCAG codes are like "WCAG2AA.Principle1.Guideline1_1.1_1_1.H37"
  // Extract the guideline number (e.g. "1_1") to build a reference link.
  const match = code.match(/Guideline(\d+_\d+(?:_\d+)*)/);
  if (match) {
    const guideline = match[1].replace(/_/g, '-');
    return `https://www.w3.org/WAI/WCAG21/Understanding/${guideline}.html`;
  }
  return 'https://www.w3.org/WAI/WCAG21/Understanding/';
}

function buildIssueBody(code, issues) {
  // Extract axe-provided metadata from the first issue that has it
  const axeExtras = issues.map((i) => i.runnerExtras).find((e) => e && (e.help || e.impact));
  const impact = axeExtras && axeExtras.impact ? axeExtras.impact : null;
  const helpText = axeExtras && axeExtras.help ? axeExtras.help : null;
  const helpUrl = axeExtras && axeExtras.helpUrl ? axeExtras.helpUrl : null;
  const runners = [...new Set(issues.map((i) => i.runner).filter(Boolean))];
  const colourThemes = [...new Set(issues.map((i) => i.pa11yTheme).filter(Boolean))].sort();

  const pageUrls = [...new Set(issues.map((i) => i.pageUrl).filter(Boolean))].sort();
  const urlSection =
    pageUrls.length === 0
      ? `**Scan entry URL**: ${SITE_URL}`
      : pageUrls.length === 1
        ? `**Page**: ${pageUrls[0]}`
        : ['**Pages** _(this issue appears on multiple URLs)_:', '', ...pageUrls.map((p) => `- ${p}`)].join(
            '\n',
          );

  // Build a summary header
  const header = [
    '## Accessibility Issue Found by Pa11y',
    '',
    `**WCAG Code**: \`${code}\``,
    `**WCAG Reference**: ${wcagReferenceUrl(code)}`,
    impact ? `**Impact**: ${impact}` : null,
    helpText ? `**Rule**: ${helpText}` : null,
    helpUrl ? `**Rule Details**: ${helpUrl}` : null,
    `**Total Occurrences**: ${issues.length}`,
    runners.length ? `**Detected by**: ${runners.join(', ')}` : null,
    colourThemes.length
      ? `**Colour themes (Pa11y)**: ${colourThemes.join(', ')}`
      : null,
    urlSection,
    `**Build**: ${BUILD_NUMBER}`,
  ]
    .filter((line) => line !== null)
    .join('\n');

  // How to fix section: use axe help text if available, otherwise derive from message
  const fixGuidance = helpText || issues[0].message;
  const howToFix = [
    '## How to Fix',
    '',
    fixGuidance,
    helpUrl ? `\nSee the full rule documentation: ${helpUrl}` : null,
  ]
    .filter((line) => line !== null)
    .join('\n');

  // List selectors so an AI agent can locate affected elements (cap at 100 to avoid GitHub body limit)
  const MAX_SELECTORS = 100;
  const selectorLines = issues
    .slice(0, MAX_SELECTORS)
    .map((issue, i) => `${i + 1}. \`${issue.selector || 'N/A'}\``);
  if (issues.length > MAX_SELECTORS) {
    selectorLines.push(`_… and ${issues.length - MAX_SELECTORS} more (${issues.length} total)_`);
  }
  const allSelectors = selectorLines.join('\n');

  const selectorSection = [
    '## All Affected Elements',
    '',
    'The following CSS selectors identify every element that needs to be fixed:',
    '',
    allSelectors,
  ].join('\n');

  // Show up to 5 detailed examples with full context so an AI agent can see the HTML to change
  const maxExamples = Math.min(issues.length, 5);
  const examples = issues
    .slice(0, maxExamples)
    .map((issue, i) => {
      const extraImpact =
        issue.runnerExtras && issue.runnerExtras.impact
          ? `\n**Impact**: ${issue.runnerExtras.impact}`
          : '';
      const extraHelp =
        issue.runnerExtras && issue.runnerExtras.help
          ? `\n**Fix**: ${issue.runnerExtras.help}`
          : '';
      const pageBlock = issue.pageUrl ? [`**Page**: ${issue.pageUrl}`, ''] : [];
      const themeBlock =
        issue.pa11yTheme && typeof issue.pa11yTheme === 'string'
          ? [`**Colour theme**: ${issue.pa11yTheme}`, '']
          : [];
      return [
        `### Occurrence ${i + 1}${issue.runner ? ` _(${issue.runner})_` : ''}`,
        '',
        ...pageBlock,
        ...themeBlock,
        `**Message**: ${issue.message}${extraImpact}${extraHelp}`,
        `**Selector**: \`${issue.selector || 'N/A'}\``,
        '',
        '**HTML Context** _(the snippet below is what needs to be changed)_:',
        '```html',
        (issue.context || 'N/A').trim(),
        '```',
      ].join('\n');
    })
    .join('\n\n');

  const examplesSection = [
    `## Detailed Examples (showing ${maxExamples} of ${issues.length})`,
    '',
    examples,
  ].join('\n');

  return [
    header,
    '',
    '---',
    '',
    howToFix,
    '',
    '---',
    '',
    selectorSection,
    '',
    '---',
    '',
    examplesSection,
    '',
    '---',
    '_Detected by [Pa11y](https://pa11y.org/) accessibility checker in Azure Pipeline_',
  ].join('\n');
}

async function run() {
  if (process.env.PA11Y_RUN_FAILED === '1') {
    console.error(
      'Pa11y did not finish successfully (e.g. Chromium launch failed). Check Azure pipeline logs and pa11y-error.log. Not updating GitHub issues.'
    );
    process.exit(0);
  }

  let results;
  try {
    results = JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf8'));
  } catch (e) {
    console.log('Could not read or parse pa11y results:', e.message);
    return;
  }

  if (!Array.isArray(results)) {
    console.log('Pa11y results are not a JSON array; not updating GitHub issues.');
    return;
  }

  const errors = results.filter((r) => r.type === 'error');
  const errorCodesFound = new Set(errors.map((e) => e.code).filter(Boolean));

  console.log(
    `Found ${results.length} total findings (${errors.length} errors, ${results.length - errors.length} warnings/notices)`
  );

  await ensureLabel();

  let openIssues;
  try {
    openIssues = await getOpenAccessibilityIssues();
  } catch (err) {
    console.error('Aborting: could not list open accessibility issues:', err.message);
    process.exit(1);
  }

  const { closed, remaining } = await closeResolvedPa11yIssues(openIssues, errorCodesFound);
  if (closed > 0) {
    console.log(`Closed ${closed} issue(s) that Pa11y no longer reports as errors.`);
  }

  if (errors.length === 0) {
    if (results.length === 0) {
      console.log('No accessibility findings in results — great work!');
    } else {
      console.log('No accessibility errors (only warnings/notices); resolved issues were closed if applicable.');
    }
    return;
  }

  const existingTitles = new Set(remaining.map((i) => i.title));

  // Group errors by WCAG code so each unique violation gets one issue
  const byCode = {};
  for (const issue of errors) {
    if (!byCode[issue.code]) byCode[issue.code] = [];
    byCode[issue.code].push(issue);
  }

  let created = 0;
  let skipped = 0;

  for (const [code, issues] of Object.entries(byCode)) {
    const title = `${PA11Y_ISSUE_TITLE_PREFIX}${code}`;
    if (existingTitles.has(title)) {
      console.log(`Skipping (already open): ${title}`);
      skipped++;
      continue;
    }

    const MAX_BODY = 65000;
    let body = buildIssueBody(code, issues);
    if (body.length > MAX_BODY) {
      const truncNote = '\n\n_⚠️ Issue body was truncated to fit GitHub\'s size limit._';
      body = body.slice(0, MAX_BODY - truncNote.length) + truncNote;
    }

    const res = await githubRequest('POST', `/repos/${REPO}/issues`, {
      title,
      body,
      labels: ['accessibility'],
    });

    if (res.status === 201 && res.body.html_url) {
      console.log(`Created issue: ${res.body.html_url}`);
      created++;
    } else if (res.status === 401) {
      console.error(
        `Failed to create issue for ${code}: 401 — same as fetch: fix GITHUB_TOKEN (Bearer PAT with issues permission).`
      );
    } else {
      console.warn(`Failed to create issue for ${code}:`, res.status, JSON.stringify(res.body));
    }
  }

  console.log(
    `Done: ${closed} closed, ${created} created, ${skipped} skipped (still open with same violation)`
  );
}

run().catch((e) => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
