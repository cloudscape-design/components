// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import OptionsList, { OptionsListProps } from '../internal/components/options-list';
import { scrollElementIntoView } from '../internal/utils/scrollable-containers';
import { getBaseProps } from '../internal/base-component';

import AutosuggestOption from './autosuggest-option';
import { AutosuggestItem } from './interfaces';
import styles from './styles.css.js';
import { AutosuggestItemsState } from './options-controller';

export interface ListProps {
  autosuggestItemsState: AutosuggestItemsState;
  menuProps: Omit<OptionsListProps, 'children'>;
  handleLoadMore: () => void;
  highlightedA11yProps: Record<string, string | number | boolean>;
  hasDropdownStatus?: boolean;
  highlightText: string;
  listBottom?: React.ReactNode;
  screenReaderContent?: string;
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
}: ListProps) => {
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const item = listRef.current?.querySelector<HTMLElement>(
      `[data-mouse-target="${autosuggestItemsState.highlightedIndex}"]`
    );
    if (autosuggestItemsState.highlightType.moveFocus && item) {
      scrollElementIntoView(item);
    }
  }, [autosuggestItemsState.highlightType, autosuggestItemsState.highlightedIndex]);

  return (
    <OptionsList
      {...menuProps}
      onLoadMore={handleLoadMore}
      open={true}
      ref={listRef}
      // to prevent closing the list when clicking the scrollbar on IE11
      nativeAttributes={{ unselectable: 'on' }}
    >
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
            {...optionProps}
          />
        );
      })}
      {listBottom ? (
        <li role="option" className={styles['list-bottom']}>
          {listBottom}
        </li>
      ) : null}
    </OptionsList>
  );
};

export default PlainList;
