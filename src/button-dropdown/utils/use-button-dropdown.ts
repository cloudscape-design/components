// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useOpenState } from '../../internal/components/options-list/utils/use-open-state';
import { fireCancelableEvent, isPlainLeftClick } from '../../internal/events';
import { KeyCode } from '../../internal/keycode';
import { CancelableEventHandler } from '../../types/events';
import { ButtonDropdownProps, ButtonDropdownSettings, GroupToggle, HighlightProps, ItemActivate } from '../interfaces';
import { filterItems } from './filter-items';
import useHighlightedMenu from './use-highlighted-menu';
import { getItemTarget, isCheckboxItem, isItemGroup, isLinkItem } from './utils';

interface UseButtonDropdownOptions extends ButtonDropdownSettings {
  items: ButtonDropdownProps.Items;
  onItemClick?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  onItemFollow?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  onReturnFocus: () => void;
  expandToViewport?: boolean;
  hasFiltering: boolean;
}

interface UseButtonDropdownApi extends HighlightProps {
  isOpen: boolean;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onKeyUp: (event: React.KeyboardEvent) => void;
  onItemActivate: ItemActivate;
  onGroupToggle: GroupToggle;
  onDropdownFocusLeave: () => void;
  toggleDropdown: (options?: { moveHighlightOnOpen?: boolean }) => void;
  closeDropdown: () => void;
  setIsUsingMouse: (isUsingMouse: boolean) => void;
  filteringValue: string;
  setFilteringValue: (value: string) => void;
  filteredItems: ButtonDropdownProps.Items;
  showExpandableGroups: boolean;
}

export function useButtonDropdown({
  items,
  onItemClick,
  onItemFollow,
  onReturnFocus,
  hasExpandableGroups,
  isInRestrictedView = false,
  expandToViewport = false,
  hasFiltering,
}: UseButtonDropdownOptions): UseButtonDropdownApi {
  const [filteringValue, setFilteringValue] = useState('');

  const filteredItems = useMemo(
    () => (hasFiltering && filteringValue ? filterItems(items, filteringValue) : items),
    [hasFiltering, filteringValue, items]
  );

  const showExpandableGroups = hasExpandableGroups && !filteringValue;

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
    items: filteredItems,
    hasExpandableGroups: showExpandableGroups,
    isInRestrictedView,
  });

  // If the filtering input changes, the options list also changes,
  // so the highlight isn't valid anymore.
  const prevFilteringValue = useRef(filteringValue);
  useEffect(() => {
    if (prevFilteringValue.current !== filteringValue) {
      prevFilteringValue.current = filteringValue;
      reset();
    }
  }, [filteringValue, reset]);

  const { isOpen, closeDropdown: closeDropdownState, ...openStateProps } = useOpenState({ onClose: reset });

  const closeDropdown = () => {
    setFilteringValue('');
    closeDropdownState();
  };

  const toggleDropdown = (options: { moveHighlightOnOpen?: boolean } = {}) => {
    const moveHighlightOnOpen = options.moveHighlightOnOpen ?? true;
    if (!isOpen && moveHighlightOnOpen && !hasFiltering) {
      moveHighlight(1);
    }
    if (isOpen) {
      setFilteringValue('');
    }
    openStateProps.toggleDropdown();
  };

  const onDropdownFocusLeave = () => {
    if (hasFiltering && isOpen) {
      if (expandToViewport) {
        // When expanded to viewport the focus can't move naturally to the next element.
        // Returning the focus to the trigger instead.
        onReturnFocus();
      }
      closeDropdown();
    }
  };

  const onGroupToggle: GroupToggle = item => (!isExpanded(item) ? expandGroup(item) : collapseGroup());

  const onItemActivate: ItemActivate = (item, event) => {
    const isCheckbox = isCheckboxItem(item);
    const isLink = isLinkItem(item);
    const details = {
      id: item.id || 'undefined',
      href: isLink ? item.href : undefined,
      external: isLink ? item.external : undefined,
      target: isLink ? getItemTarget(item) : undefined,
      checked: isCheckbox ? !item.checked : undefined,
    };
    onReturnFocus();
    if (onItemFollow && isLink && isPlainLeftClick(event)) {
      fireCancelableEvent(onItemFollow, details, event);
    }
    if (onItemClick) {
      fireCancelableEvent(onItemClick, details, event);
    }
    closeDropdown();
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

  const onKeyDown = (event: React.KeyboardEvent) => {
    setIsUsingMouse(false);
    switch (event.keyCode) {
      case KeyCode.down: {
        if (!isOpen) {
          toggleDropdown();
          if (!hasFiltering) {
            moveHighlight(1, true);
          }
        } else {
          moveHighlight(1);
        }
        event.preventDefault();
        break;
      }
      case KeyCode.up: {
        if (!isOpen) {
          toggleDropdown();
          if (!hasFiltering) {
            moveHighlight(-1, true);
          }
        } else {
          moveHighlight(-1);
        }
        event.preventDefault();
        break;
      }
      case KeyCode.space: {
        // Prevent scrolling the list of items and highlighting the trigger when filtering
        // isn't active. Hitting space when filtering is active should just type a space
        // character into the input, or activate the clear button.
        if (!hasFiltering && !isOpen) {
          event.preventDefault();
        }
        break;
      }
      case KeyCode.enter: {
        // While filtering, pressing Enter without a highlighted item should not select
        // any item or close the dropdown.
        if (isOpen && hasFiltering && !targetItem) {
          break;
        }
        if (!targetItem?.disabled) {
          activate(event, true);
        }
        break;
      }
      case KeyCode.left:
      case KeyCode.right: {
        // When filtering is enabled and there's text in the filter input, left/right
        // arrow keys should move the caret between the characters.
        if (hasFiltering && filteringValue) {
          break;
        }
        if (targetItem && !targetItem.disabled && isItemGroup(targetItem) && !isExpanded(targetItem)) {
          expandGroup();
        } else if (hasExpandableGroups) {
          collapseGroup();
        }

        event.preventDefault();
        break;
      }
      case KeyCode.escape: {
        onReturnFocus();
        closeDropdown();
        event.preventDefault();
        if (isOpen) {
          event.stopPropagation();
        }
        break;
      }
      case KeyCode.tab: {
        // In filtering mode the dropdown contains multiple focusable elements (the filter
        // input and its clear button). Tabbing between them must not close the dropdown, so
        // closing on Tab is handled by onDropdownFocusLeave instead, which only fires once
        // focus actually leaves the dropdown.
        if (hasFiltering) {
          break;
        }
        // When expanded to viewport the focus can't move naturally to the next element.
        // Returning the focus to the trigger instead.
        if (expandToViewport) {
          onReturnFocus();
        }
        closeDropdown();
        break;
      }
    }
  };
  const onKeyUp = (event: React.KeyboardEvent) => {
    // When using a roving tabindex (filtering disabled), we need to handle activating items
    // with Space separately because there is a bug in Firefox where changing the focus during
    // a Space keydown event it will trigger unexpected click events on the new element.
    // See https://bugzilla.mozilla.org/show_bug.cgi?id=1220143
    if (event.keyCode === KeyCode.space && !targetItem?.disabled && !hasFiltering) {
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
    onDropdownFocusLeave,
    toggleDropdown,
    closeDropdown,
    setIsUsingMouse,
    filteringValue,
    setFilteringValue,
    filteredItems,
    showExpandableGroups,
  };
}
