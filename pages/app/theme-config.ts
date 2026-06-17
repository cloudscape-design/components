// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { INCLUDED_THEMES } from '~components/internal/environment';

export interface SelectableTheme {
  id: string;
  label: string;
  bodyClass: string;
}

const THEME_METADATA: Record<string, { label?: string }> = {
  'visual-refresh': { label: 'Visual refresh' },
  'one-theme': { label: 'One theme' },
};

// The classic baseline (no secondary theme) used as the `theme` URL param value.
export const CLASSIC_THEME_ID = 'classic';

export const includedThemes: SelectableTheme[] = INCLUDED_THEMES.map(id => ({
  id,
  label: THEME_METADATA[id]?.label ?? id,
  bodyClass: `awsui-${id}`,
}));

function findIncludedTheme(id: string): SelectableTheme | null {
  return includedThemes.find(theme => theme.id === id) ?? null;
}

// Resolves the active theme, preferring the canonical `theme` URL param. Falls back to the legacy
// `visualRefresh` boolean param, kept for backwards compatibility.
export function resolveActiveTheme(themeParam: string | undefined, isVisualRefresh: boolean): SelectableTheme | null {
  if (themeParam) {
    return themeParam === CLASSIC_THEME_ID ? null : findIncludedTheme(themeParam);
  }
  return isVisualRefresh ? findIncludedTheme('visual-refresh') : null;
}
