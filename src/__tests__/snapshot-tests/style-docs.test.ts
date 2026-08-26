// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import fs from 'fs';
import path from 'path';

const styleApiDocDir = path.resolve(__dirname, '../../../lib/components-definitions/style-api-doc');

function getStyleApiDocComponents(): string[] {
  if (!fs.existsSync(styleApiDocDir)) {
    return [];
  }
  return fs
    .readdirSync(styleApiDocDir)
    .filter(name => name.endsWith('.json'))
    .map(name => name.replace(/\.json$/, ''))
    .sort();
}

function requireStyleApiDoc(componentName: string) {
  return JSON.parse(fs.readFileSync(path.join(styleApiDocDir, `${componentName}.json`), 'utf-8'));
}

const components = getStyleApiDocComponents();

describe('Style API docs', () => {
  test('list of components with a Style API doc matches the snapshot', () => {
    expect(components).toMatchSnapshot();
  });

  if (components.length > 0) {
    test.each<string>(components)(`definition for %s matches the snapshot`, (componentName: string) => {
      const definition = requireStyleApiDoc(componentName);
      expect(definition).toMatchSnapshot(componentName);
    });
  } else {
    test('generated Style API docs are present', () => {
      throw new Error(
        `No Style API docs found in ${styleApiDocDir}. Run the build (gulp styleDocs) before the snapshot tests.`
      );
    });
  }
});
