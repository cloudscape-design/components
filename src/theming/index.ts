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

export function generateFullThemeStylesheet({ theme }: { theme: Theme }): string {
  return coreGenerateThemeStylesheet({
    preset: {
      ...preset,
      theme: {
        id: 'custom',
        selector: 'body',
        modes: preset.theme.modes,
        tokenModeMap: preset.theme.tokenModeMap,
        ...(theme as any),
      },
    },
  });
}
