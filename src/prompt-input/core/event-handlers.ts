// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PromptInputProps } from '../interfaces';
import { EditableState } from '../tokens/use-editable-tokens';
import { ELEMENT_TYPES } from './constants';
import { getTokenCursorLength, positionAfter, positionBefore } from './cursor-manager';
import { calculateTokenPosition, setCursorOverride } from './cursor-utils';
import {
  createParagraph,
  createTrailingBreak,
  findAllParagraphs,
  getTokenType,
  insertAfter,
  isElementEffectivelyEmpty,
} from './dom-utils';
import { MenuItemsHandlers, MenuItemsState } from './menu-state';
import { extractTokensFromDOM, getPromptText } from './token-operations';
import { findAdjacentToken } from './token-utils';
import { isBreakToken, isHTMLElement, isReferenceToken, isTextNode, isTextToken, isTriggerToken } from './type-guards';

// TYPES

export type { EditableState };

export interface KeyboardHandlerDeps {
  getMenuOpen: () => boolean;
  getMenuItemsState: () => MenuItemsState | null;
  getMenuItemsHandlers: () => MenuItemsHandlers | null;
  onAction?: (detail: PromptInputProps.ActionDetail) => void;
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
  tokens?: readonly PromptInputProps.InputToken[];
  closeMenu: () => void;
  announceTokenOperation?: (message: string) => void;
  i18nStrings?: PromptInputProps.I18nStrings;
  disabled?: boolean;
  readOnly?: boolean;
}

// KEYBOARD HANDLERS

export function createKeyboardHandlers(deps: KeyboardHandlerDeps) {
  function handleMenuNavigation(event: React.KeyboardEvent): boolean {
    const menuItemsState = deps.getMenuItemsState();
    const menuItemsHandlers = deps.getMenuItemsHandlers();
    const menuOpen = deps.getMenuOpen();

    if (!menuOpen || !menuItemsHandlers || !menuItemsState) {
      return false;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();

      const delta = event.key === 'ArrowDown' ? 1 : -1;
      menuItemsHandlers.moveHighlightWithKeyboard(delta);
      return true;
    }

    if ((event.key === 'Enter' || event.key === 'Tab') && !event.shiftKey) {
      event.preventDefault();
      return menuItemsHandlers.selectHighlightedOptionWithKeyboard();
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      deps.closeMenu();
      return true;
    }

    return false;
  }

  function handleEnterKey(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }

    // Don't submit if disabled or readonly (match textarea behavior)
    if (deps.disabled || deps.readOnly) {
      event.preventDefault();
      return;
    }

    const currentTarget = event.currentTarget;
    if (!isHTMLElement(currentTarget)) {
      return;
    }

    const form = currentTarget.closest('form');
    if (form && !event.isDefaultPrevented()) {
      form.requestSubmit();
    }
    event.preventDefault();

    const plainText = deps.tokensToText ? deps.tokensToText(deps.tokens ?? []) : getPromptText(deps.tokens ?? []);

    if (deps.onAction) {
      deps.onAction({ value: plainText, tokens: [...(deps.tokens ?? [])] });
    }
  }

  return {
    handleMenuNavigation,
    handleEnterKey,
  };
}

// PARAGRAPH OPERATIONS

function findParagraphAncestor(node: Node): HTMLElement | null {
  let current: Node | null = node;
  while (current && current.nodeName !== 'P') {
    current = current.parentNode;
  }
  return isHTMLElement(current) ? current : null;
}

export function splitParagraphAtCursor(
  editableElement: HTMLDivElement,
  state: EditableState,
  suppressInputEvent = false
): void {
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return;
  }

  const range = selection.getRangeAt(0);
  const currentP = findParagraphAncestor(range.startContainer);

  if (!currentP?.parentNode) {
    return;
  }

  // Extract content after cursor
  const afterRange = document.createRange();
  afterRange.setStart(range.startContainer, range.startOffset);
  afterRange.setEndAfter(currentP.lastChild || currentP);
  const afterContent = afterRange.extractContents();

  // Create new paragraph with the extracted content
  const newP = createParagraph();
  newP.appendChild(afterContent);

  // Ensure both paragraphs have proper structure
  if (isElementEffectivelyEmpty(newP)) {
    newP.appendChild(createTrailingBreak());
  }

  if (isElementEffectivelyEmpty(currentP)) {
    currentP.appendChild(createTrailingBreak());
  }

  currentP.parentNode.insertBefore(newP, currentP.nextSibling);

  // Calculate cursor position for the new paragraph (at its start)
  const paragraphs = findAllParagraphs(editableElement);
  const currentPIndex = paragraphs.findIndex(p => p === currentP);

  let cursorPosition = 0;
  const tokens = extractTokensFromDOM(editableElement);
  let breakCount = 0;

  for (const token of tokens) {
    if (isBreakToken(token)) {
      breakCount++;
      cursorPosition += 1;
      if (breakCount > currentPIndex) {
        break;
      }
    } else {
      cursorPosition += getTokenCursorLength(token);
    }
  }

  state.skipCursorRestore = false;
  state.targetParagraphId = newP.getAttribute('data-paragraph-id');
  state.cursorPositionOverride = {
    cursorPosition,
    paragraphId: newP.getAttribute('data-paragraph-id'),
  };

  if (!suppressInputEvent) {
    editableElement.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

// TOKEN DELETION HELPERS

interface TokenElementResult {
  targetElement: HTMLElement | null;
  wrapperElement: HTMLElement | null;
}

function findTokenElementForDeletion(container: Node, offset: number, isBackspace: boolean): TokenElementResult {
  let adjacent: Node | null = null;

  if (isTextNode(container)) {
    const isAtEdge = isBackspace ? offset === 0 : offset === (container.textContent?.length || 0);
    if (isAtEdge) {
      adjacent = isBackspace ? container.previousSibling : container.nextSibling;
    }
  } else if (isHTMLElement(container)) {
    const childIndex = isBackspace ? offset - 1 : offset;
    adjacent = container.childNodes[childIndex];
  }

  if (isHTMLElement(adjacent)) {
    const adjacentType = getTokenType(adjacent);
    if (adjacentType === ELEMENT_TYPES.REFERENCE || adjacentType === ELEMENT_TYPES.PINNED) {
      return {
        wrapperElement: adjacent,
        targetElement: adjacent,
      };
    }
  }

  return { targetElement: null, wrapperElement: null };
}

function isValidTokenForDeletion(element: HTMLElement | null): boolean {
  if (!element) {
    return false;
  }
  const tokenType = getTokenType(element);
  return tokenType === ELEMENT_TYPES.REFERENCE || tokenType === ELEMENT_TYPES.PINNED;
}

export function handleReferenceTokenDeletion(
  event: React.KeyboardEvent<HTMLDivElement>,
  isBackspace: boolean,
  editableElement: HTMLDivElement,
  state: EditableState,
  announceTokenOperation?: (message: string) => void,
  i18nStrings?: PromptInputProps.I18nStrings
): boolean {
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return false;
  }

  const range = selection.getRangeAt(0);

  // If there's a selection range (not just a cursor), let the browser handle it
  // The input event will trigger token extraction which will properly handle reference removal
  if (!range.collapsed) {
    return false;
  }

  const { targetElement, wrapperElement } = findTokenElementForDeletion(
    range.startContainer,
    range.startOffset,
    isBackspace
  );

  const tokenElement = targetElement || wrapperElement || null;

  if (!isValidTokenForDeletion(tokenElement)) {
    return false;
  }

  event.preventDefault();

  // Announce token removal
  const tokenLabel = tokenElement!.textContent?.trim() || '';
  if (announceTokenOperation && tokenLabel) {
    const announcement =
      i18nStrings?.tokenRemovedAriaLabel?.({ label: tokenLabel, value: tokenLabel }) ?? `${tokenLabel} removed`;
    announceTokenOperation(announcement);
  }

  const elementToRemove = (wrapperElement || tokenElement)!;
  const paragraph = elementToRemove.parentNode;
  if (!isHTMLElement(paragraph)) {
    return true;
  }

  state.skipNextZwnjUpdate = true;
  state.skipNormalization = true;

  // Find the reference token's position in the token array
  // This gives us the correct position independent of DOM structure
  const instanceId = tokenElement!.getAttribute('data-id');
  const tokens = extractTokensFromDOM(editableElement);
  const referenceIndex = tokens.findIndex(t => isReferenceToken(t) && t.id === instanceId);

  let cursorPosition = 0;
  if (referenceIndex >= 0) {
    // Calculate position up to (but not including) the reference
    cursorPosition = calculateTokenPosition(tokens, referenceIndex, false);
  }

  // Store the position for restoration after re-render
  setCursorOverride(state, cursorPosition);
  state.isDeleteOperation = true; // Mark as deletion for Safari ghost cursor fix

  elementToRemove.remove();
  editableElement.dispatchEvent(new Event('input', { bubbles: true }));

  return true;
}

// ARROW KEY NAVIGATION

function handleArrowNavigation(
  event: React.KeyboardEvent<HTMLDivElement>,
  container: Node,
  offset: number,
  skipNormalizationRef: React.MutableRefObject<boolean>
): boolean {
  const direction = event.key === 'ArrowLeft' ? 'left' : 'right';
  const { sibling, isReferenceToken } = findAdjacentToken(container, offset, direction);

  if (isReferenceToken && sibling) {
    event.preventDefault();
    skipNormalizationRef.current = true;
    direction === 'left' ? positionBefore(sibling) : positionAfter(sibling);
    return true;
  }

  return false;
}

export function handleArrowKeyNavigation(
  event: React.KeyboardEvent<HTMLDivElement>,
  skipNormalizationRef: React.MutableRefObject<boolean>
): boolean {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
    return false;
  }

  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return false;
  }

  const range = selection.getRangeAt(0);

  // Handle Shift+Arrow for selection across reference tokens
  if (event.shiftKey) {
    return handleShiftArrowAcrossTokens(event, selection, range);
  }

  return handleArrowNavigation(event, range.startContainer, range.startOffset, skipNormalizationRef);
}

function handleShiftArrowAcrossTokens(
  event: React.KeyboardEvent<HTMLDivElement>,
  selection: Selection,
  range: Range
): boolean {
  const isLeftArrow = event.key === 'ArrowLeft';

  // For Shift+Arrow, we need to check the moving end of the selection
  // Left arrow moves the start, right arrow moves the end
  const relevantContainer = isLeftArrow ? range.startContainer : range.endContainer;
  const relevantOffset = isLeftArrow ? range.startOffset : range.endOffset;

  // Check if we're immediately adjacent to a reference token (treating it as atomic)
  let sibling: Node | null = null;

  if (isTextNode(relevantContainer)) {
    // In text node - check if at start/end boundary
    if (isLeftArrow && relevantOffset === 0) {
      sibling = relevantContainer.previousSibling;
    } else if (!isLeftArrow && relevantOffset === (relevantContainer.textContent?.length || 0)) {
      sibling = relevantContainer.nextSibling;
    }
  } else if (isHTMLElement(relevantContainer)) {
    // In element node (paragraph) - check adjacent child
    if (isLeftArrow && relevantOffset > 0) {
      sibling = relevantContainer.childNodes[relevantOffset - 1];
    } else if (!isLeftArrow && relevantOffset < relevantContainer.childNodes.length) {
      sibling = relevantContainer.childNodes[relevantOffset];
    }
  }

  if (!sibling) {
    return false;
  }

  const siblingType = isHTMLElement(sibling) ? getTokenType(sibling) : null;
  if (siblingType === ELEMENT_TYPES.REFERENCE || siblingType === ELEMENT_TYPES.PINNED) {
    event.preventDefault();

    // Extend selection to include the entire reference token (atomic)
    const newRange = range.cloneRange();
    if (isLeftArrow) {
      newRange.setStartBefore(sibling);
    } else {
      newRange.setEndAfter(sibling);
    }

    selection.removeAllRanges();
    selection.addRange(newRange);
    return true;
  }

  return false;
}

// CURSOR NORMALIZATION

function normalizeCursorInCursorSpot(container: Node): void {
  if (!isTextNode(container)) {
    return;
  }

  const parent = container.parentElement;
  if (!parent) {
    return;
  }

  const parentType = getTokenType(parent);
  if (parentType !== ELEMENT_TYPES.CURSOR_SPOT_BEFORE && parentType !== ELEMENT_TYPES.CURSOR_SPOT_AFTER) {
    return;
  }

  const wrapper = parent.parentElement;
  const wrapperType = wrapper ? getTokenType(wrapper) : null;
  if (!wrapper || (wrapperType !== ELEMENT_TYPES.REFERENCE && wrapperType !== ELEMENT_TYPES.PINNED)) {
    return;
  }

  const paragraph = wrapper.parentElement;
  if (paragraph?.nodeName !== 'P') {
    return;
  }

  parentType === ELEMENT_TYPES.CURSOR_SPOT_BEFORE ? positionBefore(wrapper) : positionAfter(wrapper);
}

export function createCursorNormalizationHandler(
  editableElementRef: React.RefObject<HTMLDivElement>,
  skipNormalizationRef: React.MutableRefObject<boolean>,
  state: EditableState
): () => void {
  return () => {
    if (skipNormalizationRef.current) {
      skipNormalizationRef.current = false;
      return;
    }

    if (state.skipNormalization) {
      state.skipNormalization = false;
      return;
    }

    const editableElement = editableElementRef.current;
    if (!editableElement) {
      return;
    }

    const selection = window.getSelection();
    if (!selection?.rangeCount) {
      return;
    }

    const range = selection.getRangeAt(0);

    // Skip normalization if there's an active selection (not just a collapsed cursor)
    // This allows text selection including reference tokens to work correctly
    if (!range.collapsed) {
      return;
    }

    normalizeCursorInCursorSpot(range.startContainer);
  };
}

// SPACE AFTER CLOSED TRIGGER

export function handleSpaceAfterClosedTrigger(
  event: React.KeyboardEvent<HTMLDivElement>,
  editableElement: HTMLDivElement,
  menuOpen: boolean,
  triggerValueWhenClosed: string,
  editableState: EditableState,
  menus?: readonly PromptInputProps.MenuDefinition[]
): boolean {
  // Only handle space key when menu is closed and we have a saved trigger length
  if (event.key !== ' ' || menuOpen || !triggerValueWhenClosed) {
    return false;
  }

  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return false;
  }

  const range = selection.getRangeAt(0);
  if (!range.collapsed) {
    return false;
  }

  // Check if cursor is at the end of a trigger element
  let triggerElement: HTMLElement | null = null;
  let cursorAtEnd = false;

  if (isTextNode(range.startContainer)) {
    const parent = range.startContainer.parentElement;
    const parentType = parent ? getTokenType(parent) : null;

    if (parentType === ELEMENT_TYPES.TRIGGER && parent) {
      triggerElement = parent;
      const textLength = range.startContainer.textContent?.length || 0;
      cursorAtEnd = range.startOffset === textLength;

      // Extract filter text (everything after trigger char)
      const fullText = triggerElement.textContent || '';
      const filterText = fullText.substring(1);

      // Only handle if filter text matches saved length (space hasn't been added yet)
      // If it's longer, the space was already added and we shouldn't handle it again
      if (filterText.length !== triggerValueWhenClosed.length) {
        return false;
      }
    }
  }

  if (!triggerElement || !cursorAtEnd) {
    return false;
  }

  // Prevent default space insertion
  event.preventDefault();

  // Get the paragraph containing the trigger
  const paragraph = triggerElement.parentElement;
  if (!paragraph || paragraph.nodeName !== 'P') {
    return false;
  }

  // Insert space after trigger
  const spaceNode = document.createTextNode(' ');
  insertAfter(spaceNode, triggerElement);

  // Calculate cursor position: after trigger + after space
  const tokens = extractTokensFromDOM(editableElement, menus);

  // Find the trigger element's ID to locate the correct trigger token
  const triggerElementId = triggerElement.getAttribute('data-id');

  let cursorPosition = 0;
  let foundTargetTrigger = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Find the specific trigger that matches our trigger element
    if (isTriggerToken(token) && !foundTargetTrigger) {
      // Match by ID if available, otherwise by being the first unmatched trigger
      if (triggerElementId && token.id === triggerElementId) {
        foundTargetTrigger = true;
        cursorPosition += getTokenCursorLength(token);

        // Check if next token is the space we just inserted
        const nextToken = tokens[i + 1];
        if (nextToken && isTextToken(nextToken) && nextToken.value.startsWith(' ')) {
          cursorPosition += 1; // Position after the space
          break;
        }
      } else if (!triggerElementId) {
        // Fallback: use first trigger
        foundTargetTrigger = true;
        cursorPosition += getTokenCursorLength(token);

        const nextToken = tokens[i + 1];
        if (nextToken && isTextToken(nextToken) && nextToken.value.startsWith(' ')) {
          cursorPosition += 1;
          break;
        }
      } else {
        // Not the target trigger, keep counting
        cursorPosition += getTokenCursorLength(token);
      }
    } else {
      cursorPosition += getTokenCursorLength(token);
    }
  }

  // Store position for unified restoration
  editableState.cursorPositionOverride = {
    cursorPosition,
    paragraphId: null,
  };
  editableState.skipCursorRestore = false;

  // Position cursor immediately to prevent it from jumping to position 0
  // This prevents menu from flickering open
  const cursorRange = document.createRange();
  const spaceTextNode = spaceNode;
  cursorRange.setStart(spaceTextNode, 1); // After the space
  cursorRange.collapse(true);
  const sel = window.getSelection();
  if (sel) {
    sel.removeAllRanges();
    sel.addRange(cursorRange);
  }

  // Trigger input event to extract tokens and update state
  editableElement.dispatchEvent(new Event('input', { bubbles: true }));

  return true;
}
