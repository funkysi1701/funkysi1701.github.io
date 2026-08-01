// spec: specs/funkysi1701-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';

async function metaContent(page: Page, selector: string) {
  return page.locator(selector).first().getAttribute('content');
}

test.describe('Performance and Technical', () => {
  test('Head SEO meta is consistent on post, home, and list pages', { tag: '@smoke' }, async ({
    page,
  }) => {
    await test.step('Post: description, canonical, social, and BlogPosting JSON-LD', async () => {
      await page.goto('/posts/2026/ndc-london-2026/');

      const description = await metaContent(page, 'meta[name="description"]');
      expect(description ?? '').toContain(
        'For the second year running, I had the privilege of volunteering at NDC London',
      );

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', /\/posts\/2026\/ndc-london-2026\/?$/);

      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        'content',
        'NDC London 2026',
      );
      expect(await metaContent(page, 'meta[property="og:description"]')).toBe(description);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        'content',
        'summary_large_image',
      );
      expect(await metaContent(page, 'meta[name="twitter:description"]')).toBe(description);

      const ld = page.locator('script[type="application/ld+json"]');
      await expect(ld).toHaveCount(1);
      const json = JSON.parse((await ld.textContent()) ?? '{}');
      const graph = json['@graph'] ?? [json];
      const article = graph.find((node: { '@type'?: string }) => node['@type'] === 'BlogPosting');
      expect(article?.headline).toBe('NDC London 2026');
      expect(article?.description).toBe(description);
    });

    await test.step('Home: WebSite JSON-LD and matching social description', async () => {
      await page.goto('/');

      const description = await metaContent(page, 'meta[name="description"]');
      expect((description ?? '').length).toBeGreaterThanOrEqual(110);
      expect((description ?? '').length).toBeLessThanOrEqual(160);

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/$/);
      expect(await metaContent(page, 'meta[property="og:description"]')).toBe(description);
      expect(await metaContent(page, 'meta[name="twitter:description"]')).toBe(description);

      const ld = page.locator('script[type="application/ld+json"]');
      const json = JSON.parse((await ld.first().textContent()) ?? '{}');
      expect(json['@type']).toBe('WebSite');
    });

    await test.step('Tags list: CollectionPage + social description match meta', async () => {
      await page.goto('/tags/');

      const description = await metaContent(page, 'meta[name="description"]');
      expect(description ?? '').toMatch(/Browse all Tags/i);
      expect(await metaContent(page, 'meta[property="og:description"]')).toBe(description);
      expect(await metaContent(page, 'meta[name="twitter:description"]')).toBe(description);

      const ld = page.locator('script[type="application/ld+json"]');
      const json = JSON.parse((await ld.first().textContent()) ?? '{}');
      const graph = json['@graph'] ?? [json];
      const collection = graph.find(
        (node: { '@type'?: string }) => node['@type'] === 'CollectionPage',
      );
      expect(collection?.description).toBe(description);
    });

    await test.step('Paginated home: noindex robots, Page N description, canonical', async () => {
      await page.goto('/page/2/');

      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex,follow',
      );

      const description = await metaContent(page, 'meta[name="description"]');
      expect(description ?? '').toMatch(/Page 2/i);
      expect((description ?? '').length).toBeLessThanOrEqual(160);
      expect(await metaContent(page, 'meta[property="og:description"]')).toBe(description);

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        /\/page\/2\/?$/,
      );
    });
  });
});
