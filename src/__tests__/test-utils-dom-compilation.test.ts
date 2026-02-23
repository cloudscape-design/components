// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const indexFilePath = path.resolve(__dirname, '../test-utils/dom/index.ts');

const minimalIndexContent = `import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

export { ElementWrapper };

export default function wrapper(root: Element = document.body) {
  return new ElementWrapper(root);
}
`;

let originalContent: string;

/**
 * This test ensures that the test-utils methods do not rely on methods added to the global ElementWrapper.
 * This allows to override ElementWrapper methods safely in the downstream packages.
 */
describe('test-utils/dom compilation', () => {
  beforeAll(() => {
    originalContent = fs.readFileSync(indexFilePath, 'utf-8');
    fs.writeFileSync(indexFilePath, minimalIndexContent, 'utf-8');
  });

  afterAll(() => {
    // Restore the original content
    fs.writeFileSync(indexFilePath, originalContent, 'utf-8');
  });

  test('should compile src/test-utils/dom with TypeScript', () => {
    // Create a temporary tsconfig specifically for test-utils/dom
    const rootDir = path.resolve(__dirname, '../..');

    // Run TypeScript compiler on the test-utils/dom folder
    // Using --noEmit to just check for errors without generating output
    try {
      execSync(`npx tsc --project ./src/test-utils/tsconfig.json`, { cwd: rootDir, stdio: 'pipe', encoding: 'utf-8' });
    } catch (error: any) {
      // Re-throw with TypeScript compiler output included
      const tscOutput = (error.stdout || '') + (error.stderr || '') || 'No output captured';
      throw new Error(`TypeScript compilation failed for src/test-utils/dom:\n\n${tscOutput}`);
    }
  });
});
