// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useMemo, useState } from 'react';
import { filterOptions } from './utils/utils';
import { generateTestIndexes } from '../internal/components/options-list/utils/test-indexes';
import { AutosuggestItem, AutosuggestProps } from './interfaces';
import {
  HighlightedOptionHandlers,
  HighlightedOptionState,
  useHighlightedOption,
} from '../internal/components/options-list/utils/use-highlight-option';

type Options = AutosuggestProps.Options;

export interface UseAutosuggestItemsProps {
  options: Options;
  filterValue: string;
  filterText: string;
  filteringType: AutosuggestProps.FilteringType;
  hideEnteredTextLabel?: boolean;
  onSelectItem: (option: AutosuggestItem) => void;
}

export interface AutosuggestItemsState extends HighlightedOptionState<AutosuggestItem> {
  items: readonly AutosuggestItem[];
  showAll: boolean;
}

export interface AutosuggestItemsHandlers extends HighlightedOptionHandlers<AutosuggestItem> {
  setShowAll(value: boolean): void;
  selectHighlightedOptionWithKeyboard(): boolean;
}

const isHighlightable = (option?: AutosuggestItem) => {
  return !!option && option.type !== 'parent';
};

const parentMap = new WeakMap<AutosuggestItem, AutosuggestItem>();
export const getParentGroup = (item: AutosuggestItem) => parentMap.get(item);

const isInteractive = (option?: AutosuggestItem) => !!option && !option.disabled && option.type !== 'parent';

export const useAutosuggestItems = ({
  options,
  filterValue,
  filterText,
  filteringType,
  hideEnteredTextLabel,
  onSelectItem,
}: UseAutosuggestItemsProps): [AutosuggestItemsState, AutosuggestItemsHandlers] => {
  const [showAll, setShowAll] = useState(false);

  const items = useMemo(() => createItems(options), [options]);

  const filteredItems = useMemo(() => {
    const filteredItems = filteringType === 'auto' && !showAll ? filterOptions(items, filterText) : [...items];
    if (filterValue && !hideEnteredTextLabel) {
      filteredItems.unshift({ value: filterValue, type: 'use-entered', option: { value: filterValue } });
    }
    generateTestIndexes(filteredItems, getParentGroup);
    return filteredItems;
  }, [items, filterValue, filterText, filteringType, showAll, hideEnteredTextLabel]);

  const [highlightedOptionState, highlightedOptionHandlers] = useHighlightedOption({
    options: filteredItems,
    isHighlightable,
  });

  const selectHighlightedOptionWithKeyboard = () => {
    if (highlightedOptionState.highlightedOption && isInteractive(highlightedOptionState.highlightedOption)) {
      onSelectItem(highlightedOptionState.highlightedOption);
      return true;
    }
    return false;
  };

  return [
    { items: filteredItems, showAll, ...highlightedOptionState },
    { setShowAll, selectHighlightedOptionWithKeyboard, ...highlightedOptionHandlers },
  ];
};

function createItems(options: Options): AutosuggestItem[] {
  const items: AutosuggestItem[] = [];
  for (const option of options) {
    if (isGroup(option)) {
      for (const item of flattenGroup(option)) {
        items.push(item);
      }
    } else {
      items.push({ ...option, option });
    }
  }
  return items;
}

function isGroup(optionOrGroup: AutosuggestProps.Option): optionOrGroup is AutosuggestProps.OptionGroup {
  return 'options' in optionOrGroup;
}

function flattenGroup(group: AutosuggestProps.OptionGroup): AutosuggestItem[] {
  const { options, ...rest } = group;

  let hasOnlyDisabledChildren = true;

  const items: AutosuggestItem[] = [{ ...rest, type: 'parent', option: group }];

  for (const option of options) {
    if (!option.disabled) {
      hasOnlyDisabledChildren = false;
    }

    const childOption: AutosuggestItem = {
      ...option,
      type: 'child',
      disabled: option.disabled || rest.disabled,
      option,
    };

    items.push(childOption);

    // TODO: Refactor parentMap and remove this side effect
    parentMap.set(childOption, { ...group, option: group });
  }

  items[0].disabled = items[0].disabled || hasOnlyDisabledChildren;

  return items;
}
