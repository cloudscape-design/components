// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

import { useDensityMode } from '@cloudscape-design/component-toolkit/internal';

import InternalButton from '../button/internal';
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
import { getPromptText } from './utils';

import styles from './styles.css.js';
import testutilStyles from './test-classes/styles.css.js';

/**
 * Helper to render a Token element into a non-editable container.
 * If beforeNode is provided, inserts before it; otherwise appends to parent.
 */
function renderTokenToDOM(
  tokenElement: React.ReactElement,
  parent: HTMLElement,
  reactContainers: Set<HTMLElement>,
  beforeNode?: Node | null
): HTMLElement {
  const container = document.createElement('span');
  container.style.display = 'inline';
  container.contentEditable = 'false';

  if (beforeNode) {
    parent.insertBefore(container, beforeNode);
  } else {
    parent.appendChild(container);
  }
  reactContainers.add(container);
  ReactDOM.render(tokenElement, container);

  return container;
}

/**
 * Renders React content (strings and Tokens) into a contentEditable element.
 * Tokens are wrapped in non-editable spans with data-token-value attributes.
 */
function renderReactContentToDOM(
  content: React.ReactNode,
  targetElement: HTMLElement,
  reactContainers: Set<HTMLElement>
): void {
  // Clean up previous render
  reactContainers.forEach(container => ReactDOM.unmountComponentAtNode(container));
  reactContainers.clear();
  targetElement.innerHTML = '';

  const renderNode = (node: React.ReactNode, parent: HTMLElement) => {
    // Primitives: render as text
    if (typeof node === 'string' || typeof node === 'number') {
      parent.appendChild(document.createTextNode(String(node)));
      return;
    }

    // Arrays: render each child
    if (Array.isArray(node)) {
      node.forEach(child => renderNode(child, parent));
      return;
    }

    // React elements: Token or Fragment
    const element = node as React.ReactElement;

    // Fragment: render children directly
    if (element.type === React.Fragment) {
      renderNode(element.props?.children, parent);
      return;
    }

    // Token: render in non-editable span
    renderTokenToDOM(element, parent, reactContainers);
  };

  renderNode(content, targetElement);

  // Ensure cursor can be placed at end
  if (targetElement.lastChild?.nodeType === Node.ELEMENT_NODE) {
    targetElement.appendChild(document.createTextNode(''));
  }
}

/**
 * Converts DOM back to ReactNode, preserving Tokens with their labels and values.
 * Extracts the label from DOM text content and value from data-token-value attribute.
 */
function domToReactNode(node: Node): React.ReactNode {
  // Element with data-token-value: convert to Token
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as HTMLElement;
    const tokenValue = element.getAttribute('data-token-value');
    if (tokenValue) {
      // Extract label from the DOM text content (rendered by Token component)
      const label = element.textContent || '';
      return <Token variant="inline" label={label} value={tokenValue} />;
    }
  }

  // Text node: return text content
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || '';
  }

  // Other elements: recursively convert children
  const children: React.ReactNode[] = [];
  for (const child of Array.from(node.childNodes)) {
    const childNode = domToReactNode(child);
    if (childNode) {
      children.push(childNode);
    }
  }

  return children.length === 0 ? '' : children.length === 1 ? children[0] : <>{children}</>;
}

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

    const editableElementRef = useRef<HTMLDivElement>(null);
    const reactContainersRef = useRef<Set<HTMLElement>>(new Set());
    const isRenderingRef = useRef(false);
    const lastValueRef = useRef<React.ReactNode>(value);

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
      }),
      [editableElementRef]
    );

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = event => {
      fireKeyboardEvent(onKeyDown, event);

      if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
        const form = (event.currentTarget as HTMLElement).closest('form');
        if (form && !event.isDefaultPrevented()) {
          form.requestSubmit();
        }
        event.preventDefault();
        fireNonCancelableEvent(onAction, { value });
      }

      // Detect space key for @mention conversion (prototype feature)
      if (event.key === ' ' && editableElementRef.current) {
        // Check if there's an @mention pattern before the cursor
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const textNode = range.startContainer;

          if (textNode.nodeType === Node.TEXT_NODE && textNode.textContent) {
            const textBeforeCursor = textNode.textContent.substring(0, range.startOffset);
            const mentionMatch = textBeforeCursor.match(/(^|\s)@(\w+)$/);

            if (mentionMatch) {
              // Prevent default space insertion
              event.preventDefault();

              const mentionText = mentionMatch[2];
              const beforeMention = textBeforeCursor.substring(0, mentionMatch.index! + mentionMatch[1].length);
              const afterCursor = textNode.textContent.substring(range.startOffset);

              // Create the full token value (will come from menu selection in the future)
              const tokenValue = `<file_content path="some_test_file.txt">${mentionText}</file_content>`;

              // Replace text with: before + Token + space + after
              const parent = textNode.parentNode as HTMLElement;
              const beforeText = document.createTextNode(beforeMention);
              const spaceText = document.createTextNode(' ');
              const afterText = document.createTextNode(afterCursor);

              parent.insertBefore(beforeText, textNode);

              // Render Token using helper (insert before textNode)
              const tokenElement = <Token variant="inline" label={mentionText} value={tokenValue} />;
              renderTokenToDOM(tokenElement, parent, reactContainersRef.current, textNode);

              parent.insertBefore(spaceText, textNode);
              parent.insertBefore(afterText, textNode);
              parent.removeChild(textNode);

              // Place cursor after the space
              const newRange = document.createRange();
              newRange.setStart(spaceText, 1);
              newRange.collapse(true);
              selection.removeAllRanges();
              selection.addRange(newRange);

              // Trigger change event
              const changeEvent = new Event('input', { bubbles: true });
              editableElementRef.current.dispatchEvent(changeEvent);
            }
          }
        }
      }
    };

    const handleChange: React.FormEventHandler<HTMLDivElement> = () => {
      if (isRenderingRef.current) {
        return; // Skip onChange during programmatic rendering
      }

      // Convert DOM back to ReactNode and emit to consumer
      if (!editableElementRef.current) {
        return;
      }
      const reactNodeValue = domToReactNode(editableElementRef.current);
      lastValueRef.current = reactNodeValue; // Track the value we're emitting
      fireNonCancelableEvent(onChange, { value: reactNodeValue });
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

    // Render value prop into contentEditable only when it changes externally
    useEffect(() => {
      if (!editableElementRef.current) {
        return;
      }

      // Only re-render if the value actually changed from outside
      // (not from user typing which would have updated lastValueRef)
      if (value !== lastValueRef.current) {
        isRenderingRef.current = true;
        renderReactContentToDOM(value || '', editableElementRef.current, reactContainersRef.current);
        isRenderingRef.current = false;
        lastValueRef.current = value;
      }

      adjustTextareaHeight();
    }, [value, adjustTextareaHeight, maxRows, isCompactMode]);

    useEffect(() => {
      if (autoFocus && editableElementRef.current) {
        editableElementRef.current.focus();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
    const showPlaceholder = !value && placeholder;

    const attributes: React.HTMLAttributes<HTMLDivElement> & {
      'data-placeholder'?: string;
    } = {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      'aria-invalid': invalid ? 'true' : undefined,
      'aria-disabled': disabled ? 'true' : undefined,
      'aria-readonly': readOnly ? 'true' : undefined,
      'aria-required': rest.ariaRequired ? 'true' : undefined,
      'data-placeholder': placeholder,
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
            onClick={() => fireNonCancelableEvent(onAction, { value })}
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
          {name && <input type="hidden" name={name} value={getPromptText(value)} />}
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
