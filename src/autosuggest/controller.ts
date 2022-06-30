// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useMemo } from 'react';
import { CancelableEventHandler, BaseKeyDetail } from '../internal/events';
import { filterOptions } from './utils/utils';
import { KeyCode } from '../internal/keycode';
import { generateTestIndexes } from '../internal/components/options-list/utils/test-indexes';
import { AutosuggestItem, AutosuggestProps } from './interfaces';

type Options = AutosuggestProps.Options;

const parentMap = new WeakMap<AutosuggestItem, AutosuggestItem>();
export const getParentGroup = (item: AutosuggestItem) => parentMap.get(item);

export const useAutosuggestItems = (options: Options = []) => {
  return useMemo(() => createItems(options), [options]);
};

function createItems(options: Options): AutosuggestItem[] {
  const items: AutosuggestItem[] = [];
  for (const option of options) {
    if (isGroup(option)) {
      items.push(...flattenGroup(option));
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
  const hasOnlyDisabledChildren = options.every(option => option.disabled);
  const parent: AutosuggestItem = {
    ...rest,
    type: 'parent',
    disabled: rest.disabled || hasOnlyDisabledChildren,
    option: group,
  };
  const children: AutosuggestItem[] = options.map(option => ({
    ...option,
    type: 'child',
    disabled: option.disabled || parent.disabled,
    option,
  }));
  // TODO: Refactor parentMap and remove this side effect
  children.forEach(child => parentMap.set(child, { ...group, option: group }));
  return [parent].concat(children);
}

export const useFilteredItems = (
  autosuggestItems: AutosuggestItem[],
  value: string,
  filterText: string,
  filteringType: AutosuggestProps.FilteringType,
  showAll: boolean,
  __hideEnteredTextLabel?: boolean
) =>
  useMemo(() => {
    const filteredItems =
      filteringType === 'auto' && !showAll ? filterOptions(autosuggestItems, filterText) : [...autosuggestItems];
    if (value && !__hideEnteredTextLabel) {
      filteredItems.unshift({ value, type: 'use-entered', option: { value } });
    }
    generateTestIndexes(filteredItems, getParentGroup);
    return filteredItems;
  }, [autosuggestItems, value, filterText, filteringType, showAll, __hideEnteredTextLabel]);

export const useSelectVisibleOption = (
  filteredItems: AutosuggestItem[],
  selectOption: (option: AutosuggestItem) => void,
  isInteractive: (option: AutosuggestItem) => boolean
) =>
  useCallback(
    (index: number) => {
      const option = filteredItems[index];
      if (option && isInteractive(option)) {
        selectOption(option);
      }
    },
    [filteredItems, selectOption, isInteractive]
  );

export const useHighlightVisibleOption = (
  filteredItems: AutosuggestItem[],
  setHighlightedIndex: (index: number) => void,
  isHighlightable: (option: AutosuggestItem) => boolean
) =>
  useCallback(
    (index: number) => {
      const option = filteredItems[index];
      if (option && isHighlightable(option)) {
        setHighlightedIndex(index);
      }
    },
    [filteredItems, setHighlightedIndex, isHighlightable]
  );

export const useKeyboardHandler = (
  moveHighlight: (direction: -1 | 1) => void,
  openDropdown: () => void,
  selectHighlighted: () => void,
  usingMouse: React.MutableRefObject<boolean>,
  open: boolean,
  onKeyDown?: CancelableEventHandler<BaseKeyDetail>
) => {
  return useCallback(
    (e: CustomEvent<BaseKeyDetail>) => {
      switch (e.detail.keyCode) {
        case KeyCode.down: {
          moveHighlight(1);
          openDropdown();
          usingMouse.current = false;
          e.preventDefault();
          break;
        }
        case KeyCode.up: {
          moveHighlight(-1);
          openDropdown();
          usingMouse.current = false;
          e.preventDefault();
          break;
        }
        case KeyCode.enter: {
          if (open) {
            selectHighlighted();
            e.preventDefault();
          }
          onKeyDown && onKeyDown(e);
          break;
        }
        default: {
          onKeyDown && onKeyDown(e);
        }
      }
    },
    [moveHighlight, selectHighlighted, onKeyDown, usingMouse, open, openDropdown]
  );
};
