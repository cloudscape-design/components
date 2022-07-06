// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Generate a short hash for a file (or files) based on the path and contents.
 *
 * Unlike regular CSS scoping, this is based on the source file content rather
 * that the generated CSS content, so it can be determined ahead of time.
 */
export function fileHashSync(srcDir: string, filePaths: string[]): string {
  const hash = crypto.createHash('sha256');
  for (const filePath of filePaths) {
    const relativePath = path.relative(srcDir, filePath);
    hash.update(relativePath + ':' + fs.readFileSync(filePath, 'utf-8'));
  }
  return hash.digest('hex').slice(0, 6);
}
