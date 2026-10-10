const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log(msg.text()));

  await page.goto('about:blank');

  await page.evaluate(async () => {
    async function testCORS(url, headers) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: "gemini-1.5-flash", 
            messages: [{role: "user", content: "hi"}]
          })
        });
        console.log(url + " => STATUS: " + res.status);
      } catch (err) {
        console.log(url + " => ERROR: " + err.message);
      }
    }

    await testCORS('https://api.openai.com/v1/chat/completions', {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test'
    });

    await testCORS('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test'
    });

    await testCORS('https://openrouter.ai/api/v1/chat/completions', {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Nazaverse'
    });
  });

  await browser.close();
})();

