// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const preset = {
  secondary: [{ id: 'one-theme' }],
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
  test('passes secondary themes by default', async () => {
    await buildThemedComponents({ theme: {} as any, outputDir: '/tmp/output', baseThemeId: 'visual-refresh' });

    expect(themingCoreBuild).toHaveBeenCalledWith(
      expect.objectContaining({
        preset,
      })
    );
  });

  test('omits secondary themes when includeSecondaryThemes is false', async () => {
    await buildThemedComponents({
      theme: {} as any,
      outputDir: '/tmp/output',
      baseThemeId: 'visual-refresh',
      includeSecondaryThemes: false,
    });

    expect(themingCoreBuild).toHaveBeenCalledWith(
      expect.objectContaining({
        preset: {
          ...preset,
          secondary: [],
        },
      })
    );
  });
});
