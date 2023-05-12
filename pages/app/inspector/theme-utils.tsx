// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { cloneDeep } from 'lodash';
import { applyTheme as componentsApplyTheme } from '~components/theming';

export interface Theme {
  tokens: Record<string, string | { light: string; dark: string }>;
  contexts: {
    'compact-table': { tokens: Record<string, string | { light: string; dark: string }> };
    header: { tokens: Record<string, string | { light: string; dark: string }> };
    'top-navigation': { tokens: Record<string, string | { light: string; dark: string }> };
    flashbar: { tokens: Record<string, string | { light: string; dark: string }> };
  };
}

export function createDefaultTheme(): Theme {
  return {
    tokens: {},
    contexts: {
      'compact-table': { tokens: {} },
      header: { tokens: {} },
      'top-navigation': { tokens: {} },
      flashbar: { tokens: {} },
    },
  };
}

export function createThemeReader(theme: Theme, _context: null | string) {
  const isDarkMode =
    !!document.querySelector('.awsui-dark-mode') || !!document.querySelector('.awsui-polaris-dark-mode');
  const scope = isDarkMode ? 'dark' : 'light';
  const context = mapContext(_context);
  return (token: string) => {
    const themeValue = context ? theme.contexts[context].tokens[token] : theme.tokens[token];
    return typeof themeValue === 'object' ? themeValue[scope] : themeValue;
  };
}

export function setThemeToken(
  theme: Theme,
  token: string,
  value: null | string,
  _context: null | string = null
): Theme {
  const context = mapContext(_context);

  const isDarkMode =
    !!document.querySelector('.awsui-dark-mode') || !!document.querySelector('.awsui-polaris-dark-mode');
  const scope = isDarkMode ? 'dark' : 'light';

  const next = cloneDeep(theme);
  const tokens = context && token.startsWith('color') ? next.contexts[context].tokens : next.tokens;
  const currValue = tokens[token];
  const currValueObj =
    typeof currValue === 'object' ? { ...currValue } : { light: currValue ?? value, dark: currValue ?? value };

  if (!value && typeof currValue === 'object') {
    const oppositeScope = isDarkMode ? 'light' : 'dark';
    tokens[token] = { light: currValue[oppositeScope], dark: currValue[oppositeScope] };
  } else if (!value) {
    delete tokens[token];
  } else {
    tokens[token] = token.startsWith('color') && scope ? { ...currValueObj, [scope]: value } : value;
  }

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

function mapContext(context: null | string): null | 'compact-table' | 'header' | 'top-navigation' | 'flashbar' {
  if (context === 'compact-table' || context === 'header' || context === 'top-navigation' || context === 'flashbar') {
    return context;
  }
  if (context === 'content-header') {
    return 'header';
  }
  return null;
}
