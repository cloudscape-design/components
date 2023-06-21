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

const KEYBOARD_ACCESSIBILITY_MIN_ACE_VERSION = [1, 23];

export function supportsKeyboardAccessibility(ace: any): boolean {
  const semanticVersion = ace?.version?.split('.').map((part: string) => {
    try {
      return parseInt(part);
    } catch {
      return part;
    }
  });

  return (
    semanticVersion &&
    typeof semanticVersion[0] === 'number' &&
    semanticVersion[0] >= KEYBOARD_ACCESSIBILITY_MIN_ACE_VERSION[0] &&
    typeof semanticVersion[1] === 'number' &&
    semanticVersion[1] >= KEYBOARD_ACCESSIBILITY_MIN_ACE_VERSION[1]
  );
}

export function getDefaultConfig(ace: any): Partial<Ace.EditorOptions> {
  return {
    behavioursEnabled: true,
    ...(supportsKeyboardAccessibility(ace) ? { enableKeyboardAccessibility: true } : {}),
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
