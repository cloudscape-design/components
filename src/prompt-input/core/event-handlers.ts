// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';

import { fireKeyboardEvent } from '../../internal/events';
import { isHTMLElement } from '../../internal/utils/dom';
import handleKey from '../../internal/utils/handle-key';
import { PromptInputProps } from '../interfaces';
import { EditableState } from '../tokens/use-token-mode';
import { CaretController, getOwnerSelection, TOKEN_LENGTHS } from './caret-controller';
import { ElementType } from './constants';
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
  stripZeroWidthCharacters,
} from './dom-utils';
import { MenuItemsHandlers, MenuItemsState } from './menu-state';
import { getPromptText } from './token-operations';
import { removeTokenRange } from './token-utils';
import { handleDeleteAfterTrigger, handleSpaceInOpenMenu } from './trigger-utils';
import { isBreakTextToken, isBRElement, isTextNode } from './type-guards';

/** Configuration for the unified keyboard event handler. */
export interface KeyboardHandlerProps {
  editableElement: HTMLDivElement | null;
  editableState: EditableState;
  caretController: CaretController | null;
  tokens?: readonly PromptInputProps.InputToken[];
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
  disabled?: boolean;
  readOnly?: boolean;
  i18nStrings?: PromptInputProps.I18nStrings;
  announceTokenOperation?: (message: string) => void;

  // Menu state
  getMenuOpen: () => boolean;
  getMenuItemsState: () => MenuItemsState | null;
  getMenuItemsHandlers: () => MenuItemsHandlers | null;
  getMenuStatusType?: () => PromptInputProps.MenuDefinition['statusType'];
  closeMenu: () => void;

  // Callbacks
  onAction?: (detail: PromptInputProps.ActionDetail) => void;
  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void;
  markTokensAsSent: (tokens: readonly PromptInputProps.InputToken[]) => void;
  onKeyDown?: PromptInputProps['onKeyDown'];
}

/** Handles all keyboard events for the editable element. */
export function handleEditableKeyDown(event: React.KeyboardEvent<HTMLDivElement>, props: KeyboardHandlerProps): void {
  const { editableElement, editableState, caretController, tokens, tokensToText } = props;

  const emitChange = (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => {
    props.markTokensAsSent(detail.tokens);
    props.onChange(detail);
  };

  const emitTokenDeletion = (newTokens: PromptInputProps.InputToken[], caretPos: number) => {
    const value = tokensToText ? tokensToText(newTokens) : getPromptText(newTokens);
    // Don't mark as sent — selection deletions use preventDefault so the DOM
    // is NOT updated by the browser. The render effect must see these as an
    // external change and re-render the DOM to match the new token state.
    props.onChange({ value, tokens: newTokens });
    if (caretController) {
      caretController.setCapturedPosition(caretPos);
    }
  };

  // Forward to consumer's onKeyDown
  fireKeyboardEvent(props.onKeyDown, event);

  const menuItemsState = props.getMenuItemsState();
  const menuItemsHandlers = props.getMenuItemsHandlers();
  const menuOpen = props.getMenuOpen();

  handleKey(event, {
    onInlineStart: () => handleInlineStart(event, caretController, props.announceTokenOperation),
    onInlineEnd: () => handleInlineEnd(event, caretController, props.announceTokenOperation),
    onShiftInlineStart: () => handleInlineStart(event, caretController, props.announceTokenOperation),
    onShiftInlineEnd: () => handleInlineEnd(event, caretController, props.announceTokenOperation),
    onSelectAll: () => {
      if (tokens?.length === 0) {
        event.preventDefault();
      }
    },
    onBackspace: () => {
      if (
        editableElement &&
        handleReferenceTokenDeletion(
          event,
          true,
          editableElement,
          editableState,
          props.announceTokenOperation,
          props.i18nStrings,
          caretController,
          tokens,
          emitTokenDeletion
        )
      ) {
        return;
      }
      if (!tokens || !editableElement) {
        return;
      }
      if (tokens.length === 0) {
        event.preventDefault();
        return;
      }
      handleBackspaceAtParagraphStart(event, editableElement, tokens, tokensToText, emitChange, caretController);
    },
    onDelete: () => {
      if (
        editableElement &&
        handleReferenceTokenDeletion(
          event,
          false,
          editableElement,
          editableState,
          props.announceTokenOperation,
          props.i18nStrings,
          caretController,
          tokens,
          emitTokenDeletion
        )
      ) {
        return;
      }
      if (!tokens || !editableElement) {
        return;
      }
      if (handleDeleteAtParagraphEnd(event, editableElement, tokens, tokensToText, emitChange, caretController)) {
        return;
      }
      handleDeleteAfterTrigger(event, editableElement);
    },
    onShiftEnter: () => {
      if (event.nativeEvent.isComposing) {
        return;
      }
      event.preventDefault();
      if (caretController?.findActiveTrigger()) {
        return;
      }
      if (editableElement) {
        splitParagraphAtCaret(editableElement, caretController);
      }
    },
    onEnter: () => {
      if (event.nativeEvent.isComposing) {
        return;
      }
      if (menuOpen && menuItemsHandlers) {
        event.preventDefault();
        menuItemsHandlers.selectHighlightedOptionWithKeyboard();
        return;
      }
      handleEnterSubmit(event, props);
    },
    onTab: () => {
      if (menuOpen && menuItemsHandlers && !event.shiftKey) {
        event.preventDefault();
        menuItemsHandlers.selectHighlightedOptionWithKeyboard();
      }
    },
    onSpace: () => {
      if (editableElement && handleSpaceAfterClosedTrigger(event, editableElement, menuOpen, caretController)) {
        return;
      }
      if (menuOpen && menuItemsHandlers && menuItemsState) {
        handleSpaceInOpenMenu(event, {
          menuItemsState,
          menuItemsHandlers,
          getMenuStatusType: props.getMenuStatusType,
          closeMenu: props.closeMenu,
          caretController: caretController ?? undefined,
          editableElement: editableElement ?? undefined,
        });
      }
    },
    onBlockEnd: () => {
      if (menuOpen && menuItemsHandlers) {
        event.preventDefault();
        menuItemsHandlers.moveHighlightWithKeyboard(1);
      }
    },
    onBlockStart: () => {
      if (menuOpen && menuItemsHandlers) {
        event.preventDefault();
        menuItemsHandlers.moveHighlightWithKeyboard(-1);
      }
    },
    onEscape: () => {
      if (menuOpen) {
        event.preventDefault();
        props.closeMenu();
      }
    },
  });
}

/** Handles Enter key for form submission and onAction. */
function handleEnterSubmit(event: React.KeyboardEvent<HTMLDivElement>, props: KeyboardHandlerProps): void {
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

/** Splits the current paragraph at the caret position, creating a new paragraph below. */
export function splitParagraphAtCaret(
  editableElement: HTMLDivElement,
  caretController: CaretController | null,
  suppressInputEvent = false
): void {
  const selection = getOwnerSelection(editableElement);
  if (!selection?.rangeCount) {
    return;
  }

  const range = selection.getRangeAt(0);
  const startElement = isHTMLElement(range.startContainer) ? range.startContainer : range.startContainer.parentElement;
  const currentP = startElement ? findUpUntil(startElement, node => node.nodeName === 'P') : null;

  if (!currentP?.parentNode) {
    return;
  }

  const afterRange = (editableElement.ownerDocument ?? document).createRange();
  afterRange.setStart(range.startContainer, range.startOffset);
  afterRange.setEndAfter(currentP.lastChild || currentP);

  const afterContent = afterRange.extractContents();

  // Strip trailing breaks from extracted content — they belong only in empty paragraphs
  for (const child of Array.from(afterContent.childNodes)) {
    if (child.nodeName === 'BR') {
      child.remove();
    }
  }

  const newP = createParagraph();
  newP.appendChild(afterContent);

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
    newCaretPos = currentPos + TOKEN_LENGTHS.LINE_BREAK;
  }

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

/** Handles Backspace/Delete when adjacent to a reference token. Returns true if handled. */
export function handleReferenceTokenDeletion(
  event: React.KeyboardEvent<HTMLDivElement>,
  isBackspace: boolean,
  editableElement: HTMLDivElement,
  state: EditableState,
  announceTokenOperation: ((message: string) => void) | undefined,
  i18nStrings: PromptInputProps.I18nStrings | undefined,
  caretController: CaretController | null,
  tokens?: readonly PromptInputProps.InputToken[],
  emitChange?: (newTokens: PromptInputProps.InputToken[], caretPosition: number) => void
): boolean {
  const selection = getOwnerSelection(editableElement);
  if (!selection?.rangeCount) {
    return false;
  }

  const range = selection.getRangeAt(0);

  if (!range.collapsed) {
    event.preventDefault();

    if (!caretController || !tokens || !emitChange) {
      return false;
    }

    // Map the DOM selection to logical token positions and remove the range
    // from state. The render effect will update the DOM on the next cycle.
    const startPos = caretController.getPosition();

    // Get end position by temporarily collapsing the range to its end
    const tempRange = range.cloneRange();
    tempRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(tempRange);
    const endPos = caretController.getPosition();
    selection.removeAllRanges();
    selection.addRange(range);

    const rangeStart = Math.min(startPos, endPos);
    const rangeEnd = Math.max(startPos, endPos);

    const newTokens = removeTokenRange(tokens, rangeStart, rangeEnd);
    emitChange(newTokens, rangeStart);

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

  const elementToRemove = (wrapperElement || tokenElement)!;
  const paragraph = elementToRemove.parentNode;
  if (!paragraph) {
    return false;
  }

  event.preventDefault();

  const tokenLabel = tokenElement!.textContent?.trim() || '';
  if (announceTokenOperation && tokenLabel) {
    const announcement = i18nStrings?.tokenRemovedAriaLabel?.({ label: tokenLabel, value: tokenLabel });
    if (announcement) {
      announceTokenOperation(announcement);
    }
  }

  state.skipNextZeroWidthUpdate = true;

  let newCaretPos: number | null = null;
  if (caretController) {
    const currentPos = caretController.getPosition();
    newCaretPos = isBackspace ? Math.max(0, currentPos - TOKEN_LENGTHS.REFERENCE) : currentPos;
  }

  elementToRemove.remove();
  editableElement.dispatchEvent(new Event('input', { bubbles: true }));

  if (caretController && newCaretPos !== null) {
    caretController.setPosition(newCaretPos);
  }

  return true;
}

/** If the caret is inside a reference's caret-spot, normalizes it to the paragraph level. */
function normalizeCaretOutOfReference(
  container: Node,
  direction: 'forward' | 'backward',
  event: React.KeyboardEvent<HTMLDivElement>,
  selection: Selection
): boolean {
  if (!isTextNode(container)) {
    return false;
  }

  const parent = container.parentElement;
  if (!parent || !isCaretSpotType(getTokenType(parent))) {
    return false;
  }

  const wrapper = parent.parentElement;
  if (!wrapper || !isReferenceElementType(getTokenType(wrapper))) {
    return false;
  }

  const paragraph = wrapper.parentElement;
  if (!paragraph) {
    return false;
  }

  const wrapperIndex = Array.from(paragraph.childNodes).indexOf(wrapper);
  const newOffset = direction === 'backward' ? wrapperIndex : wrapperIndex + 1;

  event.preventDefault();
  const newRange = (paragraph.ownerDocument ?? document).createRange();
  newRange.setStart(paragraph, newOffset);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);
  return true;
}

/** Handles inline-start (backward) arrow key — plain navigation or shift+selection across references. */
export function handleInlineStart(
  event: React.KeyboardEvent<HTMLDivElement>,
  caretController: CaretController | null,
  announceTokenOperation?: (message: string) => void
): void {
  const selection = getOwnerSelection(event.currentTarget);
  if (!selection?.rangeCount) {
    return;
  }
  const range = selection.getRangeAt(0);

  if (range.collapsed && normalizeCaretOutOfReference(range.startContainer, 'backward', event, selection)) {
    return;
  }

  if (event.shiftKey) {
    handleShiftArrowAcrossTokens(event, selection, range, 'backward');
    return;
  }

  const { sibling, isReferenceToken } = findAdjacentToken(range.startContainer, range.startOffset, 'backward');
  if (isReferenceToken && sibling) {
    event.preventDefault();
    caretController?.moveBackward(TOKEN_LENGTHS.REFERENCE);
    if (announceTokenOperation && isHTMLElement(sibling)) {
      const label = stripZeroWidthCharacters(sibling.textContent?.trim() || '');
      if (label) {
        announceTokenOperation(label);
      }
    }
  }
}

/** Handles inline-end (forward) arrow key — plain navigation or shift+selection across references. */
export function handleInlineEnd(
  event: React.KeyboardEvent<HTMLDivElement>,
  caretController: CaretController | null,
  announceTokenOperation?: (message: string) => void
): void {
  const selection = getOwnerSelection(event.currentTarget);
  if (!selection?.rangeCount) {
    return;
  }
  const range = selection.getRangeAt(0);

  if (range.collapsed && normalizeCaretOutOfReference(range.startContainer, 'forward', event, selection)) {
    return;
  }

  if (event.shiftKey) {
    handleShiftArrowAcrossTokens(event, selection, range, 'forward');
    return;
  }

  const { sibling, isReferenceToken } = findAdjacentToken(range.startContainer, range.startOffset, 'forward');
  if (isReferenceToken && sibling) {
    event.preventDefault();
    caretController?.moveForward(TOKEN_LENGTHS.REFERENCE);
    if (announceTokenOperation && isHTMLElement(sibling)) {
      const label = stripZeroWidthCharacters(sibling.textContent?.trim() || '');
      if (label) {
        announceTokenOperation(label);
      }
    }
  }
}

/** After the browser handles Shift+Arrow, nudge the focus past any reference it landed inside. */
function handleShiftArrowAcrossTokens(
  event: React.KeyboardEvent<HTMLDivElement>,
  selection: Selection,
  range: Range,
  direction: 'forward' | 'backward'
): boolean {
  const isBackward = direction === 'backward';

  // Check if the focus is adjacent to a reference in the arrow direction
  const focusNode = selection.focusNode;
  const focusOff = selection.focusOffset;
  if (!focusNode) {
    return false;
  }

  let adjacentRef: Node | null = null;

  // If focus is inside a reference (e.g. in a caret-spot), the reference itself is what we skip
  let containingRef: HTMLElement | null = null;
  let node: Node | null = isTextNode(focusNode) ? focusNode.parentElement : (focusNode as HTMLElement);
  while (node && isHTMLElement(node) && node !== event.currentTarget) {
    const tokenType = getTokenType(node);
    if (isReferenceElementType(tokenType)) {
      containingRef = node;
      break;
    }
    if (isCaretSpotType(tokenType) && node.parentElement) {
      const parentType = getTokenType(node.parentElement);
      if (isReferenceElementType(parentType)) {
        containingRef = node.parentElement;
        break;
      }
    }
    node = node.parentElement;
  }

  if (containingRef) {
    adjacentRef = containingRef;
  } else if (isTextNode(focusNode)) {
    if (isBackward && focusOff === 0) {
      adjacentRef = focusNode.previousSibling;
    } else if (!isBackward) {
      const len = focusNode.textContent?.length || 0;
      // Check at the text boundary — only jump over the reference when focus
      // is at the very end of the text node, not one character before.
      if (focusOff >= len && focusNode.nextSibling) {
        const nextSibling = focusNode.nextSibling;
        if (isHTMLElement(nextSibling) && isReferenceElementType(getTokenType(nextSibling))) {
          adjacentRef = nextSibling;
        }
      }
    }
    if (!adjacentRef && isBackward && focusOff === 0 && focusNode.previousSibling) {
      const previousSibling = focusNode.previousSibling;
      if (isHTMLElement(previousSibling) && isReferenceElementType(getTokenType(previousSibling))) {
        adjacentRef = previousSibling;
      }
    }
  } else if (isHTMLElement(focusNode)) {
    if (isBackward && focusOff > 0) {
      adjacentRef = focusNode.childNodes[focusOff - 1];
    } else if (!isBackward && focusOff < focusNode.childNodes.length) {
      adjacentRef = focusNode.childNodes[focusOff];
    }
  }

  if (!adjacentRef || !isHTMLElement(adjacentRef) || !isReferenceElementType(getTokenType(adjacentRef))) {
    return false;
  }

  const parent = adjacentRef.parentNode;
  if (!parent) {
    return false;
  }

  event.preventDefault();

  const index = Array.from(parent.childNodes).indexOf(adjacentRef as ChildNode);

  // Find the actual text node on the far side of the reference to extend into,
  // rather than using paragraph-level offsets which the browser may normalize
  // into the reference's caret-spot internals.
  let targetNode: Node = parent;
  let targetOffset: number = isBackward ? index : index + 1;

  if (!isBackward) {
    const nextSibling = adjacentRef.nextSibling;
    if (nextSibling && isTextNode(nextSibling)) {
      targetNode = nextSibling;
      targetOffset = 0;
    }
  } else {
    const prevSibling = adjacentRef.previousSibling;
    if (prevSibling && isTextNode(prevSibling)) {
      targetNode = prevSibling;
      targetOffset = prevSibling.textContent?.length || 0;
    }
  }

  // If extending would jump the focus past the anchor (deselecting through a reference),
  // collapse instead of flipping the selection direction.
  if (!range.collapsed && selection.anchorNode) {
    const anchorPos = adjacentRef.compareDocumentPosition(selection.anchorNode);
    const anchorIsAfter =
      (anchorPos & Node.DOCUMENT_POSITION_FOLLOWING) !== 0 || (anchorPos & Node.DOCUMENT_POSITION_CONTAINED_BY) !== 0;
    const anchorIsBefore =
      (anchorPos & Node.DOCUMENT_POSITION_PRECEDING) !== 0 || (anchorPos & Node.DOCUMENT_POSITION_CONTAINS) !== 0;

    if ((!isBackward && anchorIsAfter) || (isBackward && anchorIsBefore)) {
      const anchorNode = selection.anchorNode!;
      const anchorOffset = selection.anchorOffset;
      selection.collapse(anchorNode, anchorOffset);
      selection.extend(targetNode, targetOffset);
      return true;
    }
  }

  selection.extend(targetNode, targetOffset);

  return true;
}

/** Handles space key after a closed trigger element, inserting the space outside the trigger. */
export function handleSpaceAfterClosedTrigger(
  event: React.KeyboardEvent<HTMLDivElement>,
  editableElement: HTMLDivElement,
  menuOpen: boolean,
  caretController: CaretController | null
): boolean {
  if (event.key !== ' ' || menuOpen) {
    return false;
  }

  const selection = getOwnerSelection(editableElement);
  if (!selection?.rangeCount) {
    return false;
  }

  const range = selection.getRangeAt(0);
  if (!range.collapsed) {
    return false;
  }

  let triggerElement: HTMLElement | null = null;
  let caretAtEnd = false;

  if (isTextNode(range.startContainer)) {
    const parent = range.startContainer.parentElement;
    const parentType = parent ? getTokenType(parent) : null;

    if (parentType === ElementType.Trigger && parent) {
      triggerElement = parent;
      const textLength = range.startContainer.textContent?.length || 0;
      caretAtEnd = range.startOffset === textLength;
    }
  } else if (isHTMLElement(range.startContainer)) {
    const container = range.startContainer;
    if (range.startOffset > 0) {
      const prevNode = container.childNodes[range.startOffset - 1];
      if (isHTMLElement(prevNode) && getTokenType(prevNode) === ElementType.Trigger) {
        triggerElement = prevNode;
        caretAtEnd = true;
      }
    }
  }

  if (!triggerElement || !caretAtEnd) {
    return false;
  }

  const paragraph = triggerElement.parentElement;
  if (!paragraph) {
    return false;
  }

  event.preventDefault();

  if (caretController) {
    caretController.capture();
  }

  const spaceNode = (triggerElement.ownerDocument ?? document).createTextNode(' ');
  insertAfter(spaceNode, triggerElement);

  editableElement.dispatchEvent(new Event('input', { bubbles: true }));

  if (caretController) {
    caretController.restore(1);
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

/** Merges two adjacent paragraphs by removing the break token between them. */
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

  const breakIndexToRemove = direction === 'backward' ? currentParagraphIndex : currentParagraphIndex + 1;

  let breakCount = 0;
  let breakRemoved = false;

  const newTokens = tokens.filter(token => {
    if (isBreakTextToken(token)) {
      breakCount++;
      if (breakCount === breakIndexToRemove) {
        breakRemoved = true;
        return false;
      }
    }
    return true;
  });

  if (!breakRemoved) {
    return false;
  }

  const value = tokensToText ? tokensToText(newTokens) : getPromptText(newTokens);
  onChange({ value, tokens: newTokens });

  if (caretController) {
    const currentPos = caretController.getPosition();
    // Backspace: cursor was at start of next paragraph, now needs to move back by the removed break
    // Delete: cursor stays where it is — the next line merges into the current one
    const newCaretPos = direction === 'backward' ? currentPos - TOKEN_LENGTHS.LINE_BREAK : currentPos;
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
  const selection = getOwnerSelection(editableElement);
  if (!selection?.rangeCount) {
    return false;
  }

  const range = selection.getRangeAt(0);

  if (
    !range.collapsed ||
    range.startOffset !== 0 ||
    !isHTMLElement(range.startContainer) ||
    range.startContainer.nodeName !== 'P'
  ) {
    return false;
  }

  const paragraphs = findAllParagraphs(editableElement);
  const currentP = range.startContainer;
  const pIndex = Array.from(paragraphs).indexOf(currentP as HTMLParagraphElement);

  if (pIndex < 0) {
    return false;
  }

  const merged = mergeParagraphs({
    direction: 'backward',
    editableElement,
    tokens,
    currentParagraphIndex: pIndex,
    tokensToText,
    onChange,
    caretController: caretController,
  });

  if (merged) {
    event.preventDefault();
  }

  return merged;
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
  const selection = getOwnerSelection(editableElement);
  if (!selection?.rangeCount) {
    return false;
  }

  const range = selection.getRangeAt(0);
  const container = range.startContainer;

  if (!range.collapsed) {
    return false;
  }

  let isAtEndOfParagraph = false;
  let currentP: HTMLParagraphElement | null = null;

  if (isHTMLElement(container) && container.nodeName === 'P') {
    currentP = container as HTMLParagraphElement;
    const hasOnlyTrailingBR = currentP.childNodes.length === 1 && isBRElement(currentP.firstChild);
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

  if (pIndex < 0) {
    return false;
  }

  const merged = mergeParagraphs({
    direction: 'forward',
    editableElement,
    tokens,
    currentParagraphIndex: pIndex,
    tokensToText,
    onChange,
    caretController: caretController,
  });

  if (merged) {
    event.preventDefault();
  }

  return merged;
}

/** Handles copy/cut events on the contentEditable element. */
export function handleClipboardEvent(event: React.ClipboardEvent, editableElement: HTMLElement, isCut: boolean): void {
  const selection = getOwnerSelection(editableElement);
  if (!selection || selection.rangeCount === 0) {
    return;
  }

  const range = selection.getRangeAt(0);
  const fragment = range.cloneContents();

  const paragraphs = findAllParagraphs(fragment);
  const text =
    paragraphs.length > 0
      ? paragraphs.map(p => stripZeroWidthCharacters(p.textContent || '')).join('\n')
      : stripZeroWidthCharacters(fragment.textContent || '');

  event.clipboardData.setData('text/plain', text);
  event.preventDefault();

  if (isCut) {
    selection.deleteFromDocument();
  }
}
