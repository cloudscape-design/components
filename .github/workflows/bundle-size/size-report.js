import { readFileSync } from 'node:fs';

function readJson(filename) {
  return JSON.parse(readFileSync(filename, 'utf8'));
}

function formatKilobytes(value) {
  return (value / 1000).toFixed(1);
}

function formatPercents(value) {
  return (value * 100).toFixed(2);
}

function formatDiff(prSize, headSize, baselineSize) {
  const diffSize = prSize - headSize;
  const diffRelative = diffSize / (prSize - baselineSize);
  const sign = diffSize > 0 ? '+' : '';

  return `${formatKilobytes(prSize)} KB (${sign}${formatPercents(diffRelative)} % / ${sign}${formatKilobytes(
    diffSize
  )} KB)`;
}

export async function sizeReport({ github, context }) {
  const baseline = readJson('./bundle-size/output-baseline.json');
  const basebranch = readJson('./bundle-size/output-basebranch.json');
  const pr = readJson('./bundle-size/output-pr.json');

  console.log('Baseline:', baseline);
  console.log('Base branch (vs baseline):', basebranch);
  console.log('This PR (vs baseline):', pr);

  await github.rest.repos.createCommitStatus({
    owner: context.repo.owner,
    repo: context.repo.repo,
    sha: context.payload.pull_request.head.sha,
    context: 'Bundle size',
    state: 'success',
    description: [
      `CSS: ${formatDiff(pr.cssCompressedSize, basebranch.cssCompressedSize, baseline.cssCompressedSize)}`,
      `JS: ${formatDiff(pr.jsCompressedSize, basebranch.jsCompressedSize, baseline.jsCompressedSize)}`,
    ].join('\n'),
  });
}
