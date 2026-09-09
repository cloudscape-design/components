// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import mapValues from 'lodash/mapValues.js';

const preset = {
  propertiesMap: {
    borderRadiusButton: '--border-radius-button-aaaaaa',
    colorBorderButtonNormalDefault: '--color-border-button-normal-default-bbbbbb',
  },
};

jest.mock('@cloudscape-design/theming-build', () => ({
  buildThemedComponents: jest.fn().mockResolvedValue(undefined),
  generateThemeStylesheet: jest.fn().mockReturnValue('.mock-stylesheet {}'),
}));

jest.mock('../internal/template/internal/generated/theming/index.cjs', () => ({
  preset,
}));

import {
  buildThemedComponents as themingCoreBuild,
  generateThemeStylesheet as themingCoreGenerateThemeStylesheet,
} from '@cloudscape-design/theming-build';

import { buildThemedComponents, generateThemeStylesheet } from '../theming';

describe('buildThemedComponents', () => {
  test('does not pass website token versions by default', async () => {
    const theme = {} as any;

    await buildThemedComponents({ theme, outputDir: '/tmp/output', baseThemeId: 'visual-refresh' });

    expect(themingCoreBuild).toHaveBeenCalledWith(
      expect.objectContaining({
        preset,
      })
    );
  });

  test('passes stable website token versions when the feature flag is enabled', async () => {
    const theme = {} as any;

    await buildThemedComponents({
      theme,
      outputDir: '/tmp/output',
      baseThemeId: 'visual-refresh',
      ...{ __tokenHashSeed: 'website' },
    });

    expect(themingCoreBuild).toHaveBeenCalledWith(
      expect.objectContaining({
        preset: {
          ...preset,
          tokenVersions: mapValues(preset.propertiesMap, () => 'website'),
        },
      })
    );
  });
});

describe('generateThemeStylesheet', () => {
  test('passes the arguments through', () => {
    const theme = { tokens: { borderRadiusButton: '8px' } } as any;

    const stylesheet = generateThemeStylesheet({ theme, selector: '.my-theme' });

    expect(stylesheet).toBe('.mock-stylesheet {}');
    expect(themingCoreGenerateThemeStylesheet).toHaveBeenCalledWith({
      override: theme,
      preset,
      selector: '.my-theme',
    });
  });
});
