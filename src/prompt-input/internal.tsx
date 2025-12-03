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
import * as designTokens from '../internal/generated/styles/tokens';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { SomeRequired } from '../internal/types';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import Token from '../token/internal';
import { PromptInputProps } from './interfaces';
import { getPromptInputStyles } from './styles';
import { getPromptText } from './utils';

import styles from './styles.css.js';
import testutilStyles from './test-classes/styles.css.js';

/**
 * Renders tokens array into a contentEditable element.
 * Text tokens are rendered as text nodes, reference tokens as Token components.
 */
function renderTokensToDOM(
  tokens: readonly PromptInputProps.InputToken[],
  targetElement: HTMLElement,
  reactContainers: Set<HTMLElement>
): void {
  // Clean up previous render
  reactContainers.forEach(container => ReactDOM.unmountComponentAtNode(container));
  reactContainers.clear();
  targetElement.innerHTML = '';

  tokens.forEach(token => {
    if (token.type === 'text') {
      targetElement.appendChild(document.createTextNode(token.text));
    } else if (token.type === 'reference') {
      const container = document.createElement('span');
      container.style.display = 'inline';
      container.contentEditable = 'false';
      container.setAttribute('data-token-id', token.id);
      container.setAttribute('data-token-type', 'reference');
      container.setAttribute('data-token-value', token.value);

      targetElement.appendChild(container);
      reactContainers.add(container);

      ReactDOM.render(<Token variant="inline" label={token.label} value={token.value} />, container);
    }
  });

  // Ensure cursor can be placed at end
  if (targetElement.lastChild?.nodeType === Node.ELEMENT_NODE) {
    targetElement.appendChild(document.createTextNode(''));
  }
}

/**
 * Extracts tokens array from contentEditable DOM.
 * Converts text nodes to TextInputToken and Token components to ReferenceInputToken.
 */
function domToTokenArray(element: HTMLElement): PromptInputProps.InputToken[] {
  const tokens: PromptInputProps.InputToken[] = [];
  let currentText = '';

  const flushText = () => {
    if (currentText) {
      tokens.push({ type: 'text', text: currentText });
      currentText = '';
    }
  };

  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      currentText += node.textContent || '';
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tokenId = element.getAttribute('data-token-id');
      const tokenType = element.getAttribute('data-token-type');

      if (tokenType === 'reference' && tokenId) {
        flushText();
        const label = element.textContent || '';
        const value = element.getAttribute('data-token-value') || label;
        tokens.push({
          type: 'reference',
          id: tokenId,
          label,
          value,
        });
      } else {
        // Process children for other elements
        Array.from(node.childNodes).forEach(processNode);
      }
    }
  };

  Array.from(element.childNodes).forEach(processNode);
  flushText();

  return tokens;
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
      autoComplete,
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
      nativeTextareaAttributes,
      style,
      // Shortcuts
      tokens,
      menus,
      activeMenuId,
      __internalRootRef,
      ...rest
    }: InternalPromptInputProps,
    ref: Ref<PromptInputProps.Ref>
  ) => {
    const { ariaLabelledby, ariaDescribedby, controlId, invalid, warning } = useFormFieldContext(rest);

    const baseProps = getBaseProps(rest);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const editableElementRef = useRef<HTMLDivElement>(null);

    const reactContainersRef = useRef<Set<HTMLElement>>(new Set());
    const isRenderingRef = useRef(false);
    const lastTokensRef = useRef<readonly PromptInputProps.InputToken[] | undefined>(tokens);
    const savedSelectionRef = useRef<Range | null>(null);

    const isRefresh = useVisualRefresh();
    const isTextAreaCompactMode = useDensityMode(textareaRef) === 'compact';
    const isEditableElementCompactMode = useDensityMode(editableElementRef) === 'compact';
    const isCompactMode = isTextAreaCompactMode || isEditableElementCompactMode;
    const isMenusEnabled = tokens || menus;

    const PADDING = isRefresh ? designTokens.spaceXxs : designTokens.spaceXxxs;
    const LINE_HEIGHT = designTokens.lineHeightBodyM;
    const DEFAULT_MAX_ROWS = 3;

    useEffect(() => {
      console.log('Active menu is:', activeMenuId);
    }, [activeMenuId]);

    useImperativeHandle(
      ref,
      () => ({
        focus(...args: Parameters<HTMLElement['focus']>) {
          if (isMenusEnabled) {
            editableElementRef.current?.focus(...args);
            // Restore saved selection if available
            if (savedSelectionRef.current) {
              const selection = window.getSelection();
              selection?.removeAllRanges();
              selection?.addRange(savedSelectionRef.current.cloneRange());
            }
          } else {
            textareaRef.current?.focus(...args);
          }
        },
        select() {
          if (isMenusEnabled) {
            const selection = window.getSelection();
            const range = document.createRange();
            if (editableElementRef.current) {
              range.selectNodeContents(editableElementRef.current);
              selection?.removeAllRanges();
              selection?.addRange(range);
            }
          } else {
            textareaRef.current?.select();
          }
        },
        setSelectionRange(...args: Parameters<HTMLTextAreaElement['setSelectionRange']>) {
          if (isMenusEnabled) {
            if (!editableElementRef.current) {
              return;
            }

            const [start, end] = args;
            const selection = window.getSelection();
            if (!selection) {
              return;
            }

            // Helper to find node and offset for a given character position
            // Reference tokens count as 1 character each
            const findNodeAndOffset = (targetOffset: number): { node: Node; offset: number } | null => {
              let currentOffset = 0;

              for (const child of Array.from(editableElementRef.current!.childNodes)) {
                // Reference token element - counts as 1 character
                if (
                  child.nodeType === Node.ELEMENT_NODE &&
                  (child as HTMLElement).getAttribute('data-token-type') === 'reference'
                ) {
                  if (currentOffset === targetOffset) {
                    return { node: child, offset: 0 };
                  }
                  currentOffset += 1;
                  continue;
                }

                // Text node
                if (child.nodeType === Node.TEXT_NODE) {
                  const textLength = child.textContent?.length || 0;
                  if (currentOffset + textLength >= targetOffset) {
                    return { node: child, offset: targetOffset - currentOffset };
                  }
                  currentOffset += textLength;
                }
              }

              // Return last position if not found
              const lastChild = editableElementRef.current!.lastChild;
              return lastChild ? { node: lastChild, offset: lastChild.textContent?.length || 0 } : null;
            };

            const startPos = findNodeAndOffset(start ?? 0);
            const endPos = findNodeAndOffset(end ?? 0);

            if (startPos && endPos) {
              const range = document.createRange();
              range.setStart(startPos.node, startPos.offset);
              range.setEnd(endPos.node, endPos.offset);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          } else {
            textareaRef.current?.setSelectionRange(...args);
          }
        },
      }),
      [isMenusEnabled, textareaRef, editableElementRef]
    );

    const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      fireKeyboardEvent(onKeyDown, event);

      if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
        if (event.currentTarget.form && !event.isDefaultPrevented()) {
          event.currentTarget.form.requestSubmit();
        }
        event.preventDefault();
        fireNonCancelableEvent(onAction, { value, tokens: [...(tokens ?? [])] });
      }
    };

    const handleEditableElementKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      fireKeyboardEvent(onKeyDown, event);

      if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
        const form = (event.currentTarget as HTMLElement).closest('form');
        if (form && !event.isDefaultPrevented()) {
          form.requestSubmit();
        }
        event.preventDefault();
        fireNonCancelableEvent(onAction, { value, tokens: [...(tokens ?? [])] });
      }

      // Detect space key for @mention and /command conversion (prototype feature)
      if (event.key === ' ' && editableElementRef.current) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const textNode = range.startContainer;

          if (textNode.nodeType === Node.TEXT_NODE && textNode.textContent) {
            const textBeforeCursor = textNode.textContent.substring(0, range.startOffset);

            // Check for @mention pattern (can appear anywhere after whitespace)
            const mentionMatch = textBeforeCursor.match(/(^|\s)@(\w+)$/);
            // Check for /command pattern (only at the very start)
            const commandMatch = textBeforeCursor.match(/^\/(\w+)$/);

            const match = commandMatch || mentionMatch;
            const isCommand = !!commandMatch;

            if (match) {
              event.preventDefault();

              const matchText = match[2] || match[1]; // command uses [1], mention uses [2]
              const beforeMatch = isCommand ? '' : textBeforeCursor.substring(0, match.index! + match[1].length);
              const afterCursor = textNode.textContent.substring(range.startOffset);

              // Create reference token
              const tokenId = isCommand ? `command:${matchText}` : `file:${matchText}`;
              const tokenValue = isCommand
                ? `<command>${matchText}</command>`
                : `<file_content path="some_test_file.txt">${matchText}</file_content>`;

              const parent = textNode.parentNode as HTMLElement;
              const beforeText = document.createTextNode(beforeMatch);
              const spaceText = document.createTextNode(' ');
              const afterText = document.createTextNode(afterCursor);

              if (beforeMatch) {
                parent.insertBefore(beforeText, textNode);
              }

              // Render reference token
              const container = document.createElement('span');
              container.style.display = 'inline';
              container.contentEditable = 'false';
              container.setAttribute('data-token-id', tokenId);
              container.setAttribute('data-token-type', 'reference');
              container.setAttribute('data-token-value', tokenValue);

              parent.insertBefore(container, textNode);
              reactContainersRef.current.add(container);
              ReactDOM.render(<Token variant="inline" label={matchText} value={tokenValue} />, container);

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

    const handleChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      fireNonCancelableEvent(onChange, { value: event.target.value, tokens: [...(tokens ?? [])] });
      adjustInputHeight();
    };

    const handleChangeEditableElement: React.FormEventHandler<HTMLDivElement> = () => {
      if (isRenderingRef.current) {
        return; // Skip onChange during programmatic rendering
      }

      if (!editableElementRef.current) {
        return;
      }

      // Extract tokens from DOM
      const extractedTokens = domToTokenArray(editableElementRef.current);
      const plainText = getPromptText(extractedTokens);

      // Update ref to track that this change came from user input
      lastTokensRef.current = extractedTokens;

      fireNonCancelableEvent(onChange, { value: plainText, tokens: extractedTokens });
      adjustInputHeight();
    };

    const hasActionButton = actionButtonIconName || actionButtonIconSvg || actionButtonIconUrl || customPrimaryAction;

    const adjustInputHeight = useCallback(() => {
      if (editableElementRef.current || textareaRef.current) {
        const element = isMenusEnabled ? editableElementRef.current : textareaRef.current;
        // Save scroll position before adjusting height
        const scrollTop = element!.scrollTop;

        // this is required so the scrollHeight becomes dynamic, otherwise it will be locked at the highest value for the size it reached e.g. 500px
        element!.style.height = 'auto';

        const minRowsHeight = isMenusEnabled
          ? `calc(${minRows} * (${LINE_HEIGHT} + ${PADDING} / 2) + ${PADDING})`
          : `calc(${LINE_HEIGHT} +  ${designTokens.spaceScaledXxs} * 2)`;
        const scrollHeight = `calc(${element!.scrollHeight}px)`;

        if (maxRows === -1) {
          element!.style.height = `max(${scrollHeight}, ${minRowsHeight})`;
        } else {
          const maxRowsHeight = `calc(${maxRows <= 0 ? DEFAULT_MAX_ROWS : maxRows} * (${LINE_HEIGHT} + ${PADDING} / 2) + ${PADDING})`;
          element!.style.height = `min(max(${scrollHeight}, ${minRowsHeight}), ${maxRowsHeight})`;
        }

        if (isMenusEnabled) {
          // Restore scroll position after adjusting height
          element!.scrollTop = scrollTop;
        }
      }
    }, [isMenusEnabled, minRows, LINE_HEIGHT, PADDING, maxRows]);

    useEffect(() => {
      const handleResize = () => {
        adjustInputHeight();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [adjustInputHeight]);

    // Render tokens into contentEditable when they change externally (not from user typing)
    useEffect(() => {
      if (isMenusEnabled && editableElementRef.current && tokens) {
        // Only re-render if tokens changed from outside (not from user input)
        if (tokens !== lastTokensRef.current) {
          isRenderingRef.current = true;
          renderTokensToDOM(tokens, editableElementRef.current, reactContainersRef.current);
          isRenderingRef.current = false;
          lastTokensRef.current = tokens;

          // Position cursor at the end of the content when tokens are set externally
          requestAnimationFrame(() => {
            if (!editableElementRef.current) {
              return;
            }

            // Position cursor at the end of the editable element
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(editableElementRef.current);
            range.collapse(false); // false = collapse to end
            selection?.removeAllRanges();
            selection?.addRange(range);
          });
        }
      }

      adjustInputHeight();
    }, [isMenusEnabled, tokens, value, adjustInputHeight, maxRows, isCompactMode]);

    useEffect(() => {
      if (isMenusEnabled && autoFocus && editableElementRef.current) {
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

    const textareaAttributes: React.TextareaHTMLAttributes<HTMLTextAreaElement> = {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      'aria-invalid': invalid ? 'true' : undefined,
      name,
      placeholder,
      autoFocus,
      className: clsx(styles.textarea, testutilStyles.textarea, {
        [styles.invalid]: invalid,
        [styles.warning]: warning,
      }),
      autoComplete: convertAutoComplete(autoComplete),
      spellCheck: spellcheck,
      disabled,
      readOnly: readOnly ? true : undefined,
      rows: minRows,
      onKeyDown: handleTextareaKeyDown,
      onKeyUp: onKeyUp && (event => fireKeyboardEvent(onKeyUp, event)),
      // We set a default value on the component in order to force it into the controlled mode.
      value: value || '',
      onChange: handleChangeTextArea,
      onBlur: onBlur && (() => fireNonCancelableEvent(onBlur)),
      onFocus: onFocus && (() => fireNonCancelableEvent(onFocus)),
    };

    // Determine if placeholder should be visible
    const showEditableElementPlaceholder =
      isMenusEnabled &&
      placeholder &&
      (!tokens || tokens.length === 0 || (tokens.length === 1 && tokens[0].type === 'text' && !tokens[0].text));

    const editableElementAttributes: React.HTMLAttributes<HTMLDivElement> & {
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
        [styles['placeholder-visible']]: showEditableElementPlaceholder,
      }),
      spellCheck: spellcheck,
      onKeyDown: handleEditableElementKeyDown,
      onKeyUp: onKeyUp && (event => fireKeyboardEvent(onKeyUp, event)),
      onInput: handleChangeEditableElement,
      onBlur: () => {
        // Save selection before blur for contentEditable
        if (isMenusEnabled) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            savedSelectionRef.current = selection.getRangeAt(0);
          }
        }
        if (onBlur) {
          fireNonCancelableEvent(onBlur);
        }
      },
      onFocus: onFocus && (() => fireNonCancelableEvent(onFocus)),
    };

    if (disableBrowserAutocorrect) {
      textareaAttributes.autoCorrect = 'off';
      textareaAttributes.autoCapitalize = 'off';
      editableElementAttributes.autoCorrect = 'off';
      editableElementAttributes.autoCapitalize = 'off';
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
            onClick={() => fireNonCancelableEvent(onAction, { value, tokens: [...(tokens ?? [])] })}
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
          {tokens ? (
            <>
              {name && <input type="hidden" name={name} value={getPromptText(tokens)} />}
              <div
                id={controlId}
                ref={editableElementRef}
                role={'textbox'}
                contentEditable={!disabled && !readOnly}
                suppressContentEditableWarning={true}
                {...editableElementAttributes}
              />
            </>
          ) : (
            <WithNativeAttributes
              {...textareaAttributes}
              tag="textarea"
              componentName="PromptInput"
              nativeAttributes={nativeTextareaAttributes}
              ref={textareaRef}
              id={controlId}
            />
          )}
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
            <div
              className={styles.buffer}
              onClick={() => (isMenusEnabled ? editableElementRef.current?.focus() : textareaRef.current?.focus())}
            />
            {hasActionButton && action}
          </div>
        )}
      </div>
    );
  }
);

export default InternalPromptInput;
