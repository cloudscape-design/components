// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import { DropdownOption } from '../../internal/components/option/interfaces';
import OptionsList from '../../internal/components/options-list';
import { HighlightType } from '../../internal/components/options-list/utils/use-highlight-option';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import MultiselectItem from '../parts/multiselect-item';
import { getItemProps } from '../utils/get-item-props';
import { renderOptions } from '../utils/render-options';
import scrollToIndex from '../utils/scroll-to-index';
import { GetOptionProps, MenuProps } from '../utils/use-select';
import { fallbackItemHeight } from './common';

import styles from './styles.css.js';

export interface SelectListProps {
  menuProps: MenuProps;
  getOptionProps: GetOptionProps;
  filteredOptions: ReadonlyArray<DropdownOption>;
  filteringValue: string;
  highlightType: HighlightType;
  checkboxes?: boolean;
  hasDropdownStatus?: boolean;
  listBottom?: React.ReactNode;
  useInteractiveGroups?: boolean;
  screenReaderContent?: string;
  firstOptionSticky?: boolean;
}

export namespace SelectListProps {
  export type SelectListRef = (index: number) => void;
}

const PlainList = (
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
  const stickyOptionRef = useRef<HTMLDivElement>(null);
  const [stickyOptionBlockSize, setStickyOptionBlockSize] = useState(firstOptionSticky ? fallbackItemHeight : 0);

  const [width, menuMeasureRef] = useContainerQuery(rect => {
    if (stickyOptionRef.current) {
      // Cannot use container query on the sticky option individually because it is not rendered until the dropdown is open.
      // Not expecting the sticky option to change size without the dropdown also changing size.

      // The effects of using the sticky option block size to set the menu scroll padding are covered by integration tests.
      // istanbul ignore next
      setStickyOptionBlockSize(stickyOptionRef.current.clientHeight);
    }
    return { inner: rect.contentBoxWidth, outer: rect.borderBoxWidth };
  });

  const menuRef = menuProps.ref;

  const mergedRef = useMergeRefs(menuMeasureRef, menuRef);

  useImperativeHandle(
    ref,
    () => (index: number) => {
      const isSticky = firstOptionSticky && index === 0;
      if (highlightType.moveFocus && menuRef.current && !isSticky) {
        scrollToIndex({ index, menuEl: menuRef.current });
      }
    },
    [firstOptionSticky, highlightType.moveFocus, menuRef]
  );

  const withScrollbar = !!width && width.inner < width.outer;

  const stickyOption = firstOptionSticky ? filteredOptions[0] : null;
  const nonStickyFilteredOptions = firstOptionSticky ? filteredOptions.slice(1) : filteredOptions;

  return (
    <OptionsList {...menuProps} ref={mergedRef} stickyItemBlockSize={stickyOptionBlockSize}>
      {stickyOption ? (
        <MultiselectItem
          key={0}
          {...getItemProps({
            option: stickyOption,
            index: 0,
            getOptionProps,
            filteringValue: '',
            checkboxes: !!checkboxes,
          })}
          ref={stickyOptionRef}
          option={stickyOption}
          screenReaderContent={screenReaderContent}
          highlightType={highlightType.type}
          withScrollbar={withScrollbar}
          sticky={true}
        />
      ) : null}
      {renderOptions({
        options: nonStickyFilteredOptions,
        getOptionProps,
        filteringValue,
        highlightType,
        checkboxes,
        hasDropdownStatus,
        useInteractiveGroups,
        screenReaderContent,
        startIndexAt: firstOptionSticky ? 1 : 0,
      })}
      {listBottom ? (
        <li role="option" className={styles['list-bottom']}>
          {listBottom}
        </li>
      ) : null}
    </OptionsList>
  );
};

export default forwardRef(PlainList);
