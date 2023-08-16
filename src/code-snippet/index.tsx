// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, forwardRef } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { CodeSnippetProps } from './interfaces';
import {
  useEditor,
  useSyncEditorLabels,
  useSyncEditorValue,
  useSyncEditorLanguage,
  useSyncEditorWrapLines,
  useSyncEditorTheme,
} from '../code-editor/use-editor';
import { setupEditor } from './setup-editor';
import LoadingScreen from '../code-editor/loading-screen';
import ErrorScreen from '../code-editor/error-screen';

import useBaseComponent from '../internal/hooks/use-base-component';
import useForwardFocus from '../internal/hooks/forward-focus';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';
import { useInternalI18n } from '../i18n/context';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import LiveRegion from '../internal/components/live-region';

import styles from './styles.css.js';
import { DEFAULT_DARK_THEME, DEFAULT_LIGHT_THEME } from '../code-editor/util';

export { CodeSnippetProps };

const CodeSnippet = forwardRef((props: CodeSnippetProps, ref: React.Ref<CodeSnippetProps.Ref>) => {
  const { __internalRootRef } = useBaseComponent('CodeSnippet');
  const { ace, value, language, i18nStrings, ariaLabel, preferences, loading, onRecoveryClick, ...rest } = props;
  const { controlId, ariaLabelledby, ariaDescribedby } = useFormFieldContext(props);
  const baseProps = getBaseProps(rest);
  const i18n = useInternalI18n('code-editor');
  const mode = useCurrentMode(__internalRootRef);

  const { editorRef, editor } = useEditor(ace, loading);

  useSyncEditorLabels(editor, { controlId, ariaLabel, ariaLabelledby, ariaDescribedby });

  useForwardFocus(ref, editorRef);
  const isRefresh = useVisualRefresh();

  const showGutter = !!preferences?.showGutter;
  useEffect(() => {
    if (!ace || !editor) {
      return;
    }

    setupEditor(ace, editor, { showGutter });

    return () => {
      editor?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ace, editor]);

  useEffect(() => {
    editor?.setOption('showGutter', showGutter);
  }, [editor, showGutter]);

  useSyncEditorValue(editor, value);

  useSyncEditorLanguage(editor, language);

  useSyncEditorWrapLines(editor, preferences?.wrapLines);

  const defaultTheme = mode === 'dark' ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
  useSyncEditorTheme(editor, preferences?.theme ?? defaultTheme);

  return (
    <div
      {...baseProps}
      className={clsx(styles['code-snippet'], baseProps.className, { [styles['code-snippet-refresh']]: isRefresh })}
      ref={__internalRootRef}
    >
      {loading && (
        <LoadingScreen>
          <LiveRegion visible={true}>{i18n('i18nStrings.loadingState', i18nStrings?.loadingState)}</LiveRegion>
        </LoadingScreen>
      )}

      {!ace && !loading && (
        <ErrorScreen
          recoveryText={i18n('i18nStrings.errorStateRecovery', i18nStrings?.errorStateRecovery)}
          onRecoveryClick={onRecoveryClick}
        >
          {i18n('i18nStrings.errorState', i18nStrings?.errorState)}
        </ErrorScreen>
      )}

      {ace && !loading && (
        <div
          ref={editorRef}
          className={clsx(styles.snippet, styles.ace, isRefresh && styles['snippet-refresh'])}
          tabIndex={0}
          role="group"
          aria-label={i18n('i18nStrings.editorGroupAriaLabel', i18nStrings?.editorGroupAriaLabel)}
        />
      )}
    </div>
  );
});

applyDisplayName(CodeSnippet, 'CodeSnippet');
export default CodeSnippet;
