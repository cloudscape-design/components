// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const testIf = (condition: boolean) => (condition ? test : test.skip);

export type Theme = 'classic' | 'refresh' | 'refresh-toolbar';

export function getUrlParams(theme: Theme) {
  const params = new URLSearchParams({
    visualRefresh: `${theme.startsWith('refresh')}`,
    appLayoutToolbar: `${theme === 'refresh-toolbar'}`,
  });
  return params.toString();
}
