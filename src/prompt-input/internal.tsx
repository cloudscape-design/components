// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { useDensityMode, useStableCallback, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import InternalButton from '../button/internal';
import { convertAutoComplete } from '../input/utils';
import { getBaseProps } from '../internal/base-component';
import { useDropdownStatus } from '../internal/components/dropdown-status';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireKeyboardEvent, fireNonCancelableEvent } from '../internal/events';
import * as designTokens from '../internal/generated/styles/tokens';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { SomeRequired } from '../internal/types';
import InternalLiveRegion from '../live-region/internal';
import TextareaMode from './components/textarea-mode';
import TokenMode from './components/token-mode';
import { CURSOR_DETECTION_DELAY, DEFAULT_MAX_ROWS, NEXT_TICK_TIMEOUT } from './core/constants';
import { isCursorInTriggerToken, setCursorPosition, setCursorRange } from './core/cursor-manager';
import { normalizeSelection, selectAllContent } from './core/cursor-utils';
import {
  createCursorNormalizationHandler,
  createKeyboardHandlers,
  handleArrowKeyNavigation,
  handleReferenceTokenDeletion,
  handleSpaceAfterClosedTrigger,
  splitParagraphAtCursor,
} from './core/event-handlers';
import { MenuItem, useMenuItems } from './core/menu-state';
import { useMenuLoadMore } from './core/menu-state';
import { handleMenuSelection } from './core/token-operations';
import { getPromptText } from './core/token-operations';
import { handleBackspaceAtParagraphStart, handleDeleteAtParagraphEnd } from './core/token-utils';
import { PromptInputProps } from './interfaces';
import { useShortcuts } from './shortcuts/use-shortcuts';
import { getPromptInputStyles } from './styles';
import { createEditableState, useEditableTokens } from './tokens/use-editable-tokens';
import { insertTextIntoContentEditable } from './utils/insert-text-content-editable';

import styles from './styles.css.js';
import testutilStyles from './test-classes/styles.css.js';

interface InternalPromptInputProps
  extends SomeRequired<PromptInputProps, 'maxRows' | 'minRows'>,
    InternalBaseComponentProps {}

const InternalPromptInput = React.forwardRef(
  (
    {
      value: valueProp,
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
      menus,
      maxMenuHeight,
      onMenuItemSelect,
      onMenuFilter,
      onMenuLoadItems,
      i18nStrings,
      __internalRootRef,
      ...rest
    }: InternalPromptInputProps,
    ref: Ref<PromptInputProps.Ref | HTMLTextAreaElement>
  ) => {
    const { ariaLabelledby, ariaDescribedby, controlId, invalid, warning } = useFormFieldContext(rest);
    const baseProps = getBaseProps(rest);

    // i18n strings with fallback to deprecated properties
    const effectiveActionButtonAriaLabel = i18nStrings?.actionButtonAriaLabel ?? actionButtonAriaLabel;

    // Mode detection - must be declared before useEffect hooks that use it
    const isTokenMode = !!menus;

    // Default value based on mode
    const value = valueProp ?? (isTokenMode ? '' : '');

    // Refs
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const editableElementRef = useRef<HTMLDivElement>(null);
    const reactContainersRef = useRef<Set<HTMLElement>>(new Set());
    const lastKnownCursorPositionRef = useRef<number>(0);

    // Initialize consolidated shortcuts system
    const shortcuts = useShortcuts({
      isTokenMode,
      tokens,
      menus,
      tokensToText,
      onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => {
        fireNonCancelableEvent(onChange, detail);
      },
      editableElementRef,
    });

    // Extract shortcuts state for easier access
    const {
      ignoreCursorDetection,
      activeTriggerToken,
      activeMenu,
      menuIsOpen,
      menuFilterText,
      triggerWrapperRef,
      triggerWrapperReady,
      processUserInput,
      markTokensAsSent,
      setUpdateSource,
    } = shortcuts;

    // Mode detection
    const isRefresh = useVisualRefresh();
    useDensityMode(textareaRef);
    useDensityMode(editableElementRef);

    // Style constants
    const PADDING = isRefresh ? designTokens.spaceXxs : designTokens.spaceXxxs;
    const LINE_HEIGHT = designTokens.lineHeightBodyM;

    // Helper to get the active input element
    const getActiveElement = useStableCallback(() => {
      return isTokenMode ? editableElementRef.current : textareaRef.current;
    });

    // Create editable state for coordinating between event handlers and input processing
    const editableState = useMemo(() => createEditableState(), []);

    useImperativeHandle(
      ref,
      () => ({
        focus(...args: Parameters<HTMLElement['focus']>) {
          getActiveElement()?.focus(...args);
        },
        select() {
          if (isTokenMode) {
            if (editableElementRef.current) {
              selectAllContent(editableElementRef.current);
            }
          } else {
            textareaRef.current?.select();
          }
        },
        setSelectionRange(...args: Parameters<HTMLTextAreaElement['setSelectionRange']>) {
          if (isTokenMode && editableElementRef.current) {
            const [start, end] = args;

            if (end !== undefined && end !== null && end !== start) {
              setCursorRange(editableElementRef.current, start ?? 0, end);
            } else {
              setCursorPosition(editableElementRef.current, start ?? 0);
            }
          } else {
            textareaRef.current?.setSelectionRange(...args);
          }
        },
        insertText(text: string, cursorStart?: number, cursorEnd?: number) {
          // Guard against disabled/readonly at the ref level
          if (disabled || readOnly) {
            return;
          }

          if (isTokenMode) {
            if (!editableElementRef.current || !tokens) {
              return;
            }

            // Calculate offset for pinned references
            // Pinned references are always at the start and can't have content inserted before/between them
            const pinnedTokens = tokens.filter(
              (token): token is PromptInputProps.ReferenceToken => token.type === 'reference' && token.pinned === true
            );
            const pinnedOffset = pinnedTokens.length;

            // Adjust cursor positions to account for pinned tokens
            const adjustedCursorStart = cursorStart !== undefined ? cursorStart + pinnedOffset : undefined;
            const adjustedCursorEnd = cursorEnd !== undefined ? cursorEnd + pinnedOffset : undefined;

            insertTextIntoContentEditable(editableElementRef.current, text, adjustedCursorStart, adjustedCursorEnd);
          } else {
            // Textarea mode
            if (!textareaRef.current) {
              return;
            }

            const textarea = textareaRef.current;
            textarea.focus();

            const currentValue = textarea.value;
            const insertPosition = cursorStart ?? textarea.selectionStart ?? 0;
            const newValue = currentValue.substring(0, insertPosition) + text + currentValue.substring(insertPosition);

            textarea.value = newValue;

            const finalCursorPosition = cursorEnd ?? insertPosition + text.length;
            textarea.setSelectionRange(finalCursorPosition, finalCursorPosition);

            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            fireNonCancelableEvent(onChange, {
              value: newValue,
              tokens: [],
            });
          }
        },
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [getActiveElement, isTokenMode, disabled, readOnly]
    );

    /**
     * Dynamically adjusts the input height based on content and row constraints.
     */
    const adjustInputHeight = useStableCallback(() => {
      const element = getActiveElement();
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
        const effectiveMaxRows = maxRows <= 0 ? DEFAULT_MAX_ROWS : maxRows;
        const maxRowsHeight = `calc(${effectiveMaxRows} * (${LINE_HEIGHT} + ${PADDING} / 2) + ${PADDING})`;
        element.style.height = `min(max(${scrollHeight}, ${minRowsHeight}), ${maxRowsHeight})`;
      }

      if (isTokenMode) {
        element.scrollTop = scrollTop;
      }
    });

    // Adjust height when tokens change (after DOM updates)
    useEffect(() => {
      if (isTokenMode) {
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => adjustInputHeight());
      }
    }, [isTokenMode, tokens, adjustInputHeight]);

    // Helper to get plain text value from tokens or value prop
    const getPlainTextValue = useStableCallback(() => {
      if (isTokenMode) {
        return tokensToText ? tokensToText(tokens ?? []) : getPromptText(tokens ?? []);
      }
      return value;
    });

    // Use the editable hook as interface layer between contentEditable DOM and React
    const { handleInput: handleInputBase } = useEditableTokens({
      elementRef: editableElementRef,
      reactContainersRef,
      tokens,
      menus,
      tokensToText,
      onChange: detail => {
        processUserInput(detail.tokens);
      },
      adjustInputHeight,
      disabled: disabled || !isTokenMode,
      readOnly,
      editableState,
      ignoreCursorDetection,
      lastKnownCursorPositionRef,
    });

    const handleInput = handleInputBase;

    // Track if we're in the middle of arrow key navigation to avoid cursor trapping
    const skipNormalizationRef = React.useRef(false);

    // Normalize cursor position: if cursor is right after a wrapper, move it into the cursor spot
    React.useEffect(() => {
      if (!isTokenMode || !editableElementRef.current) {
        return;
      }

      const normalizeCursorPosition = createCursorNormalizationHandler(
        editableElementRef,
        skipNormalizationRef,
        editableState
      );

      // Track mouse state to skip normalization during/after mouse clicks
      const handleMouseDown = () => {
        window.isMouseDownForCursor = true;
      };
      const handleMouseUp = () => {
        // Delay clearing the flag to allow the click to complete
        setTimeout(() => {
          window.isMouseDownForCursor = false;
        }, 100);
      };

      const normalizeIfNotMouse = () => {
        if (!window.isMouseDownForCursor) {
          normalizeCursorPosition();
        }
      };

      document.addEventListener('selectionchange', normalizeIfNotMouse);
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('selectionchange', normalizeIfNotMouse);
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isTokenMode, editableState]);

    // Normalize selection to include entire reference tokens when boundary is in cursor spots
    React.useEffect(() => {
      if (!isTokenMode) {
        return;
      }

      const handleSelectionChange = () => normalizeSelection(window.getSelection());
      const handleMouseDown = () => {
        window.isMouseDown = true;
      };
      const handleMouseUp = () => {
        window.isMouseDown = false;
        normalizeSelection(window.getSelection());
      };

      document.addEventListener('selectionchange', handleSelectionChange);
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('selectionchange', handleSelectionChange);
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isTokenMode]);

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
      const newTokens = isTokenMode ? [...(tokens ?? [])] : [];
      markTokensAsSent(newTokens);
      fireNonCancelableEvent(onChange, {
        value: event.target.value,
        tokens: newTokens,
      });
      adjustInputHeight();
    };

    // Keyboard handler for contentEditable
    const handleEditableElementKeyDown = useStableCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
      // Handle arrow key navigation to skip ZWNJ in cursor spots
      if (handleArrowKeyNavigation(event, skipNormalizationRef)) {
        return;
      }

      if (event.key === 'Enter' && event.shiftKey && !event.nativeEvent.isComposing) {
        event.preventDefault();

        // Block action if cursor is inside a trigger token
        if (editableElementRef.current && isCursorInTriggerToken(editableElementRef.current)) {
          return;
        }

        if (editableElementRef.current) {
          splitParagraphAtCursor(editableElementRef.current, editableState);
        }
        return;
      }

      if (event.key === 'Backspace' || event.key === 'Delete') {
        if (
          editableElementRef.current &&
          handleReferenceTokenDeletion(
            event,
            event.key === 'Backspace',
            editableElementRef.current,
            editableState,
            (message: string) => {
              setTokenOperationAnnouncement(message);
              setTimeout(() => setTokenOperationAnnouncement(''), 100);
            },
            i18nStrings
          )
        ) {
          return;
        }
      }

      if (event.key === 'Backspace' && tokens && editableElementRef.current) {
        // Prevent backspace in completely empty input
        if (tokens.length === 0) {
          event.preventDefault();
          return;
        }

        if (
          handleBackspaceAtParagraphStart(
            event,
            editableElementRef.current,
            tokens,
            tokensToText,
            (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => {
              markTokensAsSent(detail.tokens);
              fireNonCancelableEvent(onChange, detail);
            },
            editableState
          )
        ) {
          return;
        }
      }

      if (event.key === 'Delete' && tokens && editableElementRef.current) {
        if (
          handleDeleteAtParagraphEnd(
            event,
            editableElementRef.current,
            tokens,
            tokensToText,
            lastKnownCursorPositionRef.current,
            (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => {
              markTokensAsSent(detail.tokens);
              fireNonCancelableEvent(onChange, detail);
            },
            editableState
          )
        ) {
          return;
        }
      }

      fireKeyboardEvent(onKeyDown, event);

      // Handle space after closed trigger - move space out of trigger element
      if (
        event.key === ' ' &&
        editableElementRef.current &&
        shortcuts &&
        handleSpaceAfterClosedTrigger(
          event,
          editableElementRef.current,
          shortcuts.menuIsOpen,
          shortcuts.triggerValueWhenClosed,
          editableState,
          menus
        )
      ) {
        return;
      }

      if (keyboardHandlers) {
        if (keyboardHandlers.handleMenuNavigation(event)) {
          return;
        }
      }

      if (keyboardHandlers) {
        keyboardHandlers.handleEnterKey(event);
      }
    });

    const handleEditableElementBlur = useStableCallback(() => {
      if (onBlur) {
        fireNonCancelableEvent(onBlur);
      }
    });

    // Auto-focus on mount (token mode only)
    useEffect(() => {
      if (isTokenMode && autoFocus && editableElementRef.current) {
        editableElementRef.current.focus();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Lifecycle effects: window resize and cleanup
    useEffect(() => {
      // Window resize handler
      const handleResize = () => adjustInputHeight();
      window.addEventListener('resize', handleResize);

      // Capture containers ref for cleanup
      const containers = reactContainersRef.current;

      // Cleanup on unmount
      return () => {
        window.removeEventListener('resize', handleResize);
        containers.clear();
      };
    }, [adjustInputHeight]);

    // Handle menu option selection - replace TriggerToken with selected option
    const handleMenuSelect = useStableCallback((option: MenuItem) => {
      if (!activeMenu || !activeTriggerToken || !tokens) {
        return;
      }

      ignoreCursorDetection.current = true;
      shortcuts.setCursorInTrigger(false);
      setUpdateSource('menu-selection');

      const result = handleMenuSelection(
        tokens,
        {
          value: option.option.value || '',
          label: option.option.label || option.option.value || '',
        },
        activeMenu.id,
        activeMenu.useAtStart ?? false,
        activeTriggerToken
      );

      const value = tokensToText ? tokensToText(result.tokens) : getPromptText(result.tokens);
      markTokensAsSent(result.tokens);

      editableState.menuSelectionTokenId = result.insertedToken.id || null;
      editableState.menuSelectionIsPinned = activeMenu.useAtStart ?? false;

      const isPinned = activeMenu.useAtStart ?? false;
      const tokenLabel = result.insertedToken.label || result.insertedToken.value;
      const announcement = isPinned
        ? (i18nStrings?.tokenPinnedAriaLabel?.(result.insertedToken) ?? `${tokenLabel} pinned`)
        : (i18nStrings?.tokenInsertedAriaLabel?.(result.insertedToken) ?? `${tokenLabel} inserted`);

      setTokenOperationAnnouncement(announcement);
      setTimeout(() => setTokenOperationAnnouncement(''), 100);

      fireNonCancelableEvent(onChange, { value, tokens: result.tokens });

      fireNonCancelableEvent(onMenuItemSelect, {
        menuId: activeMenu.id,
        option: option.option,
      });
    });

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

    // Menu items state and handlers
    const [menuItemsState, menuItemsHandlers] = menuItemsResult;

    // Consolidated menu state ref for keyboard handlers
    const menuStateRef = useRef({
      itemsState: menuItemsState,
      itemsHandlers: menuItemsHandlers,
      isOpen: menuIsOpen,
    });

    // Update ref when state changes
    menuStateRef.current = {
      itemsState: menuItemsState,
      itemsHandlers: menuItemsHandlers,
      isOpen: menuIsOpen,
    };

    // Create keyboard handlers
    const keyboardHandlers = useMemo(() => {
      if (!editableElementRef.current) {
        return null;
      }

      return createKeyboardHandlers({
        getMenuOpen: () => menuStateRef.current.isOpen,
        getMenuItemsState: () => menuStateRef.current.itemsState,
        getMenuItemsHandlers: () => menuStateRef.current.itemsHandlers,
        onAction: onAction ? detail => fireNonCancelableEvent(onAction, detail) : undefined,
        tokensToText,
        tokens,
        closeMenu: () => {
          ignoreCursorDetection.current = true;
          shortcuts.setCursorInTrigger(false);

          setTimeout(() => {
            ignoreCursorDetection.current = false;
          }, CURSOR_DETECTION_DELAY);
        },
        announceTokenOperation: (message: string) => {
          setTokenOperationAnnouncement(message);
          setTimeout(() => setTokenOperationAnnouncement(''), 100);
        },
        i18nStrings,
        disabled,
        readOnly,
      });
    }, [onAction, tokensToText, tokens, ignoreCursorDetection, shortcuts, i18nStrings, disabled, readOnly]);

    // Menu load more controller
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
        fireNonCancelableEvent(onMenuLoadItems, {
          menuId: activeMenu?.id ?? '',
          filteringText: undefined, // Pagination - no filter text
          firstPage: false,
          samePage: false,
        });
      },
    });

    const menuLoadMoreHandlers = activeMenu ? menuLoadMoreResult : null;

    // Menu state management effect
    useEffect(() => {
      if (menuIsOpen && activeMenu && menuLoadMoreHandlers) {
        menuLoadMoreHandlers.fireLoadMoreOnMenuOpen();
      }
    }, [menuIsOpen, activeMenu, menuLoadMoreHandlers]);

    // Highlight first item when menu opens or items change
    const prevMenuOpenRef = useRef(false);
    const prevItemsLengthRef = useRef(0);

    useEffect(() => {
      const justOpened = menuIsOpen && !prevMenuOpenRef.current;
      const itemsChanged = menuItemsState && menuItemsState.items.length !== prevItemsLengthRef.current;

      if (
        (justOpened || (menuIsOpen && itemsChanged)) &&
        menuItemsHandlers &&
        menuItemsState &&
        menuItemsState.items.length > 0
      ) {
        setTimeout(() => {
          menuItemsHandlers?.goHomeWithKeyboard();
        }, NEXT_TICK_TIMEOUT);
      }

      prevMenuOpenRef.current = menuIsOpen;
      prevItemsLengthRef.current = menuItemsState?.items.length ?? 0;
    }, [menuIsOpen, menuItemsHandlers, menuItemsState, menuItemsState.items.length]);

    // Fire filter event when trigger token filter text changes
    useEffect(() => {
      if (activeTriggerToken && activeMenu && onMenuFilter) {
        fireNonCancelableEvent(onMenuFilter, {
          menuId: activeMenu.id,
          filteringText: activeTriggerToken.value,
        });
      }
    }, [activeTriggerToken, activeMenu, onMenuFilter]);

    const hasActionButton = !!(
      actionButtonIconName ||
      actionButtonIconSvg ||
      actionButtonIconUrl ||
      customPrimaryAction
    );

    // Show placeholder in token mode when input is empty
    const showPlaceholder = isTokenMode && placeholder && (!tokens || tokens.length === 0);

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
        [styles['textarea-readonly']]: readOnly,
        [styles['placeholder-visible']]: showPlaceholder,
      }),
      autoCorrect: disableBrowserAutocorrect ? 'off' : undefined,
      autoCapitalize: disableBrowserAutocorrect ? 'off' : undefined,
      spellCheck: spellcheck,
      tabIndex: disabled ? -1 : 0,
      onKeyDown: handleEditableElementKeyDown,
      onKeyUp: onKeyUp && (event => fireKeyboardEvent(onKeyUp, event)),
      onBlur: handleEditableElementBlur,
      onFocus: onFocus && (() => fireNonCancelableEvent(onFocus)),
    };

    // Menu dropdown setup
    const menuListId = useUniqueId('menu-list');
    const menuFooterControlId = useUniqueId('menu-footer');
    const highlightedMenuOptionIdSource = useUniqueId();
    const highlightedMenuOptionId = menuItemsState?.highlightedOption ? highlightedMenuOptionIdSource : undefined;

    // Accessibility: Track token operations for screen reader announcements
    const [tokenOperationAnnouncement, setTokenOperationAnnouncement] = useState<string>('');

    // Always call useDropdownStatus hook
    const menuDropdownStatusResult = useDropdownStatus({
      ...(activeMenu ?? {}),
      isEmpty: !menuItemsState || menuItemsState.items.length === 0,
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

    const shouldRenderMenuDropdown = useMemo(
      () => !!(menuIsOpen && activeMenu && menuItemsState),
      [menuIsOpen, activeMenu, menuItemsState]
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
        <InternalLiveRegion tagName="span" hidden={true} assertive={true} delay={0}>
          {tokenOperationAnnouncement}
        </InternalLiveRegion>

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
            <TokenMode
              editableElementRef={editableElementRef}
              triggerWrapperRef={triggerWrapperRef}
              controlId={controlId}
              menuListId={menuListId}
              menuFooterControlId={menuFooterControlId}
              highlightedMenuOptionId={highlightedMenuOptionId}
              name={name}
              getPlainTextValue={getPlainTextValue}
              menuIsOpen={menuIsOpen}
              triggerWrapperReady={triggerWrapperReady}
              shouldRenderMenuDropdown={shouldRenderMenuDropdown}
              activeMenu={activeMenu}
              activeTriggerToken={activeTriggerToken}
              menuFilterText={menuFilterText}
              menuItemsState={menuItemsState}
              menuItemsHandlers={menuItemsHandlers}
              menuDropdownStatus={menuDropdownStatus}
              maxMenuHeight={maxMenuHeight}
              handleInput={handleInput}
              handleLoadMore={() => {
                if (menuLoadMoreHandlers) {
                  menuLoadMoreHandlers.fireLoadMoreOnScroll();
                }
              }}
              editableElementAttributes={editableElementAttributes}
              i18nStrings={i18nStrings}
            />
          ) : (
            <TextareaMode
              textareaRef={textareaRef}
              controlId={controlId}
              textareaAttributes={textareaAttributes}
              nativeTextareaAttributes={nativeTextareaAttributes}
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
            <div className={styles.buffer} onClick={() => getActiveElement()?.focus()} />
            {hasActionButton && actionButton}
          </div>
        )}
      </div>
    );
  }
);

export default InternalPromptInput;
