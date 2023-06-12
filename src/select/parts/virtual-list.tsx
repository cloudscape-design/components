// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import OptionsList from '../../internal/components/options-list';
import { renderOptions } from '../utils/render-options';
import { useVirtual } from 'react-virtual';
import { SelectListProps } from './plain-list';
import { useContainerQuery } from '../../internal/hooks/container-queries';

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
    }: SelectListProps,
    ref: React.Ref<SelectListProps.SelectListRef>
  ) => {
    // update component, when it gets wider or narrower to reposition items
    const [width, menuMeasureRef] = useContainerQuery(rect => rect.width, []);
    const menuRefObject = useRef(null);
    const menuRef = useMergeRefs(menuMeasureRef, menuRefObject, menuProps.ref);

    // The useVirtual from react-virtual@2 might produce an infinite update loop caused by setting
    // measured item sizes in the render cycle (as part of the measureRef assignment).
    // The sum of all measured item sizes is returned as totalSize which is then set on the list container.
    // Enforcing new container height might result in an items size change e.g. when the content wraps.
    // The infinite update cycle causes React "Maximum update depth exceeded" error and can be additionally confirmed
    // by logging the totalSize which should then bounce between two values.
    // Empirically it has been found out that increasing the container size slightly decreases the risk of items content
    // wrapping in one size and not wrapping in the other that prevents the infinite loop.
    const { virtualItems, totalSize, scrollToIndex } = useVirtual({
      size: filteredOptions.length,
      parentRef: menuRefObject,
      // estimateSize is a dependency of measurements memo. We update it to force full recalculation
      // when the height of any option could have changed:
      // 1: because the component got resized (width property got updated)
      // 2: because the option changed its content (filteringValue property controls the highlight and the visibility of hidden tags)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      estimateSize: useCallback(() => 31, [width, filteringValue]),
      overscan: 5,
    });
    useImperativeHandle(
      ref,
      () => (index: number) => {
        if (highlightType === 'keyboard') {
          scrollToIndex(index);
        }
      },
      [highlightType, scrollToIndex]
    );
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
      ariaSetsize: filteredOptions.length,
    });

    return (
      <OptionsList {...menuProps} ref={menuRef}>
        <div aria-hidden="true" key="total-size" className={styles['layout-strut']} style={{ height: totalSize + 1 }} />
        {finalOptions}
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
