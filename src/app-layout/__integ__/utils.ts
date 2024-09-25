// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const testIf = (condition: boolean) => (condition ? test : test.skip);

export type Theme = 'classic' | 'refresh' | 'refresh-toolbar';

export function getUrlParams(theme: Theme, other?: Record<string, string>) {
  const params = new URLSearchParams({
    visualRefresh: `${theme.startsWith('refresh')}`,
    appLayoutToolbar: `${theme === 'refresh-toolbar'}`,
    ...other,
  });
  return params.toString();
}
