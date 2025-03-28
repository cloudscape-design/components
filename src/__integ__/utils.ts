// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as glob from 'glob';

export type Theme = 'classic' | 'refresh' | 'refresh-toolbar';
export type Size = 'desktop' | 'mobile';

export function findAllPages(): string[] {
  return glob.sync('**/*.page.tsx', { cwd: 'pages' }).map(file => file.replace(/\.page\.tsx$/, ''));
}

export async function times(n: number, fn: () => Promise<void>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _ of new Array(n)) {
    await fn();
  }
}
