// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import mapValues from 'lodash/mapValues.js';
import { join } from 'path';

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
  test('passes stable website token versions to theming build', async () => {
    const theme = {} as any;

    await buildThemedComponents({ theme, outputDir: '/tmp/output', baseThemeId: 'visual-refresh' });

    expect(themingCoreBuild).toHaveBeenCalledWith({
      override: theme,
      preset: {
        ...preset,
        tokenVersions: mapValues(preset.propertiesMap, () => 'website'),
      },
      baseThemeId: 'visual-refresh',
      componentsOutputDir: join('/tmp/output', 'components'),
      designTokensOutputDir: join('/tmp/output', 'design-tokens'),
      templateDir: join(__dirname, '../internal/template'),
      designTokensTemplateDir: join(__dirname, '../internal/template-tokens'),
      scssDir: join(__dirname, '../internal/scss'),
    });
  });
});
