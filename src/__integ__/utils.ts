// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as glob from 'glob';

/** React major version the dev pages under test are rendered with. */
export const reactVersion = process.env.REACT_VERSION ?? '16';

/** True when the dev pages under test are rendered with React 18 or newer (concurrent root). */
export const isReact18OrNewer = Number(reactVersion) >= 18;

export type Theme = 'refresh' | 'refresh-toolbar';
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
