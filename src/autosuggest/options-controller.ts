// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useMemo, useState } from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { useInternalI18n } from '../i18n/context';
import { generateTestIndexes } from '../internal/components/options-list/utils/test-indexes';
import {
  HighlightedOptionHandlers,
  HighlightedOptionState,
  useHighlightedOption,
} from '../internal/components/options-list/utils/use-highlight-option';
import { AutosuggestItem, AutosuggestProps } from './interfaces';
import { filterOptions } from './utils/utils';

type Options = AutosuggestProps.Options;

export interface UseAutosuggestItemsProps {
  options: Options;
  filterValue: string;
  filterText: string;
  filteringType: AutosuggestProps.FilteringType;
  enteredTextLabel?: AutosuggestProps.EnteredTextLabel;
  hideEnteredTextLabel?: boolean;
  onSelectItem: (option: AutosuggestItem) => void;
}

export interface AutosuggestItemsState extends HighlightedOptionState<AutosuggestItem> {
  items: readonly AutosuggestItem[];
  showAll: boolean;
  getItemGroup: (item: AutosuggestItem) => undefined | AutosuggestProps.OptionGroup;
}

export interface AutosuggestItemsHandlers extends HighlightedOptionHandlers<AutosuggestItem> {
  setShowAll(value: boolean): void;
  selectHighlightedOptionWithKeyboard(): boolean;
  highlightVisibleOptionWithMouse(index: number): void;
  selectVisibleOptionWithMouse(index: number): void;
}

const isHighlightable = (option?: AutosuggestItem) => {
  return !!option && option.type !== 'parent';
};

const isInteractive = (option?: AutosuggestItem) => !!option && !option.disabled && option.type !== 'parent';

export const useAutosuggestItems = ({
  options,
  filterValue,
  filterText,
  filteringType,
  enteredTextLabel,
  hideEnteredTextLabel,
  onSelectItem,
}: UseAutosuggestItemsProps): [AutosuggestItemsState, AutosuggestItemsHandlers] => {
  const i18n = useInternalI18n('autosuggest');
  const [showAll, setShowAll] = useState(false);

  const { items, getItemGroup, getItemParent } = useMemo(() => createItems(options), [options]);

  const enteredItemLabel = i18n('enteredTextLabel', enteredTextLabel?.(filterValue), format =>
    format({ value: filterValue })
  );

  if (!enteredItemLabel) {
    warnOnce('Autosuggest', 'A value for enteredTextLabel must be provided.');
  }

  const filteredItems = useMemo(() => {
    const filteredItems = filteringType === 'auto' && !showAll ? filterOptions(items, filterText) : [...items];
    if (filterValue && !hideEnteredTextLabel) {
      filteredItems.unshift({
        value: filterValue,
        type: 'use-entered',
        label: enteredItemLabel,
        option: { value: filterValue },
      });
    }
    generateTestIndexes(filteredItems, getItemParent);
    return filteredItems;
  }, [filteringType, showAll, items, filterText, filterValue, hideEnteredTextLabel, getItemParent, enteredItemLabel]);

  const [highlightedOptionState, highlightedOptionHandlers] = useHighlightedOption({
    options: filteredItems,
    isHighlightable,
  });

  const selectHighlightedOptionWithKeyboard = () => {
    if (highlightedOptionState.highlightedOption && !isInteractive(highlightedOptionState.highlightedOption)) {
      // skip selection when a non-interactive item is active
      return false;
    }
    onSelectItem(
      highlightedOptionState.highlightedOption ?? {
        // put use-entered item as a fallback
        value: filterValue,
        type: 'use-entered',
        option: { value: filterValue },
      }
    );
    return true;
  };

  const highlightVisibleOptionWithMouse = (index: number) => {
    if (filteredItems[index] && isHighlightable(filteredItems[index])) {
      highlightedOptionHandlers.setHighlightedIndexWithMouse(index);
    }
  };

  const selectVisibleOptionWithMouse = (index: number) => {
    if (filteredItems[index] && isInteractive(filteredItems[index])) {
      onSelectItem(filteredItems[index]);
    }
  };

  return [
    { ...highlightedOptionState, items: filteredItems, showAll, getItemGroup },
    {
      ...highlightedOptionHandlers,
      setShowAll,
      selectHighlightedOptionWithKeyboard,
      highlightVisibleOptionWithMouse,
      selectVisibleOptionWithMouse,
    },
  ];
};

function createItems(options: Options) {
  const items: AutosuggestItem[] = [];
  const itemToGroup = new WeakMap<AutosuggestItem, AutosuggestItem>();
  const getItemParent = (item: AutosuggestItem) => itemToGroup.get(item);
  const getItemGroup = (item: AutosuggestItem) => getItemParent(item)?.option as AutosuggestProps.OptionGroup;

  for (const option of options) {
    if (isGroup(option)) {
      for (const item of flattenGroup(option)) {
        items.push(item);
      }
    } else {
      items.push({ ...option, option });
    }
  }

  function flattenGroup(group: AutosuggestProps.OptionGroup) {
    const { options, ...rest } = group;

    let hasOnlyDisabledChildren = true;

    const groupItem: AutosuggestItem = { ...rest, type: 'parent', option: group };

    const items: AutosuggestItem[] = [groupItem];

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

      itemToGroup.set(childOption, groupItem);
    }

    items[0].disabled = items[0].disabled || hasOnlyDisabledChildren;

    return items;
  }

  return { items, getItemGroup, getItemParent };
}

function isGroup(optionOrGroup: AutosuggestProps.Option): optionOrGroup is AutosuggestProps.OptionGroup {
  return 'options' in optionOrGroup;
}
