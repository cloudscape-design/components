// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { cloneDeep } from 'lodash';
import { applyTheme as componentsApplyTheme } from '~components/theming';

export interface Theme {
  tokens: Record<string, string | { light: string; dark: string }>;
  contexts: {
    'compact-table': { tokens: Record<string, string | { light: string; dark: string }> };
    'top-navigation': { tokens: Record<string, string | { light: string; dark: string }> };
    flashbar: { tokens: Record<string, string | { light: string; dark: string }> };
  };
}

export function createDefaultTheme(): Theme {
  return {
    tokens: {},
    contexts: { 'compact-table': { tokens: {} }, 'top-navigation': { tokens: {} }, flashbar: { tokens: {} } },
  };
}

export function setThemeToken(
  theme: Theme,
  token: string,
  value: string,
  scope: 'light' | 'dark',
  context: null | string = null
): Theme {
  const next = cloneDeep(theme);
  const tokens =
    context === 'compact-table' || context === 'top-navigation' || context === 'flashbar'
      ? next.contexts[context].tokens
      : next.tokens;
  const currValue = tokens[token];
  const currValueObj =
    typeof currValue === 'object' ? { ...currValue } : { light: currValue ?? value, dark: currValue ?? value };
  tokens[token] = scope ? { ...currValueObj, [scope]: value } : value;
  return next;
}

export function applyTheme(theme: Theme) {
  const isVR = !!document.querySelector('.awsui-visual-refresh');
  componentsApplyTheme({ theme, baseThemeId: isVR ? 'visual-refresh' : undefined });
}

export function exportTheme(theme: Theme) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(theme));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', 'theme.json');
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export function importTheme(file: File, onImport: (theme: Theme) => void) {
  const reader = new FileReader();

  reader.onload = event => {
    const result = event.target?.result;
    const theme = JSON.parse(typeof result === 'string' ? result : '{}');
    onImport(theme);
  };

  reader.readAsText(file);
}
