// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as glob from 'glob';

export function findAllPages(): string[] {
  return glob.sync('**/*.page.tsx', { cwd: 'pages' }).map(file => file.replace(/\.page\.tsx$/, ''));
}
