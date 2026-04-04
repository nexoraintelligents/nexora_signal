const { analyzeLinks } = require('./src/server/seo/linkAnalyzer');

async function test() {
  const html = `
    <html>
      <body>
        <a href="https://google.com">External Link 1</a>
        <a href="https://github.com">External Link 2</a>
        <a href="/internal-page">Internal Link 1</a>
        <a href="https://example.com/broken">Broken Link</a>
        <a href="#anchor">Anchor (Ignore)</a>
      </body>
    </html>
  `;
  const baseUrl = 'https://example.com';
  
  console.log('Running analysis...');
  const result = await analyzeLinks(baseUrl, html);
  console.log('Result:', JSON.stringify(result, null, 2));
}

test().catch(console.error);
