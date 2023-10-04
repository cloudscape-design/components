// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useImperativeHandle, useRef } from 'react';

import OptionsList from '../internal/components/options-list';

import AutosuggestOption from './autosuggest-option';
import { getOptionProps, ListProps } from './plain-list';
import styles from './styles.css.js';
import { useVirtual } from '../internal/hooks/use-virtual';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';

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
  // update component, when it gets wider or narrower to reposition items
  const [width, strutRef] = useContainerQuery(rect => rect.contentBoxWidth, []);
  useImperativeHandle(strutRef, () => scrollRef.current);

  const rowVirtualizer = useVirtual({
    items: autosuggestItemsState.items,
    parentRef: scrollRef,
    // estimateSize is a dependency of measurements memo. We update it to force full recalculation
    // when the height of any option could have changed:
    // 1: because the component got resized (width property got updated)
    // 2: because the option changed its content (highlightText property controls the highlight and the visibility of hidden tags)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    estimateSize: useCallback(() => 31, [width, highlightText]),
  });

  useEffect(() => {
    if (autosuggestItemsState.highlightType === 'keyboard') {
      rowVirtualizer.scrollToIndex(autosuggestItemsState.highlightedIndex);
    }
  }, [autosuggestItemsState.highlightType, autosuggestItemsState.highlightedIndex, rowVirtualizer]);

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
        style={{ height: rowVirtualizer.totalSize + (autosuggestItemsState.items.length === 1 ? 1 : 0) }}
      />
      {rowVirtualizer.virtualItems.map(virtualRow => {
        const { index, start, measureRef } = virtualRow;
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
