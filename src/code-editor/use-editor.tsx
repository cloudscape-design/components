// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Ace } from 'ace-builds';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';
import { getAceTheme, getDefaultConfig, getDefaultTheme } from './util';
import { CodeEditorProps } from './interfaces';

export function useEditor(ace: any, themes?: CodeEditorProps.AvailableThemes, loading?: boolean) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<null | Ace.Editor>(null);
  const [initialTheme] = useState(getAceTheme(getDefaultTheme(useCurrentMode(editorRef), themes)));

  useEffect(() => {
    const elem = editorRef.current;
    if (!ace || !elem) {
      return;
    }
    const config = getDefaultConfig(ace);
    setEditor(
      ace.edit(elem, {
        ...config,
        theme: initialTheme,
      })
    );
  }, [ace, loading, initialTheme]);

  return { editorRef, editor };
}

export function useSyncEditorLabels(
  editor: null | Ace.Editor,
  {
    controlId,
    ariaLabelledby,
    ariaDescribedby,
  }: { controlId?: string; ariaLabelledby?: string; ariaDescribedby?: string }
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
    updateAttribute('aria-labelledby', ariaLabelledby);
    updateAttribute('aria-describedby', ariaDescribedby);
  }, [ariaDescribedby, ariaLabelledby, controlId, editor]);
}

export function useSyncEditorSize(
  editor: null | Ace.Editor,
  { width, height }: { width?: null | number; height?: null | number }
) {
  useEffect(() => {
    editor?.resize();
  }, [editor, width, height]);

  const onResize = useCallback(() => {
    editor?.resize();
  }, [editor]);

  return { onResize };
}

export function useSyncEditorValue(editor: null | Ace.Editor, value: string) {
  useEffect(() => {
    if (!editor) {
      return;
    }
    if (value === editor.getValue()) {
      return;
    }
    const pos = editor.session.selection.toJSON();
    editor.setValue(value, -1);
    editor.session.selection.fromJSON(pos);
  }, [editor, value]);
}

export function useSyncEditorLanguage(editor: null | Ace.Editor, language: string) {
  useEffect(() => {
    editor?.session.setMode(`ace/mode/${language}`);
  }, [editor, language]);
}

export function useSyncEditorWrapLines(editor: null | Ace.Editor, wrapLines?: boolean) {
  useEffect(() => {
    editor?.session.setUseWrapMode(wrapLines ?? true);
  }, [editor, wrapLines]);
}

export function useSyncEditorTheme(editor: null | Ace.Editor, theme: CodeEditorProps.Theme) {
  useEffect(() => {
    editor?.setTheme(getAceTheme(theme));
  }, [editor, theme]);
}
