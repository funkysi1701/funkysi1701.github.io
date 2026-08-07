/**
 * Hugo `title` in config varies by environment:
 * - production (`config/_default` / `config/production`): Funky Si's Blog
 * - blog-dev (`config/development`): Funky Si's Blog (Dev)
 * - blog-test (`config/staging`): Funky Si's Test
 *
 * Assert the exact site-title fragment for the target BASE_URL so a truncated
 * or same-length fake suffix (e.g. "Deve") cannot pass silently.
 */

function siteTitleForBaseUrl(baseURL: string): string {
  const url = baseURL.trim().toLowerCase();
  if (url.includes('blog-dev.')) {
    return "Funky Si's Blog (Dev)";
  }
  if (url.includes('blog-test.')) {
    return "Funky Si's Test";
  }
  return "Funky Si's Blog";
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const resolvedBaseURL =
  process.env.BASE_URL?.trim() || 'https://www.funkysi1701.com';

/** Exact Hugo site title for the current Playwright BASE_URL. */
export const EXPECTED_SITE_TITLE = siteTitleForBaseUrl(resolvedBaseURL);

/**
 * Matches document titles that include the environment's site title
 * (homepage may prefix the hero headline; posts append the site title).
 */
export const SITE_TITLE_PATTERN = new RegExp(
  escapeRegExp(EXPECTED_SITE_TITLE),
  'i',
);
