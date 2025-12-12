// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

import { useDensityMode, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import InternalButton from '../button/internal';
import { convertAutoComplete } from '../input/utils';
import { getBaseProps } from '../internal/base-component';
import Dropdown from '../internal/components/dropdown';
import DropdownFooter from '../internal/components/dropdown-footer';
import { useDropdownStatus } from '../internal/components/dropdown-status';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireKeyboardEvent, fireNonCancelableEvent } from '../internal/events';
import * as designTokens from '../internal/generated/styles/tokens';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { SomeRequired } from '../internal/types';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import { PromptInputProps } from './interfaces';
import { MenuItem, useMenuItems } from './menus/menu-controller';
import { useMenuLoadMore } from './menus/menu-load-more-controller';
import MenuOptionsList from './menus/menu-options-list';
import { getPromptInputStyles } from './styles';
import { getPromptText } from './tokens/token-utils';
import { useEditableTokens } from './tokens/use-editable-tokens';
import { createCursorManager } from './utils/cursor-utils';
import { createKeyboardHandlers } from './utils/keyboard-handlers';

import styles from './styles.css.js';
import testutilStyles from './test-classes/styles.css.js';
interface InternalPromptInputProps
  extends SomeRequired<PromptInputProps, 'maxRows' | 'minRows'>,
    InternalBaseComponentProps {}

const InternalPromptInput = React.forwardRef<PromptInputProps.Ref | HTMLTextAreaElement, InternalPromptInputProps>(
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
      tokens,
      tokensToText,
      mode,
      onModeRemoved,
      menus,
      onMenuItemSelect,
      onMenuFilter,
      onMenuLoadItems,
      onMenuLoadMoreItems,
      i18nStrings,
      expandMenusToViewport,
      __internalRootRef,
      ...rest
    }: InternalPromptInputProps,
    ref
  ) => {
    const { ariaLabelledby, ariaDescribedby, controlId, invalid, warning } = useFormFieldContext(rest);
    const baseProps = getBaseProps(rest);

    // i18n strings with fallback to deprecated properties
    const effectiveActionButtonAriaLabel = i18nStrings?.actionButtonAriaLabel ?? actionButtonAriaLabel;

    // Menu state - event-driven trigger detection
    // Only open menu when trigger character is pressed, then track filter text
    const [detectedTrigger, setDetectedTrigger] = useState<{
      menuId: string;
      filterText: string;
      triggerPosition: number;
    } | null>(null);

    // Derive menu state from detected trigger
    const activeMenu = useMemo(
      () => (detectedTrigger ? (menus?.find(m => m.id === detectedTrigger.menuId) ?? null) : null),
      [detectedTrigger, menus]
    );
    const menuIsOpen = !!activeMenu;
    const menuFilterText = detectedTrigger?.filterText ?? '';
    const menuTriggerPosition = detectedTrigger?.triggerPosition ?? 0;

    // Refs
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const editableElementRef = useRef<HTMLDivElement>(null);
    const reactContainersRef = useRef<Set<HTMLElement>>(new Set());

    // Mode detection
    const isRefresh = useVisualRefresh();
    useDensityMode(textareaRef);
    useDensityMode(editableElementRef);
    const isTokenMode = !!menus;

    // Style constants
    const PADDING = isRefresh ? designTokens.spaceXxs : designTokens.spaceXxxs;
    const LINE_HEIGHT = designTokens.lineHeightBodyM;

    // Ref to store the keydown handler for insertText method
    const keydownHandlerRef = useRef<((event: React.KeyboardEvent<HTMLDivElement>) => void) | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus(...args: Parameters<HTMLElement['focus']>) {
          if (isTokenMode) {
            editableElementRef.current?.focus(...args);
          } else {
            textareaRef.current?.focus(...args);
          }
        },
        select() {
          if (isTokenMode) {
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
          if (isTokenMode && editableElementRef.current) {
            const [start, end] = args;
            const cursorManager = createCursorManager(editableElementRef.current);

            if (end !== undefined && end !== null && end !== start) {
              cursorManager.setRange(start ?? 0, end);
            } else {
              cursorManager.setPosition(start ?? 0);
            }
          } else {
            textareaRef.current?.setSelectionRange(...args);
          }
        },
        insertText(text: string, position?: number) {
          if (!isTokenMode || !editableElementRef.current || !keydownHandlerRef.current) {
            return;
          }

          const element = editableElementRef.current;

          // Position cursor if specified
          if (position !== undefined) {
            const cursorManager = createCursorManager(element);
            cursorManager.setPosition(position);
          }

          // Insert each character to trigger menu detection
          for (const char of text) {
            // Trigger keydown event
            const keydownEvent = {
              key: char,
              ctrlKey: false,
              metaKey: false,
              altKey: false,
              nativeEvent: new KeyboardEvent('keydown', { key: char, bubbles: true, cancelable: true }),
              preventDefault: () => {},
              stopPropagation: () => {},
            } as React.KeyboardEvent<HTMLDivElement>;

            keydownHandlerRef.current(keydownEvent);

            // Insert character at cursor
            const selection = window.getSelection();
            if (selection?.rangeCount) {
              const range = selection.getRangeAt(0);
              range.deleteContents();
              const textNode = document.createTextNode(char);
              range.insertNode(textNode);
              range.setStartAfter(textNode);
              range.setEndAfter(textNode);
              selection.removeAllRanges();
              selection.addRange(range);
            } else {
              // JSDOM fallback - append to end and try to restore selection
              element.textContent = (element.textContent || '') + char;
              const range = document.createRange();
              range.selectNodeContents(element);
              range.collapse(false);
              selection?.removeAllRanges();
              selection?.addRange(range);
            }

            // Trigger input event
            element.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
          }
        },
      }),
      [isTokenMode]
    );

    /**
     * Dynamically adjusts the input height based on content and row constraints.
     */
    const adjustInputHeight = useCallback(() => {
      const element = isTokenMode ? editableElementRef.current : textareaRef.current;
      if (!element) {
        return;
      }

      // Preserve scroll position for token mode
      const scrollTop = element.scrollTop;
      element.style.height = 'auto';

      const minRowsHeight = isTokenMode
        ? `calc(${minRows} * (${LINE_HEIGHT} + ${PADDING} / 2) + ${PADDING})`
        : `calc(${LINE_HEIGHT} + ${designTokens.spaceScaledXxs} * 2)`;
      const scrollHeight = `calc(${element.scrollHeight}px)`;

      if (maxRows === -1) {
        element.style.height = `max(${scrollHeight}, ${minRowsHeight})`;
      } else {
        const effectiveMaxRows = maxRows <= 0 ? 3 : maxRows;
        const maxRowsHeight = `calc(${effectiveMaxRows} * (${LINE_HEIGHT} + ${PADDING} / 2) + ${PADDING})`;
        element.style.height = `min(max(${scrollHeight}, ${minRowsHeight}), ${maxRowsHeight})`;
      }

      if (isTokenMode) {
        element.scrollTop = scrollTop;
      }
    }, [isTokenMode, minRows, maxRows, LINE_HEIGHT, PADDING]);

    // Callback for updating filter text when menu is open
    // Uses the wrapper element to track the trigger region
    const updateMenuFilterText = useCallback(() => {
      if (!detectedTrigger || !editableElementRef.current) {
        return;
      }

      // Find the trigger wrapper element
      const wrapper = editableElementRef.current.querySelector(
        `[data-menu-trigger="${detectedTrigger.menuId}"]`
      ) as HTMLElement;

      if (!wrapper) {
        // Wrapper was removed (e.g., user deleted it) - close menu
        setDetectedTrigger(null);
        return;
      }

      // Check if cursor is inside the wrapper
      const selection = window.getSelection();
      if (!selection?.rangeCount) {
        return;
      }

      const range = selection.getRangeAt(0);
      const cursorNode = range.startContainer;

      // Walk up to see if we're inside the wrapper
      let isInsideWrapper = false;
      let node: Node | null = cursorNode;
      while (node && node !== editableElementRef.current) {
        if (node === wrapper) {
          isInsideWrapper = true;
          break;
        }
        node = node.parentNode;
      }

      if (!isInsideWrapper) {
        // Cursor moved outside wrapper - close menu
        setDetectedTrigger(null);
        return;
      }

      // Extract filter text from wrapper (everything after the trigger char)
      const wrapperText = wrapper.textContent || '';
      const newFilterText = wrapperText.substring(1); // Skip trigger character

      // Update filter text if changed
      if (newFilterText !== detectedTrigger.filterText) {
        setDetectedTrigger({
          ...detectedTrigger,
          filterText: newFilterText,
        });

        // Fire filter event
        if (onMenuFilter) {
          fireNonCancelableEvent(onMenuFilter, {
            menuId: detectedTrigger.menuId,
            filteringText: newFilterText,
          });
        }
      }
    }, [detectedTrigger, onMenuFilter]);

    // Track desired cursor position for controlled updates (e.g., after menu selection)
    // This is in cursor space (tokens = 1 char)
    const [desiredCursorPosition, setDesiredCursorPosition] = useState<number | null>(null);

    // Reset cursor position after it's been applied
    useEffect(() => {
      if (desiredCursorPosition !== null) {
        // Reset after the cursor has been positioned
        const timer = setTimeout(() => setDesiredCursorPosition(null), 0);
        return () => clearTimeout(timer);
      }
    }, [desiredCursorPosition, tokens]);

    // Virtual tokens array: [mode, ...inputTokens] - represents actual DOM structure
    // This is the single source of truth for all cursor space operations
    interface VirtualToken {
      type: 'mode' | 'text' | 'reference';
      value: string;
      label?: string;
      id?: string;
    }
    const virtualTokens = useMemo<VirtualToken[]>(() => {
      const result: VirtualToken[] = [];
      if (mode) {
        result.push({ type: 'mode', value: mode.value, label: mode.label, id: mode.id });
      }
      for (const token of tokens ?? []) {
        result.push(token as VirtualToken);
      }
      return result;
    }, [mode, tokens]);

    // Use ref for virtualTokens to avoid recreating callbacks
    const virtualTokensRef = useRef(virtualTokens);
    virtualTokensRef.current = virtualTokens;

    // Convert cursor space position to DOM space position
    // Cursor space: mode/reference tokens = 1 char, text = actual length
    // DOM space: only TEXT NODES count (tokens are contentEditable=false so they're skipped)
    // Use ref to avoid recreating this function on every render
    const cursorSpaceToDomSpace = useCallback((cursorSpacePos: number): number => {
      let domPos = 0;
      let cursorPos = 0;

      for (const token of virtualTokensRef.current) {
        if (cursorPos >= cursorSpacePos) {
          break;
        }

        if (token.type === 'text') {
          const remaining = cursorSpacePos - cursorPos;
          const tokenLength = token.value.length;

          if (remaining <= tokenLength) {
            // Cursor is within this text token
            domPos += remaining;
            break;
          }

          domPos += tokenLength;
          cursorPos += tokenLength;
        } else {
          // Mode or reference token - these are contentEditable=false so they don't count in DOM position
          // Just increment cursor position, but NOT dom position
          cursorPos += 1;
        }
      }

      return domPos;
    }, []);

    // Helper to get plain text value from tokens or value prop
    const getPlainTextValue = useCallback(() => {
      if (isTokenMode) {
        return tokensToText ? tokensToText(tokens ?? []) : getPromptText(tokens ?? []);
      }
      return value;
    }, [isTokenMode, tokensToText, tokens, value]);

    // Convert cursor space position to DOM space for useEditableTokens
    const domCursorPosition = desiredCursorPosition !== null ? cursorSpaceToDomSpace(desiredCursorPosition) : null;

    // Use the editable hook as interface layer between contentEditable DOM and React
    const { handleInput } = useEditableTokens({
      elementRef: editableElementRef,
      reactContainersRef,
      tokens,
      mode,
      tokensToText,
      onChange: detail => fireNonCancelableEvent(onChange, detail),
      onModeRemoved: onModeRemoved ? () => fireNonCancelableEvent(onModeRemoved) : undefined,
      adjustInputHeight,
      disabled: !isTokenMode,
      cursorPosition: domCursorPosition,
    });

    const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      fireKeyboardEvent(onKeyDown, event);

      if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
        if (event.currentTarget.form && !event.isDefaultPrevented()) {
          event.currentTarget.form.requestSubmit();
        }
        event.preventDefault();
        fireNonCancelableEvent(onAction, { value: getPlainTextValue(), tokens: [...(tokens ?? [])] });
      }
    };

    const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      fireNonCancelableEvent(onChange, {
        value: event.target.value,
        tokens: isTokenMode ? [...(tokens ?? [])] : [],
      });
      adjustInputHeight();
    };

    const handleEditableElementKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        fireKeyboardEvent(onKeyDown, event);

        if (keyboardHandlers) {
          // Handle menu navigation first
          if (keyboardHandlers.handleMenuNavigation(event)) {
            return;
          }

          // Handle Enter key for form submission
          keyboardHandlers.handleEnterKey(event);
        }

        if (keyboardHandlers) {
          // Handle Backspace for token deletion
          if (keyboardHandlers.handleBackspaceKey(event)) {
            return;
          }

          // Handle mode token deletion
          if (event.key === 'Backspace') {
            const selection = window.getSelection();
            if (!selection?.rangeCount || !selection.isCollapsed) {
              return;
            }

            const range = selection.getRangeAt(0);
            let nodeToCheck = range.startContainer;

            if (nodeToCheck.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
              nodeToCheck = nodeToCheck.previousSibling as Node;
            } else if (nodeToCheck === editableElementRef.current && range.startOffset > 0) {
              nodeToCheck = editableElementRef.current.childNodes[range.startOffset - 1];
            }

            if (nodeToCheck?.nodeType === Node.TEXT_NODE && nodeToCheck.textContent === '') {
              const previousNode = nodeToCheck.previousSibling;
              if (previousNode?.nodeType === Node.ELEMENT_NODE) {
                const element = previousNode as Element;
                if (element.hasAttribute('data-token-type')) {
                  nodeToCheck = previousNode;
                }
              }
            }

            keyboardHandlers.handleModeBackspace(event, nodeToCheck);
          }
        }

        // EVENT-DRIVEN TRIGGER DETECTION
        // Check if the pressed key is a menu trigger character
        if (menus && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const triggerChar = event.key;
          const matchingMenu = menus.find(m => m.trigger === triggerChar);

          if (matchingMenu && editableElementRef.current) {
            // Get cursor position in DOM space
            const cursorManager = createCursorManager(editableElementRef.current);
            const domCursorPosition = cursorManager.getPosition();

            // Convert DOM position to cursor space position
            // Walk through tokens and count characters
            let cursorSpacePosition = 0;
            let domCharCount = 0;

            for (const token of virtualTokensRef.current) {
              if (token.type === 'text') {
                const tokenLength = token.value.length;
                if (domCharCount + tokenLength >= domCursorPosition) {
                  // Cursor is within this text token
                  cursorSpacePosition += domCursorPosition - domCharCount;
                  break;
                }
                domCharCount += tokenLength;
                cursorSpacePosition += tokenLength;
              } else {
                // Non-text tokens: count their label length in DOM but only 1 in cursor space
                const domLength = token.label?.length || token.value.length;
                if (domCharCount + domLength >= domCursorPosition) {
                  // Cursor is within or after this token - treat as after the token
                  cursorSpacePosition += 1;
                  break;
                }
                domCharCount += domLength;
                cursorSpacePosition += 1;
              }
            }

            // Build text in cursor space to check position validity
            let textInCursorSpace = '';
            for (const token of virtualTokensRef.current) {
              if (token.type === 'text') {
                textInCursorSpace += token.value;
              } else {
                textInCursorSpace += '\uFFFC';
              }
            }

            // Check if trigger is valid at this position
            let isValidPosition = false;

            if (matchingMenu.useAtStart) {
              // Must be at position 0 (start of input) OR position 1 if there's a mode token
              // This allows changing the mode by typing a new mode trigger
              const hasModeToken = virtualTokensRef.current[0]?.type === 'mode';
              isValidPosition = cursorSpacePosition === 0 || (hasModeToken && cursorSpacePosition === 1);
            } else {
              // Must be at start or after whitespace
              const charBefore = textInCursorSpace[cursorSpacePosition - 1];
              isValidPosition = cursorSpacePosition === 0 || /\s/.test(charBefore || '');
            }

            if (isValidPosition) {
              // Wrap the trigger in a temporary element for easy tracking
              // Wait for the trigger character to be inserted first
              setTimeout(() => {
                if (!editableElementRef.current) {
                  return;
                }

                const selection = window.getSelection();
                if (!selection?.rangeCount) {
                  return;
                }

                // Get current cursor position (should be right after the trigger char)
                const range = selection.getRangeAt(0);
                const cursorNode = range.startContainer;
                const cursorOffset = range.startOffset;

                // Find the text node containing the trigger
                let textNode: Text | null = null;
                let triggerOffset = 0;

                if (cursorNode.nodeType === Node.TEXT_NODE) {
                  textNode = cursorNode as Text;
                  // Trigger should be right before cursor
                  triggerOffset = cursorOffset - 1;
                } else if (cursorNode.nodeType === Node.ELEMENT_NODE) {
                  // Cursor is between elements or at start/end
                  // Look for the text node at the cursor position
                  const childNodes = Array.from(cursorNode.childNodes);
                  const nodeAtCursor = childNodes[cursorOffset - 1];

                  if (nodeAtCursor?.nodeType === Node.TEXT_NODE) {
                    textNode = nodeAtCursor as Text;
                    triggerOffset = (textNode.textContent?.length || 0) - 1;
                  }
                }

                if (!textNode || triggerOffset < 0) {
                  return;
                }

                // Create a wrapper span for the trigger region
                const wrapper = document.createElement('span');
                wrapper.setAttribute('data-menu-trigger', matchingMenu.id);
                wrapper.style.display = 'inline';

                // Split the text node at the trigger position
                const beforeTrigger = textNode.textContent?.substring(0, triggerOffset) || '';
                const triggerAndAfter = textNode.textContent?.substring(triggerOffset) || '';

                // Find where the trigger region ends (next whitespace or end)
                let endOffset = 1; // Start after trigger char
                while (endOffset < triggerAndAfter.length && !/\s/.test(triggerAndAfter[endOffset])) {
                  endOffset++;
                }

                const triggerRegion = triggerAndAfter.substring(0, endOffset);
                const afterTrigger = triggerAndAfter.substring(endOffset);

                // Replace the text node with: beforeText + wrapper(triggerRegion) + afterText
                const parent = textNode.parentNode;
                if (!parent) {
                  return;
                }

                const fragment = document.createDocumentFragment();

                if (beforeTrigger) {
                  fragment.appendChild(document.createTextNode(beforeTrigger));
                }

                wrapper.textContent = triggerRegion;
                fragment.appendChild(wrapper);

                if (afterTrigger) {
                  fragment.appendChild(document.createTextNode(afterTrigger));
                }

                parent.replaceChild(fragment, textNode);

                // Place cursor at end of wrapper (after trigger char)
                const newRange = document.createRange();
                newRange.setStart(wrapper.firstChild || wrapper, 1);
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);

                // Open menu
                setDetectedTrigger({
                  menuId: matchingMenu.id,
                  filterText: '',
                  triggerPosition: cursorSpacePosition,
                });
              }, 0);
            }
          }
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [menus, onKeyDown]
    );

    // Store keydown handler in ref for insertText method
    useEffect(() => {
      keydownHandlerRef.current = handleEditableElementKeyDown;
    }, [handleEditableElementKeyDown]);

    const handleEditableElementBlur = useCallback(() => {
      // Close menu on blur
      setDetectedTrigger(null);

      if (onBlur) {
        fireNonCancelableEvent(onBlur);
      }
    }, [onBlur]);

    // Handle window resize
    useEffect(() => {
      const handleResize = () => adjustInputHeight();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [adjustInputHeight]);

    // Auto-focus on mount
    useEffect(() => {
      if (isTokenMode && autoFocus && editableElementRef.current) {
        editableElementRef.current.focus();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Cleanup React containers on unmount
    useEffect(() => {
      const containers = reactContainersRef.current;
      return () => {
        containers.forEach(container => ReactDOM.unmountComponentAtNode(container));
        containers.clear();
      };
    }, []);

    // Handle menu option selection - update tokens and let reactive system handle DOM/cursor
    const handleMenuSelect = useCallback(
      (option: MenuItem) => {
        if (!activeMenu || !detectedTrigger || !editableElementRef.current) {
          return;
        }

        // Find and remove the trigger wrapper element
        const wrapper = editableElementRef.current.querySelector(
          `[data-menu-trigger="${detectedTrigger.menuId}"]`
        ) as HTMLElement;

        if (wrapper) {
          // Remove the wrapper, leaving its content will be handled by token update
          wrapper.remove();
        }

        const triggerLength = 1 + detectedTrigger.filterText.length; // trigger char + filter text
        const isMode = activeMenu.useAtStart;

        // Use the memoized virtualTokens - single source of truth
        let newVirtualTokens: VirtualToken[];
        let cursorPosition: number;

        if (isMode) {
          // Mode: add mode token and remove trigger text from first text token
          const modeToken: VirtualToken = {
            type: 'mode',
            id: option.option.value || '',
            label: option.option.label || option.option.value || '',
            value: option.option.value || '',
          };

          // Check if there's already a mode token
          const existingModeIndex = virtualTokens.findIndex(t => t.type === 'mode');
          const hasExistingMode = existingModeIndex !== -1;

          const firstTextIndex = virtualTokens.findIndex(t => t.type === 'text');

          if (firstTextIndex >= 0) {
            const firstToken = virtualTokens[firstTextIndex];
            const afterTrigger = firstToken.value.substring(triggerLength);

            if (hasExistingMode) {
              // Replace existing mode token
              newVirtualTokens = [
                modeToken,
                ...(afterTrigger ? [{ type: 'text' as const, value: afterTrigger }] : []),
                ...virtualTokens.slice(firstTextIndex + 1),
              ];
            } else {
              // Insert new mode token
              newVirtualTokens = [
                modeToken,
                ...virtualTokens.slice(0, firstTextIndex),
                ...(afterTrigger ? [{ type: 'text' as const, value: afterTrigger }] : []),
                ...virtualTokens.slice(firstTextIndex + 1),
              ];
            }
          } else {
            // No text tokens, just replace or add mode token
            newVirtualTokens = [modeToken, ...virtualTokens.filter(t => t.type !== 'mode')];
          }

          // Cursor after mode token = 1
          cursorPosition = 1;
        } else {
          // Reference: remove trigger and insert reference token
          const newToken: VirtualToken = {
            type: 'reference',
            id: option.option.value || '',
            label: option.option.label || option.option.value || '',
            value: option.option.value || '',
          };

          // Find token containing trigger position (in cursor space)
          let currentPos = 0;
          let insertIndex = -1;
          let insertOffset = 0;

          for (let i = 0; i < virtualTokens.length; i++) {
            const token = virtualTokens[i];
            const tokenLength = token.type === 'text' ? token.value.length : 1;

            if (currentPos <= menuTriggerPosition && currentPos + tokenLength > menuTriggerPosition) {
              insertIndex = i;
              insertOffset = menuTriggerPosition - currentPos;
              break;
            }

            currentPos += tokenLength;
          }

          newVirtualTokens = [];

          if (insertIndex === -1) {
            // Trigger not found, append at end
            newVirtualTokens.push(...virtualTokens, newToken, { type: 'text', value: ' ' });
          } else {
            // Insert at trigger position
            for (let i = 0; i < virtualTokens.length; i++) {
              if (i < insertIndex) {
                newVirtualTokens.push(virtualTokens[i]);
              } else if (i === insertIndex) {
                const token = virtualTokens[i];
                if (token.type === 'text') {
                  const beforeTrigger = token.value.substring(0, insertOffset);
                  const afterTrigger = token.value.substring(insertOffset + triggerLength);

                  if (beforeTrigger) {
                    newVirtualTokens.push({ type: 'text', value: beforeTrigger });
                  }
                  newVirtualTokens.push(newToken);
                  if (afterTrigger) {
                    newVirtualTokens.push({ type: 'text', value: afterTrigger });
                  } else {
                    newVirtualTokens.push({ type: 'text', value: ' ' });
                  }
                }
              } else {
                newVirtualTokens.push(virtualTokens[i]);
              }
            }
          }

          // Cursor: trigger position + 1 (reference token) + 1 (trailing space)
          cursorPosition = menuTriggerPosition + 1 + 1;
        }

        // DON'T update virtualTokensRef here - let it update from props
        // This ensures cursor conversion uses the correct token array

        // Split virtualTokens back into mode and tokens
        const newTokens: PromptInputProps.InputToken[] = newVirtualTokens
          .filter(t => t.type !== 'mode')
          .map(t => {
            if (t.type === 'text') {
              return { type: 'text', value: t.value };
            } else {
              return { type: 'reference', id: t.id!, label: t.label!, value: t.value };
            }
          });

        // Update tokens via onChange - reactive system will handle DOM and cursor
        const value = tokensToText ? tokensToText(newTokens) : getPromptText(newTokens);
        fireNonCancelableEvent(onChange, {
          value,
          tokens: newTokens,
        });

        // Notify parent about the selection
        fireNonCancelableEvent(onMenuItemSelect, {
          menuId: activeMenu.id,
          option: option.option,
        });

        // Set desired cursor position for reactive update
        setDesiredCursorPosition(cursorPosition);

        // Clear trigger - menu will close automatically
        setDetectedTrigger(null);
      },
      [activeMenu, detectedTrigger, tokensToText, onChange, onMenuItemSelect, virtualTokens, menuTriggerPosition]
    );

    // Menu items controller - always call hooks
    const menuItemsResult = useMenuItems({
      menu: activeMenu ?? {
        id: '',
        trigger: '',
        options: [],
      },
      filterText: menuFilterText,
      onSelectItem: handleMenuSelect,
    });

    // Keep menu items state stable to prevent dropdown from unmounting during state updates
    const [menuItemsState, menuItemsHandlers] = menuItemsResult;
    const stableMenuItemsState = activeMenu ? menuItemsState : null;
    const stableMenuItemsHandlers = activeMenu ? menuItemsHandlers : null;

    // Handle token deletion at cursor
    const handleDeleteTokenAtCursor = useCallback(() => {
      if (!editableElementRef.current || !tokens) {
        return false;
      }

      const cursorManager = createCursorManager(editableElementRef.current);
      const cursorPosition = cursorManager.getPosition();

      let currentPos = 0;
      let tokenIndexToDelete = -1;

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const tokenLength = token.type === 'text' ? token.value.length : 1;

        if (cursorPosition > currentPos && cursorPosition <= currentPos + tokenLength) {
          if (token.type !== 'text') {
            tokenIndexToDelete = i;
            break;
          }
        } else if (cursorPosition === currentPos && token.type !== 'text') {
          tokenIndexToDelete = i;
          break;
        }

        currentPos += tokenLength;
      }

      if (tokenIndexToDelete >= 0) {
        const newTokens = [...tokens];
        newTokens.splice(tokenIndexToDelete, 1);

        const value = tokensToText ? tokensToText(newTokens) : getPromptText(newTokens);
        fireNonCancelableEvent(onChange, {
          value,
          tokens: newTokens,
        });

        return true;
      }

      return false;
    }, [tokens, tokensToText, onChange]);

    // Create keyboard handlers
    const keyboardHandlers = useMemo(() => {
      if (!editableElementRef.current) {
        return null;
      }

      return createKeyboardHandlers({
        menuOpen: menuIsOpen,
        menuItemsState: stableMenuItemsState,
        menuItemsHandlers: stableMenuItemsHandlers,
        onAction: onAction ? detail => fireNonCancelableEvent(onAction, detail) : undefined,
        onModeRemoved: onModeRemoved ? () => fireNonCancelableEvent(onModeRemoved) : undefined,
        tokensToText,
        tokens,
        getPromptText,
        deleteTokenAtCursor: handleDeleteTokenAtCursor,
        closeMenu: () => {
          setDetectedTrigger(null);
        },
      });
    }, [
      menuIsOpen,
      stableMenuItemsState,
      stableMenuItemsHandlers,
      onAction,
      onModeRemoved,
      tokensToText,
      tokens,
      handleDeleteTokenAtCursor,
    ]);

    // Menu load more controller - always call hooks
    const menuLoadMoreResult = useMenuLoadMore({
      menu: activeMenu ?? {
        id: '',
        trigger: '',
        options: [],
      },
      statusType: activeMenu?.statusType ?? 'finished',
      onLoadItems: detail => {
        fireNonCancelableEvent(onMenuLoadItems, detail);
      },
      onLoadMoreItems: () => {
        fireNonCancelableEvent(onMenuLoadMoreItems, {
          menuId: activeMenu?.id ?? '',
        });
      },
    });

    const menuLoadMoreHandlers = activeMenu ? menuLoadMoreResult : null;

    // Fire load items when menu opens
    useEffect(() => {
      if (menuIsOpen && activeMenu && menuLoadMoreHandlers) {
        menuLoadMoreHandlers.fireLoadMoreOnMenuOpen();
      }
    }, [menuIsOpen, activeMenu, menuLoadMoreHandlers]);

    // Update filter text on cursor movement or content change when menu is open
    useEffect(() => {
      if (!isTokenMode || !editableElementRef.current || !detectedTrigger) {
        return;
      }

      const handleSelectionChange = () => {
        updateMenuFilterText();
      };

      // Also update on any DOM mutations (content changes)
      const observer = new MutationObserver(() => {
        updateMenuFilterText();
      });

      observer.observe(editableElementRef.current, {
        childList: true,
        characterData: true,
        subtree: true,
      });

      document.addEventListener('selectionchange', handleSelectionChange);
      return () => {
        document.removeEventListener('selectionchange', handleSelectionChange);
        observer.disconnect();
      };
    }, [isTokenMode, detectedTrigger, updateMenuFilterText]);

    const hasActionButton = !!(
      actionButtonIconName ||
      actionButtonIconSvg ||
      actionButtonIconUrl ||
      customPrimaryAction
    );

    // Show placeholder in token mode when input is empty (no mode, no tokens with content)
    const showPlaceholder = isTokenMode && placeholder && !mode && (!tokens || tokens.length === 0);

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
      autoCorrect: disableBrowserAutocorrect ? 'off' : undefined,
      autoCapitalize: disableBrowserAutocorrect ? 'off' : undefined,
      spellCheck: spellcheck,
      disabled,
      readOnly: readOnly ? true : undefined,
      rows: minRows,
      value: value || '',
      onKeyDown: handleTextareaKeyDown,
      onKeyUp: onKeyUp && (event => fireKeyboardEvent(onKeyUp, event)),
      onChange: handleTextareaChange,
      onBlur: onBlur && (() => fireNonCancelableEvent(onBlur)),
      onFocus: onFocus && (() => fireNonCancelableEvent(onFocus)),
    };

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
        [styles['placeholder-visible']]: showPlaceholder,
      }),
      autoCorrect: disableBrowserAutocorrect ? 'off' : undefined,
      autoCapitalize: disableBrowserAutocorrect ? 'off' : undefined,
      spellCheck: spellcheck,
      onKeyDown: handleEditableElementKeyDown,
      onKeyUp: onKeyUp && (event => fireKeyboardEvent(onKeyUp, event)),
      onBlur: handleEditableElementBlur,
      onFocus: onFocus && (() => fireNonCancelableEvent(onFocus)),
    };

    // Menu dropdown setup
    const menuListId = useUniqueId('menu-list');
    const menuFooterControlId = useUniqueId('menu-footer');
    const highlightedMenuOptionIdSource = useUniqueId();
    const highlightedMenuOptionId = stableMenuItemsState?.highlightedOption ? highlightedMenuOptionIdSource : undefined;

    // Always call useDropdownStatus hook
    const menuDropdownStatusResult = useDropdownStatus({
      ...(activeMenu ?? {}),
      isEmpty: !stableMenuItemsState || stableMenuItemsState.items.length === 0,
      recoveryText: i18nStrings?.menuRecoveryText,
      errorIconAriaLabel: i18nStrings?.menuErrorIconAriaLabel,
      onRecoveryClick: () => {
        if (menuLoadMoreHandlers) {
          menuLoadMoreHandlers.fireLoadMoreOnRecoveryClick();
        }
        editableElementRef.current?.focus();
      },
      hasRecoveryCallback: Boolean(onMenuLoadItems),
    });

    const menuDropdownStatus = activeMenu ? menuDropdownStatusResult : null;

    // Keep dropdown open while menu is active, even with 0 filtered results
    // This prevents flickering during filtering
    // Use stableMenuItemsState to prevent unmounting during state transitions
    const shouldRenderMenuDropdown = useMemo(
      () => menuIsOpen && activeMenu && stableMenuItemsState,
      [menuIsOpen, activeMenu, stableMenuItemsState]
    );

    const actionButton = (
      <div className={clsx(styles['primary-action'], testutilStyles['primary-action'])}>
        {customPrimaryAction ?? (
          <InternalButton
            className={clsx(styles['action-button'], testutilStyles['action-button'])}
            ariaLabel={effectiveActionButtonAriaLabel}
            disabled={disabled || readOnly || disableActionButton}
            __focusable={readOnly}
            iconName={actionButtonIconName}
            iconUrl={actionButtonIconUrl}
            iconSvg={actionButtonIconSvg}
            iconAlt={actionButtonIconAlt}
            onClick={() => {
              fireNonCancelableEvent(onAction, { value: getPlainTextValue(), tokens: [...(tokens ?? [])] });
            }}
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
          {isTokenMode ? (
            <>
              {name && <input type="hidden" name={name} value={getPlainTextValue()} />}
              <div className={styles['editable-wrapper']}>
                <Dropdown
                  stretchWidth={true}
                  expandToViewport={expandMenusToViewport}
                  forcePosition="top-left"
                  forceMobile={true}
                  open={!!shouldRenderMenuDropdown}
                  onMouseDown={event => {
                    event.preventDefault();
                  }}
                  trigger={
                    <div
                      id={controlId}
                      ref={editableElementRef}
                      role="textbox"
                      contentEditable={!disabled && !readOnly}
                      suppressContentEditableWarning={true}
                      className={testutilStyles['content-editable']}
                      aria-controls={menuIsOpen ? menuListId : undefined}
                      aria-activedescendant={highlightedMenuOptionId}
                      aria-expanded={menuIsOpen}
                      onInput={handleInput}
                      {...editableElementAttributes}
                    />
                  }
                  footer={
                    menuDropdownStatus?.isSticky && menuDropdownStatus.content ? (
                      <DropdownFooter
                        id={menuFooterControlId}
                        content={menuDropdownStatus.content}
                        hasItems={stableMenuItemsState ? stableMenuItemsState.items.length >= 1 : false}
                      />
                    ) : null
                  }
                >
                  {shouldRenderMenuDropdown && stableMenuItemsState && stableMenuItemsHandlers && activeMenu && (
                    <MenuOptionsList
                      menu={activeMenu}
                      statusType={(activeMenu.statusType ?? 'finished') as 'finished' | 'pending' | 'error' | 'loading'}
                      menuItemsState={stableMenuItemsState}
                      menuItemsHandlers={stableMenuItemsHandlers}
                      highlightedOptionId={highlightedMenuOptionId}
                      highlightText={menuFilterText}
                      listId={menuListId}
                      controlId={controlId ?? ''}
                      handleLoadMore={() => {
                        if (menuLoadMoreHandlers) {
                          menuLoadMoreHandlers.fireLoadMoreOnScroll();
                        }
                      }}
                      hasDropdownStatus={menuDropdownStatus?.content !== null}
                      selectedMenuItemAriaLabel={i18nStrings?.selectedMenuItemAriaLabel}
                      renderHighlightedMenuItemAriaLive={rest.renderHighlightedMenuItemAriaLive}
                      listBottom={
                        !menuDropdownStatus?.isSticky ? (
                          <DropdownFooter content={menuDropdownStatus?.content ?? null} id={menuFooterControlId} />
                        ) : null
                      }
                      ariaDescribedby={menuDropdownStatus?.content ? menuFooterControlId : undefined}
                    />
                  )}
                </Dropdown>
              </div>
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
          {hasActionButton && !secondaryActions && actionButton}
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
              onClick={() => (isTokenMode ? editableElementRef.current?.focus() : textareaRef.current?.focus())}
            />
            {hasActionButton && actionButton}
          </div>
        )}
      </div>
    );
  }
);

export default InternalPromptInput;
