// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import {
  applyTheme as coreApplyTheme,
  generateThemeStylesheet as coreGenerateThemeStylesheet,
  Override,
} from '@cloudscape-design/theming-runtime';

import { preset } from '../internal/generated/theming';

export type Theme = Override;
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
