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

function getStatusMetadata(context) {
  return {
    owner: context.repo.owner,
    repo: context.repo.repo,
    sha: context.payload.after,
    context: 'Bundle size',
    state: 'pending',
    target_url: `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`,
  };
}

export async function statusReportStart({ github, context }) {
  await github.rest.repos.createCommitStatus({ ...getStatusMetadata(context), state: 'pending' });
}

export async function statusReportFailure({ github, context }) {
  await github.rest.repos.createCommitStatus({
    ...getStatusMetadata(context),
    state: 'error',
    description: 'The workflow encountered an error.',
  });
}

export async function statusReportSuccess({ github, context }) {
  const basebranch = readJson('./bundle-size/output-basebranch.json');
  const pr = readJson('./bundle-size/output-pr.json');

  console.log('Base branch:', basebranch);
  console.log('This PR:', pr);

  await github.rest.repos.createCommitStatus({
    ...getStatusMetadata(context),
    state: 'success',
    description: [
      `CSS: ${formatDiff(pr.cssCompressedSize, basebranch.cssCompressedSize)}`,
      `JS: ${formatDiff(pr.jsCompressedSize, basebranch.jsCompressedSize)}`,
    ].join('\n'),
  });
}
