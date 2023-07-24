// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { requireDesignTokensFile } from './utils';

const themeNames = ['classic', 'visual-refresh'];

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
