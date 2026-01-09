// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { filterOptions } from '../../autosuggest/utils/utils';
import { OptionDefinition, OptionGroup } from '../../internal/components/option/interfaces';
import { generateTestIndexes } from '../../internal/components/options-list/utils/test-indexes';
import {
  HighlightedOptionHandlers,
  HighlightedOptionState,
  useHighlightedOption,
} from '../../internal/components/options-list/utils/use-highlight-option';
import { PromptInputProps } from '../interfaces';

export type MenuItem = (OptionDefinition | OptionGroup) & {
  type?: 'parent' | 'child';
  option: OptionDefinition | OptionGroup;
};

export interface UseMenuItemsProps {
  menu: PromptInputProps.MenuDefinition;
  filterText: string;
  onSelectItem: (option: MenuItem) => void;
}

export interface MenuItemsState extends HighlightedOptionState<MenuItem> {
  items: readonly MenuItem[];
  showAll: boolean;
  getItemGroup: (item: MenuItem) => undefined | OptionGroup;
}

export interface MenuItemsHandlers extends HighlightedOptionHandlers<MenuItem> {
  selectHighlightedOptionWithKeyboard(): boolean;
  highlightVisibleOptionWithMouse(index: number): void;
  selectVisibleOptionWithMouse(index: number): void;
}

const isHighlightable = (option?: MenuItem) => {
  return !!option && option.type !== 'parent';
};

const isInteractive = (option?: MenuItem) => !!option && !option.disabled && option.type !== 'parent';

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
    isHighlightable,
  });

  const selectHighlightedOptionWithKeyboard = () => {
    const { highlightedOption } = highlightedOptionState;
    if (!highlightedOption || !isInteractive(highlightedOption)) {
      return false;
    }
    onSelectItem(highlightedOption);
    return true;
  };

  const highlightVisibleOptionWithMouse = (index: number) => {
    const item = filteredItems[index];
    if (item && isHighlightable(item)) {
      highlightedOptionHandlers.setHighlightedIndexWithMouse(index);
    }
  };

  const selectVisibleOptionWithMouse = (index: number) => {
    const item = filteredItems[index];
    if (item && isInteractive(item)) {
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
  return 'options' in optionOrGroup;
}
