// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
//
// This test spawns REAL `gulp quick-build` child processes and mutates the real `lib/` output —
// it is the end-to-end proof that a persisted theme composition survives `clean` (which deletes
// `lib/` at the start of every quick-build/build). See build-tools/utils/themes.js's load-order
// comment on readPersistedComposition() for why this matters: the persisted read only works
// because it happens before `clean` runs, and that is an implicit (not enforced) load-order
// dependency.
//
// Deliberately excluded from the default test run (see jest.build-tools.config.js) — it takes
// ~60s and mutates the real, shared `lib/` output, which is too heavy/risky (cross-test
// contamination if killed mid-run, clobbering a developer's in-progress `npm start`) to run on
// every `npm test`/PR.
//
// It restores the release-default composition in `afterAll` regardless of pass/fail, but a hard
// kill (CI timeout, OOM) would skip that — this is the residual risk of running it against real
// `lib/`, accepted in exchange for not needing to fight the OTHER hardcoded `lib/`-relative paths
// in this build (typescript.js's `--tsBuildInfoFile ./lib/${theme.name}.tsbuildinfo`,
// bundle-vendor-files.js) that a fully isolated output directory would also need to account for.
const path = require('path');
const execa = require('execa');

const repoRoot = path.join(__dirname, '../../..');
const gulpBin = path.join(repoRoot, 'node_modules', 'gulp', 'bin', 'gulp.js');
const childEnv = {
  ...process.env,
  PATH: `${path.join(repoRoot, 'node_modules', '.bin')}${path.delimiter}${process.env.PATH}`,
};

function readEnvironmentJson() {
  return require(path.join(repoRoot, 'lib/components/internal/environment.json'));
}

function quickBuild(env) {
  return execa(process.execPath, [gulpBin, 'quick-build'], {
    cwd: repoRoot,
    env: { ...childEnv, ...env },
  });
}

jest.setTimeout(180000);

describe('theme composition survives clean (load-order regression)', () => {
  afterAll(async () => {
    // Always leave the repo on the release-default composition, regardless of pass/fail — other
    // tests (e.g. design-tokens.test.ts) assume a bare quick-build's default output. Note: this
    // must pass the release composition EXPLICITLY (PRIMARY_THEME=classic SECONDARY_THEMES=visual-refresh)
    // rather than unsetting the env vars — per the sticky-composition design, an unset env var
    // inherits whatever this test just persisted (visual-refresh+one-theme), it does NOT reset to
    // the release default.
    delete require.cache[path.join(repoRoot, 'lib/components/internal/environment.json')];
    await quickBuild({ PRIMARY_THEME: 'classic', SECONDARY_THEMES: 'visual-refresh' });
  });

  test('a bare quick-build after an explicit-composition build inherits that composition, not the release default', async () => {
    await quickBuild({ PRIMARY_THEME: 'visual-refresh', SECONDARY_THEMES: 'one-theme' });
    delete require.cache[path.join(repoRoot, 'lib/components/internal/environment.json')];
    const afterExplicitBuild = readEnvironmentJson();
    expect(afterExplicitBuild.PRIMARY_THEME).toBe('visual-refresh');
    expect(afterExplicitBuild.INCLUDED_THEMES).toEqual(['one-theme']);

    // No env vars at all — `clean` (part of quick-build) deletes lib/ (including the very file
    // we just read) before the composition is re-resolved. If the persisted read ever stopped
    // happening before `clean`, this would silently fall back to classic+visual-refresh instead.
    await quickBuild({ PRIMARY_THEME: undefined, SECONDARY_THEMES: undefined, THEME_PRESET: undefined });
    delete require.cache[path.join(repoRoot, 'lib/components/internal/environment.json')];
    const afterBareBuild = readEnvironmentJson();
    expect(afterBareBuild.PRIMARY_THEME).toBe('visual-refresh');
    expect(afterBareBuild.INCLUDED_THEMES).toEqual(['one-theme']);
  });
});
