// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Ace } from 'ace-builds';

import { AceModes } from './ace-modes';
import { LightThemes, DarkThemes } from './ace-themes';
import { CodeEditorProps } from './interfaces';

export type PaneStatus = 'error' | 'warning' | 'hidden';

const DEFAULT_LIGHT_THEME: typeof LightThemes[number]['value'] = 'cloud_editor';
const DEFAULT_DARK_THEME: typeof DarkThemes[number]['value'] = 'cloud_editor_dark';
const FALLBACK_LIGHT_THEME: typeof LightThemes[number]['value'] = 'dawn';
const FALLBACK_DARK_THEME: typeof DarkThemes[number]['value'] = 'tomorrow_night_bright';

function isAceVersionAtLeast(ace: any, minVersion: [number, number, number]): boolean {
  // Split semantic version numbers. We don't need a full semver parser for this.
  const semanticVersion = ace?.version?.split('.').map((part: string) => {
    const parsed = parseInt(part);
    return Number.isNaN(parsed) ? part : parsed;
  });

  return (
    !!semanticVersion &&
    typeof semanticVersion[0] === 'number' &&
    semanticVersion[0] >= minVersion[0] &&
    typeof semanticVersion[1] === 'number' &&
    semanticVersion[1] >= minVersion[1] &&
    typeof semanticVersion[2] === 'number' &&
    semanticVersion[2] >= minVersion[2]
  );
}

export function supportsKeyboardAccessibility(ace: any): boolean {
  return isAceVersionAtLeast(ace, [1, 23, 0]);
}

export function supportsCloudEditorThemes(ace: any): boolean {
  return isAceVersionAtLeast(ace, [1, 32, 0]);
}

export function getDefaultConfig(ace: any): Partial<Ace.EditorOptions> {
  return {
    behavioursEnabled: true,
    ...(supportsKeyboardAccessibility(ace) ? { enableKeyboardAccessibility: true } : {}),
  };
}

export function getDefaultTheme(ace: any, mode: 'light' | 'dark'): CodeEditorProps.Theme {
  if (supportsCloudEditorThemes(ace)) {
    return mode === 'dark' ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
  } else {
    return mode === 'dark' ? FALLBACK_DARK_THEME : FALLBACK_LIGHT_THEME;
  }
}

export function getDefaultSupportedThemes(ace: any): CodeEditorProps.AvailableThemes {
  return {
    light: LightThemes.map(theme => theme.value).filter(
      value => value !== 'cloud_editor' || supportsCloudEditorThemes(ace)
    ),
    dark: DarkThemes.map(theme => theme.value).filter(
      value => value !== 'cloud_editor_dark' || supportsCloudEditorThemes(ace)
    ),
  };
}

export function getAceTheme(theme: CodeEditorProps.Theme) {
  return `ace/theme/${theme}`;
}

export function getLanguageLabel(language: CodeEditorProps.Language): string {
  return AceModes.filter((mode: { value: string }) => mode.value === language)[0]?.label || language;
}
