// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React, { Ref, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import Icon from '../icon/internal';
import { getBaseProps } from '../internal/base-component';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { RichTextEditorProps } from './interfaces';

import styles from './styles.css.js';

export { RichTextEditorProps };

const DEFAULT_TOOLBAR_CONTROLS: ReadonlyArray<RichTextEditorProps.ToolbarControl> = [
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'bulleted-list',
  'numbered-list',
  'link',
];

interface ToolbarControlDefinition {
  /** The `document.execCommand` command name backing this control. */
  command: string;
  /** Default accessible label (overridable through `i18nStrings`). */
  defaultAriaLabel: string;
  /** Resolves the accessible label from the provided `i18nStrings`. */
  getAriaLabel: (i18n: RichTextEditorProps.I18nStrings) => string | undefined;
  /** Whether the control needs a value argument (e.g. a URL for links). */
  requiresValue?: boolean;
  /** Rendered content of the toolbar button. */
  render: () => React.ReactNode;
}

const CONTROL_DEFINITIONS: Record<RichTextEditorProps.ToolbarControl, ToolbarControlDefinition> = {
  bold: {
    command: 'bold',
    defaultAriaLabel: 'Bold',
    getAriaLabel: i18n => i18n.boldButtonAriaLabel,
    render: () => <span className={styles['toolbar-button-glyph-bold']}>B</span>,
  },
  italic: {
    command: 'italic',
    defaultAriaLabel: 'Italic',
    getAriaLabel: i18n => i18n.italicButtonAriaLabel,
    render: () => <span className={styles['toolbar-button-glyph-italic']}>I</span>,
  },
  underline: {
    command: 'underline',
    defaultAriaLabel: 'Underline',
    getAriaLabel: i18n => i18n.underlineButtonAriaLabel,
    render: () => <span className={styles['toolbar-button-glyph-underline']}>U</span>,
  },
  strikethrough: {
    command: 'strikeThrough',
    defaultAriaLabel: 'Strikethrough',
    getAriaLabel: i18n => i18n.strikethroughButtonAriaLabel,
    render: () => <span className={styles['toolbar-button-glyph-strikethrough']}>S</span>,
  },
  'bulleted-list': {
    command: 'insertUnorderedList',
    defaultAriaLabel: 'Bulleted list',
    getAriaLabel: i18n => i18n.bulletedListButtonAriaLabel,
    render: () => <Icon name="list-view" />,
  },
  'numbered-list': {
    command: 'insertOrderedList',
    defaultAriaLabel: 'Numbered list',
    getAriaLabel: i18n => i18n.numberedListButtonAriaLabel,
    render: () => <span>1.</span>,
  },
  link: {
    command: 'createLink',
    defaultAriaLabel: 'Insert link',
    getAriaLabel: i18n => i18n.linkButtonAriaLabel,
    requiresValue: true,
    render: () => <Icon name="anchor-link" />,
  },
};

const RichTextEditor = React.forwardRef(
  (
    {
      value,
      onChange,
      onBlur,
      onFocus,
      placeholder,
      disabled,
      readOnly,
      ariaLabel,
      toolbarControls = DEFAULT_TOOLBAR_CONTROLS,
      i18nStrings = {},
      ...rest
    }: RichTextEditorProps,
    ref: Ref<RichTextEditorProps.Ref>
  ) => {
    const { __internalRootRef } = useBaseComponent('RichTextEditor', {
      props: { disabled, readOnly, toolbarControls: toolbarControls.join(',') },
    });
    const { ariaLabelledby, ariaDescribedby, controlId, invalid, warning } = useFormFieldContext(rest);
    const baseProps = getBaseProps(rest);

    const editorRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => editorRef.current?.focus(),
    }));

    // Sync the controlled value into the DOM without resetting the caret while
    // the user is actively typing (only write when the value actually differs).
    useEffect(() => {
      const node = editorRef.current;
      if (node && node.innerHTML !== value) {
        // WIP v0: the controlled value is written directly to the contenteditable
        // element. Consuming applications are responsible for sanitizing the HTML
        // (see interfaces.ts). Built-in sanitization is tracked as follow-up work.
        // eslint-disable-next-line no-unsanitized/property
        node.innerHTML = value ?? '';
      }
    }, [value]);

    const emitChange = useCallback(() => {
      const node = editorRef.current;
      if (node) {
        fireNonCancelableEvent(onChange, { value: node.innerHTML });
      }
    }, [onChange]);

    const runCommand = useCallback(
      (control: RichTextEditorProps.ToolbarControl) => {
        if (disabled || readOnly) {
          return;
        }
        const definition = CONTROL_DEFINITIONS[control];
        const node = editorRef.current;
        if (!node) {
          return;
        }
        // Ensure the selection is inside the editor before running the command.
        node.focus();
        try {
          if (definition.requiresValue) {
            // WIP v0: use a native prompt for the link URL. A dedicated,
            // accessible link dialog is tracked as follow-up work.
            const url =
              typeof window !== 'undefined'
                ? window.prompt(i18nStrings.linkUrlPromptText ?? 'Enter a URL', 'https://')
                : null;
            if (!url) {
              return;
            }
            document.execCommand(definition.command, false, url);
          } else {
            document.execCommand(definition.command);
          }
        } catch {
          // `document.execCommand` is deprecated and may throw or be unsupported
          // in some environments (e.g. jsdom). Swallow to keep the UI resilient;
          // replacing execCommand with a Selection-API editor core is follow-up work.
        }
        emitChange();
      },
      [disabled, readOnly, emitChange, i18nStrings.linkUrlPromptText]
    );

    const showPlaceholder = !value && !!placeholder;
    const editable = !disabled && !readOnly;

    return (
      <div {...baseProps} className={clsx(styles.root, baseProps.className)} ref={__internalRootRef}>
        <div
          className={clsx(styles.editor, {
            [styles['editor-invalid']]: invalid,
            [styles['editor-warning']]: warning && !invalid,
            [styles['editor-readonly']]: readOnly,
            [styles['editor-disabled']]: disabled,
          })}
        >
          {!readOnly && (
            <div className={styles.toolbar} role="toolbar" aria-label={i18nStrings.toolbarAriaLabel ?? 'Formatting'}>
              {toolbarControls.map(control => {
                const definition = CONTROL_DEFINITIONS[control];
                return (
                  <button
                    key={control}
                    type="button"
                    // Prevent the button from stealing the caret/selection from the editor.
                    onMouseDown={event => event.preventDefault()}
                    onClick={() => runCommand(control)}
                    disabled={disabled}
                    aria-label={definition.getAriaLabel(i18nStrings) ?? definition.defaultAriaLabel}
                    data-control={control}
                    className={clsx(styles['toolbar-button'], {
                      [styles['toolbar-button-disabled']]: disabled,
                    })}
                  >
                    {definition.render()}
                  </button>
                );
              })}
            </div>
          )}

          <div className={styles['content-wrapper']}>
            {showPlaceholder && <div className={styles.placeholder}>{placeholder}</div>}
            <div
              ref={editorRef}
              id={controlId}
              role="textbox"
              aria-multiline="true"
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledby}
              aria-describedby={ariaDescribedby}
              aria-invalid={invalid ? 'true' : undefined}
              aria-readonly={readOnly ? 'true' : undefined}
              aria-disabled={disabled ? 'true' : undefined}
              contentEditable={editable}
              suppressContentEditableWarning={true}
              tabIndex={disabled ? -1 : 0}
              className={clsx(styles.content, {
                [styles['content-disabled']]: disabled,
              })}
              onInput={emitChange}
              onBlur={() => fireNonCancelableEvent(onBlur)}
              onFocus={() => fireNonCancelableEvent(onFocus)}
            />
          </div>
        </div>
      </div>
    );
  }
);

applyDisplayName(RichTextEditor, 'RichTextEditor');
export default RichTextEditor;
