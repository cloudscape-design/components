// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { useStableCallback, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { useDropdownStatus } from '../../internal/components/dropdown-status';
import { fireKeyboardEvent, fireNonCancelableEvent } from '../../internal/events';
import { isHTMLElement } from '../../internal/utils/dom';
import { getFirstScrollableParent } from '../../internal/utils/scrollable-containers';
import Token from '../../token/internal';
import {
  calculateTokenPosition,
  calculateTotalTokenLength,
  CaretController,
  normalizeCollapsedCaret,
  normalizeSelection,
  setMouseDown,
  TOKEN_LENGTHS,
} from '../core/caret-controller';
import { extractTextFromCaretSpots } from '../core/caret-spot-utils';
import { CARET_DETECTION_DELAY, ELEMENT_TYPES, NEXT_TICK_TIMEOUT } from '../core/constants';
import { createParagraph, findAllParagraphs, findElements, getTokenType } from '../core/dom-utils';
import {
  createKeyboardHandlers,
  handleArrowKeyNavigation,
  handleBackspaceAtParagraphStart,
  handleDeleteAtParagraphEnd,
  handleReferenceTokenDeletion,
  handleSpaceAfterClosedTrigger,
  splitParagraphAtCaret,
} from '../core/event-handlers';
import { MenuItem, MenuItemsHandlers, MenuItemsState, useMenuItems, useMenuLoadMore } from '../core/menu-state';
import { extractTokensFromDOM, getPromptText, handleMenuSelection, processTokens } from '../core/token-operations';
import { RenderTokenProps, renderTokensToDOM } from '../core/token-renderer';
import { enforcePinnedTokenOrdering, mergeConsecutiveTextTokens } from '../core/token-utils';
import {
  isBreakTextToken,
  isPinnedReferenceToken,
  isReferenceToken,
  isTextNode,
  isTextToken,
  isTriggerToken,
} from '../core/type-guards';
import { PromptInputProps } from '../interfaces';

import styles from '../styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

/** Mutable state shared between the editable tokens hook and event handlers. */
export interface EditableState {
  skipNextZwnjUpdate: boolean;
  menuSelectionTokenId: string | null;
}

export function createEditableState(): EditableState {
  return {
    skipNextZwnjUpdate: false,
    menuSelectionTokenId: null,
  };
}

function shouldRerender(
  oldTokens: readonly PromptInputProps.InputToken[] | undefined,
  newTokens: readonly PromptInputProps.InputToken[] | undefined
): boolean {
  if (!oldTokens || !newTokens) {
    return true;
  }

  if (oldTokens.length !== newTokens.length) {
    return true;
  }

  for (let i = 0; i < oldTokens.length; i++) {
    const oldToken = oldTokens[i];
    const newToken = newTokens[i];

    if (oldToken.type !== newToken.type) {
      return true;
    }

    if (isReferenceToken(oldToken) && isReferenceToken(newToken)) {
      if (oldToken.id !== newToken.id) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Positions the caret after a menu-selected reference token.
 * Returns true if the caret was positioned (token found), false otherwise.
 */
function positionCaretAfterMenuSelection(
  tokens: readonly PromptInputProps.InputToken[],
  editableState: EditableState,
  caretController: CaretController | null
): boolean {
  if (!editableState.menuSelectionTokenId || !caretController) {
    return false;
  }

  const insertedTokenIndex = tokens.findIndex(t => isReferenceToken(t) && t.id === editableState.menuSelectionTokenId);

  if (insertedTokenIndex === -1) {
    return false;
  }

  const caretPos = calculateTokenPosition(tokens, insertedTokenIndex);
  caretController.setPosition(caretPos);
  editableState.menuSelectionTokenId = null;
  return true;
}

/**
 * Detects whether the user is typing into an empty line based on the transition
 * from the last rendered tokens to the current ordered tokens.
 */
function detectTypingContext(
  lastRenderedTokens: readonly PromptInputProps.InputToken[] | undefined,
  orderedTokens: readonly PromptInputProps.InputToken[] | undefined,
  isTypingIntoEmptyLineRef: React.MutableRefObject<boolean>
): boolean {
  const prevLastToken = lastRenderedTokens?.[lastRenderedTokens.length - 1];
  const justStartedNewLine = prevLastToken && isBreakTextToken(prevLastToken);
  const wasCompletelyEmpty = !lastRenderedTokens || lastRenderedTokens.length === 0;
  const justAfterReference = prevLastToken && isReferenceToken(prevLastToken);

  let currentLineIsText = false;
  if (orderedTokens && orderedTokens.length > 0) {
    let lastBreakIndex = -1;
    for (let i = orderedTokens.length - 1; i >= 0; i--) {
      if (isBreakTextToken(orderedTokens[i])) {
        lastBreakIndex = i;
        break;
      }
    }
    const currentLineTokens = orderedTokens.slice(lastBreakIndex + 1);
    currentLineIsText = currentLineTokens.length > 0 && currentLineTokens.every(isTextToken);
  }

  if ((justStartedNewLine || wasCompletelyEmpty || justAfterReference) && currentLineIsText) {
    isTypingIntoEmptyLineRef.current = true;
  }

  if (!currentLineIsText && orderedTokens && orderedTokens.length > 0) {
    isTypingIntoEmptyLineRef.current = false;
  }

  if (!orderedTokens || orderedTokens.length === 0) {
    isTypingIntoEmptyLineRef.current = false;
  }

  return isTypingIntoEmptyLineRef.current;
}

/** Configuration for the useTokenMode hook — all props needed to drive token-mode behavior. */
export interface UseTokenModeConfig {
  editableElementRef: React.RefObject<HTMLDivElement>;
  caretControllerRef: React.MutableRefObject<CaretController | null>;

  isTokenMode: boolean;
  tokens?: readonly PromptInputProps.InputToken[];
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
  menus?: readonly PromptInputProps.MenuDefinition[];
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  invalid?: boolean;
  warning?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  ariaRequired?: boolean;
  disableBrowserAutocorrect?: boolean;
  spellcheck?: boolean;

  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void;
  onTriggerDetected?: (detail: PromptInputProps.TriggerDetectedDetail) => boolean;
  onAction?: PromptInputProps['onAction'];
  onBlur?: PromptInputProps['onBlur'];
  onFocus?: PromptInputProps['onFocus'];
  onKeyDown?: PromptInputProps['onKeyDown'];
  onKeyUp?: PromptInputProps['onKeyUp'];
  onMenuItemSelect?: PromptInputProps['onMenuItemSelect'];
  onMenuFilter?: PromptInputProps['onMenuFilter'];
  onMenuLoadItems?: PromptInputProps['onMenuLoadItems'];

  i18nStrings?: PromptInputProps['i18nStrings'];

  adjustInputHeight: () => void;
}

/** Return value of useTokenMode — state, handlers, and attributes consumed by TokenMode component. */
export interface UseTokenModeResult {
  reactContainersRef: React.MutableRefObject<Map<string, HTMLElement>>;

  editableState: EditableState;

  editableElementAttributes: React.HTMLAttributes<HTMLDivElement> & { 'data-placeholder'?: string };

  activeTriggerToken: PromptInputProps.TriggerToken | null;
  activeMenu: PromptInputProps.MenuDefinition | null;
  menuIsOpen: boolean;
  menuFilterText: string;
  triggerWrapperRef: React.MutableRefObject<HTMLElement | null>;
  triggerWrapperReady: boolean;

  menuListId: string;
  menuFooterControlId: string;
  highlightedMenuOptionId: string | undefined;
  menuItemsState: MenuItemsState;
  menuItemsHandlers: MenuItemsHandlers;
  menuDropdownStatus: ReturnType<typeof useDropdownStatus> | null;
  shouldRenderMenuDropdown: boolean;

  handleInput: () => void;

  handleLoadMore: () => void;

  tokenOperationAnnouncement: string;

  markTokensAsSent: (tokens: readonly PromptInputProps.InputToken[]) => void;
}

interface ShortcutsState {
  caretInTrigger: boolean;
  setCaretInTrigger: (inTrigger: boolean) => void;
  ignoreCaretDetection: React.MutableRefObject<boolean>;
  lastSentTokens: React.MutableRefObject<readonly PromptInputProps.InputToken[] | undefined>;
  isExternalUpdate: (tokens: readonly PromptInputProps.InputToken[] | undefined) => boolean;
  markTokensAsSent: (tokens: readonly PromptInputProps.InputToken[]) => void;
}

function useShortcutsState(): ShortcutsState {
  const [caretInTrigger, setCaretInTrigger] = useState(false);
  const ignoreCaretDetection = useRef(false);
  const lastSentTokens = useRef<readonly PromptInputProps.InputToken[] | undefined>(undefined);

  const isExternalUpdate = useStableCallback((tokens: readonly PromptInputProps.InputToken[] | undefined): boolean => {
    return lastSentTokens.current !== tokens;
  });

  const markTokensAsSent = useStableCallback((tokens: readonly PromptInputProps.InputToken[]) => {
    lastSentTokens.current = tokens;
  });

  return {
    caretInTrigger,
    setCaretInTrigger,
    ignoreCaretDetection,
    lastSentTokens,
    isExternalUpdate,
    markTokensAsSent,
  };
}

interface ProcessorConfig {
  tokens?: readonly PromptInputProps.InputToken[];
  menus?: readonly PromptInputProps.MenuDefinition[];
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void;
  onTriggerDetected?: (detail: PromptInputProps.TriggerDetectedDetail) => boolean;
  state: ShortcutsState;
}

function useTokenProcessor(config: ProcessorConfig) {
  const { tokens, menus, tokensToText, onChange, onTriggerDetected, state } = config;
  const previousTokensRef = useRef(tokens);

  const emitTokenChange = useStableCallback((newTokens: PromptInputProps.InputToken[]) => {
    const value = tokensToText ? tokensToText(newTokens) : getPromptText(newTokens);
    state.markTokensAsSent(newTokens);
    onChange({ value, tokens: newTokens });
  });

  const processUserInput = useStableCallback((inputTokens: PromptInputProps.InputToken[]) => {
    const processed = processTokens(
      inputTokens,
      { menus, tokensToText },
      {
        source: 'user-input',
        detectTriggers: true,
      },
      onTriggerDetected
    );

    emitTokenChange(processed);
  });

  useEffect(() => {
    if (previousTokensRef.current === tokens) {
      return;
    }

    previousTokensRef.current = tokens;

    if (!state.isExternalUpdate(tokens)) {
      return;
    }

    if (!tokens || !menus) {
      return;
    }

    const processed = processTokens(
      tokens,
      { menus, tokensToText },
      {
        source: 'external',
        detectTriggers: true,
      },
      onTriggerDetected
    );

    const hasChanges = processed.length !== tokens.length || processed.some((t, i) => t !== tokens[i]);

    if (hasChanges) {
      emitTokenChange(processed);
    }
  }, [tokens, menus, tokensToText, onTriggerDetected, state, emitTokenChange]);

  return {
    processUserInput,
  };
}

interface EffectsConfig {
  tokens?: readonly PromptInputProps.InputToken[];
  editableElementRef: React.RefObject<HTMLDivElement>;
  state: ShortcutsState;
  activeTriggerToken: PromptInputProps.TriggerToken | null;
  caretController: React.RefObject<CaretController | null>;
}

function useShortcutsEffects(config: EffectsConfig) {
  const { activeTriggerToken, editableElementRef, state, tokens, caretController } = config;

  useEffect(() => {
    const hasTriggers = tokens?.some(isTriggerToken);

    if (!hasTriggers || !editableElementRef.current) {
      state.setCaretInTrigger(false);
      return;
    }

    const checkMenuState = () => {
      const ctrl = caretController.current;
      if (!editableElementRef.current || !ctrl || state.ignoreCaretDetection.current) {
        return;
      }

      let isInTrigger = !!ctrl.findActiveTrigger();

      if (!state.ignoreCaretDetection.current) {
        const selection = window.getSelection();
        if (selection?.rangeCount) {
          const range = selection.getRangeAt(0);

          if (range.collapsed) {
            let triggerElement: HTMLElement | null = null;

            if (isTextNode(range.startContainer) && range.startOffset === 0) {
              const prevSibling = range.startContainer.previousSibling;
              if (isHTMLElement(prevSibling) && getTokenType(prevSibling) === 'trigger') {
                triggerElement = prevSibling;
              }
            } else if (range.startContainer === editableElementRef.current || isHTMLElement(range.startContainer)) {
              const container = range.startContainer as HTMLElement;
              const childNodes = Array.from(container.childNodes);
              const nodeBeforeCaret = childNodes[range.startOffset - 1];

              if (isHTMLElement(nodeBeforeCaret) && getTokenType(nodeBeforeCaret) === 'trigger') {
                triggerElement = nodeBeforeCaret;
              }
            }

            if (triggerElement) {
              const triggerTextNode = triggerElement.childNodes[0];
              if (isTextNode(triggerTextNode)) {
                const triggerText = triggerTextNode.textContent || '';
                range.setStart(triggerTextNode, triggerText.length);
                range.collapse(true);
              }
            }
          }
        }
      }

      isInTrigger = !!ctrl.findActiveTrigger();

      const shouldBeOpen = isInTrigger;

      if (shouldBeOpen !== state.caretInTrigger) {
        state.setCaretInTrigger(shouldBeOpen);
      }
    };

    checkMenuState();

    document.addEventListener('selectionchange', checkMenuState);

    const scrollableParent = getFirstScrollableParent(editableElementRef.current);
    if (scrollableParent) {
      scrollableParent.addEventListener('scroll', checkMenuState);
    }

    return () => {
      document.removeEventListener('selectionchange', checkMenuState);
      if (scrollableParent) {
        scrollableParent.removeEventListener('scroll', checkMenuState);
      }
    };
  }, [tokens, state, editableElementRef, caretController, activeTriggerToken]);
}

/** Encapsulates all token-mode logic: trigger detection, menu state, keyboard handling, and rendering. */
export function useTokenMode(config: UseTokenModeConfig): UseTokenModeResult {
  const {
    editableElementRef,
    caretControllerRef,
    tokens,
    tokensToText,
    menus,
    disabled,
    readOnly,
    autoFocus,
    placeholder,
    invalid,
    warning,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaRequired,
    disableBrowserAutocorrect,
    spellcheck,
    onChange,
    onTriggerDetected,
    onAction,
    onBlur,
    onFocus,
    onKeyDown,
    onKeyUp,
    onMenuItemSelect,
    onMenuFilter,
    onMenuLoadItems,
    i18nStrings,
    adjustInputHeight,
  } = config;

  const shortcutsState = useShortcutsState();

  const { ignoreCaretDetection, markTokensAsSent } = shortcutsState;

  const [caretUpdateTrigger, setCaretUpdateTrigger] = useState(0);

  const activeTriggerToken = useMemo((): PromptInputProps.TriggerToken | null => {
    if (!tokens || !caretControllerRef.current) {
      return null;
    }

    const activeTriggerID = caretControllerRef.current.findActiveTrigger()?.id || null;

    if (!activeTriggerID) {
      return null;
    }

    const matchingTrigger = tokens.find(t => isTriggerToken(t) && t.id === activeTriggerID) as
      | PromptInputProps.TriggerToken
      | undefined;

    return matchingTrigger || null;
    // caretControllerRef.current is a mutable ref — caretUpdateTrigger is the intentional invalidation signal
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, caretControllerRef, caretUpdateTrigger]);

  useEffect(() => {
    const handleSelectionChange = () => {
      setCaretUpdateTrigger(prev => prev + 1);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  useEffect(() => {
    if (shortcutsState.caretInTrigger) {
      setCaretUpdateTrigger(prev => prev + 1);
    }
  }, [shortcutsState.caretInTrigger]);

  const activeMenu = useMemo(
    () =>
      activeTriggerToken && shortcutsState.caretInTrigger
        ? (menus?.find(m => m.trigger === activeTriggerToken.triggerChar) ?? null)
        : null,
    [activeTriggerToken, shortcutsState.caretInTrigger, menus]
  );

  const menuIsOpen = !!activeMenu;
  const menuFilterText = activeTriggerToken?.value ?? '';

  const processor = useTokenProcessor({
    tokens,
    menus,
    tokensToText,
    onChange,
    onTriggerDetected,
    state: shortcutsState,
  });

  const { processUserInput } = processor;

  useShortcutsEffects({
    tokens,
    editableElementRef,
    state: shortcutsState,
    activeTriggerToken,
    caretController: caretControllerRef,
  });

  const triggerWrapperRef = useRef<HTMLElement | null>(null);
  const [triggerWrapperReady, setTriggerWrapperReady] = useState(false);
  const [triggerVisible, setTriggerVisible] = useState(true);

  useEffect(() => {
    if (activeTriggerToken && menuIsOpen && editableElementRef.current) {
      const triggerElement = activeTriggerToken.id
        ? editableElementRef.current.querySelector<HTMLElement>(`#${CSS.escape(activeTriggerToken.id)}`)
        : null;

      if (triggerElement) {
        triggerWrapperRef.current = triggerElement;
        setTriggerWrapperReady(true);
      } else {
        triggerWrapperRef.current = null;
        setTriggerWrapperReady(false);
      }
    } else if (!menuIsOpen) {
      triggerWrapperRef.current = null;
      setTriggerWrapperReady(false);
    }
  }, [activeTriggerToken, menuIsOpen, editableElementRef]);

  // Hide the menu dropdown when the trigger element scrolls out of the editable container's visible area
  useEffect(() => {
    if (!menuIsOpen || !triggerWrapperRef.current || !editableElementRef.current) {
      setTriggerVisible(true);
      return;
    }

    const trigger = triggerWrapperRef.current;
    const container = editableElementRef.current;

    const checkTriggerVisibility = () => {
      const triggerRect = trigger.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const isOutOfView = triggerRect.bottom < containerRect.top || triggerRect.top > containerRect.bottom;
      setTriggerVisible(!isOutOfView);
    };

    checkTriggerVisibility();

    container.addEventListener('scroll', checkTriggerVisibility);

    const scrollableParent = getFirstScrollableParent(container);
    if (scrollableParent) {
      scrollableParent.addEventListener('scroll', checkTriggerVisibility);
    }

    return () => {
      container.removeEventListener('scroll', checkTriggerVisibility);
      if (scrollableParent) {
        scrollableParent.removeEventListener('scroll', checkTriggerVisibility);
      }
    };
  }, [menuIsOpen, editableElementRef]);

  const reactContainersRef = useRef<Map<string, HTMLElement>>(new Map());

  useLayoutEffect(() => {
    if (editableElementRef.current && !caretControllerRef.current) {
      caretControllerRef.current = new CaretController(editableElementRef.current);
    }
  }, [editableElementRef, caretControllerRef]);

  const editableState = useMemo(() => createEditableState(), []);

  const [tokenOperationAnnouncement, setTokenOperationAnnouncement] = useState<string>('');

  const announceTokenOperation = useStableCallback((message: string) => {
    setTokenOperationAnnouncement(message);
    setTimeout(() => setTokenOperationAnnouncement(''), 100);
  });

  const renderToken = React.useCallback(
    (props: RenderTokenProps) =>
      React.createElement(Token, {
        key: props.id,
        variant: 'inline' as const,
        label: props.label,
        disabled: !!disabled,
        readOnly: !!readOnly,
      }),
    [disabled, readOnly]
  );

  const lastRenderedTokensRef = useRef<readonly PromptInputProps.InputToken[] | undefined>(undefined);
  const lastDisabledRef = useRef(disabled);
  const lastReadOnlyRef = useRef(readOnly);
  const renderTokenRef = useRef(renderToken);
  renderTokenRef.current = renderToken;
  const isTypingIntoEmptyLineRef = useRef(false);

  const handleInput = useCallback(() => {
    if (!editableElementRef.current) {
      return;
    }

    const cc = caretControllerRef.current;

    if (cc) {
      cc.capture();
    }

    if (editableState.skipNextZwnjUpdate) {
      editableState.skipNextZwnjUpdate = false;
    }

    const paragraphs = findAllParagraphs(editableElementRef.current);

    const { movedTextNode } = extractTextFromCaretSpots(paragraphs, true);

    if (movedTextNode && cc) {
      cc.positionAfterText(movedTextNode);
    }

    const directTextNodes = Array.from(editableElementRef.current.childNodes).filter(
      node => isTextNode(node) && node.textContent?.trim()
    );

    if (directTextNodes.length > 0) {
      if (cc) {
        cc.capture();
      }

      let targetP = findAllParagraphs(editableElementRef.current)[0];
      if (!targetP) {
        targetP = createParagraph();
        editableElementRef.current.appendChild(targetP);
      }

      directTextNodes.forEach(textNode => {
        targetP!.appendChild(textNode);
      });

      if (cc) {
        cc.restore();
      }
    }

    let extractedTokens = extractTokensFromDOM(editableElementRef.current, menus);

    const newTriggers = extractedTokens.filter(isTriggerToken);

    const existingTriggerElements = findElements(editableElementRef.current, { tokenType: ELEMENT_TYPES.TRIGGER });
    const existingTriggerIds = new Set(existingTriggerElements.map(el => el.id).filter(Boolean));

    const isNewTrigger = newTriggers.some(t => t.id && !existingTriggerIds.has(t.id));

    const hasStylingChange = newTriggers.some(newT => {
      const domElement = existingTriggerElements.find(el => el.id === newT.id);
      if (!domElement) {
        return false;
      }

      const currentHasClass = domElement.className.includes('trigger-token');
      const shouldHaveClass = newT.value.length > 0;
      return currentHasClass !== shouldHaveClass;
    });

    if (isNewTrigger || hasStylingChange) {
      if (cc) {
        cc.capture();
      }

      renderTokensToDOM(
        extractedTokens,
        editableElementRef.current,
        reactContainersRef.current,
        renderTokenRef.current
      );

      if (cc) {
        cc.restore();
      }
    }

    const movedTokens = enforcePinnedTokenOrdering(extractedTokens);
    const tokensWereMoved = movedTokens.some((t, i) => t !== extractedTokens[i]);

    const mergedTokens = mergeConsecutiveTextTokens(movedTokens);

    if (tokensWereMoved) {
      extractedTokens = mergedTokens;

      const caretPosBeforeMove = cc?.getPosition() ?? 0;

      const pinnedCount = mergedTokens.filter(isPinnedReferenceToken).length;

      const adjustedPosition = caretPosBeforeMove + pinnedCount;

      renderTokensToDOM(mergedTokens, editableElementRef.current, reactContainersRef.current, renderTokenRef.current);

      if (editableElementRef.current && document.activeElement === editableElementRef.current && cc) {
        cc.setPosition(adjustedPosition);
      }
    }

    processUserInput(extractedTokens);

    adjustInputHeight();
    // Omitted deps are refs/stable objects that don't change — including them would cause unnecessary re-creation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processUserInput, adjustInputHeight, tokensToText, ignoreCaretDetection]);

  // Initial render
  useLayoutEffect(() => {
    if (!editableElementRef.current || disabled) {
      return;
    }
    if (editableElementRef.current.children.length === 0) {
      renderTokensToDOM(tokens ?? [], editableElementRef.current, reactContainersRef.current, renderToken);
    }
    // Intentionally run only on mount — subsequent renders are handled by the useEffect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Token render effect
  useEffect(() => {
    if (!editableElementRef.current) {
      return;
    }

    const cc = caretControllerRef.current;
    const orderedTokens = tokens ? enforcePinnedTokenOrdering(tokens) : tokens;
    const prevOrderedTokens = lastRenderedTokensRef.current;

    const stateChanged = lastDisabledRef.current !== disabled || lastReadOnlyRef.current !== readOnly;
    lastDisabledRef.current = disabled;
    lastReadOnlyRef.current = readOnly;

    const triggerSplitAndMerged =
      lastRenderedTokensRef.current &&
      orderedTokens &&
      lastRenderedTokensRef.current.length === orderedTokens.length &&
      orderedTokens.some((token, i) => {
        const oldToken = lastRenderedTokensRef.current![i];
        const prevToken = i > 0 ? orderedTokens[i - 1] : null;
        return (
          isTextToken(token) &&
          isTextToken(oldToken) &&
          prevToken &&
          isTriggerToken(prevToken) &&
          token.value.length === oldToken.value.length + 1 &&
          token.value.startsWith(' ') &&
          token.value.substring(1) === oldToken.value
        );
      });

    const needsRerender =
      stateChanged || shouldRerender(lastRenderedTokensRef.current, orderedTokens) || triggerSplitAndMerged;

    if (!needsRerender) {
      positionCaretAfterMenuSelection(orderedTokens ?? [], editableState, cc);

      lastRenderedTokensRef.current = orderedTokens;
      return;
    }

    if (
      lastRenderedTokensRef.current &&
      orderedTokens &&
      lastRenderedTokensRef.current.length === 0 &&
      orderedTokens.length === 0
    ) {
      lastRenderedTokensRef.current = orderedTokens;
      return;
    }

    if (editableState.menuSelectionTokenId && cc) {
      const insertedTokenIndex = (orderedTokens ?? []).findIndex(
        t => isReferenceToken(t) && t.id === editableState.menuSelectionTokenId
      );

      if (insertedTokenIndex !== -1) {
        renderTokensToDOM(orderedTokens ?? [], editableElementRef.current, reactContainersRef.current, renderToken);
        positionCaretAfterMenuSelection(orderedTokens ?? [], editableState, cc);

        lastRenderedTokensRef.current = orderedTokens;
        adjustInputHeight();
        return;
      }
    }

    const isTypingIntoEmptyLine = detectTypingContext(
      lastRenderedTokensRef.current,
      orderedTokens,
      isTypingIntoEmptyLineRef
    );

    lastRenderedTokensRef.current = orderedTokens;

    if (isTypingIntoEmptyLine) {
      if (cc) {
        cc.capture();
      }

      const renderResult = renderTokensToDOM(
        orderedTokens ?? [],
        editableElementRef.current,
        reactContainersRef.current,
        renderToken
      );

      if (positionCaretAfterMenuSelection(orderedTokens ?? [], editableState, cc)) {
        adjustInputHeight();
        return;
      }

      const oldTriggerIds = new Set((lastRenderedTokensRef.current ?? []).filter(isTriggerToken).map(t => t.id));
      const newTriggerIds = (orderedTokens ?? []).filter(isTriggerToken).map(t => t.id);
      const hasNewTriggerId = newTriggerIds.some(id => !oldTriggerIds.has(id));

      if (renderResult.newTriggerElement && hasNewTriggerId && cc) {
        const triggerTokens = (orderedTokens ?? []).filter(isTriggerToken);
        if (triggerTokens.length > 0) {
          const lastTrigger = triggerTokens[triggerTokens.length - 1];
          const triggerIndex = (orderedTokens ?? []).indexOf(lastTrigger);

          const positionBeforeTrigger =
            triggerIndex > 0 ? calculateTokenPosition(orderedTokens ?? [], triggerIndex - 1) : 0;

          const positionAfterTrigger = positionBeforeTrigger + TOKEN_LENGTHS.trigger(lastTrigger.value);

          cc.setPosition(positionAfterTrigger);
          adjustInputHeight();
          return;
        }
      }

      if (cc) {
        cc.restore();
      }

      adjustInputHeight();
      return;
    }

    if (cc) {
      cc.capture();
    }

    renderTokensToDOM(orderedTokens ?? [], editableElementRef.current, reactContainersRef.current, renderToken);

    if (positionCaretAfterMenuSelection(orderedTokens ?? [], editableState, cc)) {
      adjustInputHeight();
      return;
    }

    if (cc) {
      const savedPosition = cc.getSavedPosition();

      const hasPinnedTokens = orderedTokens?.some(isPinnedReferenceToken) ?? false;
      const hasOnlyPinnedTokens = (hasPinnedTokens && orderedTokens?.every(t => isPinnedReferenceToken(t))) ?? false;

      const totalLength = calculateTotalTokenLength(orderedTokens ?? []);

      const savedPositionInvalid = savedPosition !== null && savedPosition > totalLength;

      if (hasOnlyPinnedTokens || savedPositionInvalid) {
        cc.setPosition(totalLength);
      } else {
        // If triggers were removed since last render, the saved position may be offset
        // by the removed trigger's logical length. Adjust by the difference in total length.
        const prevTotalLength = calculateTotalTokenLength(prevOrderedTokens ?? []);
        const lengthDelta = prevTotalLength - totalLength;

        if (lengthDelta > 0 && savedPosition !== null) {
          cc.setPosition(Math.max(0, savedPosition - lengthDelta));
        } else {
          cc.restore();
        }
      }
    }

    adjustInputHeight();
    // Omitted deps are refs/stable values — effect should only re-run when actual data changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, readOnly, tokens, adjustInputHeight]);

  useEffect(() => {
    const handleSelectionChange = () => {
      normalizeCollapsedCaret(window.getSelection());
      normalizeSelection(window.getSelection());
    };
    const handleMouseDown = () => {
      setMouseDown(true);
    };
    const handleMouseUp = () => {
      setMouseDown(false);
      normalizeCollapsedCaret(window.getSelection());
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
  }, []);

  const handleMenuSelect = useStableCallback((option: MenuItem) => {
    if (!activeMenu || !activeTriggerToken || !tokens) {
      return;
    }

    shortcutsState.setCaretInTrigger(false);

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

    const isPinned = activeMenu.useAtStart ?? false;
    const tokenLabel = result.insertedToken.label || result.insertedToken.value;
    const announcement = isPinned
      ? (i18nStrings?.tokenPinnedAriaLabel?.(result.insertedToken) ?? `${tokenLabel} pinned`)
      : (i18nStrings?.tokenInsertedAriaLabel?.(result.insertedToken) ?? `${tokenLabel} inserted`);

    announceTokenOperation(announcement);

    onChange({ value, tokens: result.tokens });

    fireNonCancelableEvent(onMenuItemSelect, {
      menuId: activeMenu.id,
      option: option.option,
    });
  });

  const menuItemsResult = useMenuItems({
    menu: activeMenu ?? { id: '', trigger: '', options: [] },
    filterText: menuFilterText,
    onSelectItem: handleMenuSelect,
  });

  const [menuItemsState, menuItemsHandlers] = menuItemsResult;

  const menuStateRef = useRef({
    itemsState: menuItemsState,
    itemsHandlers: menuItemsHandlers,
    isOpen: menuIsOpen,
  });
  menuStateRef.current = {
    itemsState: menuItemsState,
    itemsHandlers: menuItemsHandlers,
    isOpen: menuIsOpen,
  };

  const keyboardHandlers = useMemo(() => {
    if (!editableElementRef.current) {
      return null;
    }

    return createKeyboardHandlers({
      getMenuOpen: () => menuStateRef.current.isOpen,
      getMenuItemsState: () => menuStateRef.current.itemsState,
      getMenuItemsHandlers: () => menuStateRef.current.itemsHandlers,
      getMenuStatusType: () => activeMenu?.statusType,
      onAction: onAction ? detail => fireNonCancelableEvent(onAction, detail) : undefined,
      tokensToText,
      tokens,
      closeMenu: () => {
        ignoreCaretDetection.current = true;
        shortcutsState.setCaretInTrigger(false);
        setTimeout(() => {
          ignoreCaretDetection.current = false;
        }, CARET_DETECTION_DELAY);
      },
      announceTokenOperation,
      i18nStrings,
      disabled,
      readOnly,
      caretController: caretControllerRef.current || undefined,
    });
  }, [
    onAction,
    tokensToText,
    tokens,
    i18nStrings,
    disabled,
    readOnly,
    activeMenu?.statusType,
    ignoreCaretDetection,
    shortcutsState,
    announceTokenOperation,
    caretControllerRef,
    editableElementRef,
  ]);

  const handleEditableElementKeyDown = useStableCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'a' && (event.ctrlKey || event.metaKey) && tokens?.length === 0) {
      event.preventDefault();
      return;
    }

    if (handleArrowKeyNavigation(event, caretControllerRef.current)) {
      return;
    }

    if (event.key === 'Enter' && event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();

      if (caretControllerRef.current?.findActiveTrigger()) {
        return;
      }

      if (editableElementRef.current) {
        splitParagraphAtCaret(editableElementRef.current, caretControllerRef.current);
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
          announceTokenOperation,
          i18nStrings,
          caretControllerRef.current
        )
      ) {
        return;
      }
    }

    if (event.key === 'Backspace' && tokens && editableElementRef.current) {
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
            onChange(detail);
          },
          caretControllerRef.current
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
          (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => {
            markTokensAsSent(detail.tokens);
            onChange(detail);
          },
          caretControllerRef.current
        )
      ) {
        return;
      }
    }

    fireKeyboardEvent(onKeyDown, event);

    if (
      event.key === ' ' &&
      editableElementRef.current &&
      handleSpaceAfterClosedTrigger(
        event,
        editableElementRef.current,
        menuIsOpen,
        ignoreCaretDetection,
        caretControllerRef.current
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

  useEffect(() => {
    if (autoFocus && editableElementRef.current) {
      editableElementRef.current.focus();
    }
    // Intentionally run only on mount — autoFocus should fire once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => adjustInputHeight();
    window.addEventListener('resize', handleResize);
    const containers = reactContainersRef.current;
    return () => {
      window.removeEventListener('resize', handleResize);
      containers.clear();
    };
  }, [adjustInputHeight]);

  const menuLoadMoreResult = useMenuLoadMore({
    menu: activeMenu ?? { id: '', trigger: '', options: [] },
    statusType: activeMenu?.statusType ?? 'finished',
    onLoadItems: detail => {
      fireNonCancelableEvent(onMenuLoadItems, detail);
    },
    onLoadMoreItems: () => {
      fireNonCancelableEvent(onMenuLoadItems, {
        menuId: activeMenu?.id ?? '',
        filteringText: undefined,
        firstPage: false,
        samePage: false,
      });
    },
  });

  const menuLoadMoreHandlers = activeMenu ? menuLoadMoreResult : null;

  useEffect(() => {
    if (menuIsOpen && activeMenu && menuLoadMoreHandlers) {
      menuLoadMoreHandlers.fireLoadMoreOnMenuOpen();
    }
  }, [menuIsOpen, activeMenu, menuLoadMoreHandlers]);

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

  useEffect(() => {
    if (activeTriggerToken && activeMenu && onMenuFilter) {
      fireNonCancelableEvent(onMenuFilter, {
        menuId: activeMenu.id,
        filteringText: activeTriggerToken.value,
      });
    }
  }, [activeTriggerToken, activeMenu, onMenuFilter]);

  const handleLoadMore = useStableCallback(() => {
    if (menuLoadMoreHandlers) {
      menuLoadMoreHandlers.fireLoadMoreOnScroll();
    }
  });

  const menuListId = useUniqueId('menu-list');
  const menuFooterControlId = useUniqueId('menu-footer');
  const highlightedMenuOptionIdSource = useUniqueId();
  const highlightedMenuOptionId = menuItemsState?.highlightedOption ? highlightedMenuOptionIdSource : undefined;

  const menuDropdownStatusResult = useDropdownStatus({
    ...(activeMenu ?? {}),
    isEmpty: !menuItemsState || menuItemsState.items.length === 0,
    recoveryText: i18nStrings?.menuRecoveryText,
    errorIconAriaLabel: i18nStrings?.menuErrorIconAriaLabel,
    loadingText: i18nStrings?.menuLoadingText,
    finishedText: i18nStrings?.menuFinishedText,
    errorText: i18nStrings?.menuErrorText,
    onRecoveryClick: () => {
      if (menuLoadMoreHandlers) {
        menuLoadMoreHandlers.fireLoadMoreOnRecoveryClick();
      }
      editableElementRef.current?.focus();
    },
    hasRecoveryCallback: Boolean(onMenuLoadItems),
  });

  const menuDropdownStatus = activeMenu ? menuDropdownStatusResult : null;

  const shouldRenderMenuDropdown = useMemo(() => {
    return !!(menuIsOpen && activeMenu && menuItemsState && triggerVisible);
  }, [menuIsOpen, activeMenu, menuItemsState, triggerVisible]);

  const showPlaceholder = !!(placeholder && (!tokens || tokens.length === 0));

  const editableElementAttributes: React.HTMLAttributes<HTMLDivElement> & { 'data-placeholder'?: string } = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    'aria-invalid': invalid ? 'true' : undefined,
    'aria-disabled': disabled ? 'true' : undefined,
    'aria-readonly': readOnly ? 'true' : undefined,
    'aria-required': ariaRequired ? 'true' : undefined,
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

  return {
    reactContainersRef,
    editableState,
    editableElementAttributes,
    activeTriggerToken,
    activeMenu,
    menuIsOpen,
    menuFilterText,
    triggerWrapperRef,
    triggerWrapperReady,
    menuListId,
    menuFooterControlId,
    highlightedMenuOptionId,
    menuItemsState,
    menuItemsHandlers,
    menuDropdownStatus,
    shouldRenderMenuDropdown,
    handleInput,
    handleLoadMore,
    tokenOperationAnnouncement,
    markTokensAsSent,
  };
}
