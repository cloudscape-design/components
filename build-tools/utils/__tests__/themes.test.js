// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');

const ENVIRONMENT_JSON_SUFFIX = path.join('components', 'internal', 'environment.json');

// Loads a fresh copy of ../themes with a controlled env and a mocked "persisted" build output
// (lib/components/internal/environment.json), so we can exercise resolveComposition's
// precedence rules without touching the real filesystem or requiring a real build.
function loadThemes({ env = {}, argv = [], persisted } = {}) {
  jest.resetModules();

  const originalEnv = process.env;
  const originalArgv = process.argv;
  process.env = { ...originalEnv };
  for (const key of ['AWSUI_PRIMARY_THEME', 'AWSUI_SECONDARY_THEMES', 'AWSUI_THEME_PRESET']) {
    delete process.env[key];
  }
  Object.assign(process.env, env);
  process.argv = ['node', 'gulp', ...argv];
  const persistedBox = { current: persisted };

  jest.doMock('fs', () => {
    const realFs = jest.requireActual('fs');
    return {
      ...realFs,
      readFileSync: (filePath, ...rest) => {
        if (typeof filePath === 'string' && filePath.endsWith(ENVIRONMENT_JSON_SUFFIX)) {
          const current = persistedBox.current;
          if (current === undefined) {
            const error = new Error('no such file');
            error.code = 'ENOENT';
            throw error;
          }
          if (current === 'CORRUPT') {
            return 'not valid json {{{';
          }
          // These keys are the emitted-constant/JSON names (kept unprefixed), not env vars.
          return JSON.stringify({ PRIMARY_THEME: current.primary, INCLUDED_THEMES: current.secondary });
        }
        return realFs.readFileSync(filePath, ...rest);
      },
    };
  });

  try {
    const themesModule = require('../themes');
    // Lets tests simulate "another process changed lib/ after this module captured its own
    // composition" without requiring a fresh module load — assertCompositionUnchanged() re-reads
    // via the same mocked fs.readFileSync, which reads persistedBox.current live.
    themesModule.__setPersistedForTest = next => {
      persistedBox.current = next;
    };
    return themesModule;
  } finally {
    process.env = originalEnv;
    process.argv = originalArgv;
    jest.dontMock('fs');
  }
}

describe('theme composition resolution', () => {
  let logSpy;
  let warnSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
  });

  test('defaults to the release composition (classic + visual-refresh) with nothing set', () => {
    const themes = loadThemes({});
    expect(themes[0].primaryThemeId).toBe('classic');
    expect(themes[0].includedThemes).toEqual(['visual-refresh']);
    expect(themes[0].alwaysVisualRefresh).toBe(false);
  });

  test('AWSUI_THEME_PRESET=dev with no persisted build resolves to every switchable theme', () => {
    const themes = loadThemes({ env: { AWSUI_THEME_PRESET: 'dev' } });
    expect(themes[0].primaryThemeId).toBe('classic');
    expect(themes[0].includedThemes).toEqual(['visual-refresh', 'one-theme']);
  });

  test('sticky: inherits the persisted composition over the preset when nothing explicit is set', () => {
    const themes = loadThemes({
      persisted: { primary: 'visual-refresh', secondary: ['one-theme'] },
    });
    expect(themes[0].primaryThemeId).toBe('visual-refresh');
    expect(themes[0].includedThemes).toEqual(['one-theme']);
    expect(themes[0].alwaysVisualRefresh).toBe(true);
  });

  test('AWSUI_THEME_PRESET=dev does not override a persisted composition (persisted beats preset)', () => {
    const themes = loadThemes({
      env: { AWSUI_THEME_PRESET: 'dev' },
      persisted: { primary: 'classic', secondary: ['visual-refresh'] },
    });
    expect(themes[0].primaryThemeId).toBe('classic');
    expect(themes[0].includedThemes).toEqual(['visual-refresh']);
  });

  test('an explicit env var overrides a persisted composition outside of watch', () => {
    const themes = loadThemes({
      env: { AWSUI_PRIMARY_THEME: 'visual-refresh', AWSUI_SECONDARY_THEMES: 'one-theme' },
      persisted: { primary: 'classic', secondary: ['visual-refresh'] },
    });
    expect(themes[0].primaryThemeId).toBe('visual-refresh');
    expect(themes[0].includedThemes).toEqual(['one-theme']);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Theme composition changed'));
  });

  test('explicitly-empty AWSUI_SECONDARY_THEMES means zero secondary themes, not "unset"', () => {
    const themes = loadThemes({ env: { AWSUI_PRIMARY_THEME: 'visual-refresh', AWSUI_SECONDARY_THEMES: '' } });
    expect(themes[0].primaryThemeId).toBe('visual-refresh');
    expect(themes[0].includedThemes).toEqual([]);
  });

  test('order-insensitive: reordering an unchanged secondary list does not count as a change', () => {
    const themes = loadThemes({
      env: { AWSUI_SECONDARY_THEMES: 'one-theme,visual-refresh' },
      persisted: { primary: 'classic', secondary: ['visual-refresh', 'one-theme'] },
    });
    expect(themes[0].includedThemes.slice().sort()).toEqual(['one-theme', 'visual-refresh']);
    expect(logSpy).not.toHaveBeenCalledWith(expect.stringContaining('Theme composition changed'));
  });

  test('watch guard: fails loud instead of silently half-rebuilding when explicit conflicts with persisted', () => {
    expect(() =>
      loadThemes({
        argv: ['watch'],
        env: { AWSUI_PRIMARY_THEME: 'visual-refresh', AWSUI_SECONDARY_THEMES: 'one-theme' },
        persisted: { primary: 'classic', secondary: ['visual-refresh'] },
      })
    ).toThrow(/gulp watch.*never cleans lib\//);
  });

  test('watch guard does not fire when the explicit composition matches the persisted one', () => {
    expect(() =>
      loadThemes({
        argv: ['watch'],
        env: { AWSUI_PRIMARY_THEME: 'classic', AWSUI_SECONDARY_THEMES: 'visual-refresh' },
        persisted: { primary: 'classic', secondary: ['visual-refresh'] },
      })
    ).not.toThrow();
  });

  test('a corrupt persisted file logs a warning and falls back to the preset rather than crashing', () => {
    const themes = loadThemes({ persisted: 'CORRUPT' });
    expect(themes[0].primaryThemeId).toBe('classic');
    expect(themes[0].includedThemes).toEqual(['visual-refresh']);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Ignoring corrupt persisted theme composition'));
  });

  test('a missing persisted file (fresh clone) logs one informational line and uses the preset', () => {
    loadThemes({});
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('No previous build found'));
  });

  describe('validation', () => {
    test('rejects an unknown AWSUI_PRIMARY_THEME', () => {
      expect(() => loadThemes({ env: { AWSUI_PRIMARY_THEME: 'does-not-exist' } })).toThrow(
        /Unknown AWSUI_PRIMARY_THEME/
      );
    });

    test('rejects a theme with no primary module used as AWSUI_PRIMARY_THEME', () => {
      expect(() => loadThemes({ env: { AWSUI_PRIMARY_THEME: 'one-theme' } })).toThrow(/has no primary module/);
    });

    test('rejects a theme with no secondary module used in AWSUI_SECONDARY_THEMES', () => {
      expect(() => loadThemes({ env: { AWSUI_SECONDARY_THEMES: 'core' } })).toThrow(/has no secondary module/);
    });

    test('rejects an unknown id in AWSUI_SECONDARY_THEMES', () => {
      expect(() => loadThemes({ env: { AWSUI_SECONDARY_THEMES: 'does-not-exist' } })).toThrow(/Unknown theme/);
    });

    test('rejects the same theme used as both primary and secondary', () => {
      expect(() =>
        loadThemes({ env: { AWSUI_PRIMARY_THEME: 'visual-refresh', AWSUI_SECONDARY_THEMES: 'visual-refresh' } })
      ).toThrow(/cannot be both AWSUI_PRIMARY_THEME and listed in AWSUI_SECONDARY_THEMES/);
    });

    test('rejects a duplicate id within AWSUI_SECONDARY_THEMES', () => {
      expect(() => loadThemes({ env: { AWSUI_SECONDARY_THEMES: 'visual-refresh,visual-refresh' } })).toThrow(
        /listed more than once in AWSUI_SECONDARY_THEMES/
      );
    });

    test('trims whitespace around AWSUI_PRIMARY_THEME', () => {
      const themes = loadThemes({ env: { AWSUI_PRIMARY_THEME: '  core  ', AWSUI_SECONDARY_THEMES: '' } });
      expect(themes[0].primaryThemeId).toBe('core');
    });
  });

  describe('inheriting only one of the two env vars: atomic resolution', () => {
    test('AWSUI_PRIMARY_THEME explicit, AWSUI_SECONDARY_THEMES unset: secondary comes from the preset, NOT persisted', () => {
      const themes = loadThemes({
        env: { AWSUI_PRIMARY_THEME: 'core' },
        persisted: { primary: 'classic', secondary: ['one-theme'] },
      });
      expect(themes[0].primaryThemeId).toBe('core');
      expect(themes[0].includedThemes).toEqual(['visual-refresh']);
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('AWSUI_SECONDARY_THEMES defaulted to the'));
    });

    test('AWSUI_SECONDARY_THEMES explicit, AWSUI_PRIMARY_THEME unset: primary comes from the preset, NOT persisted', () => {
      const themes = loadThemes({
        env: { AWSUI_SECONDARY_THEMES: '' },
        persisted: { primary: 'core', secondary: [] },
      });
      expect(themes[0].primaryThemeId).toBe('classic');
      expect(themes[0].includedThemes).toEqual([]);
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('AWSUI_PRIMARY_THEME defaulted to the'));
    });

    test('does not warn when both env vars are explicit', () => {
      loadThemes({
        env: { AWSUI_PRIMARY_THEME: 'core', AWSUI_SECONDARY_THEMES: '' },
        persisted: { primary: 'classic', secondary: ['visual-refresh'] },
      });
      expect(logSpy).not.toHaveBeenCalledWith(expect.stringContaining('defaulted to the'));
    });

    test('does not warn when neither env var is explicit (pure stickiness, no atomic fallback involved)', () => {
      loadThemes({ persisted: { primary: 'core', secondary: [] } });
      expect(logSpy).not.toHaveBeenCalledWith(expect.stringContaining('defaulted to the'));
    });

    test("reproduces the owner's report: AWSUI_PRIMARY_THEME=visual-refresh alone, with the release default persisted, fails loud rather than silently keeping classic", () => {
      // This is exactly experiment 2 from the bug report: a release-default build (classic +
      // [visual-refresh]) is already persisted, then only AWSUI_PRIMARY_THEME is set. Atomic
      // resolution takes secondary from the preset (still ['visual-refresh'] for the release
      // preset), which collides with the new primary — validateComposition must fail loudly, not
      // swallow this into a fallback that silently keeps classic+visual-refresh.
      expect(() =>
        loadThemes({
          env: { AWSUI_PRIMARY_THEME: 'visual-refresh' },
          persisted: { primary: 'classic', secondary: ['visual-refresh'] },
        })
      ).toThrow(/"visual-refresh" cannot be both AWSUI_PRIMARY_THEME and listed in AWSUI_SECONDARY_THEMES/);
    });

    test('AWSUI_PRIMARY_THEME alone succeeds when the preset secondary does not collide', () => {
      const themes = loadThemes({
        env: { AWSUI_PRIMARY_THEME: 'core' },
        persisted: { primary: 'classic', secondary: ['one-theme'] },
      });
      expect(themes[0].primaryThemeId).toBe('core');
      expect(themes[0].includedThemes).toEqual(['visual-refresh']);
    });

    test('neither set, with no persisted build at all: uses the preset directly (no persisted to ignore)', () => {
      const themes = loadThemes({});
      expect(themes[0].primaryThemeId).toBe('classic');
      expect(themes[0].includedThemes).toEqual(['visual-refresh']);
    });
  });

  describe('assertCompositionUnchanged (watch-trigger staleness guard)', () => {
    test('does not throw when the on-disk composition still matches what this process captured', () => {
      const themes = loadThemes({ persisted: { primary: 'visual-refresh', secondary: ['one-theme'] } });
      expect(() => themes.assertCompositionUnchanged()).not.toThrow();
    });

    test('throws when another process has since rebuilt lib/ with a different composition', () => {
      const themes = loadThemes({ persisted: { primary: 'visual-refresh', secondary: ['one-theme'] } });
      themes.__setPersistedForTest({ primary: 'classic', secondary: ['visual-refresh'] });
      expect(() => themes.assertCompositionUnchanged()).toThrow(
        /Another build changed the theme composition on disk.*stale and must be restarted/
      );
    });

    test('throws when lib/ no longer contains a readable composition at all', () => {
      const themes = loadThemes({ persisted: { primary: 'classic', secondary: ['visual-refresh'] } });
      themes.__setPersistedForTest(undefined);
      expect(() => themes.assertCompositionUnchanged()).toThrow(/no longer contains a readable theme composition/);
    });

    test('does not throw merely because the secondary list order differs', () => {
      const themes = loadThemes({
        persisted: { primary: 'core', secondary: ['one-theme', 'visual-refresh'] },
      });
      themes.__setPersistedForTest({ primary: 'core', secondary: ['visual-refresh', 'one-theme'] });
      expect(() => themes.assertCompositionUnchanged()).not.toThrow();
    });
  });

  describe('the four shipped compositions', () => {
    test('open-source: visual-refresh primary, no secondary', () => {
      const themes = loadThemes({ env: { AWSUI_PRIMARY_THEME: 'visual-refresh', AWSUI_SECONDARY_THEMES: '' } });
      expect(themes[0].primaryThemeId).toBe('visual-refresh');
      expect(themes[0].includedThemes).toEqual([]);
      expect(themes[0].alwaysVisualRefresh).toBe(true);
    });

    test('legacy console (polaris): classic primary, visual-refresh secondary — the default', () => {
      const themes = loadThemes({});
      expect(themes[0].primaryThemeId).toBe('classic');
      expect(themes[0].includedThemes).toEqual(['visual-refresh']);
      expect(themes[0].alwaysVisualRefresh).toBe(false);
    });

    test('console: visual-refresh primary, one-theme secondary, classic removed', () => {
      const themes = loadThemes({
        env: { AWSUI_PRIMARY_THEME: 'visual-refresh', AWSUI_SECONDARY_THEMES: 'one-theme' },
      });
      expect(themes[0].primaryThemeId).toBe('visual-refresh');
      expect(themes[0].includedThemes).toEqual(['one-theme']);
      expect(themes[0].alwaysVisualRefresh).toBe(true);
    });

    test('core: core primary only, no secondary', () => {
      const themes = loadThemes({ env: { AWSUI_PRIMARY_THEME: 'core', AWSUI_SECONDARY_THEMES: '' } });
      expect(themes[0].primaryThemeId).toBe('core');
      expect(themes[0].includedThemes).toEqual([]);
      expect(themes[0].alwaysVisualRefresh).toBe(true);
      expect(themes[0].primaryThemePath).toBe('./core/index.js');
    });
  });
});
