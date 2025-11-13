// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

import { useDensityMode } from '@cloudscape-design/component-toolkit/internal';

import InternalButton from '../button/internal';
import { convertAutoComplete } from '../input/utils';
import { getBaseProps } from '../internal/base-component';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireKeyboardEvent, fireNonCancelableEvent } from '../internal/events';
import * as tokens from '../internal/generated/styles/tokens';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { SomeRequired } from '../internal/types';
import Token from '../token/internal';
import { PromptInputProps } from './interfaces';
import { getPromptInputStyles } from './styles';

import styles from './styles.css.js';
import testutilStyles from './test-classes/styles.css.js';

interface InternalPromptInputProps
  extends SomeRequired<PromptInputProps, 'maxRows' | 'minRows'>,
    InternalBaseComponentProps {}

const InternalPromptInput = React.forwardRef(
  (
    {
      value,
      actionButtonAriaLabel,
      actionButtonIconName,
      actionButtonIconUrl,
      actionButtonIconSvg,
      actionButtonIconAlt,
      ariaLabel,
      autoComplete,
      autoFocus,
      disableActionButton,
      disableBrowserAutocorrect,
      disabled,
      maxRows,
      minRows,
      name,
      onAction,
      onBlur,
      onChange,
      onFocus,
      onKeyDown,
      onKeyUp,
      placeholder,
      readOnly,
      spellcheck,
      customPrimaryAction,
      secondaryActions,
      secondaryContent,
      disableSecondaryActionsPaddings,
      disableSecondaryContentPaddings,
      style,
      __internalRootRef,
      ...rest
    }: InternalPromptInputProps,
    ref: Ref<PromptInputProps.Ref>
  ) => {
    const { ariaLabelledby, ariaDescribedby, controlId, invalid, warning } = useFormFieldContext(rest);

    const baseProps = getBaseProps(rest);

    // Get the current text value (will be updated on each render)
    const editableElementRef = useRef<HTMLDivElement>(null);
    const reactContainersRef = useRef<Set<HTMLElement>>(new Set());
    const lastKeyPressedRef = useRef<string>('');

    // Get the current text value from the contentEditable
    const getCurrentValue = () => editableElementRef.current?.textContent || '';

    const isRefresh = useVisualRefresh();
    const isCompactMode = useDensityMode(editableElementRef) === 'compact';

    const PADDING = isRefresh ? tokens.spaceXxs : tokens.spaceXxxs;
    const LINE_HEIGHT = tokens.lineHeightBodyM;
    const DEFAULT_MAX_ROWS = 3;

    useImperativeHandle(
      ref,
      () => ({
        focus(...args: Parameters<HTMLElement['focus']>) {
          editableElementRef.current?.focus(...args);
        },
        select() {
          const selection = window.getSelection();
          const range = document.createRange();
          if (editableElementRef.current) {
            range.selectNodeContents(editableElementRef.current);
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        },
        setSelectionRange() {
          // setSelectionRange is not supported on contentEditable divs
          // This method is kept for API compatibility but does nothing
        },
      }),
      [editableElementRef]
    );

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = event => {
      lastKeyPressedRef.current = event.key;
      fireKeyboardEvent(onKeyDown, event);

      if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
        const form = (event.currentTarget as HTMLElement).closest('form');
        if (form && !event.isDefaultPrevented()) {
          form.requestSubmit();
        }
        event.preventDefault();
        fireNonCancelableEvent(onAction, { value: getCurrentValue() });
      }
    };

    const handleChange: React.FormEventHandler<HTMLDivElement> = () => {
      const textValue = getCurrentValue();

      // Check if space was just pressed and there's an @mention in raw text nodes
      if (lastKeyPressedRef.current === ' ') {
        const mentionPattern = /(^|\s)@(\w+)\s/;

        // Find text nodes that contain @mentions
        const findAndConvertMention = (node: Node): boolean => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent) {
            const match = node.textContent.match(mentionPattern);
            if (match) {
              const mentionText = match[2];
              const beforeMention = node.textContent.substring(0, match.index! + match[1].length);
              const afterMention = node.textContent.substring(match.index! + match[0].length);

              // Create Token container
              const container = document.createElement('span');
              container.style.display = 'inline';
              container.contentEditable = 'false';
              reactContainersRef.current.add(container);

              // Replace text node with: before + Token + after
              const parent = node.parentNode!;
              if (beforeMention) {
                parent.insertBefore(document.createTextNode(beforeMention), node);
              }
              parent.insertBefore(container, node);
              if (afterMention) {
                parent.insertBefore(document.createTextNode(afterMention), node);
              }
              parent.removeChild(node);

              // Render Token into container
              ReactDOM.render(<Token variant="inline" label={mentionText} />, container);

              return true;
            }
          } else if (node.nodeType === Node.ELEMENT_NODE && !reactContainersRef.current.has(node as HTMLElement)) {
            // Search in child nodes (but skip Token containers)
            for (const child of Array.from(node.childNodes)) {
              if (findAndConvertMention(child)) {
                return true;
              }
            }
          }
          return false;
        };

        if (editableElementRef.current) {
          findAndConvertMention(editableElementRef.current);
        }
      }

      fireNonCancelableEvent(onChange, { value: textValue });
      adjustTextareaHeight();
    };

    const hasActionButton = actionButtonIconName || actionButtonIconSvg || actionButtonIconUrl || customPrimaryAction;

    const adjustTextareaHeight = useCallback(() => {
      if (editableElementRef.current) {
        const element = editableElementRef.current;
        // Save scroll position before adjusting height
        const scrollTop = element.scrollTop;

        // this is required so the scrollHeight becomes dynamic, otherwise it will be locked at the highest value for the size it reached e.g. 500px
        element.style.height = 'auto';

        const minRowsHeight = `calc(${minRows} * (${LINE_HEIGHT} + ${PADDING} / 2) + ${PADDING})`;
        const scrollHeight = `calc(${element.scrollHeight}px)`;

        if (maxRows === -1) {
          element.style.height = `max(${scrollHeight}, ${minRowsHeight})`;
        } else {
          const maxRowsHeight = `calc(${maxRows <= 0 ? DEFAULT_MAX_ROWS : maxRows} * (${LINE_HEIGHT} + ${PADDING} / 2) + ${PADDING})`;
          element.style.height = `min(max(${scrollHeight}, ${minRowsHeight}), ${maxRowsHeight})`;
        }

        // Restore scroll position after adjusting height
        element.scrollTop = scrollTop;
      }
    }, [maxRows, minRows, LINE_HEIGHT, PADDING]);

    useEffect(() => {
      const handleResize = () => {
        adjustTextareaHeight();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [adjustTextareaHeight]);

    useEffect(() => {
      adjustTextareaHeight();
    }, [value, adjustTextareaHeight, maxRows, isCompactMode]);

    useEffect(() => {
      if (autoFocus && editableElementRef.current) {
        editableElementRef.current.focus();
      }
    }, [autoFocus]);

    // Cleanup React containers on unmount
    useEffect(() => {
      const containers = reactContainersRef.current;
      return () => {
        containers.forEach(container => {
          ReactDOM.unmountComponentAtNode(container);
        });
        containers.clear();
      };
    }, []);

    // Determine if placeholder should be visible (only when value is empty)
    const showPlaceholder = !getCurrentValue().trim() && placeholder;

    const attributes: React.HTMLAttributes<HTMLDivElement> & {
      'data-placeholder'?: string;
      autoComplete?: string;
    } = {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      'aria-invalid': invalid ? 'true' : undefined,
      'aria-disabled': disabled ? 'true' : undefined,
      'aria-readonly': readOnly ? 'true' : undefined,
      'data-placeholder': placeholder,
      autoComplete: convertAutoComplete(autoComplete),
      className: clsx(styles.textarea, testutilStyles.textarea, {
        [styles.invalid]: invalid,
        [styles.warning]: warning,
        [styles['textarea-disabled']]: disabled,
        [styles['placeholder-visible']]: showPlaceholder,
      }),
      spellCheck: spellcheck,
      onKeyDown: handleKeyDown,
      onKeyUp: onKeyUp && (event => fireKeyboardEvent(onKeyUp, event)),
      onInput: handleChange,
      onBlur: onBlur && (() => fireNonCancelableEvent(onBlur)),
      onFocus: onFocus && (() => fireNonCancelableEvent(onFocus)),
    };

    if (disableBrowserAutocorrect) {
      attributes.autoCorrect = 'off';
      attributes.autoCapitalize = 'off';
    }

    const action = (
      <div className={clsx(styles['primary-action'], testutilStyles['primary-action'])}>
        {customPrimaryAction ?? (
          <InternalButton
            className={clsx(styles['action-button'], testutilStyles['action-button'])}
            ariaLabel={actionButtonAriaLabel}
            disabled={disabled || readOnly || disableActionButton}
            __focusable={readOnly}
            iconName={actionButtonIconName}
            iconUrl={actionButtonIconUrl}
            iconSvg={actionButtonIconSvg}
            iconAlt={actionButtonIconAlt}
            onClick={() => fireNonCancelableEvent(onAction, { value: getCurrentValue() })}
            variant="icon"
          />
        )}
      </div>
    );

    return (
      <div
        {...baseProps}
        aria-label={ariaLabel}
        className={clsx(styles.root, testutilStyles.root, baseProps.className, {
          [styles['textarea-readonly']]: readOnly,
          [styles['textarea-invalid']]: invalid,
          [styles['textarea-warning']]: warning && !invalid,
          [styles.disabled]: disabled,
        })}
        ref={__internalRootRef}
        role="region"
        style={getPromptInputStyles(style)}
      >
        {secondaryContent && (
          <div
            className={clsx(styles['secondary-content'], testutilStyles['secondary-content'], {
              [styles['with-paddings']]: !disableSecondaryContentPaddings,
              [styles.invalid]: invalid,
              [styles.warning]: warning,
            })}
          >
            {secondaryContent}
          </div>
        )}
        <div className={styles['textarea-wrapper']}>
          {name && <input type="hidden" name={name} value={getCurrentValue()} />}
          <div
            id={controlId}
            ref={editableElementRef}
            role={'textbox'}
            contentEditable={!disabled && !readOnly}
            suppressContentEditableWarning={true}
            {...attributes}
          />
          {hasActionButton && !secondaryActions && action}
        </div>
        {secondaryActions && (
          <div
            className={clsx(styles['action-stripe'], {
              [styles.invalid]: invalid,
              [styles.warning]: warning,
            })}
          >
            <div
              className={clsx(styles['secondary-actions'], testutilStyles['secondary-actions'], {
                [styles['with-paddings']]: !disableSecondaryActionsPaddings,
                [styles['with-paddings-and-actions']]: !disableSecondaryActionsPaddings && hasActionButton,
                [styles.invalid]: invalid,
                [styles.warning]: warning,
              })}
            >
              {secondaryActions}
            </div>
            <div className={styles.buffer} onClick={() => editableElementRef.current?.focus()} />
            {hasActionButton && action}
          </div>
        )}
      </div>
    );
  }
);

export default InternalPromptInput;
