// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Ace } from 'ace-builds';

import { AceModes } from './ace-modes';
import { LightThemes, DarkThemes } from './ace-themes';
import { CodeEditorProps } from './interfaces';
import { findUpUntil } from '../internal/utils/dom';

export type PaneStatus = 'error' | 'warning' | 'hidden';

export const DEFAULT_LIGHT_THEME: typeof LightThemes[number]['value'] = 'dawn';
export const DEFAULT_DARK_THEME: typeof DarkThemes[number]['value'] = 'tomorrow_night_bright';

export function getDefaultConfig(): Partial<Ace.EditorOptions> {
  return {
    behavioursEnabled: true,
    enableKeyboardAccessibility: true,
  };
}

export function getDefaultTheme(element: HTMLElement): CodeEditorProps.Theme {
  const isDarkMode = !!findUpUntil(
    element,
    node => node.classList.contains('awsui-polaris-dark-mode') || node.classList.contains('awsui-dark-mode')
  );
  return isDarkMode ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
}

export function getAceTheme(theme: CodeEditorProps.Theme) {
  return `ace/theme/${theme}`;
}

export function getLanguageLabel(language: CodeEditorProps.Language): string {
  return AceModes.filter((mode: { value: string }) => mode.value === language)[0]?.label || language;
}
