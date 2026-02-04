import { test, expect } from './fixtures';

const BASE_URL = 'https://www.funkysi1701.com';

test('navigate to www.funkysi1701.com, check top 100 blog posts for broken links and images', async ({ page }) => {
  // Step 1: Navigate to the homepage
  await page.goto(BASE_URL);
  await expect(page).toHaveTitle(/Funky Si's Blog/);

  // Step 2: Find top 100 blog post URLs (assume links under /posts/)
  const blogPostUrls = await page.$$eval('a[href^="/posts/"]', (as) => {
    const seen = new Set();
    const urls = [];
    for (const a of as) {
      let href = a.getAttribute('href');
      if (href && !seen.has(href)) {
        seen.add(href);
        // Make absolute URL
        if (href.startsWith('/')) {
          href = 'https://www.funkysi1701.com' + href;
        }
        urls.push(href);
        if (urls.length >= 100) break;
      }
    }
    return urls;
  });

  for (const url of blogPostUrls) {
    await page.goto(url);
    await expect(page).toHaveURL(url);

    // Check for broken images
    const brokenImages = await page.$$eval('img', imgs =>
      imgs.filter(img => !(img.complete && img.naturalWidth > 0)).map(img => img.src)
    );
    expect.soft(brokenImages, `Broken images on ${url}: ${brokenImages.join(', ')}`).toEqual([]);

    // Check for broken links (status not 200 or 301/302 for external)
    const links = await page.$$eval('a[href]', as => as.map(a => a.href));
    const linkChecks = links
      .filter(link => /^https?:\/\//.test(link))
      .map(async (link) => {
        const response = await page.request.get(link);
        expect.soft(response.status(), `Broken link: ${link} on ${url}`).toBeLessThan(400);
      });
    await Promise.all(linkChecks);
  }
});