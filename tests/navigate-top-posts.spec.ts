import { test, expect } from './fixtures';

test('navigate to www.funkysi1701.com, click top blog posts, check console for errors', async ({ page }) => {
  // Collect console errors
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  // Step 1: Navigate to the homepage
  await page.goto('/');
  await expect(page).toHaveTitle(/Funky Si's Blog/);

  // Step 2: Use explicit URLs for the top blog posts based on MCP output
  const blogPostUrls = [
    '/posts/start-here/',
    '/posts/2026/ndc-london-2026/',
    '/posts/2026/2025-in-review-and-2026-goals/',

    '/posts/2025/kubernetes-and-letsencrypt/',
    '/posts/2025/stepping-outside-your-comfort-zone/',
    '/posts/2025/deploying-hugo-with-helm/',
    '/posts/2025/learning-kubernetes/',
    '/posts/2025/getting-started-with-opentelemetry/',
    '/posts/2025/periodic-table-devops-2025/',
    '/posts/2025/setting-up-grafana/',
    '/posts/2025/opentelemetry-logs/',
    '/posts/2025/nuget-central-package-management/',
    '/posts/2025/merge-two-projects-into-one/',
    '/posts/2025/mandelbrot-set/',
    '/posts/2025/pragmatic-programmer/',
    '/posts/2025/whats-new-csharp/',
    '/posts/2025/volunteering-at-ndc/',
    '/posts/2025/using-ai/',
    '/posts/2025/the-hacker-ethic/',
    '/posts/2025/monitoring-with-nagios-docker/',
    '/posts/2025/fun-with-ai/',
    '/posts/2025/festive-naughty-or-nice-checker/',
    '/posts/2025/exceptions/',
    '/posts/2025/blazor-and-dotnet10/',
    '/posts/2025/aspire-9.2/',
    '/posts/2025/adding-elasticsearch-with-aspire/',

    '/posts/2024/top-electricity-devices/',
    '/posts/2024/strategy-pattern/',
    '/posts/2024/scottishsummit/',
    '/posts/2024/end-of-year/',
    '/posts/2024/dotnet9/',
    '/posts/2024/common-ai-copilot-terms/',
    '/posts/2024/codeclub/',
    '/posts/2024/trekranks/',
    '/posts/2024/charity-hike/',
    '/posts/2024/automatic-pull-requests/',
    '/posts/2024/aspire/'
  ];

  for (const url of blogPostUrls) {
    errors.length = 0;
    await page.goto(url);
    // Check for any console errors (excluding ad network errors which are expected)
    const relevantErrors = errors.filter(err => !err.includes('ERR_NAME_NOT_RESOLVED') && !err.includes('ERR_ADDRESS_INVALID'));
    expect(relevantErrors).toEqual([]);
    // Optionally, check that the page loaded a blog post
    await expect(page).toHaveURL(new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});