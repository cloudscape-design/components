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
const fs = require('fs');
const os = require('os');
const path = require('path');
const execa = require('execa');

const repoRoot = path.join(__dirname, '../../..');
const gulpBin = path.join(repoRoot, 'node_modules', 'gulp', 'bin', 'gulp.js');
const childEnv = {
  ...process.env,
  PATH: `${path.join(repoRoot, 'node_modules', '.bin')}${path.delimiter}${process.env.PATH}`,
};

function readEnvironmentJson() {
  // Plain fs read, not require() — this repo's checkout path involves a symlink
  // (/home/.../workplace/... -> /workplace/...), and require()'s cache keys are resolved via
  // realpath, which does not match the literal path computed here. require()-based caching
  // silently returned stale data across these re-reads; fs.readFileSync has no such cache.
  return JSON.parse(fs.readFileSync(path.join(repoRoot, 'lib/components/internal/environment.json'), 'utf-8'));
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
    // must pass the release composition EXPLICITLY (AWSUI_PRIMARY_THEME=classic AWSUI_SECONDARY_THEMES=visual-refresh)
    // rather than unsetting the env vars — per the sticky-composition design, an unset env var
    // inherits whatever this test just persisted (visual-refresh+one-theme), it does NOT reset to
    // the release default.
    await quickBuild({ AWSUI_PRIMARY_THEME: 'classic', AWSUI_SECONDARY_THEMES: 'visual-refresh' });
  });

  test('a bare quick-build after an explicit-composition build inherits that composition, not the release default', async () => {
    await quickBuild({ AWSUI_PRIMARY_THEME: 'visual-refresh', AWSUI_SECONDARY_THEMES: 'one-theme' });
    const afterExplicitBuild = readEnvironmentJson();
    expect(afterExplicitBuild.PRIMARY_THEME).toBe('visual-refresh');
    expect(afterExplicitBuild.INCLUDED_THEMES).toEqual(['one-theme']);

    // No env vars at all — `clean` (part of quick-build) deletes lib/ (including the very file
    // we just read) before the composition is re-resolved. If the persisted read ever stopped
    // happening before `clean`, this would silently fall back to classic+visual-refresh instead.
    await quickBuild({
      AWSUI_PRIMARY_THEME: undefined,
      AWSUI_SECONDARY_THEMES: undefined,
      AWSUI_THEME_PRESET: undefined,
    });
    const afterBareBuild = readEnvironmentJson();
    expect(afterBareBuild.PRIMARY_THEME).toBe('visual-refresh');
    expect(afterBareBuild.INCLUDED_THEMES).toEqual(['one-theme']);
  });
});

describe('a stale concurrent gulp watch does not silently clobber a newer build', () => {
  afterAll(async () => {
    await quickBuild({ AWSUI_PRIMARY_THEME: 'classic', AWSUI_SECONDARY_THEMES: 'visual-refresh' });
  });

  test('a watch-triggered rerun aborts loudly instead of overwriting a composition built by another process', async () => {
    // Composition A: what a `gulp watch` session (e.g. from an earlier, un-terminated `npm start`)
    // would have captured as its own persisted composition at startup.
    await quickBuild({ AWSUI_PRIMARY_THEME: 'visual-refresh', AWSUI_SECONDARY_THEMES: 'one-theme' });

    // A standalone script that mimics exactly what gulpfile.js's watch pipeline runs on a file
    // change: assertCompositionNotStale, then generateEnvironment, then styles. It requires
    // themes.js itself (capturing composition A, since that's what's on disk right now), then
    // waits for a signal before actually running the task — giving the test time to rebuild with
    // a DIFFERENT composition B in between, exactly reproducing "another quick-build ran while
    // this watch session stayed alive".
    const readyFlag = path.join(os.tmpdir(), `theme-watch-ready-${Date.now()}`);
    const goFlag = path.join(os.tmpdir(), `theme-watch-go-${Date.now()}`);
    const resultFile = path.join(os.tmpdir(), `theme-watch-result-${Date.now()}`);
    const script = `
      const fs = require('fs');
      const gulp = require('gulp');
      const { series } = gulp;
      // Task errors are reported via our own done(err) callback below; without this listener,
      // gulp/undertaker's internal 'error' event (unhandled) crashes the process before that
      // callback's result gets written. The real 'gulp' CLI attaches an equivalent listener itself.
      gulp.on('error', () => {});
      const themes = require(${JSON.stringify(path.join(repoRoot, 'build-tools/utils/themes.js'))});
      const { generateEnvironment, styles } = require(${JSON.stringify(path.join(repoRoot, 'build-tools/tasks/index.js'))});
      fs.writeFileSync(${JSON.stringify(readyFlag)}, 'ready');
      const start = Date.now();
      (function waitForGo() {
        if (fs.existsSync(${JSON.stringify(goFlag)})) {
          const task = series(function assertCompositionNotStale(done) {
            try { themes.assertCompositionUnchanged(); done(); } catch (e) { done(e); }
          }, generateEnvironment, styles);
          task(err => {
            fs.writeFileSync(${JSON.stringify(resultFile)}, err ? 'ERROR:' + err.message : 'SUCCEEDED');
            process.exit(0);
          });
        } else if (Date.now() - start > 120000) {
          fs.writeFileSync(${JSON.stringify(resultFile)}, 'ERROR:timed out waiting for go flag');
          process.exit(1);
        } else {
          setTimeout(waitForGo, 100);
        }
      })();
    `;
    const scriptPath = path.join(repoRoot, `.theme-watch-tmp-script-${Date.now()}.js`);
    fs.writeFileSync(scriptPath, script);

    const staleProcess = execa(process.execPath, [scriptPath], { cwd: repoRoot, env: childEnv });
    try {
      const readyDeadline = Date.now() + 20000;
      while (!fs.existsSync(readyFlag)) {
        if (Date.now() > readyDeadline) {
          throw new Error('Timed out waiting for the stale-watch script to signal ready.');
        }
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Composition B: a different, separate quick-build run while the "stale watch" process
      // above has already captured composition A.
      await quickBuild({ AWSUI_PRIMARY_THEME: 'classic', AWSUI_SECONDARY_THEMES: 'visual-refresh' });
      const afterB = readEnvironmentJson();
      expect(afterB.PRIMARY_THEME).toBe('classic');
      expect(afterB.INCLUDED_THEMES).toEqual(['visual-refresh']);

      fs.writeFileSync(goFlag, 'go');
      await staleProcess;

      const result = fs.readFileSync(resultFile, 'utf-8');
      expect(result).toMatch(/^ERROR:/);
      expect(result).toContain('Another build changed the theme composition on disk');
      expect(result).toContain('stale and must be restarted');

      // The stale rerun must not have clobbered composition B.
      const afterStaleRerun = readEnvironmentJson();
      expect(afterStaleRerun.PRIMARY_THEME).toBe('classic');
      expect(afterStaleRerun.INCLUDED_THEMES).toEqual(['visual-refresh']);
    } finally {
      for (const file of [readyFlag, goFlag, resultFile, scriptPath]) {
        fs.rmSync(file, { force: true });
      }
    }
  });
});
