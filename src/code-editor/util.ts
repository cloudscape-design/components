// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Ace } from 'ace-builds';

import { AceModes } from './ace-modes';
import { LightThemes, DarkThemes } from './ace-themes';
import { CodeEditorProps } from './interfaces';
import { findUpUntil } from '../internal/utils/dom';
import { useEffect, useState } from 'react';

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

export function useAceEditor(ace: any, codeSnippetRef: React.RefObject<HTMLElement>, loading: boolean) {
  const [editor, setEditor] = useState<null | Ace.Editor>(null);

  useEffect(() => {
    const elem = codeSnippetRef.current;
    if (!ace || !elem) {
      return;
    }
    const config = getDefaultConfig(ace);
    setEditor(
      ace.edit(elem, {
        ...config,
        theme: getAceTheme(getDefaultTheme(elem)),
      })
    );
  }, [ace, codeSnippetRef, loading]);

  return editor;
}

export function useEditorAttributes(
  editor: null | Ace.Editor,
  {
    controlId,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
  }: {
    controlId?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
    ariaDescribedby?: string;
  }
) {
  useEffect(() => {
    if (!editor) {
      return;
    }
    const { textarea } = editor.renderer as unknown as { textarea: HTMLTextAreaElement };
    if (!textarea) {
      return;
    }
    const updateAttribute = (attribute: string, value: string | undefined) =>
      value ? textarea.setAttribute(attribute, value) : textarea.removeAttribute(attribute);
    updateAttribute('id', controlId);
    updateAttribute('aria-label', ariaLabel);
    updateAttribute('aria-labelledby', ariaLabelledby);
    updateAttribute('aria-describedby', ariaDescribedby);
  }, [ariaLabel, ariaDescribedby, ariaLabelledby, controlId, editor]);
}

export function useEditorValue(editor: null | Ace.Editor, value: string) {
  useEffect(() => {
    if (!editor) {
      return;
    }
    if (value === editor.getValue()) {
      return;
    }
    // TODO maintain cursor position?
    const pos = editor.session.selection.toJSON();
    editor.setValue(value, -1);
    editor.session.selection.fromJSON(pos);
  }, [editor, value]);
}

export function useEditorLanguage(editor: null | Ace.Editor, language: string) {
  useEffect(() => {
    editor?.session.setMode(`ace/mode/${language}`);
  }, [editor, language]);
}

export function useEditorPreferences(
  editor: null | Ace.Editor,
  preferences: { wrapLines?: boolean; theme?: CodeEditorProps.Theme },
  defaultTheme: CodeEditorProps.Theme
) {
  useEffect(() => {
    if (!editor) {
      return;
    }

    const theme: CodeEditorProps.Theme = preferences.theme ?? defaultTheme;
    editor.setTheme(getAceTheme(theme));

    editor.session.setUseWrapMode(preferences.wrapLines ?? true);
  }, [editor, defaultTheme, preferences.wrapLines, preferences.theme]);
}
