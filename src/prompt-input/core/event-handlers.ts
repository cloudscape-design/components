// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PromptInputProps } from '../interfaces';
import { ELEMENT_TYPES } from './constants';
import { getTokenCursorLength, positionAfter, positionBefore } from './cursor-manager';
import { MenuItemsHandlers, MenuItemsState } from './menu-state';
import { extractTokensFromDOM } from './token-extractor';
import { isBRElement, isHTMLElement, isReferenceToken, isTextNode, isTextToken, isTriggerToken } from './type-guards';
import {
  createParagraph,
  createTrailingBreak,
  findAllParagraphs,
  getTokenType,
  insertAfter,
  isElementEffectivelyEmpty,
} from './utils';

// TYPES

export interface KeyboardHandlerDeps {
  getMenuOpen: () => boolean;
  getMenuItemsState: () => MenuItemsState | null;
  getMenuItemsHandlers: () => MenuItemsHandlers | null;
  onAction?: (detail: PromptInputProps.ActionDetail) => void;
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
  tokens?: readonly PromptInputProps.InputToken[];
  getPromptText: (tokens: readonly PromptInputProps.InputToken[]) => string;
  closeMenu: () => void;
  announceTokenOperation?: (message: string) => void;
  i18nStrings?: PromptInputProps.I18nStrings;
}

interface DeletionContext {
  cursorPosition: number;
  paragraphId: string | null;
}

/**
 * Shared state for coordinating between event handlers and input processing
 */
export interface EditableState {
  skipNextZwnjUpdate: boolean;
  skipNormalization: boolean;
  skipCursorRestore: boolean;
  targetParagraphId: string | null;
  deletionContext: DeletionContext | null;
  menuSelectionTokenId: string | null;
  menuSelectionIsPinned: boolean;
}

export function createEditableState(): EditableState {
  return {
    skipNextZwnjUpdate: false,
    skipNormalization: false,
    skipCursorRestore: false,
    targetParagraphId: null,
    deletionContext: null,
    menuSelectionTokenId: null,
    menuSelectionIsPinned: false,
  };
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

    const currentTarget = event.currentTarget;
    if (!isHTMLElement(currentTarget)) {
      return;
    }

    const form = currentTarget.closest('form');
    if (form && !event.isDefaultPrevented()) {
      form.requestSubmit();
    }
    event.preventDefault();

    const plainText = deps.tokensToText ? deps.tokensToText(deps.tokens ?? []) : deps.getPromptText(deps.tokens ?? []);

    if (deps.onAction) {
      deps.onAction({ value: plainText, tokens: [...(deps.tokens ?? [])] });
    }
  }

  return {
    handleMenuNavigation,
    handleEnterKey,
  };
}

// PARAGRAPH MERGING

export function handleBackspaceAtParagraphStart(
  event: React.KeyboardEvent<HTMLDivElement>,
  editableElement: HTMLDivElement,
  tokens: readonly PromptInputProps.InputToken[],
  tokensToText: ((tokens: readonly PromptInputProps.InputToken[]) => string) | undefined,
  getPromptText: (tokens: readonly PromptInputProps.InputToken[]) => string,
  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void,
  setCursorPosition: (element: HTMLElement, position: number) => void,
  state?: EditableState
): boolean {
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return false;
  }

  const range = selection.getRangeAt(0);

  if (range.startOffset !== 0 || range.startContainer.nodeName !== 'P') {
    return false;
  }

  const paragraphs = findAllParagraphs(editableElement);
  const currentP = range.startContainer;
  const pIndex = Array.from(paragraphs).indexOf(currentP as HTMLParagraphElement);

  if (pIndex <= 0) {
    return false;
  }

  event.preventDefault();

  let breakCount = 0;
  let cursorPosition = 0;

  const newTokens = tokens.filter(token => {
    if (token.type === 'break') {
      breakCount++;
      if (breakCount === pIndex) {
        return false;
      }
      cursorPosition += 1;
    } else {
      if (breakCount < pIndex) {
        cursorPosition += getTokenCursorLength(token);
      }
    }
    return true;
  });

  const value = tokensToText ? tokensToText(newTokens) : getPromptText(newTokens);
  onChange({ value, tokens: newTokens });

  // Store the target position for restoration after re-render
  if (state) {
    state.deletionContext = {
      cursorPosition,
      paragraphId: null,
    };
    state.skipCursorRestore = false;
  } else {
    // Fallback for backward compatibility
    requestAnimationFrame(() => {
      setCursorPosition(editableElement, cursorPosition);
    });
  }

  return true;
}

export function handleDeleteAtParagraphEnd(
  event: React.KeyboardEvent<HTMLDivElement>,
  editableElement: HTMLDivElement,
  tokens: readonly PromptInputProps.InputToken[],
  tokensToText: ((tokens: readonly PromptInputProps.InputToken[]) => string) | undefined,
  getPromptText: (tokens: readonly PromptInputProps.InputToken[]) => string,
  cursorPosition: number,
  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void,
  setCursorPosition: (element: HTMLElement, position: number) => void,
  state?: EditableState
): boolean {
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return false;
  }

  const range = selection.getRangeAt(0);
  const container = range.startContainer;

  let isAtEndOfParagraph = false;
  let currentP: HTMLParagraphElement | null = null;

  if (container.nodeName === 'P') {
    currentP = container as HTMLParagraphElement;
    const hasOnlyTrailingBR =
      currentP.childNodes.length === 1 && isBRElement(currentP.firstChild, ELEMENT_TYPES.TRAILING_BREAK);
    isAtEndOfParagraph = hasOnlyTrailingBR || range.startOffset === currentP.childNodes.length;
  } else if (isTextNode(container)) {
    isAtEndOfParagraph = range.startOffset === (container.textContent?.length || 0) && !container.nextSibling;
    let node: Node | null = container;
    while (node && node.nodeName !== 'P') {
      node = node.parentNode;
    }
    currentP = node as HTMLParagraphElement;
  }

  if (!isAtEndOfParagraph || !currentP) {
    return false;
  }

  const paragraphs = findAllParagraphs(editableElement);
  const pIndex = Array.from(paragraphs).indexOf(currentP);

  if (pIndex < 0 || pIndex >= paragraphs.length - 1) {
    return false;
  }

  event.preventDefault();

  let breakCount = 0;

  const newTokens = tokens.filter(token => {
    if (token.type === 'break') {
      breakCount++;
      return breakCount !== pIndex + 1;
    }
    return true;
  });

  const value = tokensToText ? tokensToText(newTokens) : getPromptText(newTokens);
  onChange({ value, tokens: newTokens });

  // Store the target position for restoration after re-render
  if (state) {
    state.deletionContext = {
      cursorPosition,
      paragraphId: null,
    };
    state.skipCursorRestore = false;
  } else {
    // Fallback for backward compatibility
    requestAnimationFrame(() => {
      setCursorPosition(editableElement, cursorPosition);
    });
  }

  return true;
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

  const afterRange = document.createRange();
  afterRange.setStart(range.startContainer, range.startOffset);
  afterRange.setEndAfter(currentP.lastChild || currentP);
  const afterContent = afterRange.extractContents();

  const newP = createParagraph();
  newP.appendChild(afterContent);

  if (isElementEffectivelyEmpty(newP)) {
    newP.appendChild(createTrailingBreak());
  }

  if (isElementEffectivelyEmpty(currentP)) {
    currentP.appendChild(createTrailingBreak());
  }

  currentP.parentNode.insertBefore(newP, currentP.nextSibling);

  // Calculate cursor position for the new paragraph (at its start)
  // Count all tokens before the split point
  const paragraphs = findAllParagraphs(editableElement);
  const currentPIndex = paragraphs.findIndex(p => p === currentP);

  let cursorPosition = 0;
  const tokens = extractTokensFromDOM(editableElement);
  let breakCount = 0;

  for (const token of tokens) {
    if (token.type === 'break') {
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
  // Store the calculated position for unified restoration
  state.deletionContext = {
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

function findTokenElementForBackspace(container: Node, offset: number): TokenElementResult {
  if (isTextNode(container) && offset === 0) {
    const prev = container.previousSibling;
    const prevType = isHTMLElement(prev) ? getTokenType(prev) : null;
    if (prevType === ELEMENT_TYPES.REFERENCE || prevType === ELEMENT_TYPES.PINNED) {
      return {
        wrapperElement: prev as HTMLElement,
        targetElement: prev as HTMLElement,
      };
    }
  } else if (isHTMLElement(container) && offset > 0) {
    const prev = container.childNodes[offset - 1];
    const prevType = isHTMLElement(prev) ? getTokenType(prev) : null;
    if (prevType === ELEMENT_TYPES.REFERENCE || prevType === ELEMENT_TYPES.PINNED) {
      return {
        wrapperElement: prev as HTMLElement,
        targetElement: prev as HTMLElement,
      };
    }
  }

  return { targetElement: null, wrapperElement: null };
}

function findTokenElementForDelete(container: Node, offset: number): TokenElementResult {
  if (isTextNode(container) && offset === (container.textContent?.length || 0)) {
    const next = container.nextSibling;
    const nextType = isHTMLElement(next) ? getTokenType(next) : null;
    if (nextType === ELEMENT_TYPES.REFERENCE || nextType === ELEMENT_TYPES.PINNED) {
      return {
        wrapperElement: next as HTMLElement,
        targetElement: next as HTMLElement,
      };
    }
  } else if (isHTMLElement(container)) {
    const next = container.childNodes[offset];
    const nextType = isHTMLElement(next) ? getTokenType(next) : null;
    if (nextType === ELEMENT_TYPES.REFERENCE || nextType === ELEMENT_TYPES.PINNED) {
      return {
        wrapperElement: next as HTMLElement,
        targetElement: next as HTMLElement,
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

  const { targetElement, wrapperElement } = isBackspace
    ? findTokenElementForBackspace(range.startContainer, range.startOffset)
    : findTokenElementForDelete(range.startContainer, range.startOffset);

  const finalTarget = targetElement || wrapperElement || null;

  if (!isValidTokenForDeletion(finalTarget)) {
    return false;
  }

  event.preventDefault();

  // Announce token removal
  const tokenLabel = finalTarget!.textContent?.trim() || '';
  if (announceTokenOperation && tokenLabel) {
    const announcement =
      i18nStrings?.tokenRemovedAriaLabel?.({ label: tokenLabel, value: tokenLabel }) ?? `${tokenLabel} removed`;
    announceTokenOperation(announcement);
  }

  const elementToRemove = (wrapperElement || finalTarget)!;
  const paragraph = elementToRemove.parentNode;
  if (!isHTMLElement(paragraph)) {
    return true;
  }

  state.skipNextZwnjUpdate = true;
  state.skipNormalization = true;

  // Find the reference token's position in the token array
  // This gives us the correct position independent of DOM structure
  const instanceId = finalTarget!.getAttribute('data-id');
  const tokens = extractTokensFromDOM(editableElement);
  const referenceIndex = tokens.findIndex(t => isReferenceToken(t) && t.id === instanceId);

  let targetCursorPosition = 0;
  if (referenceIndex >= 0) {
    // Calculate position up to (but not including) the reference
    for (let i = 0; i < referenceIndex; i++) {
      const token = tokens[i];
      if (isTextToken(token)) {
        targetCursorPosition += token.value.length;
      } else if (isTriggerToken(token)) {
        targetCursorPosition += 1 + token.value.length;
      } else {
        targetCursorPosition += 1; // other references
      }
    }

    // For delete, cursor stays before the reference (already calculated)
    // For backspace, cursor also goes before the reference (same position)
  }

  // Store the target position for restoration after re-render
  state.deletionContext = {
    cursorPosition: targetCursorPosition,
    paragraphId: null,
  };
  state.skipCursorRestore = false; // Allow restoration with our calculated position

  elementToRemove.remove();
  editableElement.dispatchEvent(new Event('input', { bubbles: true }));

  return true;
}

// ARROW KEY NAVIGATION

function handleArrowInElementNode(
  event: React.KeyboardEvent<HTMLDivElement>,
  container: Node,
  offset: number,
  skipNormalizationRef: React.MutableRefObject<boolean>
): boolean {
  if (!isHTMLElement(container)) {
    return false;
  }

  const isLeftArrow = event.key === 'ArrowLeft';
  const sibling = isLeftArrow
    ? offset > 0
      ? container.childNodes[offset - 1]
      : container.previousSibling
    : offset < container.childNodes.length
      ? container.childNodes[offset]
      : container.nextSibling;

  const siblingType = isHTMLElement(sibling) ? getTokenType(sibling) : null;
  if (siblingType === ELEMENT_TYPES.REFERENCE || siblingType === ELEMENT_TYPES.PINNED) {
    event.preventDefault();
    skipNormalizationRef.current = true;
    isLeftArrow ? positionBefore(sibling as HTMLElement) : positionAfter(sibling as HTMLElement);
    return true;
  }

  return false;
}

function handleArrowInTextNode(
  event: React.KeyboardEvent<HTMLDivElement>,
  container: Node,
  offset: number,
  skipNormalizationRef: React.MutableRefObject<boolean>
): boolean {
  if (!isTextNode(container)) {
    return false;
  }

  const isLeftArrow = event.key === 'ArrowLeft';
  const isAtBoundary = isLeftArrow ? offset === 0 : offset === (container.textContent?.length || 0);

  if (!isAtBoundary) {
    return false;
  }

  const sibling = isLeftArrow ? container.previousSibling : container.nextSibling;

  const siblingType = isHTMLElement(sibling) ? getTokenType(sibling) : null;
  if (siblingType === ELEMENT_TYPES.REFERENCE || siblingType === ELEMENT_TYPES.PINNED) {
    event.preventDefault();
    skipNormalizationRef.current = true;
    isLeftArrow ? positionBefore(sibling as HTMLElement) : positionAfter(sibling as HTMLElement);
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
  const container = range.startContainer;
  const offset = range.startOffset;

  // Handle Shift+Arrow for selection across reference tokens
  if (event.shiftKey) {
    return handleShiftArrowAcrossTokens(event, selection, range);
  }

  return (
    handleArrowInElementNode(event, container, offset, skipNormalizationRef) ||
    handleArrowInTextNode(event, container, offset, skipNormalizationRef)
  );
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

// SELECTION NORMALIZATION

/**
 * Normalizes selection to include entire reference tokens when selection boundary is in cursor spots.
 * If selection starts or ends in a cursor spot, expands to include the entire reference wrapper.
 */
function normalizeSelectionAroundReferences(): void {
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return;
  }

  const range = selection.getRangeAt(0);

  // Only normalize non-collapsed selections
  if (range.collapsed) {
    return;
  }

  let modified = false;
  let newStartContainer = range.startContainer;
  let newStartOffset = range.startOffset;
  let newEndContainer = range.endContainer;
  let newEndOffset = range.endOffset;

  // Check if start is in a cursor spot
  if (isTextNode(range.startContainer)) {
    const startParent = range.startContainer.parentElement;
    if (startParent) {
      const startParentType = getTokenType(startParent);
      if (startParentType === ELEMENT_TYPES.CURSOR_SPOT_BEFORE || startParentType === ELEMENT_TYPES.CURSOR_SPOT_AFTER) {
        const wrapper = startParent.parentElement;
        const wrapperType = wrapper ? getTokenType(wrapper) : null;
        if (wrapper && (wrapperType === ELEMENT_TYPES.REFERENCE || wrapperType === ELEMENT_TYPES.PINNED)) {
          const paragraph = wrapper.parentElement;
          if (paragraph) {
            // If in cursor-spot-before, expand to before wrapper
            // If in cursor-spot-after, expand to after wrapper
            if (startParentType === ELEMENT_TYPES.CURSOR_SPOT_BEFORE) {
              newStartContainer = paragraph;
              newStartOffset = Array.from(paragraph.childNodes).indexOf(wrapper);
            } else {
              newStartContainer = paragraph;
              newStartOffset = Array.from(paragraph.childNodes).indexOf(wrapper) + 1;
            }
            modified = true;
          }
        }
      }
    }
  }

  // Check if end is in a cursor spot
  if (isTextNode(range.endContainer)) {
    const endParent = range.endContainer.parentElement;
    if (endParent) {
      const endParentType = getTokenType(endParent);
      if (endParentType === ELEMENT_TYPES.CURSOR_SPOT_BEFORE || endParentType === ELEMENT_TYPES.CURSOR_SPOT_AFTER) {
        const wrapper = endParent.parentElement;
        const wrapperType = wrapper ? getTokenType(wrapper) : null;
        if (wrapper && (wrapperType === ELEMENT_TYPES.REFERENCE || wrapperType === ELEMENT_TYPES.PINNED)) {
          const paragraph = wrapper.parentElement;
          if (paragraph) {
            // If in cursor-spot-before, expand to before wrapper
            // If in cursor-spot-after, expand to after wrapper
            if (endParentType === ELEMENT_TYPES.CURSOR_SPOT_BEFORE) {
              newEndContainer = paragraph;
              newEndOffset = Array.from(paragraph.childNodes).indexOf(wrapper);
            } else {
              newEndContainer = paragraph;
              newEndOffset = Array.from(paragraph.childNodes).indexOf(wrapper) + 1;
            }
            modified = true;
          }
        }
      }
    }
  }

  if (modified) {
    const newRange = document.createRange();
    newRange.setStart(newStartContainer, newStartOffset);
    newRange.setEnd(newEndContainer, newEndOffset);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
}

export function createSelectionNormalizationHandler(): () => void {
  return () => {
    normalizeSelectionAroundReferences();
  };
}

// SPACE AFTER CLOSED TRIGGER

export function handleSpaceAfterClosedTrigger(
  event: React.KeyboardEvent<HTMLDivElement>,
  editableElement: HTMLDivElement,
  menuOpen: boolean,
  triggerValueWhenClosed: string,
  editableState: EditableState
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

  // Calculate cursor position after the space for unified restoration
  const tokens = extractTokensFromDOM(editableElement);
  let cursorPosition = 0;
  let foundTrigger = false;

  for (const token of tokens) {
    if (token.type === 'trigger' && !foundTrigger) {
      cursorPosition += getTokenCursorLength(token) + 1; // trigger + space
      foundTrigger = true;
      break;
    }
    cursorPosition += getTokenCursorLength(token);
  }

  // Store position for unified restoration
  editableState.deletionContext = {
    cursorPosition,
    paragraphId: null,
  };
  editableState.skipCursorRestore = false;

  // Trigger input event to extract tokens and update state
  editableElement.dispatchEvent(new Event('input', { bubbles: true }));

  return true;
}
