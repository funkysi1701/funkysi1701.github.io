const fs = require('fs');
const path = require('path');

function generatePageCoverageReport() {
  const visitReportPath = path.join(process.cwd(), 'test-results', 'page-visits', 'page-visits.json');
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  const outputPath = path.join(process.cwd(), 'coverage', 'page-coverage.lcov');

  // Read page visit data
  if (!fs.existsSync(visitReportPath)) {
    console.log('No page visit report found');
    return;
  }

  const visitData = JSON.parse(fs.readFileSync(visitReportPath, 'utf8'));
  const visitedUrls = new Set(visitData.pages.map(p => p.url));

  // Extract all pages from sitemap
  let allPages = [];
  if (fs.existsSync(sitemapPath)) {
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    const urlMatches = sitemap.matchAll(/<loc>(.*?)<\/loc>/g);
    allPages = Array.from(urlMatches).map(match => match[1]);
  }

  // If no sitemap, use visited pages only
  if (allPages.length === 0) {
    allPages = Array.from(visitedUrls);
  }

  // Generate LCOV format
  let lcov = '';

  allPages.forEach(url => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname || '/';
      
      // Use pathname as the "file" name
      const filename = `pages${pathname === '/' ? '/index' : pathname}.html`;
      const isVisited = visitedUrls.has(url);

      // LCOV format for this "file"
      lcov += `TN:\n`;
      lcov += `SF:${filename}\n`;
      
      // Line coverage - treat each page as having 1 "line"
      // If visited, line is covered; if not, line is not covered
      lcov += `DA:1,${isVisited ? '1' : '0'}\n`;
      lcov += `LF:1\n`; // Lines found
      lcov += `LH:${isVisited ? '1' : '0'}\n`; // Lines hit
      lcov += `end_of_record\n`;
    } catch (e) {
      // Skip invalid URLs
    }
  });

  // Ensure coverage directory exists
  const coverageDir = path.dirname(outputPath);
  if (!fs.existsSync(coverageDir)) {
    fs.mkdirSync(coverageDir, { recursive: true });
  }

  // Write LCOV file
  fs.writeFileSync(outputPath, lcov);

  // Calculate statistics
  const visitedCount = Array.from(visitedUrls).filter(url => allPages.includes(url)).length;
  const totalPages = allPages.length;
  const coverage = totalPages > 0 ? ((visitedCount / totalPages) * 100).toFixed(2) : 0;

  console.log(`\n📄 Page Coverage Report Generated:`);
  console.log(`   Total pages: ${totalPages}`);
  console.log(`   Visited pages: ${visitedCount}`);
  console.log(`   Coverage: ${coverage}%`);
  console.log(`   Report: ${outputPath}\n`);

  return {
    totalPages,
    visitedCount,
    coverage,
  };
}

try {
  generatePageCoverageReport();
} catch (error) {
  console.error('Error generating page coverage:', error);
  process.exit(0); // Don't fail the build
}
