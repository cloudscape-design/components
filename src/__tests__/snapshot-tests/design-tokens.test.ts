// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { requireDesignTokensFile } from '../utils';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const themes = require('../../../build-tools/utils/themes');

// Derived from whatever composition this build was actually run with (see AWSUI_PRIMARY_THEME /
// AWSUI_SECONDARY_THEMES in docs/SETUP.md), rather than a hardcoded list — otherwise this test drifts
// out of sync whenever the build composition changes.
const themeNames: string[] = [themes[0].primaryThemeId, ...themes[0].includedThemes];

describe('Design tokens artifacts', () => {
  test.each<string>(themeNames)(`Design tokens JSON for %s matches the snapshot`, (themeName: string) => {
    const jsonContent = requireDesignTokensFile(`index-${themeName}.json`);
    expect(jsonContent).toMatchSnapshot(themeName);
  });
  test.each<string>(themeNames)(`Design tokens JSON schema is generated`, (themeName: string) => {
    const jsonSchema = requireDesignTokensFile(`index-${themeName}-schema.json`);
    expect(jsonSchema).not.toBeUndefined();
  });
});
