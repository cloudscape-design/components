// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PromptInputProps } from '../interfaces';
import { CaretController } from './caret-controller';
import { ELEMENT_TYPES } from './constants';
import { getTokenType, insertAfter } from './dom-utils';
import { MenuItemsHandlers, MenuItemsState } from './menu-state';
import { isTextNode } from './type-guards';

import styles from '../styles.css.js';

interface TriggerSpaceHandlerProps {
  menuItemsState: MenuItemsState;
  menuItemsHandlers: MenuItemsHandlers;
  getMenuStatusType?: () => PromptInputProps.MenuDefinition['statusType'];
  closeMenu: () => void;
  caretController?: CaretController;
}

/**
 * Finds the trigger element at the current caret position
 */
function findTriggerAtCaret(): HTMLElement | null {
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const parent = isTextNode(range.startContainer) ? range.startContainer.parentElement : null;
  return parent && getTokenType(parent) === ELEMENT_TYPES.TRIGGER ? parent : null;
}

/**
 * Finalizes space insertion after a trigger by positioning caret and updating refs
 */
function finalizeSpaceInsertion(spaceNode: Text, props: Pick<TriggerSpaceHandlerProps, 'caretController'>): void {
  if (props.caretController) {
    const currentPos = props.caretController.getPosition();
    props.caretController.setPosition(currentPos + 1);
  }

  queueMicrotask(() => {
    const editableElement = spaceNode.parentElement?.closest('[contenteditable="true"]') as HTMLElement;
    if (editableElement) {
      editableElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
}

/**
 * Handles space key press when a trigger menu is open.
 * @returns true if the event was handled, false to allow default behavior
 */
export function handleSpaceInOpenMenu(event: React.KeyboardEvent, props: TriggerSpaceHandlerProps): boolean {
  const { menuItemsState, menuItemsHandlers, getMenuStatusType, closeMenu } = props;
  const items = menuItemsState.items;
  const statusType = getMenuStatusType?.() ?? 'finished';
  const isLoading = statusType === 'loading' || statusType === 'pending';

  const triggerElement = findTriggerAtCaret();
  if (!triggerElement) {
    return false;
  }

  const triggerText = triggerElement.textContent || '';
  const triggerChar = triggerText[0];
  const filterText = triggerText.substring(1);

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

    const oneSpace = document.createTextNode(' ');
    insertAfter(oneSpace, triggerElement);
    finalizeSpaceInsertion(oneSpace, props);

    return true;
  }

  // Empty filter — space dismisses the trigger
  if (filterText === '') {
    event.preventDefault();
    closeMenu();

    const spaceNode = document.createTextNode(' ');
    insertAfter(spaceNode, triggerElement);
    finalizeSpaceInsertion(spaceNode, props);

    return true;
  }

  return false;
}
