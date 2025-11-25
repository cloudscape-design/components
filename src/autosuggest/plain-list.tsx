// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode, useEffect, useRef } from 'react';

import { getBaseProps } from '../internal/base-component';
import OptionsList, { OptionsListProps } from '../internal/components/options-list';
import { scrollElementIntoView } from '../internal/utils/scrollable-containers';
import AutosuggestOption from './autosuggest-option';
import { AutosuggestItem, AutosuggestProps } from './interfaces';
import { AutosuggestItemsState } from './options-controller';

import styles from './styles.css.js';

export interface ListProps {
  autosuggestItemsState: AutosuggestItemsState;
  menuProps: Omit<OptionsListProps, 'children'>;
  handleLoadMore: () => void;
  highlightedA11yProps: Record<string, string | number | boolean>;
  hasDropdownStatus?: boolean;
  highlightText: string;
  listBottom?: React.ReactNode;
  screenReaderContent?: string;
  renderOption?: (option: AutosuggestProps.AutosuggestItem) => ReactNode;
}

export const getOptionProps = (
  index: number,
  item: AutosuggestItem,
  filteredItems: readonly AutosuggestItem[],
  highlightedA11yProps: ListProps['highlightedA11yProps'],
  highlightedOption?: AutosuggestItem,
  hasDropdownStatus?: boolean
) => {
  const nativeAttributes = item === highlightedOption ? highlightedA11yProps : {};
  const baseOptionProps = getBaseProps(nativeAttributes);
  const isLastItem = index === filteredItems.length - 1;
  const isNotEnteredTextItem = filteredItems.length > 1;
  const padBottom = !hasDropdownStatus && isNotEnteredTextItem && isLastItem;

  return { nativeAttributes, padBottom, ...baseOptionProps };
};

const PlainList = ({
  autosuggestItemsState,
  handleLoadMore,
  menuProps,
  highlightedA11yProps,
  hasDropdownStatus,
  highlightText,
  listBottom,
  screenReaderContent,
  renderOption,
}: ListProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const item = listRef.current?.querySelector<HTMLElement>(
      `[data-mouse-target="${autosuggestItemsState.highlightedIndex}"]`
    );
    if (autosuggestItemsState.highlightType.moveFocus && item) {
      scrollElementIntoView(item);
    }
  }, [autosuggestItemsState.highlightType, autosuggestItemsState.highlightedIndex]);

  return (
    <OptionsList {...menuProps} onLoadMore={handleLoadMore} open={true} ref={listRef}>
      {autosuggestItemsState.items.map((item, index) => {
        const optionProps = getOptionProps(
          index,
          item,
          autosuggestItemsState.items,
          highlightedA11yProps,
          autosuggestItemsState.highlightedOption,
          hasDropdownStatus
        );

        return (
          <AutosuggestOption
            highlightText={highlightText}
            option={item}
            highlighted={item === autosuggestItemsState.highlightedOption}
            current={item.value === highlightText}
            key={index}
            data-mouse-target={index}
            screenReaderContent={screenReaderContent}
            highlightType={autosuggestItemsState.highlightType}
            renderOption={renderOption}
            {...optionProps}
          />
        );
      })}
      {listBottom ? (
        <div role="option" className={styles['list-bottom']}>
          {listBottom}
        </div>
      ) : null}
    </OptionsList>
  );
};

export default PlainList;
