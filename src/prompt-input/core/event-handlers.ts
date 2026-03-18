// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isHTMLElement } from '../../internal/utils/dom';
import { PromptInputProps } from '../interfaces';
import { EditableState } from '../tokens/use-token-mode';
import { CaretController, TOKEN_LENGTHS } from './caret-controller';
import { ELEMENT_TYPES } from './constants';
import {
  createParagraph,
  createTrailingBreak,
  findAdjacentToken,
  findAllParagraphs,
  getTokenType,
  insertAfter,
  isCaretSpotType,
  isElementEffectivelyEmpty,
  isReferenceElementType,
} from './dom-utils';
import { MenuItemsHandlers, MenuItemsState } from './menu-state';
import { getPromptText } from './token-operations';
import { handleSpaceInOpenMenu } from './trigger-utils';
import { isBreakToken, isBRElement, isTextNode } from './type-guards';

/** Configuration for keyboard handlers created by createKeyboardHandlers. */
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
  caretController?: CaretController;
}

/** Creates keyboard event handlers for menu navigation and Enter-to-submit. */
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
        caretController: props.caretController,
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

function findParagraphAncestor(node: Node): HTMLElement | null {
  let current: Node | null = node;
  while (current && current.nodeName !== 'P') {
    current = current.parentNode;
  }
  return isHTMLElement(current) ? current : null;
}

/** Splits the current paragraph at the caret position, creating a new paragraph below. */
export function splitParagraphAtCaret(
  editableElement: HTMLDivElement,
  caretController: CaretController | null,
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

  // Extract everything after the caret into a document fragment
  const afterContent = afterRange.extractContents();

  const newP = createParagraph();
  newP.appendChild(afterContent);

  // Both paragraphs need valid content — empty ones get a trailing BR
  if (isElementEffectivelyEmpty(newP)) {
    newP.appendChild(createTrailingBreak());
  }

  if (isElementEffectivelyEmpty(currentP)) {
    currentP.appendChild(createTrailingBreak());
  }

  currentP.parentNode.insertBefore(newP, currentP.nextSibling);

  let newCaretPos: number | null = null;
  if (caretController) {
    const currentPos = caretController.getPosition();
    // Caret moves forward by one line break to land at the start of the new paragraph
    newCaretPos = currentPos + TOKEN_LENGTHS.LINE_BREAK;
  }

  // Fire input to trigger token extraction from the updated DOM
  if (!suppressInputEvent) {
    editableElement.dispatchEvent(new Event('input', { bubbles: true }));
  }

  if (caretController && newCaretPos !== null) {
    caretController.setPosition(newCaretPos);
  }
}

interface TokenElementResult {
  targetElement: HTMLElement | null;
  wrapperElement: HTMLElement | null;
}

function findTokenElementForDeletion(container: Node, offset: number, isBackspace: boolean): TokenElementResult {
  let adjacent: Node | null = null;

  if (isTextNode(container)) {
    // At the edge of a text node, check the sibling in the deletion direction
    const isAtEdge = isBackspace ? offset === 0 : offset === (container.textContent?.length || 0);
    if (isAtEdge) {
      adjacent = isBackspace ? container.previousSibling : container.nextSibling;
    }
  } else if (isHTMLElement(container)) {
    // At paragraph level, the child at offset-1 (backspace) or offset (delete) is the target
    const childIndex = isBackspace ? offset - 1 : offset;
    adjacent = container.childNodes[childIndex];
  }

  if (isHTMLElement(adjacent)) {
    const adjacentType = getTokenType(adjacent);
    if (isReferenceElementType(adjacentType)) {
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
  return isReferenceElementType(tokenType);
}

/**
 * Handles Backspace/Delete when adjacent to a reference token.
 * @returns true if a token deletion was handled
 */
export function handleReferenceTokenDeletion(
  event: React.KeyboardEvent<HTMLDivElement>,
  isBackspace: boolean,
  editableElement: HTMLDivElement,
  state: EditableState,
  announceTokenOperation: ((message: string) => void) | undefined,
  i18nStrings: PromptInputProps.I18nStrings | undefined,
  caretController: CaretController | null
): boolean {
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return false;
  }

  const range = selection.getRangeAt(0);

  if (!range.collapsed) {
    event.preventDefault();

    range.deleteContents();

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

  // Prevent the next input handler from processing ZWNJ changes left behind by the removed element
  state.skipNextZwnjUpdate = true;

  let newCaretPos: number | null = null;
  if (caretController) {
    const currentPos = caretController.getPosition();
    // Backspace: move caret back by the reference length. Delete: stay in place.
    newCaretPos = isBackspace ? Math.max(0, currentPos - TOKEN_LENGTHS.REFERENCE) : currentPos;
  }

  // Remove the element first, then fire input to re-extract tokens
  elementToRemove.remove();
  editableElement.dispatchEvent(new Event('input', { bubbles: true }));

  if (caretController && newCaretPos !== null) {
    caretController.setPosition(newCaretPos);
  }

  return true;
}

function handleArrowNavigation(
  event: React.KeyboardEvent<HTMLDivElement>,
  container: Node,
  offset: number,
  caretController: CaretController | null
): boolean {
  const direction = event.key === 'ArrowLeft' ? 'left' : 'right';
  const { sibling, isReferenceToken } = findAdjacentToken(container, offset, direction);

  if (isReferenceToken && sibling) {
    event.preventDefault();

    if (direction === 'left') {
      caretController?.moveBackward(TOKEN_LENGTHS.REFERENCE);
    } else {
      caretController?.moveForward(TOKEN_LENGTHS.REFERENCE);
    }

    return true;
  }

  return false;
}

/** Handles left/right arrow key navigation, jumping over atomic reference tokens. */
export function handleArrowKeyNavigation(
  event: React.KeyboardEvent<HTMLDivElement>,
  caretController: CaretController | null
): boolean {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
    return false;
  }

  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return false;
  }

  const range = selection.getRangeAt(0);

  if (range.collapsed) {
    const container = range.startContainer;
    if (isTextNode(container)) {
      const parent = container.parentElement;
      if (parent) {
        const parentType = getTokenType(parent);
        if (isCaretSpotType(parentType)) {
          // Caret landed in a caret spot — normalize it out before processing the arrow key
          const wrapper = parent.parentElement;
          const wrapperType = wrapper ? getTokenType(wrapper) : null;
          if (wrapper && isReferenceElementType(wrapperType)) {
            const paragraph = wrapper.parentElement;
            if (paragraph) {
              const wrapperIndex = Array.from(paragraph.childNodes).indexOf(wrapper);

              let newOffset: number;
              if (parentType === ELEMENT_TYPES.CURSOR_SPOT_BEFORE) {
                newOffset = event.key === 'ArrowLeft' ? wrapperIndex : wrapperIndex + 1;
              } else {
                newOffset = event.key === 'ArrowLeft' ? wrapperIndex : wrapperIndex + 1;
              }

              event.preventDefault();
              const newRange = document.createRange();
              newRange.setStart(paragraph, newOffset);
              newRange.collapse(true);
              selection.removeAllRanges();
              selection.addRange(newRange);
              return true;
            }
          }
        }
      }
    }
  }

  if (event.shiftKey) {
    return handleShiftArrowAcrossTokens(event, selection, range);
  }

  return handleArrowNavigation(event, range.startContainer, range.startOffset, caretController);
}

function handleShiftArrowAcrossTokens(
  event: React.KeyboardEvent<HTMLDivElement>,
  selection: Selection,
  range: Range
): boolean {
  const isLeftArrow = event.key === 'ArrowLeft';

  // Shift+Arrow extends the selection — left extends the start, right extends the end
  const relevantContainer = isLeftArrow ? range.startContainer : range.endContainer;
  const relevantOffset = isLeftArrow ? range.startOffset : range.endOffset;

  // Check if the extending edge is adjacent to a reference token
  let sibling: Node | null = null;

  if (isTextNode(relevantContainer)) {
    if (isLeftArrow && relevantOffset === 0) {
      sibling = relevantContainer.previousSibling;
    } else if (!isLeftArrow && relevantOffset === (relevantContainer.textContent?.length || 0)) {
      sibling = relevantContainer.nextSibling;
    }
  } else if (isHTMLElement(relevantContainer)) {
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
  if (isReferenceElementType(siblingType)) {
    event.preventDefault();

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

/**
 * Handles space key after a closed trigger element, inserting the space outside the trigger.
 * @returns true if handled
 */
export function handleSpaceAfterClosedTrigger(
  event: React.KeyboardEvent<HTMLDivElement>,
  editableElement: HTMLDivElement,
  menuOpen: boolean,
  ignoreCaretDetection: React.MutableRefObject<boolean>,
  caretController: CaretController | null
): boolean {
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

  let triggerElement: HTMLElement | null = null;
  let caretAtEnd = false;

  // Case 1: Caret is inside the trigger's text node
  if (isTextNode(range.startContainer)) {
    const parent = range.startContainer.parentElement;
    const parentType = parent ? getTokenType(parent) : null;

    if (parentType === ELEMENT_TYPES.TRIGGER && parent) {
      triggerElement = parent;
      const textLength = range.startContainer.textContent?.length || 0;
      caretAtEnd = range.startOffset === textLength;
    }
  } else if (isHTMLElement(range.startContainer)) {
    // Case 2: Caret is at paragraph level, right after the trigger child
    const container = range.startContainer;
    if (range.startOffset > 0) {
      const prevNode = container.childNodes[range.startOffset - 1];
      if (isHTMLElement(prevNode) && getTokenType(prevNode) === ELEMENT_TYPES.TRIGGER) {
        triggerElement = prevNode;
        caretAtEnd = true;
      }
    }
  }

  if (!triggerElement || !caretAtEnd) {
    return false;
  }

  event.preventDefault();

  const paragraph = triggerElement.parentElement;
  if (!paragraph || paragraph.nodeName !== 'P') {
    return false;
  }

  const spaceNode = document.createTextNode(' ');
  insertAfter(spaceNode, triggerElement);

  let newCaretPos: number | null = null;
  if (caretController) {
    const currentPos = caretController.getPosition();
    newCaretPos = currentPos + 1;
  }

  ignoreCaretDetection.current = true;
  setTimeout(() => {
    ignoreCaretDetection.current = false;
  }, 100);

  editableElement.dispatchEvent(new Event('input', { bubbles: true }));

  if (caretController && newCaretPos !== null) {
    caretController.setPosition(newCaretPos);
  }

  return true;
}

export type MergeDirection = 'forward' | 'backward';

interface MergeParagraphsParams {
  direction: MergeDirection;
  editableElement: HTMLDivElement;
  tokens: readonly PromptInputProps.InputToken[];
  currentParagraphIndex: number;
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void;
  caretController?: CaretController | null;
}

/**
 * Merges two adjacent paragraphs by removing the break token between them.
 * @param params.direction 'backward' merges with previous, 'forward' merges with next
 * @param params.currentParagraphIndex zero-based index of the cursor's paragraph
 * @returns true if a merge was performed
 */
export function mergeParagraphs(params: MergeParagraphsParams): boolean {
  const { direction, editableElement, tokens, currentParagraphIndex, tokensToText, onChange, caretController } = params;

  const paragraphs = findAllParagraphs(editableElement);

  if (direction === 'backward') {
    if (currentParagraphIndex <= 0) {
      return false;
    }
  } else {
    if (currentParagraphIndex >= paragraphs.length - 1) {
      return false;
    }
  }

  // The Nth break token corresponds to the boundary between paragraph N and N+1.
  // For backward merge, remove the break at the current paragraph index.
  // For forward merge, remove the break after the current paragraph.
  const breakIndexToRemove = direction === 'backward' ? currentParagraphIndex : currentParagraphIndex + 1;

  let breakCount = 0;

  // Filter out the specific break token by counting breaks sequentially
  const newTokens = tokens.filter(token => {
    if (isBreakToken(token)) {
      breakCount++;
      if (breakCount === breakIndexToRemove) {
        return false;
      }
    }
    return true;
  });

  const value = tokensToText ? tokensToText(newTokens) : getPromptText(newTokens);
  onChange({ value, tokens: newTokens });

  if (caretController) {
    const currentPos = caretController.getPosition();
    const newCaretPos = currentPos - TOKEN_LENGTHS.LINE_BREAK;
    caretController.setPosition(newCaretPos);
  }

  return true;
}

/** Handles Backspace at the start of a paragraph by merging with the previous one. */
export function handleBackspaceAtParagraphStart(
  event: React.KeyboardEvent<HTMLDivElement>,
  editableElement: HTMLDivElement,
  tokens: readonly PromptInputProps.InputToken[],
  tokensToText: ((tokens: readonly PromptInputProps.InputToken[]) => string) | undefined,
  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void,
  caretController: CaretController | null
): boolean {
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return false;
  }

  const range = selection.getRangeAt(0);

  if (range.startOffset !== 0 || !isHTMLElement(range.startContainer) || range.startContainer.nodeName !== 'P') {
    return false;
  }

  const paragraphs = findAllParagraphs(editableElement);
  const currentP = range.startContainer;
  const pIndex = Array.from(paragraphs).indexOf(currentP as HTMLParagraphElement);

  if (pIndex < 0) {
    return false;
  }

  event.preventDefault();

  return mergeParagraphs({
    direction: 'backward',
    editableElement,
    tokens,
    currentParagraphIndex: pIndex,
    tokensToText,
    onChange,
    caretController: caretController,
  });
}

/** Handles Delete at the end of a paragraph by merging with the next one. */
export function handleDeleteAtParagraphEnd(
  event: React.KeyboardEvent<HTMLDivElement>,
  editableElement: HTMLDivElement,
  tokens: readonly PromptInputProps.InputToken[],
  tokensToText: ((tokens: readonly PromptInputProps.InputToken[]) => string) | undefined,
  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void,
  caretController: CaretController | null
): boolean {
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return false;
  }

  const range = selection.getRangeAt(0);
  const container = range.startContainer;

  let isAtEndOfParagraph = false;
  let currentP: HTMLParagraphElement | null = null;

  // Detect end-of-paragraph from two possible caret positions:
  // 1. Caret at paragraph element level with offset at the end of children
  if (isHTMLElement(container) && container.nodeName === 'P') {
    currentP = container as HTMLParagraphElement;
    const hasOnlyTrailingBR = currentP.childNodes.length === 1 && isBRElement(currentP.firstChild);
    isAtEndOfParagraph = hasOnlyTrailingBR || range.startOffset === currentP.childNodes.length;
  } else if (isTextNode(container)) {
    // 2. Caret at end of the last text node in the paragraph (no next sibling)
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

  if (pIndex < 0) {
    return false;
  }

  event.preventDefault();

  return mergeParagraphs({
    direction: 'forward',
    editableElement,
    tokens,
    currentParagraphIndex: pIndex,
    tokensToText,
    onChange,
    caretController: caretController,
  });
}
