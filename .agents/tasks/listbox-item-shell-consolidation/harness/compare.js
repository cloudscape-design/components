// TEMPORARY: compare two harness outputs. Usage: node compare.js before.json after.json
const fs = require('fs');
const [beforePath, afterPath] = process.argv.slice(2);
// useUniqueId falls back to `${counter}-${Date.now()}-${random}` on React < 18, so replace each generated id
// with its order of first appearance within the case. References between elements stay comparable.
const normalize = html => {
  const ids = new Map();
  return html.replace(/\d+-\d{13}-\d+/g, id => {
    if (!ids.has(id)) {
      ids.set(id, `ID${ids.size}`);
    }
    return ids.get(id);
  });
};
const load = p =>
  Object.fromEntries(Object.entries(JSON.parse(fs.readFileSync(p, 'utf8'))).map(([k, v]) => [k, normalize(v)]));
const before = load(beforePath);
const after = load(afterPath);
const beforeKeys = Object.keys(before);
const afterKeys = Object.keys(after);
let diffs = 0;
if (beforeKeys.join('\n') !== afterKeys.join('\n')) {
  console.log('Case lists differ');
  diffs++;
}
for (const key of beforeKeys) {
  if (before[key] !== after[key]) {
    diffs++;
    if (diffs <= 5) {
      console.log(`DIFF ${key}\n  before: ${before[key]}\n  after:  ${after[key]}`);
    }
  }
}
const tooltipCases = beforeKeys.filter(k => before[k].includes('disabled-reason-tooltip')).length;
const describedby = beforeKeys.filter(k => before[k].includes('aria-describedby')).length;
const checked = beforeKeys.filter(k => before[k].includes('aria-checked')).length;
const customRender = beforeKeys.filter(k => before[k].includes('data-args')).length;
console.log(
  `cases=${beforeKeys.length} after=${afterKeys.length} differing=${diffs} ` +
    `(coverage: tooltip=${tooltipCases} aria-describedby=${describedby} aria-checked=${checked} renderOption=${customRender})`
);
process.exit(diffs ? 1 : 0);
