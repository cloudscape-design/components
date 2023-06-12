// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { useVirtual } from 'react-virtual';

import OptionsList from '../internal/components/options-list';
import { useContainerQuery } from '../internal/hooks/container-queries';

import AutosuggestOption from './autosuggest-option';
import { getOptionProps, ListProps } from './plain-list';
import styles from './styles.css.js';

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
  const [width, strutRef] = useContainerQuery(rect => rect.width, []);
  useImperativeHandle(strutRef, () => scrollRef.current);

  // The useVirtual from react-virtual@2 might produce an infinite update loop caused by setting
  // measured item sizes in the render cycle (as part of the measureRef assignment).
  // The sum of all measured item sizes is returned as totalSize which is then set on the list container.
  // Enforcing new container height might result in an items size change e.g. when the content wraps.
  // The infinite update cycle causes React "Maximum update depth exceeded" error and can be additionally confirmed
  // by logging the totalSize which should then bounce between two values.
  // Empirically it has been found out that increasing the container size slightly decreases the risk of items content
  // wrapping in one size and not wrapping in the other that prevents the infinite loop.
  const rowVirtualizer = useVirtual({
    size: autosuggestItemsState.items.length,
    parentRef: scrollRef,
    // estimateSize is a dependency of measurements memo. We update it to force full recalculation
    // when the height of any option could have changed:
    // 1: because the component got resized (width property got updated)
    // 2: because the option changed its content (highlightText property controls the highlight and the visibility of hidden tags)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    estimateSize: useCallback(() => 31, [width, highlightText]),
    overscan: 5,
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
        style={{ height: rowVirtualizer.totalSize + 1 }}
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
