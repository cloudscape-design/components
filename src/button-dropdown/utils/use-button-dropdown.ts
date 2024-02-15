// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useOpenState } from '../../internal/components/options-list/utils/use-open-state';
import { ButtonDropdownProps, ButtonDropdownSettings, GroupToggle, HighlightProps, ItemActivate } from '../interfaces';
import { fireCancelableEvent, CancelableEventHandler, isPlainLeftClick } from '../../internal/events';
import { KeyCode } from '../../internal/keycode';
import { getItemTarget, isItemGroup, isLinkItem } from './utils';
import useHighlightedMenu from './use-highlighted-menu';
import handleKeyDown from '../../internal/utils/handle-key-down';

interface UseButtonDropdownOptions extends ButtonDropdownSettings {
  items: ButtonDropdownProps.Items;
  onItemClick?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  onItemFollow?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  onReturnFocus: () => void;
  expandToViewport?: boolean;
}

interface UseButtonDropdownApi extends HighlightProps {
  isOpen: boolean;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onKeyUp: (event: React.KeyboardEvent) => void;
  onItemActivate: ItemActivate;
  onGroupToggle: GroupToggle;
  toggleDropdown: (options?: { moveHighlightOnOpen?: boolean }) => void;
  closeDropdown: () => void;
  setIsUsingMouse: (isUsingMouse: boolean) => void;
}

export function useButtonDropdown({
  items,
  onItemClick,
  onItemFollow,
  onReturnFocus,
  hasExpandableGroups,
  isInRestrictedView = false,
  expandToViewport = false,
}: UseButtonDropdownOptions): UseButtonDropdownApi {
  const {
    targetItem,
    isHighlighted,
    isKeyboardHighlight,
    isExpanded,
    highlightItem,
    moveHighlight,
    expandGroup,
    collapseGroup,
    reset,
    setIsUsingMouse,
  } = useHighlightedMenu({
    items,
    hasExpandableGroups,
    isInRestrictedView,
  });

  const { isOpen, closeDropdown, ...openStateProps } = useOpenState({ onClose: reset });
  const toggleDropdown = (options: { moveHighlightOnOpen?: boolean } = {}) => {
    const moveHighlightOnOpen = options.moveHighlightOnOpen ?? true;
    if (!isOpen && moveHighlightOnOpen) {
      moveHighlight(1);
    }
    openStateProps.toggleDropdown();
  };

  const onGroupToggle: GroupToggle = item => (!isExpanded(item) ? expandGroup(item) : collapseGroup());

  const onItemActivate: ItemActivate = (item, event) => {
    const details = {
      id: item.id || 'undefined',
      href: item.href,
      external: item.external,
      target: getItemTarget(item),
    };
    if (onItemFollow && item.href && isPlainLeftClick(event)) {
      fireCancelableEvent(onItemFollow, details, event);
    }
    if (onItemClick) {
      fireCancelableEvent(onItemClick, details, event);
    }
    onReturnFocus();
    closeDropdown();
  };

  const doVerticalNavigation = (direction: -1 | 1) => {
    if (isOpen) {
      moveHighlight(direction);
    }
  };

  const openAndSelectFirst = (event: React.KeyboardEvent) => {
    toggleDropdown();
    event.preventDefault();
  };

  const actOnParentDropdown = (event: React.KeyboardEvent) => {
    // if there is no highlighted item we act on the trigger by opening or closing dropdown
    if (!targetItem) {
      if (isOpen && !isInRestrictedView) {
        toggleDropdown();
      } else {
        openAndSelectFirst(event);
      }
    } else {
      if (isItemGroup(targetItem)) {
        onGroupToggle(targetItem, event);
      } else {
        onItemActivate(targetItem, event);
      }
    }
  };

  const activate = (event: React.KeyboardEvent, isEnter?: boolean) => {
    setIsUsingMouse(false);

    // if item is a link we rely on default behavior of an anchor, no need to prevent
    if (targetItem && isLinkItem(targetItem) && isEnter) {
      return;
    }

    event.preventDefault();
    actOnParentDropdown(event);
  };

  const onLeftOrRight = () => {
    if (targetItem && !targetItem.disabled && isItemGroup(targetItem) && !isExpanded(targetItem)) {
      expandGroup();
    } else if (hasExpandableGroups) {
      collapseGroup();
    }
  };

  const onKeyDown = handleKeyDown({
    onAll: () => {
      setIsUsingMouse(false);
    },
    onSpace: event => {
      // Prevent scrolling the list of items and highlighting the trigger
      event.preventDefault();
    },
    onEnter: event => {
      if (!targetItem?.disabled) {
        activate(event, true);
      }
    },
    onEscape: event => {
      onReturnFocus();
      closeDropdown();
      event.preventDefault();
      if (isOpen) {
        event.stopPropagation();
      }
    },
    onDown: event => {
      doVerticalNavigation(1);
      event.preventDefault();
    },
    onUp: event => {
      doVerticalNavigation(-1);
      event.preventDefault();
    },
    onLeft: onLeftOrRight,
    onRight: onLeftOrRight,
    onTab: () => {
      // When expanded to viewport the focus can't move naturally to the next element.
      // Returning the focus to the trigger instead.
      if (expandToViewport) {
        onReturnFocus();
      }
      closeDropdown();
    },
  });

  const onKeyUp = (event: React.KeyboardEvent) => {
    // We need to handle activating items with Space separately because there is a bug
    // in Firefox where changing the focus during a Space keydown event it will trigger
    // unexpected click events on the new element: https://bugzilla.mozilla.org/show_bug.cgi?id=1220143
    if (event.keyCode === KeyCode.space && !targetItem?.disabled) {
      activate(event);
    }
  };

  return {
    isOpen,
    targetItem,
    isHighlighted,
    isKeyboardHighlight,
    isExpanded,
    highlightItem,
    onKeyDown,
    onKeyUp,
    onItemActivate,
    onGroupToggle,
    toggleDropdown,
    closeDropdown,
    setIsUsingMouse,
  };
}
