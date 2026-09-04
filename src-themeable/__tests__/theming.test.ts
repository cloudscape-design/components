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
}));

jest.mock('../internal/template/internal/generated/theming/index.cjs', () => ({
  preset,
}));

import { buildThemedComponents as themingCoreBuild } from '@cloudscape-design/theming-build';

import { buildThemedComponents } from '../theming';

describe('buildThemedComponents', () => {
  test('does not pass website token versions by default', async () => {
    const theme = {} as any;

    await buildThemedComponents({ theme, outputDir: '/tmp/output', baseThemeId: 'visual-refresh' });

    expect(themingCoreBuild).toHaveBeenCalledWith(
      expect.objectContaining({
        preset: {
          ...preset,
        },
      })
    );
  });

  test('passes stable website token versions when the feature flag is enabled', async () => {
    const theme = {} as any;

    await buildThemedComponents({
      theme,
      outputDir: '/tmp/output',
      baseThemeId: 'visual-refresh',
      ...({ __tokenHashSeed: 'website' } as any),
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
