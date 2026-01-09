// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PromptInputProps } from '../interfaces';
import { MenuItemsHandlers, MenuItemsState } from '../menus/menu-controller';

export interface KeyboardHandlerDeps {
  menuOpen: boolean;
  menuItemsState: MenuItemsState | null;
  menuItemsHandlers: MenuItemsHandlers | null;
  onAction?: (detail: PromptInputProps.ActionDetail) => void;
  onModeRemoved?: () => void;
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
  tokens?: readonly PromptInputProps.InputToken[];
  getPromptText: (tokens: readonly PromptInputProps.InputToken[]) => string;
  deleteTokenAtCursor: () => boolean;
  closeMenu: () => void;
}

/**
 * Creates keyboard event handlers for contentEditable prompt input.
 * Handles menu navigation, token deletion, and form submission.
 */
export function createKeyboardHandlers(deps: KeyboardHandlerDeps) {
  /**
   * Handles menu navigation keys (ArrowUp, ArrowDown, Enter, Escape).
   * @returns true if the event was handled, false otherwise
   */
  function handleMenuNavigation(event: React.KeyboardEvent): boolean {
    if (!deps.menuOpen || !deps.menuItemsHandlers || !deps.menuItemsState) {
      return false;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (deps.menuItemsState.items.length - 1 === deps.menuItemsState.highlightedIndex) {
        deps.menuItemsHandlers.goHomeWithKeyboard();
      } else {
        deps.menuItemsHandlers.moveHighlightWithKeyboard(1);
      }
      return true;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (
        (deps.menuItemsState.highlightedOption?.type === 'child' && deps.menuItemsState.highlightedIndex === 1) ||
        deps.menuItemsState.highlightedIndex === 0
      ) {
        deps.menuItemsHandlers.goEndWithKeyboard();
      } else {
        deps.menuItemsHandlers.moveHighlightWithKeyboard(-1);
      }
      return true;
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (deps.menuItemsHandlers.selectHighlightedOptionWithKeyboard()) {
        return true;
      }
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      deps.closeMenu();
      return true;
    }

    return false;
  }

  /**
   * Handles Enter key for form submission and action triggering.
   */
  function handleEnterKey(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }

    const form = (event.currentTarget as HTMLElement).closest('form');
    if (form && !event.isDefaultPrevented()) {
      form.requestSubmit();
    }
    event.preventDefault();

    const plainText = deps.tokensToText ? deps.tokensToText(deps.tokens ?? []) : deps.getPromptText(deps.tokens ?? []);

    if (deps.onAction) {
      deps.onAction({ value: plainText, tokens: [...(deps.tokens ?? [])] });
    }
  }

  /**
   * Handles Backspace key for token deletion.
   */
  function handleBackspaceKey(event: React.KeyboardEvent): boolean {
    if (event.key !== 'Backspace') {
      return false;
    }

    const deleted = deps.deleteTokenAtCursor();
    if (deleted) {
      event.preventDefault();
      return true;
    }

    return false;
  }

  /**
   * Handles mode token deletion via Backspace.
   */
  function handleModeBackspace(event: React.KeyboardEvent, nodeToCheck: Node | null): boolean {
    if (event.key !== 'Backspace') {
      return false;
    }

    if (nodeToCheck?.nodeType === Node.ELEMENT_NODE) {
      const element = nodeToCheck as Element;
      const tokenType = element.getAttribute('data-token-type');

      if (tokenType === 'mode' && deps.onModeRemoved) {
        event.preventDefault();
        deps.onModeRemoved();
        return true;
      }
    }

    return false;
  }

  return {
    handleMenuNavigation,
    handleEnterKey,
    handleBackspaceKey,
    handleModeBackspace,
  };
}
