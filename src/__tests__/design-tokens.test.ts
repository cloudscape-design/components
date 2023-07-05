// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { requireDesignTokensFile } from './utils';

describe('Design tokens artifacts', () => {
  test.each<string>(['classic', 'visual-refresh'])(
    `Design tokens JSON for %s matches the snapshot`,
    (themeName: string) => {
      const jsonContent = requireDesignTokensFile(`index-${themeName}.json`);
      expect(jsonContent).toMatchSnapshot(themeName);
    }
  );
});
