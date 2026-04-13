// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

import { useStableCallback, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { useDropdownStatus } from '../../internal/components/dropdown-status';
import { fireKeyboardEvent, fireNonCancelableEvent } from '../../internal/events';
import { getFirstScrollableParent } from '../../internal/utils/scrollable-containers';
import Token from '../../token/internal';
import { calculateTokenPosition, CaretController, getOwnerSelection } from '../core/caret-controller';
import { extractTextFromCaretSpots } from '../core/caret-spot-utils';
import {
  findContainingReference,
  getMouseDown,
  isNonTypeablePosition,
  normalizeCollapsedCaret,
  normalizeSelection,
  setMouseDown,
} from '../core/caret-utils';
import { NEXT_TICK_TIMEOUT } from '../core/constants';
import { createParagraph, findAllParagraphs } from '../core/dom-utils';
import { handleClipboardEvent, handleEditableKeyDown } from '../core/event-handlers';
import {
  handleMenuSelection,
  MenuItem,
  MenuItemsHandlers,
  MenuItemsState,
  useMenuItems,
  useMenuLoadMore,
} from '../core/menu-state';
import { extractTokensFromDOM, getPromptText, processTokens } from '../core/token-operations';
import { PortalContainer, renderTokensToDOM } from '../core/token-renderer';
import {
  enforcePinnedTokenOrdering,
  getCaretPositionAfterPinnedReorder,
  getCaretPositionAfterTokenRemoval,
  mergeConsecutiveTextTokens,
} from '../core/token-utils';
import { detectTriggerTransition } from '../core/trigger-utils';
import { isReferenceToken, isTextNode, isTextToken, isTriggerToken } from '../core/type-guards';
import { PromptInputProps } from '../interfaces';
import { insertTextIntoContentEditable } from '../utils/insert-text-content-editable';
import { ShortcutsState, useShortcutsEffects, useShortcutsState } from './use-shortcuts';

import styles from '../styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

/** Mutable state shared between the editable tokens hook and event handlers. */
export interface EditableState {
  skipNextZeroWidthUpdate: boolean;
  menuSelectionTokenId: string | null;
}

export function createEditableState(): EditableState {
  return {
    skipNextZeroWidthUpdate: false,
    menuSelectionTokenId: null,
  };
}

/**
 * Determines if the token array changed structurally and needs a full DOM re-render.
 *
 * Compares token types, IDs, and text values. During normal typing the extracted
 * tokens already match the DOM, so text comparisons won't trigger unnecessary
 * re-renders. External updates (parent replacing tokens) will be detected by
 * the value difference and trigger a re-render.
 *
 * Returns 'none' if no changes, 'text-only' if only token values differ
 * (same count, types, and IDs — covers both text and trigger filter changes),
 * or 'structural' for any other change.
 */
function classifyChange(
  oldTokens: readonly PromptInputProps.InputToken[] | undefined,
  newTokens: readonly PromptInputProps.InputToken[] | undefined
): 'none' | 'text-only' | 'structural' {
  if (!oldTokens || !newTokens) {
    return 'structural';
  }

  if (oldTokens.length !== newTokens.length) {
    return 'structural';
  }

  let hasTextDiff = false;

  for (let i = 0; i < oldTokens.length; i++) {
    const oldToken = oldTokens[i];
    const newToken = newTokens[i];

    if (oldToken.type !== newToken.type) {
      return 'structural';
    }

    if (isReferenceToken(oldToken) && isReferenceToken(newToken)) {
      if (oldToken.id !== newToken.id) {
        return 'structural';
      }
    }

    if (isTriggerToken(oldToken) && isTriggerToken(newToken)) {
      if (oldToken.id !== newToken.id) {
        return 'structural';
      }
      // Transition between empty and non-empty filter text changes the underline styling.
      const wasEmpty = oldToken.value.length === 0;
      const isEmpty = newToken.value.length === 0;
      if (wasEmpty !== isEmpty) {
        return 'structural';
      }
      if (oldToken.value !== newToken.value) {
        hasTextDiff = true;
      }
    }

    if (isTextToken(oldToken) && isTextToken(newToken)) {
      if (oldToken.value !== newToken.value) {
        hasTextDiff = true;
      }
    }
  }

  return hasTextDiff ? 'text-only' : 'none';
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

/** Finds a trigger token by its ID in the token array. */
function findTriggerTokenById(
  tokens: readonly PromptInputProps.InputToken[],
  triggerId: string
): PromptInputProps.TriggerToken | null {
  const trigger = tokens.find(token => isTriggerToken(token) && token.id === triggerId);
  if (trigger && isTriggerToken(trigger)) {
    return trigger;
  }
  return null;
}

/** Configuration for the useTokenMode hook — all props needed to drive token-mode behavior. */
export interface UseTokenModeConfig {
  editableElementRef: React.RefObject<HTMLDivElement>;
  caretControllerRef: React.MutableRefObject<CaretController | null>;

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
  portalContainersRef: React.MutableRefObject<Map<string, PortalContainer>>;
  /** Snapshot of portal containers for rendering portals. Updated after each renderTokensToDOM call. */
  portalContainers: PortalContainer[];
  /** Portal elements to render — renders Token components into DOM containers via createPortal. */
  portals: React.ReactPortal[];

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

interface ProcessorConfig {
  tokens?: readonly PromptInputProps.InputToken[];
  menus?: readonly PromptInputProps.MenuDefinition[];
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void;
  onTriggerDetected?: (detail: PromptInputProps.TriggerDetectedDetail) => boolean;
  state: ShortcutsState;
}

/**
 * Processes token changes from both user input and external (parent) updates.
 *
 * For user input: runs trigger detection on extracted DOM tokens and emits
 * the processed result via onChange.
 *
 * For external updates: detects if the parent provided new tokens that need
 * trigger detection or ID assignment, and emits corrected tokens if so.
 * Skips processing when the tokens reference matches what we last emitted
 * (for example, the parent is echoing back our own onChange).
 */
function useTokenProcessor(config: ProcessorConfig) {
  const { tokens, menus, tokensToText, onChange, onTriggerDetected, state } = config;

  const emitTokenChange = useStableCallback((newTokens: PromptInputProps.InputToken[]) => {
    const value = tokensToText ? tokensToText(newTokens) : getPromptText(newTokens);
    state.markTokensAsSent(newTokens);
    onChange({ value, tokens: newTokens });
  });

  const markCancelledTriggers = useStableCallback((cancelledIds: Set<string>) => {
    for (const id of cancelledIds) {
      state.cancelledTriggerIds.current.add(id);
      // Prevent opening the menu if the active trigger was cancelled
      if (state.caretInTrigger === id) {
        state.setCaretInTrigger(null);
      }
    }
  });

  /** Processes tokens extracted from the DOM after user input. */
  const processUserInput = useStableCallback((inputTokens: PromptInputProps.InputToken[]) => {
    const { tokens: processed, cancelledIds } = processTokens(
      inputTokens,
      { menus, tokensToText },
      {
        source: 'user-input',
        detectTriggers: true,
      },
      onTriggerDetected,
      state.cancelledTriggerIds.current
    );

    markCancelledTriggers(cancelledIds);
    emitTokenChange(processed);
  });

  /** Processes external token updates from the parent component. */
  useEffect(() => {
    // Skip if these are the tokens we just emitted — the parent is echoing back our onChange
    if (state.lastEmittedTokensRef.current === tokens) {
      return;
    }

    if (!tokens) {
      return;
    }

    const { tokens: processed, cancelledIds } = processTokens(
      tokens,
      { menus, tokensToText },
      {
        source: 'external',
        detectTriggers: true,
      },
      undefined,
      state.cancelledTriggerIds.current
    );

    markCancelledTriggers(cancelledIds);

    // Only emit if processing actually changed the tokens (e.g., new triggers detected,
    // IDs assigned). Compare by type, value, and ID to avoid false positives from
    // reference inequality after processTokens creates new token objects.
    const hasChanges =
      processed.length !== tokens.length ||
      processed.some((t, i) => {
        const orig = tokens[i];
        if (t.type !== orig.type || t.value !== orig.value) {
          return true;
        }
        if (isReferenceToken(t) && isReferenceToken(orig) && t.id !== orig.id) {
          return true;
        }
        if (isTriggerToken(t) && isTriggerToken(orig) && t.id !== orig.id) {
          return true;
        }
        return false;
      });

    if (hasChanges) {
      emitTokenChange(processed);
    } else {
      // Mark as seen even when no changes — prevents re-processing on next render
      state.lastEmittedTokensRef.current = tokens;
    }
  }, [tokens, menus, tokensToText, state, emitTokenChange, markCancelledTriggers]);

  return {
    processUserInput,
  };
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

  const { markTokensAsSent } = shortcutsState;

  const activeTriggerToken = useMemo((): PromptInputProps.TriggerToken | null => {
    if (!tokens || !caretControllerRef.current) {
      return null;
    }

    const activeTriggerID = caretControllerRef.current.findActiveTrigger()?.id || null;

    if (!activeTriggerID) {
      return null;
    }

    if (shortcutsState.cancelledTriggerIds.current.has(activeTriggerID)) {
      return null;
    }

    return findTriggerTokenById(tokens, activeTriggerID);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caretInTrigger is the invalidation signal from useShortcutsEffects
  }, [tokens, caretControllerRef, shortcutsState.caretInTrigger]);

  const activeMenu = useMemo(
    () =>
      activeTriggerToken && shortcutsState.caretInTrigger && !disabled && !readOnly
        ? (menus?.find(m => m.trigger === activeTriggerToken.triggerChar) ?? null)
        : null,
    [activeTriggerToken, shortcutsState.caretInTrigger, menus, disabled, readOnly]
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
  const [triggerVisible, setTriggerVisible] = useState(true);

  // Resolve the trigger DOM element synchronously during render from the tracked map.
  // The Dropdown's contentKey (which includes activeTriggerToken.id) handles
  // repositioning when the active trigger changes — no open/close toggle needed.
  if (activeTriggerToken?.id && menuIsOpen) {
    triggerWrapperRef.current = shortcutsState.triggerElementsRef.current.get(activeTriggerToken.id) ?? null;
  } else {
    triggerWrapperRef.current = null;
  }

  const triggerWrapperReady = !!triggerWrapperRef.current && menuIsOpen;

  // Hide menu dropdown when trigger scrolls out of the editable container
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
  }, [menuIsOpen, editableElementRef, activeTriggerToken]);

  const portalContainersRef = useRef<Map<string, PortalContainer>>(new Map());
  const [portalContainers, setPortalContainers] = useState<PortalContainer[]>([]);

  const renderTokens = useCallback(
    (tokens: readonly PromptInputProps.InputToken[], target: HTMLElement) => {
      const result = renderTokensToDOM(
        tokens,
        target,
        portalContainersRef.current,
        shortcutsState.triggerElementsRef.current,
        shortcutsState.cancelledTriggerIds.current
      );

      // Update trigger element map from render result
      shortcutsState.triggerElementsRef.current = new Map(result.triggerElements);

      setPortalContainers(Array.from(portalContainersRef.current.values()));
      return result;
    },
    [shortcutsState.triggerElementsRef, shortcutsState.cancelledTriggerIds, portalContainersRef]
  );

  useLayoutEffect(() => {
    if (editableElementRef.current && !caretControllerRef.current) {
      caretControllerRef.current = new CaretController(editableElementRef.current);
    }
  }, [editableElementRef, caretControllerRef]);

  const editableState = useRef(createEditableState()).current;

  const [tokenOperationAnnouncement, setTokenOperationAnnouncement] = useState<string>('');

  const announceTokenOperation = useStableCallback((message: string) => {
    setTokenOperationAnnouncement(message);
  });

  const lastRenderedTokensRef = useRef<readonly PromptInputProps.InputToken[] | undefined>(undefined);
  const lastDisabledRef = useRef(disabled);
  const lastReadOnlyRef = useRef(readOnly);

  // Refs to avoid recreating handleInput when these change (new array reference each render).
  const menusRef = useRef(menus);
  menusRef.current = menus;

  const handleInput = useCallback(() => {
    if (!editableElementRef.current) {
      return;
    }

    const ownerDoc = editableElementRef.current.ownerDocument ?? document;
    const cc = caretControllerRef.current;

    if (cc) {
      cc.capture();
    }

    if (editableState.skipNextZeroWidthUpdate) {
      editableState.skipNextZeroWidthUpdate = false;
    }

    const { movedTextNode } = extractTextFromCaretSpots(portalContainersRef.current, true);

    // Extract filter text from cancelled triggers, moving it to the paragraph level
    for (const id of shortcutsState.cancelledTriggerIds.current) {
      const trigger =
        shortcutsState.triggerElementsRef.current.get(id) ??
        (editableElementRef.current.querySelector(`#${CSS.escape(id)}`) as HTMLElement | null);
      if (!trigger) {
        continue;
      }
      const filterText = (trigger.textContent || '').substring(1);
      if (!filterText) {
        continue;
      }

      let caretInTrigger = false;
      const selection = editableElementRef.current ? getOwnerSelection(editableElementRef.current) : null;
      if (selection?.rangeCount && trigger.contains(selection.getRangeAt(0).startContainer)) {
        caretInTrigger = true;
      }

      const textNode = ownerDoc.createTextNode(filterText);
      trigger.parentNode?.insertBefore(textNode, trigger.nextSibling);
      trigger.textContent = (trigger.textContent || '').charAt(0);

      if (caretInTrigger && !movedTextNode) {
        if (cc) {
          cc.positionAfterText(textNode);
        }
      }
    }

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

    let extractedTokens = extractTokensFromDOM(
      editableElementRef.current,
      menusRef.current,
      portalContainersRef.current
    );

    // When a new trigger appears in the DOM, render immediately to ensure the
    // trigger element exists before subsequent caret operations.
    const newTriggers = extractedTokens.filter(isTriggerToken);
    const existingTriggerIds = new Set(shortcutsState.triggerElementsRef.current.keys());
    if (newTriggers.some(t => !existingTriggerIds.has(t.id))) {
      renderTokens(extractedTokens, editableElementRef.current);
    }

    const movedTokens = enforcePinnedTokenOrdering(extractedTokens);
    const tokensWereMoved = movedTokens.some((t, i) => t !== extractedTokens[i]);

    const mergedTokens = mergeConsecutiveTextTokens(movedTokens);

    if (tokensWereMoved) {
      const caretPosBeforeMove = cc?.getPosition() ?? 0;
      const adjustedPosition = getCaretPositionAfterPinnedReorder(extractedTokens, mergedTokens, caretPosBeforeMove);

      extractedTokens = mergedTokens;

      renderTokens(mergedTokens, editableElementRef.current);

      if (editableElementRef.current && ownerDoc.activeElement === editableElementRef.current && cc) {
        cc.setPosition(adjustedPosition);
      }
    }

    processUserInput(extractedTokens);

    adjustInputHeight();
  }, [
    processUserInput,
    adjustInputHeight,
    editableElementRef,
    caretControllerRef,
    portalContainersRef,
    editableState,
    renderTokens,
    shortcutsState.triggerElementsRef,
    shortcutsState.cancelledTriggerIds,
  ]);

  // Token render effect
  useLayoutEffect(() => {
    if (!editableElementRef.current) {
      return;
    }

    const cc = caretControllerRef.current;
    const orderedTokens = tokens ? enforcePinnedTokenOrdering(tokens) : tokens;
    const prevOrderedTokens = lastRenderedTokensRef.current;

    const stateChanged = lastDisabledRef.current !== disabled || lastReadOnlyRef.current !== readOnly;
    lastDisabledRef.current = disabled;
    lastReadOnlyRef.current = readOnly;

    const triggerTransition = detectTriggerTransition(lastRenderedTokensRef.current, orderedTokens);

    const changeType = classifyChange(lastRenderedTokensRef.current, orderedTokens);
    const needsRerender = stateChanged || changeType !== 'none' || triggerTransition > 0;

    if (!needsRerender) {
      positionCaretAfterMenuSelection(orderedTokens ?? [], editableState, cc);

      lastRenderedTokensRef.current = orderedTokens;
      return;
    }

    // Text-only changes from user input are already reflected in the DOM by the
    // browser's native editing. Skip re-render to preserve cursor position —
    // Text-only changes from user input are already reflected in the DOM by the
    // browser's native editing. Skip re-render to preserve cursor position —
    // re-rendering would read a corrupted position from normalizeCaretIntoTrigger.
    // External updates still need a re-render.
    if (
      changeType === 'text-only' &&
      !stateChanged &&
      triggerTransition === 0 &&
      shortcutsState.lastEmittedTokensRef.current === tokens
    ) {
      lastRenderedTokensRef.current = orderedTokens;
      return;
    }

    if (triggerTransition > 0 && orderedTokens && cc) {
      renderTokens(orderedTokens, editableElementRef.current);
      lastRenderedTokensRef.current = orderedTokens;
      cc.setPosition(triggerTransition);
      adjustInputHeight();
      return;
    }

    // A new trigger appeared (e.g. user typed a trigger char, possibly replacing a selection).
    // Position the caret after the trigger character so the user can start typing a filter.
    const newTrigger =
      orderedTokens &&
      prevOrderedTokens &&
      orderedTokens.find(t => isTriggerToken(t) && !prevOrderedTokens.some(p => isTriggerToken(p) && p.id === t.id));
    if (newTrigger && isTriggerToken(newTrigger) && cc) {
      renderTokens(orderedTokens, editableElementRef.current);
      lastRenderedTokensRef.current = orderedTokens;
      // Use the saved position from insertText if available, otherwise position after the trigger char
      const savedPos = cc.getSavedPosition();
      if (savedPos !== null) {
        cc.setPosition(savedPos);
      } else {
        const triggerIndex = orderedTokens.indexOf(newTrigger);
        const posBeforeTrigger = triggerIndex > 0 ? calculateTokenPosition(orderedTokens, triggerIndex - 1) : 0;
        cc.setPosition(posBeforeTrigger + newTrigger.triggerChar.length);
      }
      adjustInputHeight();
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
        renderTokens(orderedTokens ?? [], editableElementRef.current);
        positionCaretAfterMenuSelection(orderedTokens ?? [], editableState, cc);

        lastRenderedTokensRef.current = orderedTokens;
        adjustInputHeight();
        return;
      }
    }

    lastRenderedTokensRef.current = orderedTokens;

    if (cc) {
      cc.capture();
    }

    renderTokens(orderedTokens ?? [], editableElementRef.current);

    if (positionCaretAfterMenuSelection(orderedTokens ?? [], editableState, cc)) {
      adjustInputHeight();
      return;
    }

    if (cc) {
      const savedPosition = cc.getSavedPosition();
      const restoredPosition = getCaretPositionAfterTokenRemoval(
        savedPosition,
        prevOrderedTokens ?? [],
        orderedTokens ?? []
      );

      if (restoredPosition !== null) {
        cc.setPosition(restoredPosition);
      } else {
        cc.restore();
      }
    }

    adjustInputHeight();
  }, [
    disabled,
    readOnly,
    tokens,
    adjustInputHeight,
    caretControllerRef,
    editableElementRef,
    portalContainersRef,
    editableState,
    renderTokens,
    shortcutsState,
  ]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = editableElementRef.current ? getOwnerSelection(editableElementRef.current) : null;
      if (!sel?.rangeCount || !editableElementRef.current?.contains(sel.getRangeAt(0).startContainer)) {
        return;
      }
      // Skip caret normalization during mousedown — the user may be starting a
      // drag selection from a caret-spot position adjacent to a reference.
      if (!getMouseDown()) {
        normalizeCollapsedCaret(sel);
      }
      normalizeSelection(sel);
    };
    const handleMouseDown = () => {
      setMouseDown(true);
    };
    const handleMouseUp = () => {
      setMouseDown(false);
      const sel = editableElementRef.current ? getOwnerSelection(editableElementRef.current) : null;
      if (!sel?.rangeCount || !editableElementRef.current?.contains(sel.getRangeAt(0).startContainer)) {
        return;
      }
      normalizeCollapsedCaret(sel);
      normalizeSelection(sel);

      // Deferred re-check: browsers may finalize caret position after mouseup
      /* istanbul ignore next -- browser mouseup normalization covered by integ tests */
      requestAnimationFrame(() => {
        const sel = editableElementRef.current ? getOwnerSelection(editableElementRef.current) : null;
        if (!sel?.rangeCount) {
          return;
        }

        const range = sel.getRangeAt(0);
        if (!range.collapsed) {
          const startBad = isNonTypeablePosition(range.startContainer);
          const endBad = isNonTypeablePosition(range.endContainer);

          if (startBad) {
            const ref = findContainingReference(range.startContainer);
            if (ref?.parentNode) {
              const index = Array.from(ref.parentNode.childNodes).indexOf(ref as ChildNode);
              range.setStart(ref.parentNode, index);
            }
          }
          if (endBad) {
            const ref = findContainingReference(range.endContainer);
            if (ref?.parentNode) {
              const index = Array.from(ref.parentNode.childNodes).indexOf(ref as ChildNode);
              range.setEnd(ref.parentNode, index + 1);
            }
          }
        }

        normalizeCollapsedCaret(sel);
        normalizeSelection(sel);
      });
    };

    const ownerDoc = editableElementRef.current?.ownerDocument ?? document;
    const element = editableElementRef.current;
    // selectionchange only fires on document — containment is checked inside the handler.
    ownerDoc.addEventListener('selectionchange', handleSelectionChange);
    // mousedown/mouseup scoped to the element to avoid reacting to clicks elsewhere.
    element?.addEventListener('mousedown', handleMouseDown);
    element?.addEventListener('mouseup', handleMouseUp);

    return () => {
      ownerDoc.removeEventListener('selectionchange', handleSelectionChange);
      element?.removeEventListener('mousedown', handleMouseDown);
      element?.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only needs to run on mount
  }, []);

  const handleMenuSelect = useStableCallback((option: MenuItem) => {
    if (!activeMenu || !activeTriggerToken || !tokens) {
      return;
    }

    shortcutsState.setCaretInTrigger(null);

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
    const announcement = isPinned
      ? i18nStrings?.tokenPinnedAriaLabel?.(result.insertedToken)
      : i18nStrings?.tokenInsertedAriaLabel?.(result.insertedToken);

    if (announcement) {
      announceTokenOperation(announcement);
    }

    onChange({ value, tokens: result.tokens });

    fireNonCancelableEvent(onMenuItemSelect, {
      menuId: activeMenu.id,
      option: option.option,
    });
  });

  const [menuItemsState, menuItemsHandlers] = useMenuItems({
    menu: activeMenu ?? { id: '', trigger: '', options: [] },
    filterText: menuFilterText,
    onSelectItem: handleMenuSelect,
  });

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

  const closeMenu = useStableCallback(() => {
    shortcutsState.menuJustClosed.current = shortcutsState.caretInTrigger;
    shortcutsState.setCaretInTrigger(null);
  });

  const handleEditableElementKeyDown = useStableCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    handleEditableKeyDown(event, {
      editableElement: editableElementRef.current,
      editableState,
      caretController: caretControllerRef.current,
      tokens,
      tokensToText,
      disabled,
      readOnly,
      i18nStrings,
      announceTokenOperation,
      getMenuOpen: () => menuStateRef.current.isOpen,
      getMenuItemsState: () => menuStateRef.current.itemsState,
      getMenuItemsHandlers: () => menuStateRef.current.itemsHandlers,
      getMenuStatusType: () => activeMenu?.statusType,
      closeMenu,
      onAction: onAction ? detail => fireNonCancelableEvent(onAction, detail) : undefined,
      onChange,
      markTokensAsSent,
      onKeyDown,
    });
  });

  const handleEditableElementFocus = useStableCallback(() => {
    if (onFocus) {
      fireNonCancelableEvent(onFocus);
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
    const ownerWindow = (editableElementRef.current?.ownerDocument ?? document).defaultView ?? window;
    const handleResize = () => adjustInputHeight();
    ownerWindow.addEventListener('resize', handleResize);
    return () => {
      ownerWindow.removeEventListener('resize', handleResize);
    };
  }, [adjustInputHeight, editableElementRef]);

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
    const itemsLoaded =
      menuIsOpen && prevMenuOpenRef.current && prevItemsLengthRef.current === 0 && menuItemsState.items.length > 0;

    if ((justOpened || itemsLoaded) && menuItemsHandlers && menuItemsState && menuItemsState.items.length > 0) {
      // Reset highlight so goHomeWithKeyboard triggers a state change even at index 0
      menuItemsHandlers.resetHighlightWithKeyboard();
      setTimeout(() => {
        menuItemsHandlers?.goHomeWithKeyboard();
      }, NEXT_TICK_TIMEOUT);
    }

    prevMenuOpenRef.current = menuIsOpen;
    prevItemsLengthRef.current = menuItemsState?.items.length ?? 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only needs to react to menu open/close and item count changes
  }, [menuIsOpen, menuItemsState.items.length]);

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
    // When disabled, omit tabIndex entirely so the div is not focusable at all.
    tabIndex: disabled ? undefined : 0,
    onKeyDown: handleEditableElementKeyDown,
    onKeyUp: onKeyUp && (event => fireKeyboardEvent(onKeyUp, event)),
    onBlur: handleEditableElementBlur,
    onFocus: handleEditableElementFocus,
    onCopy: (event: React.ClipboardEvent) => {
      if (editableElementRef.current) {
        handleClipboardEvent(event, editableElementRef.current, false);
      }
    },
    onCut: (event: React.ClipboardEvent) => {
      if (editableElementRef.current) {
        handleClipboardEvent(event, editableElementRef.current, true);
      }
    },
    onPaste: (event: React.ClipboardEvent) => {
      event.preventDefault();
      if (disabled || readOnly) {
        return;
      }
      const text = event.clipboardData.getData('text/plain');
      if (!text || !editableElementRef.current || !caretControllerRef.current) {
        return;
      }
      const cc = caretControllerRef.current;
      // Pass undefined for caretStart/caretEnd — let insertText calculate
      // the position after the selection is deleted by replaceSelection.
      insertTextIntoContentEditable(editableElementRef.current, text, undefined, undefined, cc, true);
    },
  };

  const portals = portalContainers.map(container =>
    ReactDOM.createPortal(
      <Token key={container.id} variant="inline" label={container.label} disabled={!!disabled} readOnly={!!readOnly} />,
      container.element
    )
  );

  return {
    portalContainersRef,
    portalContainers,
    portals,
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
