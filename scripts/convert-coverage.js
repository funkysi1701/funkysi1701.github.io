const fs = require('fs');
const path = require('path');
const v8toIstanbul = require('v8-to-istanbul');

async function convertCoverage() {
  const coverageDir = path.join(process.cwd(), 'coverage', 'tmp');
  const outputDir = path.join(process.cwd(), 'coverage');

  if (!fs.existsSync(coverageDir)) {
    console.log('No coverage data found');
    return;
  }

  const files = fs.readdirSync(coverageDir);
  const allCoverage = [];

  for (const file of files) {
    if (file.endsWith('.json')) {
      const data = JSON.parse(fs.readFileSync(path.join(coverageDir, file), 'utf8'));
      allCoverage.push(...data);
    }
  }

  // Merge and convert to Istanbul format
  const istanbulCoverage = {};

  for (const entry of allCoverage) {
    try {
      const url = new URL(entry.url);
      // Only process your site's JavaScript files
      if (url.hostname === 'www.funkysi1701.com') {
        const converter = v8toIstanbul(url.pathname, 0, { source: entry.source });
        await converter.load();
        converter.applyCoverage(entry.functions);
        Object.assign(istanbulCoverage, converter.toIstanbul());
      }
    } catch (e) {
      // Skip invalid URLs or files
      continue;
    }
  }

  // Write Istanbul coverage
  const istanbulFile = path.join(outputDir, 'coverage-final.json');
  fs.writeFileSync(istanbulFile, JSON.stringify(istanbulCoverage, null, 2));

  console.log(`Converted ${allCoverage.length} coverage entries to Istanbul format`);
}

convertCoverage().catch(console.error);
