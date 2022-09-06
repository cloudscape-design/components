// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Ace } from 'ace-builds';
import clsx from 'clsx';
import { ResizableBox } from 'react-resizable';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';

import { getBaseProps } from '../internal/base-component';
import { KeyCode } from '../internal/keycode';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { CodeEditorProps } from './interfaces';
import { Pane } from './pane';
import { useChangeEffect } from './listeners';
import {
  getDefaultConfig,
  getAceTheme,
  PaneStatus,
  getLanguageLabel,
  DEFAULT_DARK_THEME,
  DEFAULT_LIGHT_THEME,
  getDefaultTheme,
} from './util';
import { fireNonCancelableEvent } from '../internal/events';
import { setupEditor } from './setup-editor';
import handler from './resize-handler';
import PreferencesModal from './preferences-modal';
import LoadingScreen from './loading-screen';
import ErrorScreen from './error-screen';

import styles from './styles.css.js';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { useContainerQuery } from '../internal/hooks/container-queries/use-container-query';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useCurrentMode } from '../internal/hooks/use-visual-mode';
import { StatusBar } from './status-bar';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { useControllable } from '../internal/hooks/use-controllable';
export { CodeEditorProps };

export default function CodeEditor(props: CodeEditorProps) {
  const { __internalRootRef } = useBaseComponent('CodeEditor');
  const { controlId, ariaLabelledby, ariaDescribedby } = useFormFieldContext(props);
  const { ace, value, language, i18nStrings, editorContentHeight, onEditorContentResize, ...rest } = props;
  const [editorHeight = 480, setEditorHeight] = useControllable(editorContentHeight, onEditorContentResize, 480, {
    componentName: 'code-editor',
    changeHandler: 'onEditorContentResize',
    controlledProp: 'editorContentHeight',
  });
  const baseProps = getBaseProps(rest);

  const [editor, setEditor] = useState<Ace.Editor>();
  const mode = useCurrentMode(__internalRootRef);
  const defaultTheme = mode === 'dark' ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;

  const editorRef = useCallback(
    (elem: HTMLDivElement) => {
      if (!ace || !elem) {
        return;
      }

      const config = getDefaultConfig();
      setEditor(
        ace.edit(elem, {
          ...config,
          theme: getAceTheme(getDefaultTheme(elem)),
        })
      );
    },
    [ace]
  ); // loads as soon as ace lib is available

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

  const [paneStatus, setPaneStatus] = useState<PaneStatus>('hidden');
  const [annotations, setAnnotations] = useState<Ace.Annotation[]>([]);
  const [highlightedAnnotation, setHighlightedAnnotation] = useState<Ace.Annotation>();
  const [languageLabel, setLanguageLabel] = useState<string>('');
  const [cursorPosition, setCursorPosition] = useState<Ace.Point>({ row: 0, column: 0 });
  const [isTabFocused, setTabFocused] = useState<boolean>(false);

  const errorsTabRef = useRef<HTMLButtonElement>(null);
  const warningsTabRef = useRef<HTMLButtonElement>(null);

  const [codeEditorWidth, codeEditorMeasureRef] = useContainerQuery(rect => rect.width);
  const mergedRef = useMergeRefs(codeEditorMeasureRef, __internalRootRef);

  const isRefresh = useVisualRefresh();

  useEffect(() => {
    editor?.resize();
  }, [editor, editorContentHeight, codeEditorWidth]);

  const paneId = useUniqueId('code-editor-pane');

  useEffect(() => {
    if (!ace || !editor) {
      return;
    }

    setupEditor(ace, editor, setAnnotations, setCursorPosition, setHighlightedAnnotation, setPaneStatus);

    return () => {
      editor?.destroy();
    }; // TODO profile/monitor this
  }, [ace, editor, __internalRootRef]);

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
    if (!editor) {
      return;
    }
    editor.session.setMode(`ace/mode/${language}`);

    setLanguageLabel(getLanguageLabel(language));
  }, [editor, language]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const theme: CodeEditorProps.Theme = props.preferences?.theme ?? defaultTheme;

    editor.setTheme(getAceTheme(theme));

    editor.session.setUseWrapMode(props.preferences?.wrapLines ?? true);
  }, [editor, defaultTheme, props.preferences]);

  // listeners
  useChangeEffect(editor, props.onChange, props.onDelayedChange);
  // TODO implement other listeners

  // Hide error panel when there are no errors to show.
  useEffect(() => {
    if (annotations.length === 0) {
      setPaneStatus('hidden');
    }

    if (props.onValidate) {
      fireNonCancelableEvent(props.onValidate, { annotations });
    }
  }, [annotations, props.onValidate]);

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

  const onResize = useCallback(() => {
    editor?.resize();
  }, [editor]);

  const onErrorPaneToggle = useCallback(() => {
    setPaneStatus(paneStatus !== 'error' ? 'error' : 'hidden');
  }, [paneStatus]);

  const onWarningPaneToggle = useCallback(() => {
    setPaneStatus(paneStatus !== 'warning' ? 'warning' : 'hidden');
  }, [paneStatus]);

  const onPaneClose = useCallback(() => {
    if (paneStatus === 'error' && errorsTabRef.current) {
      errorsTabRef.current.focus();
    }
    if (paneStatus === 'warning' && warningsTabRef.current) {
      warningsTabRef.current.focus();
    }
    setPaneStatus('hidden');
  }, [paneStatus]);

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

  /**
   * Ignore focus lock if focused element is the pane tab button or within editor tree.
   * This check is required:
   * - When closing the pane with `ESC` key: The panel closes asynchronously and its focus lock
   *   still exists when trying to focus the tab button in higher-order component.
   * - When clicking or hittin `Enter` on an annotation: The panel remains open but focus lock
   *   deactivates asynchronously.
   */
  const shouldHandleFocus = useCallback(
    (activeElement: HTMLElement): boolean => {
      return (
        activeElement !== errorsTabRef.current &&
        activeElement !== warningsTabRef.current &&
        !editor?.container.contains(activeElement)
      );
    },
    [editor]
  );

  const [isPreferencesModalVisible, setPreferencesModalVisible] = useState(false);
  const onPreferencesOpen = () => setPreferencesModalVisible(true);
  const onPreferencesConfirm = (p: CodeEditorProps.Preferences) => {
    fireNonCancelableEvent(props.onPreferencesChange, p);
    setPreferencesModalVisible(false);
  };
  const onPreferencesDismiss = () => setPreferencesModalVisible(false);

  return (
    <div {...baseProps} className={clsx(styles['code-editor'], baseProps.className)} ref={mergedRef}>
      {props.loading && <LoadingScreen>{i18nStrings.loadingState}</LoadingScreen>}

      {!ace && !props.loading && (
        <ErrorScreen recoveryText={i18nStrings.errorStateRecovery} onRecoveryClick={props.onRecoveryClick}>
          {i18nStrings.errorState}
        </ErrorScreen>
      )}

      {ace && !props.loading && (
        <>
          <ResizableBox
            className={styles['resizable-box']}
            width={Infinity}
            height={Math.max(editorHeight, 20)}
            minConstraints={[Infinity, 20]}
            axis="y"
            handle={handler}
            onResize={(e, data) => {
              setEditorHeight(data.size.height);
              onResize();
              fireNonCancelableEvent(onEditorContentResize, {
                height: data.size.height,
              });
            }}
          >
            <div
              ref={editorRef}
              className={clsx(styles.editor, styles.ace)}
              onKeyDown={onEditorKeydown}
              tabIndex={0}
              role="group"
              aria-label={i18nStrings.editorGroupAriaLabel}
            />
          </ResizableBox>
          <div role="group" aria-label={i18nStrings.statusBarGroupAriaLabel}>
            <StatusBar
              languageLabel={languageLabel}
              cursorPosition={i18nStrings.cursorPosition(cursorPosition.row + 1, cursorPosition.column + 1)}
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
              paneId={paneId}
              onPreferencesOpen={onPreferencesOpen}
              isRefresh={isRefresh}
            />
            <Pane
              id={paneId}
              visible={paneStatus !== 'hidden'}
              annotations={currentAnnotations}
              highlighted={highlightedAnnotation}
              onAnnotationClick={onAnnotationClick}
              onAnnotationClear={onAnnotationClear}
              onClose={onPaneClose}
              onAllowlist={shouldHandleFocus}
              cursorPositionLabel={i18nStrings.cursorPosition}
              closeButtonAriaLabel={i18nStrings.paneCloseButtonAriaLabel}
            />
          </div>
          {isPreferencesModalVisible && (
            <PreferencesModal
              onConfirm={onPreferencesConfirm}
              onDismiss={onPreferencesDismiss}
              preferences={props.preferences}
              defaultTheme={defaultTheme}
              i18nStrings={{
                header: i18nStrings.preferencesModalHeader,
                cancel: i18nStrings.preferencesModalCancel,
                confirm: i18nStrings.preferencesModalConfirm,
                wrapLines: i18nStrings.preferencesModalWrapLines,
                theme: i18nStrings.preferencesModalTheme,
                lightThemes: i18nStrings.preferencesModalLightThemes,
                darkThemes: i18nStrings.preferencesModalDarkThemes,
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

applyDisplayName(CodeEditor, 'CodeEditor');
