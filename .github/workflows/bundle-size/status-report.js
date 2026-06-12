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

function formatDiff(prSize, headSize) {
  const diffSize = prSize - headSize;
  const diffRelative = diffSize / prSize;
  const sign = diffSize > 0 ? '+' : '';

  return `${formatKilobytes(prSize)} KB (${sign}${formatPercents(diffRelative)} % / ${sign}${formatKilobytes(
    diffSize
  )} KB)`;
}

function getStatusMetadata(context, sha, targetUrl) {
  return {
    owner: context.repo.owner,
    repo: context.repo.repo,
    sha,
    context: 'Bundle size',
    target_url: targetUrl,
  };
}

// Entry point for the "Report bundle size" workflow. Posts a commit status on
// `sha` (the trusted workflow_run head SHA). On a non-success run it reports an
// error without touching the artifact. On success it reads the measurement
// data, whose values only ever flow into numeric formatting, never execution.
export async function reportBundleSize({ github, context, sha, dataDir, conclusion, targetUrl }) {
  const metadata = getStatusMetadata(context, sha, targetUrl);

  if (conclusion !== 'success') {
    await github.rest.repos.createCommitStatus({
      ...metadata,
      state: 'error',
      description: 'The workflow encountered an error.',
    });
    return;
  }

  const basebranch = readJson(`${dataDir}/output-basebranch.json`);
  const pr = readJson(`${dataDir}/output.json`);

  console.log('Base branch:', basebranch);
  console.log('This PR:', pr);

  await github.rest.repos.createCommitStatus({
    ...metadata,
    state: 'success',
    description: [
      `CSS: ${formatDiff(pr.cssCompressedSize, basebranch.cssCompressedSize)}`,
      `JS: ${formatDiff(pr.jsCompressedSize, basebranch.jsCompressedSize)}`,
    ].join('\n'),
  });
}
