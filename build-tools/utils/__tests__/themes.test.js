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
  for (const key of ['PRIMARY_THEME', 'SECONDARY_THEMES', 'THEME_PRESET']) {
    delete process.env[key];
  }
  Object.assign(process.env, env);
  process.argv = ['node', 'gulp', ...argv];

  jest.doMock('fs', () => {
    const realFs = jest.requireActual('fs');
    return {
      ...realFs,
      readFileSync: (filePath, ...rest) => {
        if (typeof filePath === 'string' && filePath.endsWith(ENVIRONMENT_JSON_SUFFIX)) {
          if (persisted === undefined) {
            const error = new Error('no such file');
            error.code = 'ENOENT';
            throw error;
          }
          if (persisted === 'CORRUPT') {
            return 'not valid json {{{';
          }
          return JSON.stringify({ PRIMARY_THEME: persisted.primary, INCLUDED_THEMES: persisted.secondary });
        }
        return realFs.readFileSync(filePath, ...rest);
      },
    };
  });

  try {
    return require('../themes');
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

  test('THEME_PRESET=dev with no persisted build resolves to every switchable theme', () => {
    const themes = loadThemes({ env: { THEME_PRESET: 'dev' } });
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

  test('THEME_PRESET=dev does not override a persisted composition (persisted beats preset)', () => {
    const themes = loadThemes({
      env: { THEME_PRESET: 'dev' },
      persisted: { primary: 'classic', secondary: ['visual-refresh'] },
    });
    expect(themes[0].primaryThemeId).toBe('classic');
    expect(themes[0].includedThemes).toEqual(['visual-refresh']);
  });

  test('an explicit env var overrides a persisted composition outside of watch', () => {
    const themes = loadThemes({
      env: { PRIMARY_THEME: 'visual-refresh', SECONDARY_THEMES: 'one-theme' },
      persisted: { primary: 'classic', secondary: ['visual-refresh'] },
    });
    expect(themes[0].primaryThemeId).toBe('visual-refresh');
    expect(themes[0].includedThemes).toEqual(['one-theme']);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Theme composition changed'));
  });

  test('explicitly-empty SECONDARY_THEMES means zero secondary themes, not "unset"', () => {
    const themes = loadThemes({ env: { PRIMARY_THEME: 'visual-refresh', SECONDARY_THEMES: '' } });
    expect(themes[0].primaryThemeId).toBe('visual-refresh');
    expect(themes[0].includedThemes).toEqual([]);
  });

  test('order-insensitive: reordering an unchanged secondary list does not count as a change', () => {
    const themes = loadThemes({
      env: { SECONDARY_THEMES: 'one-theme,visual-refresh' },
      persisted: { primary: 'classic', secondary: ['visual-refresh', 'one-theme'] },
    });
    expect(themes[0].includedThemes.slice().sort()).toEqual(['one-theme', 'visual-refresh']);
    expect(logSpy).not.toHaveBeenCalledWith(expect.stringContaining('Theme composition changed'));
  });

  test('watch guard: fails loud instead of silently half-rebuilding when explicit conflicts with persisted', () => {
    expect(() =>
      loadThemes({
        argv: ['watch'],
        env: { PRIMARY_THEME: 'visual-refresh', SECONDARY_THEMES: 'one-theme' },
        persisted: { primary: 'classic', secondary: ['visual-refresh'] },
      })
    ).toThrow(/gulp watch.*never cleans lib\//);
  });

  test('watch guard does not fire when the explicit composition matches the persisted one', () => {
    expect(() =>
      loadThemes({
        argv: ['watch'],
        env: { PRIMARY_THEME: 'classic', SECONDARY_THEMES: 'visual-refresh' },
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
    test('rejects an unknown PRIMARY_THEME', () => {
      expect(() => loadThemes({ env: { PRIMARY_THEME: 'does-not-exist' } })).toThrow(/Unknown PRIMARY_THEME/);
    });

    test('rejects a theme with no primary module used as PRIMARY_THEME', () => {
      expect(() => loadThemes({ env: { PRIMARY_THEME: 'one-theme' } })).toThrow(/has no primary module/);
    });

    test('rejects a theme with no secondary module used in SECONDARY_THEMES', () => {
      expect(() => loadThemes({ env: { SECONDARY_THEMES: 'core' } })).toThrow(/has no secondary module/);
    });

    test('rejects an unknown id in SECONDARY_THEMES', () => {
      expect(() => loadThemes({ env: { SECONDARY_THEMES: 'does-not-exist' } })).toThrow(/Unknown theme/);
    });

    test('rejects the same theme used as both primary and secondary', () => {
      expect(() =>
        loadThemes({ env: { PRIMARY_THEME: 'visual-refresh', SECONDARY_THEMES: 'visual-refresh' } })
      ).toThrow(/cannot be both PRIMARY_THEME and listed in SECONDARY_THEMES/);
    });

    test('rejects a duplicate id within SECONDARY_THEMES', () => {
      expect(() => loadThemes({ env: { SECONDARY_THEMES: 'visual-refresh,visual-refresh' } })).toThrow(
        /listed more than once in SECONDARY_THEMES/
      );
    });

    test('trims whitespace around PRIMARY_THEME', () => {
      const themes = loadThemes({ env: { PRIMARY_THEME: '  core  ', SECONDARY_THEMES: '' } });
      expect(themes[0].primaryThemeId).toBe('core');
    });
  });

  describe('inheriting only one of the two env vars from a persisted build', () => {
    test('warns when PRIMARY_THEME is explicit but SECONDARY_THEMES is inherited', () => {
      loadThemes({
        env: { PRIMARY_THEME: 'core' },
        persisted: { primary: 'classic', secondary: [] },
      });
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('SECONDARY_THEMES was not — it was inherited'));
    });

    test('warns when SECONDARY_THEMES is explicit but PRIMARY_THEME is inherited', () => {
      loadThemes({
        env: { SECONDARY_THEMES: '' },
        persisted: { primary: 'core', secondary: [] },
      });
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('PRIMARY_THEME was not — it was inherited'));
    });

    test('does not warn when both env vars are explicit', () => {
      loadThemes({
        env: { PRIMARY_THEME: 'core', SECONDARY_THEMES: '' },
        persisted: { primary: 'classic', secondary: ['visual-refresh'] },
      });
      expect(logSpy).not.toHaveBeenCalledWith(expect.stringContaining('was inherited'));
    });
  });

  describe('the four shipped compositions', () => {
    test('open-source: visual-refresh primary, no secondary', () => {
      const themes = loadThemes({ env: { PRIMARY_THEME: 'visual-refresh', SECONDARY_THEMES: '' } });
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
      const themes = loadThemes({ env: { PRIMARY_THEME: 'visual-refresh', SECONDARY_THEMES: 'one-theme' } });
      expect(themes[0].primaryThemeId).toBe('visual-refresh');
      expect(themes[0].includedThemes).toEqual(['one-theme']);
      expect(themes[0].alwaysVisualRefresh).toBe(true);
    });

    test('core: core primary only, no secondary', () => {
      const themes = loadThemes({ env: { PRIMARY_THEME: 'core', SECONDARY_THEMES: '' } });
      expect(themes[0].primaryThemeId).toBe('core');
      expect(themes[0].includedThemes).toEqual([]);
      expect(themes[0].alwaysVisualRefresh).toBe(true);
      expect(themes[0].primaryThemePath).toBe('./core/index.js');
    });
  });
});
