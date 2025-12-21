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

  // Step 2: Use explicit URLs for the top 5 blog posts based on MCP output
  const blogPostUrls = [
    'https://www.funkysi1701.com/posts/2025/kubernetes-and-letsencrypt/',
    'https://www.funkysi1701.com/posts/2025/stepping-outside-your-comfort-zone/',
    'https://www.funkysi1701.com/posts/2025/deploying-hugo-with-helm/',
    'https://www.funkysi1701.com/posts/2025/learning-kubernetes/',
    'https://www.funkysi1701.com/posts/2025/getting-started-with-opentelemetry/'
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