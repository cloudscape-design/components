// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PromptInputProps } from '../interfaces';
import { EditableState } from '../tokens/use-editable-tokens';
import { ELEMENT_TYPES } from './constants';
import { getCursorPosition, positionAfter } from './cursor-manager';
import { getTokenType, insertAfter } from './dom-utils';
import { MenuItemsHandlers, MenuItemsState } from './menu-state';
import { isTextNode } from './type-guards';

import styles from '../styles.css.js';

interface TriggerSpaceHandlerProps {
  menuItemsState: MenuItemsState;
  menuItemsHandlers: MenuItemsHandlers;
  getMenuStatusType?: () => PromptInputProps.MenuDefinition['statusType'];
  closeMenu: () => void;
  editableElementRef?: React.RefObject<HTMLDivElement>;
  lastKnownCursorPositionRef?: React.MutableRefObject<number>;
  editableState?: EditableState;
}

/**
 * Finds the trigger element at the current cursor position
 */
export function findTriggerAtCursor(): HTMLElement | null {
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const parent = isTextNode(range.startContainer) ? range.startContainer.parentElement : null;
  return parent && getTokenType(parent) === ELEMENT_TYPES.TRIGGER ? parent : null;
}

/**
 * Finalizes space insertion after a trigger by positioning cursor and updating refs
 */
function finalizeSpaceInsertion(
  spaceNode: Text,
  props: Pick<TriggerSpaceHandlerProps, 'editableElementRef' | 'lastKnownCursorPositionRef' | 'editableState'>
): void {
  positionAfter(spaceNode);

  if (props.editableElementRef?.current && props.lastKnownCursorPositionRef) {
    props.lastKnownCursorPositionRef.current = getCursorPosition(props.editableElementRef.current);
  }
  if (props.editableState) {
    props.editableState.skipCursorRestore = true;
  }

  queueMicrotask(() => {
    const editableElement = spaceNode.parentElement?.closest('[contenteditable="true"]') as HTMLElement;
    if (editableElement) {
      editableElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
}

/**
 * Handles space key press when menu is open
 * Returns true if handled, false to allow default behavior
 */
export function handleSpaceInOpenMenu(event: React.KeyboardEvent, props: TriggerSpaceHandlerProps): boolean {
  const { menuItemsState, menuItemsHandlers, getMenuStatusType, closeMenu } = props;
  const items = menuItemsState.items;
  const statusType = getMenuStatusType?.() ?? 'finished';
  const isLoading = statusType === 'loading' || statusType === 'pending';

  const triggerElement = findTriggerAtCursor();
  if (!triggerElement) {
    return false;
  }

  const triggerText = triggerElement.textContent || '';
  const triggerChar = triggerText[0];
  const filterText = triggerText.substring(1);

  // Case 1: Single selectable option (not loading) - select it
  const selectableItems = items.filter(item => item.type !== 'parent');
  if (selectableItems.length === 1 && !isLoading) {
    event.preventDefault();
    return menuItemsHandlers.selectHighlightedOptionWithKeyboard();
  }

  // Case 2: Double space - close menu, clean filter, add ONE space
  if (filterText.endsWith(' ')) {
    event.preventDefault();
    closeMenu();

    const cleanFilterText = filterText.trimEnd();
    triggerElement.textContent = triggerChar + cleanFilterText;
    triggerElement.className = cleanFilterText.length > 0 ? styles['trigger-token'] : '';

    const oneSpace = document.createTextNode(' ');
    insertAfter(oneSpace, triggerElement);
    finalizeSpaceInsertion(oneSpace, props);

    return true;
  }

  // Case 3: Empty filter - close menu, add space as plain text
  if (filterText === '') {
    event.preventDefault();
    closeMenu();

    const spaceNode = document.createTextNode(' ');
    insertAfter(spaceNode, triggerElement);
    finalizeSpaceInsertion(spaceNode, props);

    return true;
  }

  // Default: Allow space in filter for multi-word filtering
  return false;
}

/**
 * Checks if a trigger needs immediate re-rendering due to styling changes
 */
export function needsImmediateRenderForStyling(
  newTriggers: PromptInputProps.TriggerToken[],
  oldTriggers: PromptInputProps.TriggerToken[]
): boolean {
  return newTriggers.some((newT, i) => {
    const oldT = oldTriggers[i];
    if (!oldT) {
      return false;
    }
    // Render when transitioning between empty and non-empty filter (styling change)
    const wasEmpty = oldT.value.length === 0;
    const isEmpty = newT.value.length === 0;
    return wasEmpty !== isEmpty;
  });
}
