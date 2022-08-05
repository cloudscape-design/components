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
  handleLoadMore,
  filteredItems,
  usingMouse,
  menuProps,
  highlightedOption,
  highlightedIndex,
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
  const rowVirtualizer = useVirtual({
    size: filteredItems.length,
    parentRef: scrollRef,
    // estimateSize is a dependency of measurements memo. We update it to force full recalculation
    // when the height of any option could have changed:
    // 1: because the component got resized (width property got updated)
    // 2: becasue the option changed its content (highlightText property controls the highlight and the visibility of hidden tags)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    estimateSize: useCallback(() => 31, [width, highlightText]),
    overscan: 5,
  });

  useEffect(() => {
    if (!usingMouse.current) {
      rowVirtualizer.scrollToIndex(highlightedIndex);
    }
  }, [usingMouse, rowVirtualizer, highlightedIndex]);

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
        style={{ height: rowVirtualizer.totalSize + (filteredItems.length === 1 ? 1 : 0) }}
      />
      {rowVirtualizer.virtualItems.map(virtualRow => {
        const { index, start, measureRef } = virtualRow;
        const item = filteredItems[index];
        const optionProps = getOptionProps(
          index,
          item,
          filteredItems,
          highlightedA11yProps,
          highlightedOption,
          hasDropdownStatus
        );

        return (
          <AutosuggestOption
            key={index}
            ref={measureRef}
            highlightText={highlightText}
            option={item}
            highlighted={item === highlightedOption}
            data-mouse-target={index}
            enteredTextLabel={enteredTextLabel}
            virtualPosition={start + (index === 0 ? 1 : 0)}
            screenReaderContent={screenReaderContent}
            ariaSetsize={filteredItems.length}
            ariaPosinset={index + 1}
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
