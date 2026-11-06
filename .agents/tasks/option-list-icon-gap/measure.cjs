// Measures the gap between an option's icon and its content on the OptionList, Select item and Multiselect pages.
// Usage: node measure.cjs <prefix>   (prefix is "before" or "after"; screenshots go next to this file)
const path = require('path');
const puppeteer = require('/Users/amanabiy/Documents/components/.worktrees/option-list-icon-gap/node_modules/puppeteer-core');

const prefix = process.argv[2] || 'before';
const outDir = __dirname;
const base = 'http://127.0.0.1:8080/#/light';

// For every option row that has an icon, measures:
// - wrapperGap: content.left - (element before content).right — the spacing the layout provides
// - glyphGap: content.left - svg.right — the visible gap between the glyph and the label
function measureInPage() {
  const results = [];
  document.querySelectorAll('[class*="awsui_content_"]').forEach(content => {
    const optionEl = content.parentElement;
    const iconSlot = content.previousElementSibling;
    if (!iconSlot) {
      return;
    }
    const svg = iconSlot.querySelector('svg');
    if (!svg) {
      return;
    }
    const c = content.getBoundingClientRect();
    const slot = iconSlot.getBoundingClientRect();
    const s = svg.getBoundingClientRect();
    const row = optionEl.closest('[role="option"], li, [data-value]');
    results.push({
      label: (content.innerText || '').split('\n')[0].slice(0, 40),
      iconSlotClass: iconSlot.className.toString().split(' ')[0],
      wrapperGap: +(c.left - slot.right).toFixed(2),
      glyphGap: +(c.left - s.right).toFixed(2),
      svgWidth: +s.width.toFixed(2),
      multi: !!(row && row.closest('[aria-multiselectable="true"]')) || !!optionEl.parentElement.querySelector('[class*="awsui_checkbox_"]'),
    });
  });
  return results;
}

function summarize(name, rows) {
  const uniq = {};
  rows.forEach(r => {
    const key = `${r.multi ? 'multi' : 'single'} wrapperGap=${r.wrapperGap} glyphGap=${r.glyphGap} svgWidth=${r.svgWidth} slot=${r.iconSlotClass}`;
    uniq[key] = (uniq[key] || 0) + 1;
  });
  return `${name}: ${rows.length} icon rows\n` + Object.entries(uniq).map(([k, n]) => `  ${n}x ${k}`).join('\n');
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });
  const out = [];

  // OptionList permutations
  await page.goto(`${base}/option-list/permutations`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('[role="listbox"]');
  out.push(summarize('OptionList permutations', await page.evaluate(measureInPage)));
  // Screenshot the first single and multi permutation with icons.
  const handles = await page.$$('[role="listbox"]');
  let shots = 0;
  for (const h of handles) {
    const hasIcon = await h.evaluate(el => !!el.querySelector('[class*="awsui_content_"]')?.previousElementSibling?.querySelector('svg'));
    if (!hasIcon) continue;
    const multi = await h.evaluate(el => el.getAttribute('aria-multiselectable') === 'true');
    const name = `${prefix}-option-list-${multi ? 'multi' : 'single'}-${shots}.png`;
    await h.screenshot({ path: path.join(outDir, name) });
    shots++;
    if (shots >= 4) break;
  }

  // Shared Select/Multiselect item permutations (same Item and Option rendering as the dropdowns)
  await page.goto(`${base}/select/item.permutations`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('ul[aria-label="list"]');
  await page.waitForSelector('[role="listbox"]');
  out.push(summarize('Select item permutations', await page.evaluate(measureInPage)));
  const area = await page.$('.screenshot-area');
  await (area || (await page.$('body'))).screenshot({ path: path.join(outDir, `${prefix}-select-item-permutations.png`) });

  // Real Select dropdown with icons
  await page.goto(`${base}/select/screenshot`, { waitUntil: 'networkidle0' });
  const selectTrigger = await page.waitForSelector('button[aria-haspopup]');
  if (selectTrigger) {
    await selectTrigger.click();
    await new Promise(r => setTimeout(r, 500));
    await page.waitForSelector('[role="listbox"] [class*="awsui_content_"]');
    out.push(summarize('Select dropdown (select/screenshot)', await page.evaluate(measureInPage)));
    await page.screenshot({ path: path.join(outDir, `${prefix}-select-dropdown.png`) });
  }

  // Real Multiselect dropdown with icons
  await page.goto(`${base}/multiselect/disabled-reason`, { waitUntil: 'networkidle0' });
  const msTrigger = await page.waitForSelector('button[aria-haspopup]');
  if (msTrigger) {
    await msTrigger.click();
    await new Promise(r => setTimeout(r, 500));
    await page.waitForSelector('[role="listbox"] [class*="awsui_content_"]');
    out.push(summarize('Multiselect dropdown (multiselect/disabled-reason)', await page.evaluate(measureInPage)));
    await page.screenshot({ path: path.join(outDir, `${prefix}-multiselect-dropdown.png`) });
  }

  await browser.close();
  const text = out.join('\n\n');
  require('fs').writeFileSync(path.join(outDir, `${prefix}-measurements.txt`), text + '\n');
  console.log(text);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
