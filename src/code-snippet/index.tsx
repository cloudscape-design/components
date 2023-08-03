// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState, forwardRef } from 'react';
import { Ace } from 'ace-builds';
import clsx from 'clsx';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';

import { getBaseProps } from '../internal/base-component';
import { CodeSnippetProps } from './interfaces';
import {
  getDefaultConfig,
  getAceTheme,
  DEFAULT_DARK_THEME,
  DEFAULT_LIGHT_THEME,
  getDefaultTheme,
} from '../code-editor/util';
import { fireNonCancelableEvent } from '../internal/events';
import { setupEditor } from './setup-editor';
import { ResizableBox } from '../code-editor/resizable-box';
import LoadingScreen from '../code-editor/loading-screen';
import ErrorScreen from '../code-editor/error-screen';

import useBaseComponent from '../internal/hooks/use-base-component';
import useForwardFocus from '../internal/hooks/forward-focus';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';
import { useInternalI18n } from '../i18n/context';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { useControllable } from '../internal/hooks/use-controllable';
import LiveRegion from '../internal/components/live-region';

import styles from './styles.css.js';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';

export { CodeSnippetProps };

const CodeSnippet = forwardRef((props: CodeSnippetProps, ref: React.Ref<CodeSnippetProps.Ref>) => {
  const CodeSnippetRef = useRef<HTMLDivElement>(null);
  const { __internalRootRef } = useBaseComponent('CodeSnippet');
  const { controlId, ariaLabelledby, ariaDescribedby } = useFormFieldContext(props);
  const { ace, value, language, i18nStrings, editorContentHeight, onEditorContentResize, ariaLabel, ...rest } = props;
  const [editorHeight = 480, setEditorHeight] = useControllable(editorContentHeight, onEditorContentResize, 480, {
    componentName: 'code-editor',
    changeHandler: 'onEditorContentResize',
    controlledProp: 'editorContentHeight',
  });
  const baseProps = getBaseProps(rest);
  const i18n = useInternalI18n('code-editor');

  const [editor, setEditor] = useState<Ace.Editor>();
  const mode = useCurrentMode(__internalRootRef);
  const defaultTheme = mode === 'dark' ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;

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

  useEffect(() => {
    const elem = CodeSnippetRef.current;
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
  }, [ace, props.loading]);
  const [CodeSnippetWidth, CodeSnippetMeasureRef] = useContainerQuery(rect => rect.contentBoxWidth);
  const mergedRef = useMergeRefs(CodeSnippetMeasureRef, __internalRootRef);
  useForwardFocus(ref, CodeSnippetRef);
  const isRefresh = useVisualRefresh();

  useEffect(() => {
    editor?.resize();
  }, [editor, editorContentHeight, CodeSnippetWidth]);

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

  useEffect(() => {
    editor?.session.setMode(`ace/mode/${language}`);
  }, [editor, language]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const theme: CodeSnippetProps.Theme = props.preferences?.theme ?? defaultTheme;
    editor.setTheme(getAceTheme(theme));

    editor.session.setUseWrapMode(props.preferences?.wrapLines ?? true);
  }, [editor, defaultTheme, props.preferences]);

  const onResize = useCallback(() => {
    editor?.resize();
  }, [editor]);

  return (
    <div
      {...baseProps}
      className={clsx(styles['code-snippet'], baseProps.className, { [styles['code-snippet-refresh']]: isRefresh })}
      ref={mergedRef}
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
        <ResizableBox
          height={Math.max(editorHeight, 20)}
          minHeight={20}
          onResize={height => {
            setEditorHeight(height);
            onResize();
            fireNonCancelableEvent(onEditorContentResize, { height });
          }}
        >
          <div
            ref={CodeSnippetRef}
            className={clsx(styles.snippet, styles.ace, isRefresh && styles['snippet-refresh'])}
            tabIndex={0}
            role="group"
            aria-label={i18n('i18nStrings.editorGroupAriaLabel', i18nStrings?.editorGroupAriaLabel)}
          />
        </ResizableBox>
      )}
    </div>
  );
});

applyDisplayName(CodeSnippet, 'CodeSnippet');
export default CodeSnippet;
