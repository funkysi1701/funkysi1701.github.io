import { test, expect } from '@playwright/test';

test('navigate to www.funkysi1701.com, click top 5 blog posts, check console for errors', async ({ page }) => {
  // Collect console errors
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  // Step 1: Navigate to the homepage
  await page.goto('https://www.funkysi1701.com');
  await expect(page).toHaveTitle(/Funky Si's Blog/);

  // Step 2: Use explicit URLs for the top 100 blog posts based on MCP output
  const blogPostUrls = [
    'https://www.funkysi1701.com/posts/2025/kubernetes-and-letsencrypt/',
    'https://www.funkysi1701.com/posts/2025/stepping-outside-your-comfort-zone/',
    'https://www.funkysi1701.com/posts/2025/deploying-hugo-with-helm/',
    'https://www.funkysi1701.com/posts/2025/learning-kubernetes/',
    'https://www.funkysi1701.com/posts/2025/getting-started-with-opentelemetry/',
    'https://www.funkysi1701.com/posts/2025/periodic-table-devops-2025/',
    'https://www.funkysi1701.com/posts/2025/setting-up-grafana/',
    'https://www.funkysi1701.com/posts/2025/opentelemetry-logs/',
    'https://www.funkysi1701.com/posts/2025/nuget-central-package-management/',
    'https://www.funkysi1701.com/posts/2025/merge-two-projects-into-one/',
    'https://www.funkysi1701.com/posts/2025/mandelbrot-set/',
    'https://www.funkysi1701.com/posts/2025/pragmatic-programmer/',
    'https://www.funkysi1701.com/posts/2025/whats-new-csharp/',
    'https://www.funkysi1701.com/posts/2025/volunteering-at-ndc/',
    'https://www.funkysi1701.com/posts/2025/using-ai/',
    'https://www.funkysi1701.com/posts/2025/the-hacker-ethic/',
    'https://www.funkysi1701.com/posts/2025/monitoring-with-nagios-docker/',
    'https://www.funkysi1701.com/posts/2025/fun-with-ai/',
    'https://www.funkysi1701.com/posts/2025/festive-naughty-or-nice-checker/',
    'https://www.funkysi1701.com/posts/2025/exceptions/',
    'https://www.funkysi1701.com/posts/2025/blazor-and-dotnet10/',
    'https://www.funkysi1701.com/posts/2025/aspire-9.2/',
    'https://www.funkysi1701.com/posts/2025/adding-elasticsearch-with-aspire/',
    'https://www.funkysi1701.com/posts/2024/top-electricity-devices/',
    'https://www.funkysi1701.com/posts/2024/strategy-pattern/',
    'https://www.funkysi1701.com/posts/2024/scottishsummit/',
    'https://www.funkysi1701.com/posts/2024/end-of-year/',
    'https://www.funkysi1701.com/posts/2024/dotnet9/',
    'https://www.funkysi1701.com/posts/2024/common-ai-copilot-terms/',
    'https://www.funkysi1701.com/posts/2024/codeclub/',
    'https://www.funkysi1701.com/posts/2024/charity-hike/',
    'https://www.funkysi1701.com/posts/2024/automatic-pull-requests/',
    'https://www.funkysi1701.com/posts/2024/aspire/'
  ];

  for (const url of blogPostUrls) {
    errors.length = 0;
    await page.goto(url);
    // Check for any console errors
    expect(errors).toEqual([]);
    // Optionally, check that the page loaded a blog post
    await expect(page).toHaveURL(url);
  }
});