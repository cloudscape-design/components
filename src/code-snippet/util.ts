// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Ace } from 'ace-builds';

import { LightThemes, DarkThemes } from './ace-themes';
import { CodeSnippetProps } from './interfaces';
import { findUpUntil } from '../internal/utils/dom';

export type PaneStatus = 'error' | 'warning' | 'hidden';

export const DEFAULT_LIGHT_THEME: typeof LightThemes[number]['value'] = 'dawn';
export const DEFAULT_DARK_THEME: typeof DarkThemes[number]['value'] = 'tomorrow_night_bright';

const KEYBOARD_ACCESSIBILITY_MIN_ACE_VERSION = [1, 23];

export function supportsKeyboardAccessibility(ace: any): boolean {
  // Split semantic version numbers. We don't need a full semver parser for this.
  const semanticVersion = ace?.version?.split('.').map((part: string) => {
    const parsed = parseInt(part);
    return Number.isNaN(parsed) ? part : parsed;
  });

  return (
    !!semanticVersion &&
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

export function getDefaultTheme(element: HTMLElement): CodeSnippetProps.Theme {
  const isDarkMode = !!findUpUntil(
    element,
    node => node.classList.contains('awsui-polaris-dark-mode') || node.classList.contains('awsui-dark-mode')
  );
  return isDarkMode ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
}

export function getAceTheme(theme: CodeSnippetProps.Theme) {
  return `ace/theme/${theme}`;
}
