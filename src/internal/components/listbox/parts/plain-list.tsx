// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { useMergeRefs, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { MultiselectProps } from '../../../../multiselect/interfaces';
import { SelectProps } from '../../../../select/interfaces';
import { GetOptionProps, MenuProps } from '../../../../select/utils/use-select';
import { DropdownOption } from '../../option/interfaces';
import OptionsList from '../../options-list';
import { HighlightType } from '../../options-list/utils/use-highlight-option';
import { SelectionType } from '../selection/interfaces';
import { fallbackItemHeight } from './common';
import { renderOptions } from './render-options';
import scrollToIndex from './scroll-to-index';

import styles from '../../../../select/parts/styles.css.js';

export interface SelectListProps {
  menuProps: MenuProps;
  getOptionProps: GetOptionProps;
  filteredOptions: ReadonlyArray<DropdownOption>;
  filteringValue: string;
  highlightType: HighlightType;
  hasDropdownStatus?: boolean;
  listBottom?: React.ReactNode;
  selectionType?: SelectionType;
  screenReaderContent?: string;
  firstOptionSticky?: boolean;
  isMultiSelect?: boolean;
  renderOption?: SelectProps.SelectOptionItemRenderer | MultiselectProps.MultiselectOptionItemRenderer;
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
    hasDropdownStatus,
    listBottom,
    selectionType,
    screenReaderContent,
    firstOptionSticky,
    isMultiSelect,
    renderOption,
  }: SelectListProps,
  ref: React.Ref<SelectListProps.SelectListRef>
) => {
  const idPrefix = useUniqueId('select-list-');
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

  return (
    <OptionsList
      {...menuProps}
      ref={mergedRef}
      stickyItemBlockSize={stickyOptionBlockSize}
      isMultiSelect={isMultiSelect}
    >
      {renderOptions({
        renderOption,
        options: filteredOptions,
        getOptionProps,
        filteringValue,
        idPrefix,
        highlightType,
        hasDropdownStatus,
        selectionType,
        screenReaderContent,
        firstOptionSticky,
        stickyOptionRef,
        withScrollbar,
      })}
      {listBottom ? (
        <div role="option" className={styles['list-bottom']}>
          {listBottom}
        </div>
      ) : null}
    </OptionsList>
  );
};

export default forwardRef(PlainList);
