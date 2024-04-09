// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo, useRef, useState, forwardRef } from 'react';
import { Ace } from 'ace-builds';
import clsx from 'clsx';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';

import { getBaseProps } from '../internal/base-component';
import { KeyCode } from '../internal/keycode';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { CodeEditorProps } from './interfaces';
import { Pane } from './pane';
import { useChangeEffect } from './listeners';
import { PaneStatus, getLanguageLabel, getDefaultTheme, DEFAULT_AVAILABLE_THEMES } from './util';
import { fireNonCancelableEvent } from '../internal/events';
import { setupEditor } from './setup-editor';
import { ResizableBox } from './resizable-box';
import PreferencesModal from './preferences-modal';
import LoadingScreen from './loading-screen';
import ErrorScreen from './error-screen';

import useBaseComponent from '../internal/hooks/use-base-component';
import useForwardFocus from '../internal/hooks/forward-focus';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';
import { useInternalI18n } from '../i18n/context';
import { StatusBar } from './status-bar';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { useControllable } from '../internal/hooks/use-controllable';
import LiveRegion from '../internal/components/live-region';

import styles from './styles.css.js';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import {
  useEditor,
  useSyncEditorSize,
  useSyncEditorLabels,
  useSyncEditorValue,
  useSyncEditorLanguage,
  useSyncEditorWrapLines,
  useSyncEditorTheme,
} from './use-editor';

export { CodeEditorProps };

const CodeEditor = forwardRef((props: CodeEditorProps, ref: React.Ref<CodeEditorProps.Ref>) => {
  const {
    ace,
    value,
    language,
    i18nStrings,
    editorContentHeight,
    onEditorContentResize,
    ariaLabel,
    languageLabel: customLanguageLabel,
    preferences,
    loading,
    themes,
    getModalRoot,
    removeModalRoot,
    ...rest
  } = props;
  const { __internalRootRef } = useBaseComponent('CodeEditor', { props: { language } });
  const { controlId, ariaLabelledby, ariaDescribedby } = useFormFieldContext(props);
  const [editorHeight = 480, setEditorHeight] = useControllable(editorContentHeight, onEditorContentResize, 480, {
    componentName: 'code-editor',
    changeHandler: 'onEditorContentResize',
    controlledProp: 'editorContentHeight',
  });
  const mode = useCurrentMode(__internalRootRef);
  const isRefresh = useVisualRefresh();
  const baseProps = getBaseProps(rest);
  const i18n = useInternalI18n('code-editor');

  const errorsTabRef = useRef<HTMLButtonElement>(null);
  const warningsTabRef = useRef<HTMLButtonElement>(null);
  const [codeEditorWidth, codeEditorMeasureRef] = useContainerQuery(rect => rect.contentBoxWidth);
  const mergedRef = useMergeRefs(codeEditorMeasureRef, __internalRootRef);

  const paneId = useUniqueId('code-editor-pane');

  const [paneStatus, setPaneStatus] = useState<PaneStatus>('hidden');
  const [annotations, setAnnotations] = useState<Ace.Annotation[]>([]);
  const [highlightedAnnotation, setHighlightedAnnotation] = useState<Ace.Annotation>();
  const [cursorPosition, setCursorPosition] = useState<Ace.Point>({ row: 0, column: 0 });
  const [isTabFocused, setTabFocused] = useState<boolean>(false);

  const { editorRef, editor } = useEditor(ace, themes, loading);

  useForwardFocus(ref, editorRef);

  useEffect(() => {
    if (!ace || !editor) {
      return;
    }

    setupEditor(ace, editor, setAnnotations, setCursorPosition, setHighlightedAnnotation, setPaneStatus);

    return () => {
      editor?.destroy();
    };
  }, [ace, editor]);

  useSyncEditorLabels(editor, { controlId, ariaLabel, ariaLabelledby, ariaDescribedby });

  const { onResize } = useSyncEditorSize(editor, { width: codeEditorWidth, height: editorContentHeight });

  useSyncEditorValue(editor, value);

  useSyncEditorLanguage(editor, language);

  useSyncEditorWrapLines(editor, preferences?.wrapLines);

  const defaultTheme = getDefaultTheme(mode, themes);
  useSyncEditorTheme(editor, preferences?.theme ?? defaultTheme);

  // Change listeners
  useChangeEffect(editor, props.onChange, props.onDelayedChange);

  // Hide error panel when there are no errors to show.
  useEffect(() => {
    if (annotations.length === 0) {
      setPaneStatus('hidden');
    }

    if (props.onValidate) {
      fireNonCancelableEvent(props.onValidate, { annotations });
    }
  }, [annotations, props.onValidate]);

  const languageLabel = customLanguageLabel ?? getLanguageLabel(language);

  const errorCount = annotations.filter(a => a.type === 'error').length;
  const warningCount = annotations.filter(a => a.type === 'warning').length;
  const currentAnnotations = useMemo(() => annotations.filter(a => a.type === paneStatus), [annotations, paneStatus]);

  /*
   * Callbacks
   */

  const onEditorKeydown = useCallback(
    (e: React.KeyboardEvent) => {
      if (editor && e.target === editor.container && e.keyCode === KeyCode.enter) {
        e.stopPropagation();
        e.preventDefault();
        editor.focus();
      }
    },
    [editor]
  );

  const onTabFocus = useCallback(() => setTabFocused(true), []);
  const onTabBlur = useCallback(() => setTabFocused(false), []);

  const onErrorPaneToggle = useCallback(() => {
    setPaneStatus(paneStatus !== 'error' ? 'error' : 'hidden');
  }, [paneStatus]);

  const onWarningPaneToggle = useCallback(() => {
    setPaneStatus(paneStatus !== 'warning' ? 'warning' : 'hidden');
  }, [paneStatus]);

  const onPaneClose = () => {
    setPaneStatus('hidden');
  };

  const onAnnotationClick = ({ row = 0, column = 0 }: Ace.Annotation) => {
    if (!editor) {
      return;
    }
    editor.focus();
    editor.gotoLine(row + 1, column, false);
    setHighlightedAnnotation(undefined);
  };

  const onAnnotationClear = useCallback(() => {
    setHighlightedAnnotation(undefined);
  }, []);

  const [isPreferencesModalVisible, setPreferencesModalVisible] = useState(false);
  const onPreferencesOpen = () => setPreferencesModalVisible(true);
  const onPreferencesConfirm = (p: CodeEditorProps.Preferences) => {
    fireNonCancelableEvent(props.onPreferencesChange, p);
    setPreferencesModalVisible(false);
  };
  const onPreferencesDismiss = () => setPreferencesModalVisible(false);

  const isPaneVisible = paneStatus !== 'hidden';

  return (
    <div
      {...baseProps}
      className={clsx(styles['code-editor'], baseProps.className, { [styles['code-editor-refresh']]: isRefresh })}
      ref={mergedRef}
    >
      {loading && (
        <LoadingScreen>
          <LiveRegion visible={true}>{i18n('i18nStrings.loadingState', i18nStrings?.loadingState)}</LiveRegion>
        </LoadingScreen>
      )}

      {!ace && !loading && (
        <ErrorScreen
          recoveryText={i18n('i18nStrings.errorStateRecovery', i18nStrings?.errorStateRecovery)}
          onRecoveryClick={props.onRecoveryClick}
        >
          {i18n('i18nStrings.errorState', i18nStrings?.errorState)}
        </ErrorScreen>
      )}

      {ace && !loading && (
        <>
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
              ref={editorRef}
              className={clsx(styles.editor, styles.ace, isRefresh && styles['editor-refresh'])}
              onKeyDown={onEditorKeydown}
              tabIndex={0}
              role="group"
              aria-label={i18n('i18nStrings.editorGroupAriaLabel', i18nStrings?.editorGroupAriaLabel)}
            />
          </ResizableBox>
          <div
            role="group"
            aria-label={i18n('i18nStrings.statusBarGroupAriaLabel', i18nStrings?.statusBarGroupAriaLabel)}
          >
            <StatusBar
              languageLabel={languageLabel}
              cursorPosition={i18n(
                'i18nStrings.cursorPosition',
                i18nStrings?.cursorPosition?.(cursorPosition.row + 1, cursorPosition.column + 1),
                format => format({ row: cursorPosition.row + 1, column: cursorPosition.column + 1 })
              )}
              errorCount={errorCount}
              warningCount={warningCount}
              paneStatus={paneStatus}
              onErrorPaneToggle={onErrorPaneToggle}
              onWarningPaneToggle={onWarningPaneToggle}
              onTabFocus={onTabFocus}
              onTabBlur={onTabBlur}
              errorsTabRef={errorsTabRef}
              warningsTabRef={warningsTabRef}
              i18nStrings={i18nStrings}
              isTabFocused={isTabFocused}
              paneId={isPaneVisible ? paneId : undefined}
              onPreferencesOpen={onPreferencesOpen}
              isRefresh={isRefresh}
            />
            <Pane
              id={paneId}
              paneStatus={paneStatus}
              visible={isPaneVisible}
              annotations={currentAnnotations}
              highlighted={highlightedAnnotation}
              onAnnotationClick={onAnnotationClick}
              onAnnotationClear={onAnnotationClear}
              onClose={onPaneClose}
              cursorPositionLabel={i18n(
                'i18nStrings.cursorPosition',
                i18nStrings?.cursorPosition,
                format => (row, column) => format({ row, column })
              )}
              closeButtonAriaLabel={i18n('i18nStrings.paneCloseButtonAriaLabel', i18nStrings?.paneCloseButtonAriaLabel)}
            />
          </div>
          {isPreferencesModalVisible && (
            <PreferencesModal
              getModalRoot={getModalRoot}
              removeModalRoot={removeModalRoot}
              onConfirm={onPreferencesConfirm}
              onDismiss={onPreferencesDismiss}
              themes={themes ?? DEFAULT_AVAILABLE_THEMES}
              preferences={preferences}
              defaultTheme={defaultTheme}
              i18nStrings={{
                header: i18n('i18nStrings.preferencesModalHeader', i18nStrings?.preferencesModalHeader),
                cancel: i18n('i18nStrings.preferencesModalCancel', i18nStrings?.preferencesModalCancel),
                confirm: i18n('i18nStrings.preferencesModalConfirm', i18nStrings?.preferencesModalConfirm),
                wrapLines: i18n('i18nStrings.preferencesModalWrapLines', i18nStrings?.preferencesModalWrapLines),
                theme: i18n('i18nStrings.preferencesModalTheme', i18nStrings?.preferencesModalTheme),
                lightThemes: i18n('i18nStrings.preferencesModalLightThemes', i18nStrings?.preferencesModalLightThemes),
                darkThemes: i18n('i18nStrings.preferencesModalDarkThemes', i18nStrings?.preferencesModalDarkThemes),
                themeFilteringAriaLabel: i18nStrings?.preferencesModalThemeFilteringAriaLabel,
                themeFilteringClearAriaLabel: i18nStrings?.preferencesModalThemeFilteringClearAriaLabel,
                themeFilteringPlaceholder: i18nStrings?.preferencesModalThemeFilteringPlaceholder,
              }}
            />
          )}
        </>
      )}
    </div>
  );
});

applyDisplayName(CodeEditor, 'CodeEditor');
export default CodeEditor;
