// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useOpenState } from '../../internal/components/options-list/utils/use-open-state';
import { ButtonDropdownProps, ButtonDropdownSettings, GroupToggle, HighlightProps, ItemActivate } from '../interfaces';
import { fireCancelableEvent, CancelableEventHandler, isPlainLeftClick } from '../../internal/events';
import { KeyCode } from '../../internal/keycode';
import { getItemTarget, isItemGroup, isLinkItem } from './utils';
import useHighlightedMenu from './use-highlighted-menu';

interface UseButtonDropdownOptions extends ButtonDropdownSettings {
  items: ButtonDropdownProps.Items;
  onItemClick?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  onItemFollow?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  usingMouse: React.MutableRefObject<boolean>;
}

interface UseButtonDropdownApi extends HighlightProps {
  isOpen: boolean;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onKeyUp: (event: React.KeyboardEvent) => void;
  onItemActivate: ItemActivate;
  onGroupToggle: GroupToggle;
  toggleDropdown: () => void;
}

export function useButtonDropdown({
  items,
  onItemClick,
  onItemFollow,
  hasExpandableGroups,
  isInRestrictedView = false,
  usingMouse,
}: UseButtonDropdownOptions): UseButtonDropdownApi {
  const { targetItem, isHighlighted, isExpanded, highlightItem, moveHighlight, expandGroup, collapseGroup, reset } =
    useHighlightedMenu({
      items,
      hasExpandableGroups,
      isInRestrictedView,
    });

  const { isOpen, closeDropdown, toggleDropdown } = useOpenState({ onClose: reset });

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
    closeDropdown();
  };

  const doVerticalNavigation = (direction: -1 | 1) => {
    if (isOpen) {
      moveHighlight(direction);
    }
  };

  const openAndSelectFirst = (event: React.KeyboardEvent) => {
    toggleDropdown();
    moveHighlight(1);
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
    usingMouse.current = false;

    // if item is a link we rely on default behavior of an anchor, no need to prevent
    if (targetItem && isLinkItem(targetItem) && isEnter) {
      return;
    }

    event.preventDefault();
    actOnParentDropdown(event);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.keyCode) {
      case KeyCode.down: {
        usingMouse.current = false;
        doVerticalNavigation(1);
        event.preventDefault();
        break;
      }
      case KeyCode.up: {
        usingMouse.current = false;
        doVerticalNavigation(-1);
        event.preventDefault();
        break;
      }
      case KeyCode.space: {
        // Prevent scrolling the list of items and highlighting the trigger
        usingMouse.current = false;
        event.preventDefault();
        break;
      }
      case KeyCode.enter: {
        if (!targetItem?.disabled) {
          activate(event, true);
        }
        break;
      }
      case KeyCode.left:
      case KeyCode.right: {
        if (targetItem && !targetItem.disabled && isItemGroup(targetItem) && !isExpanded(targetItem)) {
          expandGroup();
        } else if (hasExpandableGroups) {
          collapseGroup();
        }

        event.preventDefault();
        break;
      }
      case KeyCode.escape: {
        closeDropdown();
        event.preventDefault();
        break;
      }
      case KeyCode.tab: {
        closeDropdown();
        break;
      }
    }
  };
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
    isExpanded,
    highlightItem,
    onKeyDown,
    onKeyUp,
    onItemActivate,
    onGroupToggle,
    toggleDropdown,
  };
}
