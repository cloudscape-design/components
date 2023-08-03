// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, forwardRef } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { CodeSnippetProps } from './interfaces';
import {
  DEFAULT_DARK_THEME,
  DEFAULT_LIGHT_THEME,
  useEditorAttributes,
  useAceEditor,
  useEditorValue,
  useEditorLanguage,
  useEditorPreferences,
} from '../code-editor/util';
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

export { CodeSnippetProps };

const CodeSnippet = forwardRef((props: CodeSnippetProps, ref: React.Ref<CodeSnippetProps.Ref>) => {
  const codeSnippetRef = useRef<HTMLDivElement>(null);
  const { __internalRootRef } = useBaseComponent('CodeSnippet');
  const { controlId, ariaLabelledby, ariaDescribedby } = useFormFieldContext(props);
  const { ace, value, language, i18nStrings, ariaLabel, ...rest } = props;
  const baseProps = getBaseProps(rest);
  const i18n = useInternalI18n('code-editor');

  const mode = useCurrentMode(__internalRootRef);
  const defaultTheme = mode === 'dark' ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;

  const editor = useAceEditor(ace, codeSnippetRef, !!props.loading);

  useEditorAttributes(editor ?? null, { ariaLabel, ariaDescribedby, ariaLabelledby, controlId });

  useForwardFocus(ref, codeSnippetRef);
  const isRefresh = useVisualRefresh();

  const showGutter = !!props.preferences?.showGutter;
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

  useEditorValue(editor, value);

  useEditorLanguage(editor, language);

  useEditorPreferences(
    editor,
    { wrapLines: props.preferences?.wrapLines, theme: props.preferences?.theme },
    defaultTheme
  );

  return (
    <div
      {...baseProps}
      className={clsx(styles['code-snippet'], baseProps.className, { [styles['code-snippet-refresh']]: isRefresh })}
      ref={__internalRootRef}
    >
      {props.loading && (
        <LoadingScreen>
          <LiveRegion visible={true}>{i18n('i18nStrings.loadingState', i18nStrings?.loadingState)}</LiveRegion>
        </LoadingScreen>
      )}

      {!ace && !props.loading && (
        <ErrorScreen
          recoveryText={i18n('i18nStrings.errorStateRecovery', i18nStrings?.errorStateRecovery)}
          onRecoveryClick={props.onRecoveryClick}
        >
          {i18n('i18nStrings.errorState', i18nStrings?.errorState)}
        </ErrorScreen>
      )}

      {ace && !props.loading && (
        <div
          ref={codeSnippetRef}
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
