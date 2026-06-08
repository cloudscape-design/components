// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useMemo, useRef } from 'react';

import { filterOptions } from '../../autosuggest/utils/utils';
import { DropdownStatusProps } from '../../internal/components/dropdown-status/interfaces';
import { OptionDefinition, OptionGroup } from '../../internal/components/option/interfaces';
import { generateTestIndexes } from '../../internal/components/options-list/utils/test-indexes';
import {
  HighlightedOptionHandlers,
  HighlightedOptionState,
  useHighlightedOption,
} from '../../internal/components/options-list/utils/use-highlight-option';
import { PromptInputProps } from '../interfaces';
import { calculateTokenPosition } from './caret-controller';
import { generateTokenId } from './dom-utils';
import { isPinnedReferenceToken, isReferenceToken, isTriggerToken } from './type-guards';

export type MenuItem = (OptionDefinition | OptionGroup) & {
  type?: 'parent' | 'child' | 'use-entered';
  option: OptionDefinition | OptionGroup;
};

/** Props for the useMenuItems hook. */
export interface UseMenuItemsProps {
  menu: PromptInputProps.MenuDefinition;
  filterText: string;
  onSelectItem: (option: MenuItem) => void;
}

/** Current state of the menu items list, including highlight tracking. */
export interface MenuItemsState extends HighlightedOptionState<MenuItem> {
  items: readonly MenuItem[];
  showAll: boolean;
  getItemGroup: (item: MenuItem) => undefined | OptionGroup;
}

/** Handlers for navigating and selecting menu items via keyboard and mouse. */
export interface MenuItemsHandlers extends HighlightedOptionHandlers<MenuItem> {
  selectHighlightedOptionWithKeyboard(): boolean;
  highlightVisibleOptionWithMouse(index: number): void;
  selectVisibleOptionWithMouse(index: number): void;
}

interface UseMenuLoadMoreProps {
  menu: PromptInputProps.MenuDefinition;
  statusType: DropdownStatusProps.StatusType;
  onLoadItems: (detail: PromptInputProps.MenuLoadItemsDetail) => void;
  onLoadMoreItems?: () => void;
}

interface MenuLoadMoreHandlers {
  fireLoadMoreOnScroll(): void;
  fireLoadMoreOnRecoveryClick(): void;
  fireLoadMoreOnMenuOpen(): void;
  fireLoadMoreOnInputChange(filteringText: string): void;
}

function isMenuItemHighlightable(option?: MenuItem): boolean {
  return !!option && option.type !== 'parent';
}

function isMenuItemInteractive(option?: MenuItem): boolean {
  return !!option && !option.disabled && option.type !== 'parent';
}

/** Manages menu item filtering, highlighting, and selection for a trigger menu. */
export const useMenuItems = ({
  menu,
  filterText,
  onSelectItem,
}: UseMenuItemsProps): [MenuItemsState, MenuItemsHandlers] => {
  const { items, getItemGroup, getItemParent } = useMemo(() => createItems(menu.options), [menu.options]);

  const filteredItems = useMemo(() => {
    const filteringType = menu.filteringType ?? 'auto';
    const filtered: MenuItem[] =
      filteringType === 'auto' ? (filterOptions(items, filterText) as MenuItem[]) : [...items];
    generateTestIndexes(filtered, getItemParent);
    return filtered;
  }, [menu.filteringType, items, filterText, getItemParent]);

  const [highlightedOptionState, highlightedOptionHandlers] = useHighlightedOption({
    options: filteredItems,
    isHighlightable: isMenuItemHighlightable,
  });

  const selectHighlightedOptionWithKeyboard = () => {
    const { highlightedOption } = highlightedOptionState;
    if (!highlightedOption || !isMenuItemInteractive(highlightedOption)) {
      return false;
    }
    onSelectItem(highlightedOption);
    return true;
  };

  const highlightVisibleOptionWithMouse = (index: number) => {
    const item = filteredItems[index];
    if (item && isMenuItemHighlightable(item)) {
      highlightedOptionHandlers.setHighlightedIndexWithMouse(index);
    }
  };

  const selectVisibleOptionWithMouse = (index: number) => {
    const item = filteredItems[index];
    if (item && isMenuItemInteractive(item)) {
      onSelectItem(item);
    }
  };

  return [
    { ...highlightedOptionState, items: filteredItems, showAll: false, getItemGroup },
    {
      ...highlightedOptionHandlers,
      selectHighlightedOptionWithKeyboard,
      highlightVisibleOptionWithMouse,
      selectVisibleOptionWithMouse,
    },
  ];
};

function createItems(options: readonly OptionDefinition[]) {
  const items: MenuItem[] = [];
  const itemToGroup = new WeakMap<MenuItem, MenuItem>();
  const getItemParent = (item: MenuItem) => itemToGroup.get(item);
  const getItemGroup = (item: MenuItem) => getItemParent(item)?.option as OptionGroup;

  for (const option of options) {
    if (isGroup(option)) {
      for (const item of flattenGroup(option)) {
        items.push(item);
      }
    } else {
      items.push({ ...option, option });
    }
  }

  function flattenGroup(group: OptionGroup) {
    const { options, ...rest } = group;

    let hasOnlyDisabledChildren = true;

    const groupItem: MenuItem = { ...rest, type: 'parent', option: group };

    const items: MenuItem[] = [groupItem];

    for (const option of options) {
      if (!option.disabled) {
        hasOnlyDisabledChildren = false;
      }

      const childOption: MenuItem = {
        ...option,
        type: 'child',
        disabled: option.disabled || rest.disabled,
        option,
      };

      items.push(childOption);

      itemToGroup.set(childOption, groupItem);
    }

    items[0].disabled = items[0].disabled || hasOnlyDisabledChildren;

    return items;
  }

  return { items, getItemGroup, getItemParent };
}

function isGroup(optionOrGroup: OptionDefinition): optionOrGroup is OptionGroup {
  const key: keyof OptionGroup = 'options';
  return key in optionOrGroup;
}

/** Manages pagination and load-more behavior for menu items. */
export const useMenuLoadMore = ({
  menu,
  statusType,
  onLoadItems,
  onLoadMoreItems,
}: UseMenuLoadMoreProps): MenuLoadMoreHandlers => {
  const lastFilteringText = useRef<string | null>(null);

  const fireLoadMore = (firstPage: boolean, samePage: boolean, filteringText?: string) => {
    if (filteringText !== undefined && filteringText !== lastFilteringText.current) {
      lastFilteringText.current = filteringText;
    }

    if (filteringText === undefined || lastFilteringText.current !== filteringText) {
      onLoadItems({
        menuId: menu.id,
        filteringText: lastFilteringText.current ?? '',
        firstPage,
        samePage,
      });
    }
  };

  const fireLoadMoreOnScroll = () => {
    if (menu.options.length > 0 && statusType === 'pending') {
      if (onLoadMoreItems) {
        onLoadMoreItems();
      } else {
        fireLoadMore(false, false);
      }
    }
  };

  const fireLoadMoreOnRecoveryClick = () => fireLoadMore(false, true);

  const fireLoadMoreOnMenuOpen = () => fireLoadMore(true, false, lastFilteringText.current ?? '');

  const fireLoadMoreOnInputChange = (filteringText: string) => fireLoadMore(true, false, filteringText);

  return { fireLoadMoreOnScroll, fireLoadMoreOnRecoveryClick, fireLoadMoreOnMenuOpen, fireLoadMoreOnInputChange };
};

export interface MenuSelectionResult {
  tokens: PromptInputProps.InputToken[];
  caretPosition: number;
  insertedToken: PromptInputProps.ReferenceToken;
}

/** Replaces a trigger token with a reference token (or pinned token) after menu selection. */
export function handleMenuSelection(
  tokens: readonly PromptInputProps.InputToken[],
  selectedOption: { value: string; label?: string },
  menuId: string,
  isPinned: boolean,
  activeTrigger: PromptInputProps.TriggerToken
): MenuSelectionResult {
  const newTokens = [...tokens];
  const triggerIndex = newTokens.findIndex(t => isTriggerToken(t) && t.id === activeTrigger.id);

  if (isPinned) {
    const pinnedToken: PromptInputProps.ReferenceToken = {
      type: 'reference',
      id: generateTokenId(),
      label: selectedOption.label || selectedOption.value || '',
      value: selectedOption.value || '',
      menuId,
      pinned: true,
    };

    newTokens.splice(triggerIndex, 1);

    let insertIndex = 0;
    while (insertIndex < newTokens.length && isPinnedReferenceToken(newTokens[insertIndex])) {
      insertIndex++;
    }

    newTokens.splice(insertIndex, 0, pinnedToken);
    const caretPos = calculateTokenPosition(newTokens, insertIndex);
    return { tokens: newTokens, caretPosition: caretPos, insertedToken: pinnedToken };
  }

  const referenceToken: PromptInputProps.ReferenceToken = {
    type: 'reference',
    id: generateTokenId(),
    label: selectedOption.label || selectedOption.value || '',
    value: selectedOption.value || '',
    menuId,
  };

  newTokens.splice(triggerIndex, 1, referenceToken);
  const insertedIndex = newTokens.findIndex(t => isReferenceToken(t) && t.id === referenceToken.id);
  const caretPos = calculateTokenPosition(newTokens, insertedIndex);
  return { tokens: newTokens, caretPosition: caretPos, insertedToken: referenceToken };
}
