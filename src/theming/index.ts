// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import {
  applyTheme as coreApplyTheme,
  generateThemeStylesheet as coreGenerateThemeStylesheet,
} from '@cloudscape-design/theming-runtime';

import { preset, TypedOverride } from '../internal/generated/theming';

export type Theme = TypedOverride;
export interface ApplyThemeParams {
  theme: Theme;
  baseThemeId?: string;
}

export interface ApplyThemeResult {
  reset: () => void;
}

export function applyTheme({ theme, baseThemeId }: ApplyThemeParams): ApplyThemeResult {
  return coreApplyTheme({
    override: theme,
    preset,
    baseThemeId,
  });
}

export interface GenerateThemeStylesheetParams {
  theme: Theme;
  baseThemeId?: string;
}

export function generateThemeStylesheet({ theme, baseThemeId }: GenerateThemeStylesheetParams): string {
  return coreGenerateThemeStylesheet({
    override: theme,
    preset,
    baseThemeId,
  });
}

const themeStorageKey = Symbol.for('awsui-global-theme');
const themeChangeEvent = 'awsui-global-theme-change';

interface WindowWithTheme extends Window {
  [themeStorageKey]?: Theme;
}

function getTopWindow(): WindowWithTheme {
  try {
    if (window.top) {
      return window.top as unknown as WindowWithTheme;
    }
  } catch {
    // Cross-origin access error — fall back to current window.
  }
  return window as unknown as WindowWithTheme;
}

export function setGlobalTheme(theme: Theme): void {
  if (typeof window === 'undefined') {
    return;
  }
  const topWindow = getTopWindow();
  topWindow[themeStorageKey] = theme;
  topWindow.dispatchEvent(new Event(themeChangeEvent));
}

function getGlobalTheme(): Theme | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  const topWindow = getTopWindow();
  return topWindow[themeStorageKey];
}

export function applyGlobalTheme(): ApplyThemeResult {
  if (typeof window === 'undefined') {
    return { reset: () => {} };
  }

  const topWindow = getTopWindow();
  let currentReset: (() => void) | undefined;

  function apply() {
    currentReset?.();
    currentReset = undefined;
    const theme = getGlobalTheme();

    if (theme) {
      const result = applyTheme({ theme });
      currentReset = result.reset;
    }
  }

  // Apply the current global theme immediately.
  apply();

  // Listen for future global theme changes.
  const listener = () => {
    apply();
  };
  topWindow.addEventListener(themeChangeEvent, listener);

  return {
    reset: () => {
      currentReset?.();
      currentReset = undefined;
      topWindow.removeEventListener(themeChangeEvent, listener);
    },
  };
}
