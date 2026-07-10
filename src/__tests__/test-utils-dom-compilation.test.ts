// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const cwd = path.resolve(__dirname, '../..');
const indexFilePath = path.resolve(__dirname, '../test-utils/dom/index.ts');
const minimalElementWrapperImpl = `
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
export { ElementWrapper };
export default function wrapper(root: Element = document.body) {
  return new ElementWrapper(root);
}
`;

let originalContent: string;

test('should compile test-utils without ElementWrapper methods', () => {
  try {
    // Replace generated ElementWrapper with minimal one.
    originalContent = fs.readFileSync(indexFilePath, 'utf-8');
    fs.writeFileSync(indexFilePath, minimalElementWrapperImpl, 'utf-8');

    // Run TypeScript compiler on the test-utils/dom folder.
    // Using --noEmit to just check for errors without generating output.
    execSync(`npx tsc --project ./src/test-utils/tsconfig.json --noEmit`, { cwd, stdio: 'pipe', encoding: 'utf-8' });
  } catch (error: any) {
    // Re-throw with TypeScript compiler output included.
    const tscOutput = (error.stdout || '') + (error.stderr || '') || 'No output captured';
    throw new Error(`TypeScript compilation failed for src/test-utils/dom:\n\n${tscOutput}`);
  } finally {
    // Restore original ElementWrapper.
    fs.writeFileSync(indexFilePath, originalContent, 'utf-8');
  }
});
