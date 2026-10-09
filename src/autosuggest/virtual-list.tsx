// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useImperativeHandle, useRef } from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import OptionsList from '../internal/components/options-list';
import { useVirtual } from '../internal/hooks/use-virtual';
import AutosuggestOption from './autosuggest-option';
import { getOptionProps, ListProps } from './plain-list';
import { getParentProps } from './utils/parent-props';

import styles from './styles.css.js';

const VirtualList = ({
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
  const scrollRef = useRef<HTMLDivElement>(null);
  // update component, when it gets wider or narrower to reposition items
  const [width, strutRef] = useContainerQuery(rect => rect.contentBoxWidth, []);
  useImperativeHandle(strutRef, () => scrollRef.current);

  const { virtualItems, totalSize, scrollToIndex } = useVirtual({
    items: autosuggestItemsState.items,
    parentRef: scrollRef,
    // estimateSize is a dependency of measurements memo. We update it to force full recalculation
    // when the height of any option could have changed:
    // 1: because the component got resized (width property got updated)
    // 2: because the option changed its content (highlightText property controls the highlight and the visibility of hidden tags)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    estimateSize: useCallback(() => 31, [width, highlightText]),
  });

  // Scroll when the highlight changes and moveFocus is true. The scrollToIndex identity changes
  // whenever the number of items changes (e.g. when the next page of options is loaded), which
  // shouldn't reset the scroll position either.
  const scrollToHighlightedIndex = useStableCallback(scrollToIndex);
  useEffect(() => {
    if (autosuggestItemsState.highlightType.moveFocus) {
      const index = autosuggestItemsState.highlightedIndex;
      scrollToHighlightedIndex(index);
      // Options are rendered with estimated sizes and measured afterwards, which can push the highlighted option out
      // of view (e.g. when jumping to the last option). With React 18 the measurement happens after react-virtual's own
      // retry, so retry once more after it.
      const timeout = setTimeout(() => scrollToHighlightedIndex(index), 0);
      return () => clearTimeout(timeout);
    }
  }, [autosuggestItemsState.highlightType, autosuggestItemsState.highlightedIndex, scrollToHighlightedIndex]);

  let lastGroupIndex = -1;

  return (
    <OptionsList {...menuProps} onLoadMore={handleLoadMore} ref={scrollRef} open={true}>
      <div
        aria-hidden="true"
        key="total-size"
        className={styles['layout-strut']}
        style={{ height: totalSize + (autosuggestItemsState.items.length === 1 ? 1 : 0) }}
      />
      {virtualItems.map(virtualRow => {
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

        const { parentProps, updatedLastGroupIndex } = getParentProps(item, index, lastGroupIndex, index);
        lastGroupIndex = updatedLastGroupIndex;

        return (
          <AutosuggestOption
            parentProps={parentProps}
            index={index}
            virtualIndex={index}
            renderOption={renderOption}
            key={index}
            ref={measureRef}
            highlightText={highlightText}
            option={item}
            highlighted={item === autosuggestItemsState.highlightedOption}
            current={item.value === highlightText}
            data-mouse-target={index}
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
        <div role="option" className={styles['list-bottom']}>
          {listBottom}
        </div>
      ) : null}
    </OptionsList>
  );
};

export default VirtualList;
