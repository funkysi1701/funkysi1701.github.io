'use strict';

const fs = require('fs');
const https = require('https');

const GITHUB_TOKEN = (process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '').trim();
const BUILD_NUMBER = process.env.BUILD_NUMBER || 'unknown';
const REPO = 'funkysi1701/funkysi1701.github.io';
const SITE_URL = 'https://bog-dev.funkysi1701.com';
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

async function getExistingIssueTitles() {
  const perPage = 100;
  const titles = new Set();
  let page = 1;

  while (true) {
    const res = await githubRequest(
      'GET',
      `/repos/${REPO}/issues?labels=accessibility&state=open&per_page=${perPage}&page=${page}`,
      null
    );

    if (res.status !== 200) {
      if (res.status === 401) {
        console.error(
          'GitHub API 401: invalid or expired token, or missing repo/issues access. Use a PAT with classic scope "repo" (private) or "public_repo" (public only), or a fine-grained token with Issues read/write on this repository. Ensure the Global variable GITHUB_TOKEN is set and this pipeline is allowed to use it.'
        );
      } else {
        console.warn('Failed to fetch existing issues:', res.status);
      }
      return new Set();
    }

    const issues = Array.isArray(res.body) ? res.body : [];
    issues.forEach((issue) => titles.add(issue.title));

    if (issues.length < perPage) {
      break;
    }

    page += 1;
  }

  return titles;
}

function buildIssueBody(code, issues) {
  const examples = issues
    .slice(0, 3)
    .map((issue, i) =>
      [
        `### Example ${i + 1}`,
        '',
        `**Message**: ${issue.message}`,
        `**Selector**: \`${issue.selector || 'N/A'}\``,
        '',
        '**Context:**',
        '```html',
        (issue.context || 'N/A').trim(),
        '```',
      ].join('\n')
    )
    .join('\n\n');

  return [
    '## Accessibility Issue Found by Pa11y',
    '',
    `**WCAG Code**: \`${code}\``,
    `**Total Occurrences**: ${issues.length}`,
    `**URL**: ${SITE_URL}`,
    `**Build**: ${BUILD_NUMBER}`,
    '',
    '---',
    '',
    examples,
    '',
    '---',
    '_Detected by [Pa11y](https://pa11y.org/) accessibility checker in Azure Pipeline_',
  ].join('\n');
}

async function run() {
  if (process.env.PA11Y_RUN_FAILED === '1') {
    console.error(
      'Pa11y did not finish successfully (e.g. Chromium launch failed). Check Azure pipeline logs and pa11y-error.log. Not creating GitHub issues.'
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

  if (!Array.isArray(results) || results.length === 0) {
    console.log('No accessibility issues found - great work!');
    return;
  }

  const errors = results.filter((r) => r.type === 'error');
  console.log(
    `Found ${results.length} total issues (${errors.length} errors, ${results.length - errors.length} warnings/notices)`
  );

  if (errors.length === 0) {
    console.log('No accessibility errors to report (only warnings/notices)');
    return;
  }

  await ensureLabel();
  const existingTitles = await getExistingIssueTitles();

  // Group errors by WCAG code so each unique violation gets one issue
  const byCode = {};
  for (const issue of errors) {
    if (!byCode[issue.code]) byCode[issue.code] = [];
    byCode[issue.code].push(issue);
  }

  let created = 0;
  let skipped = 0;

  for (const [code, issues] of Object.entries(byCode)) {
    const title = `Accessibility: ${code}`;
    if (existingTitles.has(title)) {
      console.log(`Skipping (already open): ${title}`);
      skipped++;
      continue;
    }

    const res = await githubRequest('POST', `/repos/${REPO}/issues`, {
      title,
      body: buildIssueBody(code, issues),
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

  console.log(`Done: ${created} issue(s) created, ${skipped} skipped (already open)`);
}

run().catch((e) => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
