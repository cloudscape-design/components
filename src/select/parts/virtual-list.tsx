// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import OptionsList from '../../internal/components/options-list';
import { renderOptions } from '../utils/render-options';
import { SelectListProps } from './plain-list';

import styles from './styles.css.js';
import { useVirtual } from '../../internal/hooks/use-virtual';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';

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
    const [width, menuMeasureRef] = useContainerQuery(rect => rect.contentBoxWidth, []);
    const menuRefObject = useRef(null);
    const menuRef = useMergeRefs(menuMeasureRef, menuRefObject, menuProps.ref);

    const { virtualItems, totalSize, scrollToIndex, measureElement } = useVirtual({
      items: filteredOptions,
      parentRef: menuRefObject,
      // estimateSize is a dependency of measurements memo. We update it to force full recalculation
      // when the height of any option could have changed:
      // 1: because the component got resized (width property got updated)
      // 2: because the option changed its content (filteringValue property controls the highlight and the visibility of hidden tags)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      estimateSize: useCallback(() => 31, [width, filteringValue]),
    });

    useImperativeHandle(
      ref,
      () => (index: number) => {
        if (highlightType.moveFocus) {
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
      measureElement,
      useInteractiveGroups,
      screenReaderContent,
      ariaSetsize: filteredOptions.length,
    });

    return (
      <OptionsList {...menuProps} ref={menuRef}>
        <div aria-hidden="true" key="total-size" className={styles['layout-strut']} style={{ height: totalSize }} />
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
