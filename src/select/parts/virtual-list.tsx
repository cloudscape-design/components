// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import OptionsList from '../../internal/components/options-list';
import { renderOptions } from '../utils/render-options';
import { SelectListProps } from './plain-list';

import styles from './styles.css.js';
import { useVirtualScroll } from '../../internal/hooks/virtual-scroll';

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
    const menuRefObject = useRef(null);
    const menuRef = useMergeRefs(menuRefObject, menuProps.ref);

    const { virtualItems, totalSize, scrollToIndex } = useVirtualScroll(
      {
        size: filteredOptions.length,
        containerRef: menuRefObject,
        defaultItemSize: 31,
      },
      [filteringValue]
    );

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
