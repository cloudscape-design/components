// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { applyTheme as coreApplyTheme } from '@cloudscape-design/theming-runtime';
import { preset, TypedOverride } from '../internal/generated/theming';

export type Theme = TypedOverride;
export interface ApplyThemeParams {
  theme: Theme;
}

export interface ApplyThemeResult {
  reset: () => void;
}

export function applyTheme({ theme }: ApplyThemeParams): ApplyThemeResult {
  return coreApplyTheme({
    override: theme,
    preset,
  });
}
