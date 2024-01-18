// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import OptionsList from '../internal/components/options-list';

import AutosuggestOption from './autosuggest-option';
import { getOptionProps, ListProps } from './plain-list';
import styles from './styles.css.js';
import { useVirtualScroll } from '../internal/hooks/virtual-scroll';

const VirtualList = ({
  autosuggestItemsState,
  handleLoadMore,
  menuProps,
  enteredTextLabel,
  highlightedA11yProps,
  hasDropdownStatus,
  highlightText,
  listBottom,
  screenReaderContent,
}: ListProps) => {
  const scrollRef = useRef<HTMLUListElement>(null);

  const { virtualItems, totalSize, scrollToIndex } = useVirtualScroll({
    size: autosuggestItemsState.items.length,
    defaultItemSize: 31,
    containerRef: scrollRef,
  });

  useEffect(() => {
    if (autosuggestItemsState.highlightType.moveFocus) {
      scrollToIndex(autosuggestItemsState.highlightedIndex);
    }
  }, [autosuggestItemsState.highlightType, autosuggestItemsState.highlightedIndex, scrollToIndex]);

  return (
    <OptionsList
      {...menuProps}
      onLoadMore={handleLoadMore}
      ref={scrollRef}
      open={true}
      // to prevent closing the list when clicking the scrollbar on IE11
      nativeAttributes={{ unselectable: 'on' }}
    >
      <div
        aria-hidden="true"
        key="total-size"
        className={styles['layout-strut']}
        style={{ height: totalSize + (autosuggestItemsState.items.length === 1 ? 1 : 0) }}
      />
      {virtualItems.map(virtualItem => {
        const { index, start, measureRef } = virtualItem;
        const item = autosuggestItemsState.items[index];
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
            key={index}
            ref={measureRef}
            highlightText={highlightText}
            option={item}
            highlighted={item === autosuggestItemsState.highlightedOption}
            current={item.value === highlightText}
            data-mouse-target={index}
            enteredTextLabel={enteredTextLabel}
            virtualPosition={start + (index === 0 ? 1 : 0)}
            screenReaderContent={screenReaderContent}
            ariaSetsize={autosuggestItemsState.items.length}
            ariaPosinset={index + 1}
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

export default VirtualList;
