import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface PageVisit {
  url: string;
  testTitle: string;
  testFile: string;
  timestamp: string;
}

class PageVisitTrackerReporter implements Reporter {
  private visits: PageVisit[] = [];
  private uniqueUrls: Set<string> = new Set();

  onBegin(config: FullConfig, suite: Suite) {
    console.log(`\n📊 Page Visit Tracker: Starting test run with ${suite.allTests().length} tests\n`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // Extract page visits from test attachments or stdout
    const stdout = result.stdout.map(s => s.toString()).join('');
    const urlPattern = /https?:\/\/[^\s'"<>]+/g;
    const urls = stdout.match(urlPattern) || [];

    urls.forEach(url => {
      // Filter to only track the main site URLs
      if (url.includes('funkysi1701.com') || url.includes('localhost')) {
        this.uniqueUrls.add(url);
        this.visits.push({
          url,
          testTitle: test.title,
          testFile: path.relative(process.cwd(), test.location.file),
          timestamp: new Date().toISOString(),
        });
      }
    });
  }

  async onEnd(result: FullResult) {
    // Group visits by URL
    const visitsByUrl = new Map<string, PageVisit[]>();
    this.visits.forEach(visit => {
      if (!visitsByUrl.has(visit.url)) {
        visitsByUrl.set(visit.url, []);
      }
      visitsByUrl.get(visit.url)!.push(visit);
    });

    // Sort URLs for consistent output
    const sortedUrls = Array.from(visitsByUrl.keys()).sort();

    // Create output directory
    const outputDir = path.join(process.cwd(), 'test-results', 'page-visits');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate JSON report
    const jsonReport = {
      summary: {
        totalTests: this.visits.length,
        uniquePages: this.uniqueUrls.size,
        generatedAt: new Date().toISOString(),
      },
      pages: sortedUrls.map(url => ({
        url,
        visitCount: visitsByUrl.get(url)!.length,
        tests: visitsByUrl.get(url)!.map(v => ({
          title: v.testTitle,
          file: v.testFile,
        })),
      })),
    };

    fs.writeFileSync(
      path.join(outputDir, 'page-visits.json'),
      JSON.stringify(jsonReport, null, 2)
    );

    // Generate Markdown report
    let markdown = `# Page Visit Coverage Report\n\n`;
    markdown += `**Generated:** ${new Date().toISOString()}\n\n`;
    markdown += `## Summary\n\n`;
    markdown += `- **Total Page Visits:** ${this.visits.length}\n`;
    markdown += `- **Unique Pages Tested:** ${this.uniqueUrls.size}\n\n`;
    markdown += `## Pages Tested\n\n`;

    sortedUrls.forEach(url => {
      const visits = visitsByUrl.get(url)!;
      const urlPath = new URL(url).pathname;
      markdown += `### ${urlPath || '/'}\n\n`;
      markdown += `**Full URL:** ${url}\n\n`;
      markdown += `**Visit Count:** ${visits.length}\n\n`;
      markdown += `**Tests:**\n\n`;
      visits.forEach(visit => {
        markdown += `- [${visit.testFile}] ${visit.testTitle}\n`;
      });
      markdown += `\n`;
    });

    fs.writeFileSync(
      path.join(outputDir, 'page-visits.md'),
      markdown
    );

    // Console summary
    console.log(`\n📊 Page Visit Coverage Summary:`);
    console.log(`   Total visits: ${this.visits.length}`);
    console.log(`   Unique pages: ${this.uniqueUrls.size}`);
    console.log(`\n   Top visited pages:`);
    
    const visitCounts = Array.from(visitsByUrl.entries())
      .map(([url, visits]) => ({ url, count: visits.length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    visitCounts.forEach(({ url, count }) => {
      const urlPath = new URL(url).pathname || '/';
      console.log(`   ${count}x - ${urlPath}`);
    });

    console.log(`\n   Reports saved to: ${outputDir}\n`);
  }
}

export default PageVisitTrackerReporter;
