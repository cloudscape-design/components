// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import OptionsList from '../../internal/components/options-list';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import { useVirtual } from '../../internal/hooks/use-virtual';
import { renderOptions } from '../utils/render-options';
import customScrollToIndex from '../utils/scroll-to-index';
import { fallbackItemHeight } from './common';
import { SelectListProps } from './plain-list';

import styles from './styles.css.js';

const VirtualList = (props: SelectListProps, ref: React.Ref<SelectListProps.SelectListRef>) => {
  return props.menuProps.open ? <VirtualListOpen {...props} ref={ref} /> : <VirtualListClosed {...props} ref={ref} />;
};

const VirtualListOpen = forwardRef(
  (
    {
      menuProps,
      getOptionProps,
      filteredOptions,
      filteringValue,
      highlightType,
      checkboxes,
      hasDropdownStatus,
      listBottom,
      useInteractiveGroups,
      screenReaderContent,
      firstOptionSticky,
    }: SelectListProps,
    ref: React.Ref<SelectListProps.SelectListRef>
  ) => {
    // update component, when it gets wider or narrower to reposition items
    const [width, menuMeasureRef] = useContainerQuery(
      rect => ({ inner: rect.contentBoxWidth, outer: rect.borderBoxWidth }),
      []
    );
    const menuRefObject = useRef(null);
    const menuRef = useMergeRefs(menuMeasureRef, menuRefObject, menuProps.ref);
    const previousHighlightedIndex = useRef<number>();
    const { virtualItems, totalSize, scrollToIndex } = useVirtual({
      items: filteredOptions,
      parentRef: menuRefObject,
      // estimateSize is a dependency of measurements memo. We update it to force full recalculation
      // when the height of any option could have changed:
      // 1: because the component got resized (width property got updated)
      // 2: because the option changed its content (filteringValue property controls the highlight and the visibility of hidden tags)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      estimateSize: useCallback(() => fallbackItemHeight, [width?.inner, filteringValue]),
      firstItemSticky: firstOptionSticky,
    });

    useImperativeHandle(
      ref,
      () => (index: number) => {
        if (highlightType.moveFocus) {
          const movingUp = previousHighlightedIndex.current !== undefined && index < previousHighlightedIndex.current;
          if (firstOptionSticky && movingUp && index !== 0 && menuRefObject.current) {
            // React-Virtual v2 does not offer a proper way to handle sticky elements when scrolling,
            // so until we upgrade to v3, use our own scroll implementation
            // to prevent newly highlighted element from being covered by the sticky element
            // when moving the highlight upwards in the list.

            // Scrolling behavior is covered by integration tests.
            // istanbul ignore next
            customScrollToIndex({
              index,
              menuEl: menuRefObject?.current,
            });
          } else {
            scrollToIndex(index);
          }
        }
        previousHighlightedIndex.current = index;
      },
      [firstOptionSticky, highlightType.moveFocus, scrollToIndex]
    );

    const stickySize = firstOptionSticky ? virtualItems[0].size : 0;
    const withScrollbar = !!width && width.inner < width.outer;

    const finalOptions = renderOptions({
      options: virtualItems.map(({ index }) => filteredOptions[index]),
      getOptionProps,
      filteringValue,
      highlightType,
      checkboxes,
      hasDropdownStatus,
      virtualItems,
      useInteractiveGroups,
      screenReaderContent,
      firstOptionSticky,
      withScrollbar,
    });

    return (
      <OptionsList {...menuProps} stickyItemBlockSize={stickySize} ref={menuRef}>
        {finalOptions}
        <div
          aria-hidden="true"
          key="total-size"
          className={styles['layout-strut']}
          style={{ height: totalSize - stickySize }}
        />
        {listBottom ? (
          <li role="option" className={styles['list-bottom']}>
            {listBottom}
          </li>
        ) : null}
      </OptionsList>
    );
  }
);

const VirtualListClosed = forwardRef(
  ({ menuProps, listBottom }: SelectListProps, ref: React.Ref<SelectListProps.SelectListRef>) => {
    useImperativeHandle(ref, () => () => {}, []);
    return (
      <OptionsList {...menuProps} ref={menuProps.ref}>
        {listBottom ? (
          <li role="option" className={styles['list-bottom']}>
            {listBottom}
          </li>
        ) : null}
      </OptionsList>
    );
  }
);

export default forwardRef(VirtualList);
