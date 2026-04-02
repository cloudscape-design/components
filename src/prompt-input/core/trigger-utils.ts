// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isHTMLElement } from '../../internal/utils/dom';
import { PromptInputProps } from '../interfaces';
import { calculateTokenPosition, CaretController, getOwnerSelection } from './caret-controller';
import { ElementType } from './constants';
import { getTokenType, insertAfter } from './dom-utils';
import { MenuItemsHandlers, MenuItemsState } from './menu-state';
import { isTextNode, isTextToken, isTriggerToken } from './type-guards';

import styles from '../styles.css.js';

interface TriggerSpaceHandlerProps {
  menuItemsState: MenuItemsState;
  menuItemsHandlers: MenuItemsHandlers;
  getMenuStatusType?: () => PromptInputProps.MenuDefinition['statusType'];
  closeMenu: () => void;
  caretController?: CaretController;
  editableElement?: HTMLElement;
}

/** Finds the trigger element at the current caret position. */
/** Finds the trigger element at the current caret position. */
function findTriggerAtCaret(editableElement?: HTMLElement): HTMLElement | null {
  const selection = editableElement ? getOwnerSelection(editableElement) : window.getSelection();
  if (!selection?.rangeCount) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const parent = isTextNode(range.startContainer) ? range.startContainer.parentElement : null;
  return parent && getTokenType(parent) === ElementType.Trigger ? parent : null;
}

/** Finalizes space insertion after a trigger by positioning caret and dispatching input. */
function finalizeSpaceInsertion(spaceNode: Text, props: Pick<TriggerSpaceHandlerProps, 'caretController'>): void {
  if (props.caretController) {
    props.caretController.capture();
    props.caretController.restore(1);
  }

  queueMicrotask(() => {
    const editableElement = spaceNode.parentElement?.closest('[contenteditable="true"]') as HTMLElement;
    if (editableElement) {
      editableElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
}

/** Handles space key press when a trigger menu is open. Returns true if handled. */
export function handleSpaceInOpenMenu(event: React.KeyboardEvent, props: TriggerSpaceHandlerProps): boolean {
  const { menuItemsState, menuItemsHandlers, getMenuStatusType, closeMenu, editableElement } = props;
  const items = menuItemsState.items;
  const statusType = getMenuStatusType?.() ?? 'finished';
  const isLoading = statusType === 'loading' || statusType === 'pending';

  const ownerElement = editableElement ?? (event.currentTarget as HTMLElement);
  const triggerElement = findTriggerAtCaret(ownerElement);
  if (!triggerElement) {
    return false;
  }

  const triggerText = triggerElement.textContent || '';
  const triggerChar = triggerText[0];
  const filterText = triggerText.substring(1);
  const ownerDoc = triggerElement.ownerDocument ?? document;

  // Single match while not loading — auto-select it
  const selectableItems = items.filter(item => item.type !== 'parent');
  if (selectableItems.length === 1 && !isLoading) {
    event.preventDefault();
    return menuItemsHandlers.selectHighlightedOptionWithKeyboard();
  }

  // Double space (filter already ends with space) — close menu and insert one space outside trigger
  if (filterText.endsWith(' ')) {
    event.preventDefault();
    closeMenu();

    const cleanFilterText = filterText.trimEnd();
    triggerElement.textContent = triggerChar + cleanFilterText;
    triggerElement.className = cleanFilterText.length > 0 ? styles['trigger-token'] : '';

    const oneSpace = ownerDoc.createTextNode(' ');
    insertAfter(oneSpace, triggerElement);
    finalizeSpaceInsertion(oneSpace, props);

    return true;
  }

  // Empty filter — space dismisses the trigger
  if (filterText === '') {
    event.preventDefault();
    closeMenu();

    const spaceNode = ownerDoc.createTextNode(' ');
    insertAfter(spaceNode, triggerElement);
    finalizeSpaceInsertion(spaceNode, props);

    return true;
  }

  // Caret right after trigger char with filter text ahead — split filter out of trigger
  const selection = ownerElement ? getOwnerSelection(ownerElement) : window.getSelection();
  const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
  if (
    filterText.length > 0 &&
    range &&
    isTextNode(range.startContainer) &&
    range.startContainer.parentElement === triggerElement &&
    range.startOffset === triggerChar.length
  ) {
    event.preventDefault();
    closeMenu();

    triggerElement.textContent = triggerChar;
    triggerElement.className = '';

    const textAfter = ownerDoc.createTextNode(' ' + filterText);
    insertAfter(textAfter, triggerElement);
    finalizeSpaceInsertion(textAfter, props);

    return true;
  }

  return false;
}

/** Handles Delete at the end of a trigger element, removing the leading space from the next text node. */
export function handleDeleteAfterTrigger(
  event: React.KeyboardEvent<HTMLDivElement>,
  editableElement: HTMLDivElement
): boolean {
  const selection = getOwnerSelection(editableElement);
  if (!selection?.rangeCount || !selection.getRangeAt(0).collapsed) {
    return false;
  }

  const range = selection.getRangeAt(0);
  const { startContainer, startOffset } = range;

  // Find the trigger element the cursor is at the end of
  let triggerElement: HTMLElement | null = null;
  if (isTextNode(startContainer)) {
    const parent = startContainer.parentElement;
    if (
      parent &&
      getTokenType(parent) === ElementType.Trigger &&
      startOffset === (startContainer.textContent?.length || 0)
    ) {
      triggerElement = parent;
    }
  } else if (isHTMLElement(startContainer) && startOffset > 0) {
    const prev = startContainer.childNodes[startOffset - 1];
    if (isHTMLElement(prev) && getTokenType(prev) === ElementType.Trigger) {
      triggerElement = prev;
    }
  }

  const nextText = triggerElement?.nextSibling;
  if (!triggerElement || !nextText || !isTextNode(nextText) || !nextText.textContent?.startsWith(' ')) {
    return false;
  }

  event.preventDefault();
  nextText.textContent = nextText.textContent.substring(1);
  if (!nextText.textContent) {
    nextText.remove();
  }
  editableElement.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
}

/** Detects structural trigger transitions between old and new token arrays. Returns the caret position, or 0 if none. */
export function detectTriggerTransition(
  oldTokens: readonly PromptInputProps.InputToken[] | null | undefined,
  newTokens: readonly PromptInputProps.InputToken[] | null | undefined
): number {
  if (!oldTokens || !newTokens) {
    return 0;
  }

  for (let i = 0; i < newTokens.length; i++) {
    const newToken = newTokens[i];
    const oldToken = i < oldTokens.length ? oldTokens[i] : null;
    const prevNewToken = i > 0 ? newTokens[i - 1] : null;
    const prevOldToken = i > 0 && i - 1 < oldTokens.length ? oldTokens[i - 1] : null;

    // Space split: trigger's filter text was pushed into a following text token.
    // Either the text token is new (old array was shorter) or it grew.
    if (
      isTextToken(newToken) &&
      newToken.value.startsWith(' ') &&
      prevNewToken &&
      isTriggerToken(prevNewToken) &&
      prevNewToken.value === '' &&
      prevOldToken &&
      isTriggerToken(prevOldToken) &&
      prevNewToken.id === prevOldToken.id &&
      prevOldToken.value.length > 0 &&
      (!oldToken || (isTextToken(oldToken) && newToken.value.length > oldToken.value.length))
    ) {
      return calculateTokenPosition(newTokens, i - 1) + 1;
    }

    // Trigger absorbed adjacent text (value grew by more than 1 character)
    if (
      isTriggerToken(newToken) &&
      oldToken &&
      isTriggerToken(oldToken) &&
      newToken.id === oldToken.id &&
      newToken.value.length > oldToken.value.length + 1
    ) {
      const posBeforeTrigger = i > 0 ? calculateTokenPosition(newTokens, i - 1) : 0;

      if (oldToken.value === '') {
        // Merge from empty trigger → caret after trigger char
        return posBeforeTrigger + newToken.triggerChar.length;
      }

      // Merge from non-empty trigger → caret at merge point
      return posBeforeTrigger + newToken.triggerChar.length + oldToken.value.length;
    }
  }

  return 0;
}
