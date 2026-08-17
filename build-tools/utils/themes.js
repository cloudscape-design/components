// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const fs = require('fs');
const path = require('path');
const workspace = require('./workspace');

// Registry of theme ids to their style-dictionary entry points. A theme can be usable as a
// primary (root selector `body`), as a secondary (root selector a class, layered on top of a
// primary), or both — `visual-refresh` has distinct primary/secondary modules because the two
// use different selectors. `classic` and `core` are primary-only. `one-theme` is secondary-only.
// To add a new theme, register it here, then select it via AWSUI_PRIMARY_THEME/AWSUI_SECONDARY_THEMES.
const THEME_REGISTRY = {
  classic: { primaryModule: './classic/index.js' },
  'visual-refresh': {
    primaryModule: './visual-refresh/index.js',
    secondaryModule: './visual-refresh-secondary/index.js',
  },
  'one-theme': { secondaryModule: './one-theme/index.js' },
  core: { primaryModule: './core/index.js' },
};

// The composition a plain `npm run build`/`npm run quick-build` (no env vars) produces. This is
// the release path: pushing dev-v3-* branches triggers release.yml, which publishes to
// CodeArtifact using this exact default — it must never change silently.
const RELEASE_DEFAULT = { primary: 'classic', secondary: ['visual-refresh'] };

// The composition used for local dev/test pages (`npm start`), selected only via
// AWSUI_THEME_PRESET=dev (see package.json's start:watch script) — offers every switchable theme.
const DEV_DEFAULT = { primary: 'classic', secondary: ['visual-refresh', 'one-theme'] };

const ENVIRONMENT_JSON_PATH = path.join(workspace.targetPath, 'components', 'internal', 'environment.json');

function parseThemeList(value) {
  return value
    .split(',')
    .map(id => id.trim())
    .filter(Boolean);
}

function sameThemeList(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return false;
  }
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((id, index) => id === sortedB[index]);
}

function describeComposition({ primary, secondary }) {
  return secondary.length > 0 ? `${primary}+${secondary.join(',')}` : primary;
}

// Reads the composition the LAST full build actually produced, from the build's own output
// (rather than a separate manifest) so "persisted" always reflects ground truth.
//
// IMPORTANT LOAD-ORDER REQUIREMENT: this must run before `clean` deletes `lib/`. It does, today,
// because gulpfile.js requires this module (transitively, via `require('./build-tools/tasks')`)
// synchronously at process startup, and `clean` only runs later as an actual gulp *task* — task
// bodies never execute during the `require()` phase. This function result is captured ONCE into
// `persistedComposition` below (a module-level constant, not re-read per call) specifically so
// that a later refactor which moves this read into a function called from inside a task would be
// forced to touch this file and hopefully notice this comment. If you need to re-derive the
// persisted composition inside a task body (i.e. after `clean` may have already run), you must
// capture it here at module load and pass it through — do not call this function lazily.
function readPersistedComposition() {
  let raw;
  try {
    raw = fs.readFileSync(ENVIRONMENT_JSON_PATH, 'utf-8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(
        `[themes] No previous build found at ${ENVIRONMENT_JSON_PATH} — using the ` +
          `${process.env.AWSUI_THEME_PRESET === 'dev' ? 'dev' : 'release'} preset default.`
      );
    } else {
      console.warn(
        `[themes] Could not read persisted theme composition from ${ENVIRONMENT_JSON_PATH} (${error.message}). ` +
          `Falling back to the ${process.env.AWSUI_THEME_PRESET === 'dev' ? 'dev' : 'release'} preset default.`
      );
    }
    return undefined;
  }

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.PRIMARY_THEME !== 'string' || !Array.isArray(parsed.INCLUDED_THEMES)) {
      throw new Error('missing or malformed PRIMARY_THEME / INCLUDED_THEMES fields');
    }
    return { primary: parsed.PRIMARY_THEME, secondary: parsed.INCLUDED_THEMES };
  } catch (error) {
    console.warn(
      `[themes] Ignoring corrupt persisted theme composition at ${ENVIRONMENT_JSON_PATH} (${error.message}). ` +
        `Falling back to the ${process.env.AWSUI_THEME_PRESET === 'dev' ? 'dev' : 'release'} preset default.`
    );
    return undefined;
  }
}

// See the load-order comment on readPersistedComposition() above: this MUST be evaluated here,
// at module load, before any gulp task (including `clean`) runs.
const persistedComposition = readPersistedComposition();

function isWatchEntrypoint() {
  return process.argv.slice(2).includes('watch');
}

function validateComposition(primary, secondary) {
  const registryIds = Object.keys(THEME_REGISTRY);

  if (!THEME_REGISTRY[primary]) {
    throw new Error(`Unknown AWSUI_PRIMARY_THEME "${primary}". Available themes: ${registryIds.join(', ')}.`);
  }
  if (!THEME_REGISTRY[primary].primaryModule) {
    const validPrimaries = registryIds.filter(id => THEME_REGISTRY[id].primaryModule).join(', ');
    throw new Error(
      `"${primary}" has no primary module and cannot be used as AWSUI_PRIMARY_THEME. Valid primary themes: ${validPrimaries}.`
    );
  }

  const seen = new Set();
  for (const id of secondary) {
    if (!THEME_REGISTRY[id]) {
      throw new Error(`Unknown theme "${id}" in AWSUI_SECONDARY_THEMES. Available themes: ${registryIds.join(', ')}.`);
    }
    if (!THEME_REGISTRY[id].secondaryModule) {
      const validSecondaries = registryIds.filter(regId => THEME_REGISTRY[regId].secondaryModule).join(', ');
      throw new Error(
        `"${id}" has no secondary module and cannot be used in AWSUI_SECONDARY_THEMES. Valid secondary themes: ${validSecondaries}.`
      );
    }
    if (id === primary) {
      throw new Error(`"${id}" cannot be both AWSUI_PRIMARY_THEME and listed in AWSUI_SECONDARY_THEMES.`);
    }
    if (seen.has(id)) {
      throw new Error(`"${id}" is listed more than once in AWSUI_SECONDARY_THEMES.`);
    }
    seen.add(id);
  }
}

// Resolution precedence: explicit env var (this process) > persisted (last full build's output) >
// preset (release, unless AWSUI_THEME_PRESET=dev). Uses `??`, not `||`, so an explicitly-empty
// AWSUI_SECONDARY_THEMES="" (zero secondary themes, needed for the open-source/core compositions) is
// preserved rather than being mistaken for "not provided".
//
// Composition resolves ATOMICALLY: if EITHER env var is set explicitly, BOTH fields resolve from
// explicit-or-preset and persisted is ignored entirely for BOTH — resolving one field from an
// explicit override while the other silently inherits a stale persisted value can yield a
// composition nobody asked for and can't predict (e.g. AWSUI_PRIMARY_THEME=visual-refresh alone
// inheriting a persisted AWSUI_SECONDARY_THEMES that happens to also be ["visual-refresh"], colliding
// with itself). Stickiness (inheriting the entire last build) applies ONLY when NEITHER var is set.
function resolveComposition() {
  const explicitPrimary = process.env.AWSUI_PRIMARY_THEME;
  const explicitSecondary = process.env.AWSUI_SECONDARY_THEMES;
  const usingDevPreset = process.env.AWSUI_THEME_PRESET === 'dev';
  const preset = usingDevPreset ? DEV_DEFAULT : RELEASE_DEFAULT;
  const presetName = usingDevPreset ? 'dev' : 'release';
  const isExplicit = explicitPrimary !== undefined || explicitSecondary !== undefined;

  const primary = isExplicit
    ? (explicitPrimary?.trim() ?? preset.primary)
    : (persistedComposition?.primary ?? preset.primary);
  const secondary = isExplicit
    ? explicitSecondary !== undefined
      ? parseThemeList(explicitSecondary)
      : preset.secondary
    : (persistedComposition?.secondary ?? preset.secondary);

  // Setting only one of the two env vars is a natural thing to try, and — because resolution is
  // atomic — the OTHER field now defaults to the preset, not to whatever was last built. Call
  // that out explicitly, since it's a likely source of confusing validation errors below.
  if (isExplicit && persistedComposition !== undefined) {
    if (explicitPrimary !== undefined && explicitSecondary === undefined) {
      console.log(
        `[themes] AWSUI_PRIMARY_THEME was set explicitly but AWSUI_SECONDARY_THEMES was not. Composition resolves ` +
          `atomically, so AWSUI_SECONDARY_THEMES defaulted to the ${presetName} preset (${secondary.join(',') || '<none>'}), ` +
          `NOT your last build's secondary themes. Set AWSUI_SECONDARY_THEMES explicitly alongside AWSUI_PRIMARY_THEME ` +
          `to pick a specific composition.`
      );
    } else if (explicitSecondary !== undefined && explicitPrimary === undefined) {
      console.log(
        `[themes] AWSUI_SECONDARY_THEMES was set explicitly but AWSUI_PRIMARY_THEME was not. Composition resolves ` +
          `atomically, so AWSUI_PRIMARY_THEME defaulted to the ${presetName} preset (${primary}), NOT your last ` +
          `build's primary theme. Set AWSUI_PRIMARY_THEME explicitly alongside AWSUI_SECONDARY_THEMES to pick a specific ` +
          `composition.`
      );
    }
  }

  validateComposition(primary, secondary);

  const changedFromPersisted =
    persistedComposition !== undefined &&
    (persistedComposition.primary !== primary || !sameThemeList(persistedComposition.secondary, secondary));

  if (isExplicit && changedFromPersisted) {
    const from = describeComposition(persistedComposition);
    const to = describeComposition({ primary, secondary });

    if (isWatchEntrypoint()) {
      // `gulp watch` never runs `clean`, so silently adopting a different composition here would
      // partially overwrite lib/ file-by-file as sources change, producing a half-and-half build
      // that is worse than either composition. Fail loud instead.
      throw new Error(
        `Requested theme composition (${to}) differs from what's currently built in lib/ (${from}). ` +
          `'gulp watch' never cleans lib/, so switching composition here would silently half-rebuild it. ` +
          `Run 'npm run quick-build' with the new composition first, then restart 'npm start'.`
      );
    }

    console.log(`[themes] Theme composition changed: ${from} -> ${to}.`);
  }

  return { primary, secondary };
}

const { primary, secondary } = resolveComposition();

// Called from the `gulp watch` pipeline (see gulpfile.js) right before every watch-triggered
// `styles`/`generateEnvironment` rerun. This process captured `persistedComposition` ONCE, at
// startup, and never re-reads it — so if some OTHER process (typically a separate `quick-build`
// run while this watch session stayed alive) has since rebuilt lib/ with a DIFFERENT composition,
// this session's own composition is stale. Rewriting lib/ with it would silently clobber the
// other build. Re-read the ground truth fresh and abort loudly on any mismatch instead.
function assertCompositionUnchanged() {
  const onDisk = readPersistedComposition();

  if (onDisk === undefined) {
    throw new Error(
      `[themes] lib/ no longer contains a readable theme composition at ${ENVIRONMENT_JSON_PATH} — was it deleted ` +
        `by another process? This 'gulp watch' session (started with ${describeComposition({ primary, secondary })}) ` +
        `is stale. Stop it, run 'npm run quick-build' again, then restart 'npm start'.`
    );
  }

  if (onDisk.primary !== primary || !sameThemeList(onDisk.secondary, secondary)) {
    throw new Error(
      `[themes] Another build changed the theme composition on disk (now ${describeComposition(onDisk)}) since ` +
        `this 'gulp watch' session started (with ${describeComposition({ primary, secondary })}). This watch ` +
        `session is stale and must be restarted: stop it and run 'npm start' again.`
    );
  }
}

const themes = [
  // This is the default Cloudscape theme, which is best used with Visual Refresh enabled (by default)
  {
    name: 'default',
    packageJson: { name: '@cloudscape-design/components' },
    designTokensOutput: 'index',
    designTokensDir: 'design-tokens',
    designTokensPackageJson: { name: '@cloudscape-design/design-tokens' },
    outputPath: path.join(workspace.targetPath, 'components'),
    primaryThemeId: primary,
    primaryThemePath: THEME_REGISTRY[primary].primaryModule,
    includedThemes: secondary,
    secondaryThemePaths: secondary.map(id => THEME_REGISTRY[id].secondaryModule),
    alwaysVisualRefresh: primary === 'visual-refresh' || primary === 'core',
  },
];

module.exports = themes;
module.exports.THEME_REGISTRY = THEME_REGISTRY;
module.exports.RELEASE_DEFAULT = RELEASE_DEFAULT;
module.exports.DEV_DEFAULT = DEV_DEFAULT;
module.exports.resolveComposition = resolveComposition;
module.exports.validateComposition = validateComposition;
module.exports.assertCompositionUnchanged = assertCompositionUnchanged;
