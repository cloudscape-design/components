// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PromptInputProps } from '../interfaces';
import { EditableState } from '../tokens/use-editable-tokens';
import { ELEMENT_TYPES } from './constants';
import { CursorController, TOKEN_LENGTHS } from './cursor-controller';
import {
  createParagraph,
  createTrailingBreak,
  getTokenType,
  insertAfter,
  isElementEffectivelyEmpty,
} from './dom-utils';
import { MenuItemsHandlers, MenuItemsState } from './menu-state';
import { getPromptText } from './token-operations';
import { findAdjacentToken } from './token-utils';
import { handleSpaceInOpenMenu } from './trigger-utils';
import { isHTMLElement, isTextNode } from './type-guards';

// TYPES

export type { EditableState };

export interface KeyboardHandlerProps {
  getMenuOpen: () => boolean;
  getMenuItemsState: () => MenuItemsState | null;
  getMenuItemsHandlers: () => MenuItemsHandlers | null;
  getMenuStatusType?: () => PromptInputProps.MenuDefinition['statusType'];
  onAction?: (detail: PromptInputProps.ActionDetail) => void;
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
  tokens?: readonly PromptInputProps.InputToken[];
  closeMenu: () => void;
  announceTokenOperation?: (message: string) => void;
  i18nStrings?: PromptInputProps.I18nStrings;
  disabled?: boolean;
  readOnly?: boolean;
  editableState?: EditableState;
  editableElementRef?: React.RefObject<HTMLDivElement>;
  cursorController?: CursorController;
}

// KEYBOARD HANDLERS

export function createKeyboardHandlers(props: KeyboardHandlerProps) {
  function handleMenuNavigation(event: React.KeyboardEvent): boolean {
    const menuItemsState = props.getMenuItemsState();
    const menuItemsHandlers = props.getMenuItemsHandlers();
    const menuOpen = props.getMenuOpen();

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

    if (event.key === ' ') {
      return handleSpaceInOpenMenu(event, {
        menuItemsState,
        menuItemsHandlers,
        getMenuStatusType: props.getMenuStatusType,
        closeMenu: props.closeMenu,
        editableElementRef: props.editableElementRef,
        cursorController: props.cursorController,
        editableState: props.editableState,
      });
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      props.closeMenu();
      return true;
    }

    return false;
  }

  function handleEnterKey(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }

    // Don't submit if disabled or readonly (match textarea behavior)
    if (props.disabled || props.readOnly) {
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

    const plainText = props.tokensToText ? props.tokensToText(props.tokens ?? []) : getPromptText(props.tokens ?? []);

    if (props.onAction) {
      props.onAction({ value: plainText, tokens: [...(props.tokens ?? [])] });
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
  cursorController: CursorController | null,
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

  // Calculate new cursor position BEFORE input event (if controller exists)
  let newCursorPos: number | null = null;
  if (cursorController) {
    const currentPos = cursorController.getPosition();
    newCursorPos = currentPos + TOKEN_LENGTHS.LINE_BREAK;
  }

  if (!suppressInputEvent) {
    editableElement.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Position cursor at calculated position
  // The input event triggers onChange which uses flushSync to update DOM synchronously
  if (cursorController && newCursorPos !== null) {
    cursorController.setPosition(newCursorPos);
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
  announceTokenOperation: ((message: string) => void) | undefined,
  i18nStrings: PromptInputProps.I18nStrings | undefined,
  cursorController: CursorController | null
): boolean {
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return false;
  }

  const range = selection.getRangeAt(0);

  // If there's a selection range, delete it and trigger input event
  if (!range.collapsed) {
    event.preventDefault();

    // Delete the selected content
    range.deleteContents();

    // Trigger input event to extract tokens from updated DOM
    editableElement.dispatchEvent(new Event('input', { bubbles: true }));

    return true;
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

  // Calculate new cursor position BEFORE removing element
  let newCursorPos: number | null = null;
  if (cursorController) {
    const currentPos = cursorController.getPosition();
    // For Backspace, move cursor back; for Delete, keep cursor at same position
    newCursorPos = isBackspace ? Math.max(0, currentPos - TOKEN_LENGTHS.REFERENCE) : currentPos;
  }

  elementToRemove.remove();
  editableElement.dispatchEvent(new Event('input', { bubbles: true }));

  // Position cursor at calculated position
  // The input event triggers onChange which uses flushSync to update DOM synchronously
  if (cursorController && newCursorPos !== null) {
    cursorController.setPosition(newCursorPos);
  }

  return true;
}

// ARROW KEY NAVIGATION

function handleArrowNavigation(
  event: React.KeyboardEvent<HTMLDivElement>,
  container: Node,
  offset: number,
  cursorController: CursorController | null
): boolean {
  const direction = event.key === 'ArrowLeft' ? 'left' : 'right';
  const { sibling, isReferenceToken } = findAdjacentToken(container, offset, direction);

  if (isReferenceToken && sibling) {
    event.preventDefault();

    // Jump cursor over reference token
    if (direction === 'left') {
      // Check if we're in a text node at offset 0 OR in paragraph right after a reference
      // This means we just jumped here with right arrow, so only move back by 1
      const isInTextAtStart = isTextNode(container) && offset === 0;
      const isInParagraphAfterRef =
        isHTMLElement(container) &&
        offset > 0 &&
        isHTMLElement(container.childNodes[offset - 1]) &&
        (getTokenType(container.childNodes[offset - 1] as HTMLElement) === ELEMENT_TYPES.REFERENCE ||
          getTokenType(container.childNodes[offset - 1] as HTMLElement) === ELEMENT_TYPES.PINNED);

      const moveAmount = isInTextAtStart || isInParagraphAfterRef ? 1 : 2;
      cursorController?.moveBackward(moveAmount);
    } else {
      cursorController?.moveForward(TOKEN_LENGTHS.REFERENCE);
    }

    return true;
  }

  return false;
}

export function handleArrowKeyNavigation(
  event: React.KeyboardEvent<HTMLDivElement>,
  cursorController: CursorController | null
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

  return handleArrowNavigation(event, range.startContainer, range.startOffset, cursorController);
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

// SPACE AFTER CLOSED TRIGGER

export function handleSpaceAfterClosedTrigger(
  event: React.KeyboardEvent<HTMLDivElement>,
  editableElement: HTMLDivElement,
  menuOpen: boolean,
  ignoreCursorDetection: React.MutableRefObject<boolean>,
  cursorController: CursorController | null
): boolean {
  // Only handle space key when menu is closed
  // triggerValueWhenClosed can be empty string (trigger with no filter) or non-empty (trigger with filter)
  if (event.key !== ' ' || menuOpen) {
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
    }
  } else if (isHTMLElement(range.startContainer)) {
    // Cursor might be positioned in the paragraph after the trigger
    const container = range.startContainer;
    if (range.startOffset > 0) {
      const prevNode = container.childNodes[range.startOffset - 1];
      if (isHTMLElement(prevNode) && getTokenType(prevNode) === ELEMENT_TYPES.TRIGGER) {
        triggerElement = prevNode;
        cursorAtEnd = true;
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

  // Calculate new cursor position BEFORE input event (if controller exists)
  let newCursorPos: number | null = null;
  if (cursorController) {
    const currentPos = cursorController.getPosition();
    newCursorPos = currentPos + 1;
  }

  // Prevent cursor detection from reopening the menu
  ignoreCursorDetection.current = true;
  setTimeout(() => {
    ignoreCursorDetection.current = false;
  }, 100);

  // Trigger input event
  editableElement.dispatchEvent(new Event('input', { bubbles: true }));

  // Position cursor at calculated position
  // The input event triggers onChange which uses flushSync to update DOM synchronously
  if (cursorController && newCursorPos !== null) {
    cursorController.setPosition(newCursorPos);
  }

  return true;
}
