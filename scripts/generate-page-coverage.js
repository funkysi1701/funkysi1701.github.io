const fs = require('fs');
const path = require('path');

function findContentFile(urlPath) {
  // Map URL paths to actual Hugo content files
  const contentDir = path.join(process.cwd(), 'content');
  
  // Remove trailing slash
  urlPath = urlPath.replace(/\/$/, '');
  
  // Homepage
  if (urlPath === '' || urlPath === '/') {
    // For homepage, use a dummy file path that represents it
    return 'content/_index.md';
  }
  
  // Try to find matching content file
  const possiblePaths = [
    path.join(contentDir, `${urlPath}.md`),
    path.join(contentDir, urlPath, 'index.md'),
    path.join(contentDir, 'posts', `${urlPath}.md`),
  ];
  
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return path.relative(process.cwd(), p);
    }
  }
  
  // Check if it's a year-based blog post (e.g., /2024/01/31/post-name)
  const yearMatch = urlPath.match(/^\/(\d{4})\/(.+)/);
  if (yearMatch) {
    const [, year, rest] = yearMatch;
    const postPath = path.join(contentDir, 'posts', year, `${rest.replace(/\//g, '-')}.md`);
    if (fs.existsSync(postPath)) {
      return path.relative(process.cwd(), postPath);
    }
  }
  
  // Return the URL path as-is if no file found (will be filtered out)
  return null;
}

function generatePageCoverageReport() {
  const visitReportPath = path.join(process.cwd(), 'test-results', 'page-visits', 'page-visits.json');
  const outputPath = path.join(process.cwd(), 'coverage', 'page-coverage.lcov');

  // Read page visit data
  if (!fs.existsSync(visitReportPath)) {
    console.log('No page visit report found');
    return;
  }

  const visitData = JSON.parse(fs.readFileSync(visitReportPath, 'utf8'));
  const visitedUrls = new Set(visitData.pages.map(p => p.url));

  // Find all content files
  const contentDir = path.join(process.cwd(), 'content');
  const allContentFiles = [];
  
  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith('.md')) {
        allContentFiles.push(path.relative(process.cwd(), fullPath));
      }
    }
  }
  
  scanDir(contentDir);

  // Map visited URLs to content files
  const visitedFiles = new Set();
  visitedUrls.forEach(url => {
    try {
      const urlObj = new URL(url);
      const contentFile = findContentFile(urlObj.pathname);
      if (contentFile && fs.existsSync(contentFile)) {
        visitedFiles.add(contentFile);
      }
    } catch (e) {
      // Skip invalid URLs
    }
  });

  // Generate LCOV format for content files
  let lcov = '';

  allContentFiles.forEach(filename => {
    const isVisited = visitedFiles.has(filename);

    // LCOV format for this file
    lcov += `TN:\n`;
    lcov += `SF:${filename}\n`;
    
    // Line coverage - treat each file as having 1 "line"
    lcov += `DA:1,${isVisited ? '1' : '0'}\n`;
    lcov += `LF:1\n`; // Lines found
    lcov += `LH:${isVisited ? '1' : '0'}\n`; // Lines hit
    lcov += `end_of_record\n`;
  });

  // Ensure coverage directory exists
  const coverageDir = path.dirname(outputPath);
  if (!fs.existsSync(coverageDir)) {
    fs.mkdirSync(coverageDir, { recursive: true });
  }

  // Write LCOV file
  fs.writeFileSync(outputPath, lcov);

  // Calculate statistics
  const visitedCount = visitedFiles.size;
  const totalPages = allContentFiles.length;
  const coverage = totalPages > 0 ? ((visitedCount / totalPages) * 100).toFixed(2) : 0;

  console.log(`\n📄 Page Coverage Report Generated:`);
  console.log(`   Total content files: ${totalPages}`);
  console.log(`   Visited content files: ${visitedCount}`);
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
