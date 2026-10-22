// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { useMergeRefs, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { DropdownOption } from '../../option/interfaces';
import OptionsList from '../../options-list';
import { HighlightType } from '../../options-list/utils/use-highlight-option';
import { SelectionType } from '../selection/interfaces';
import { GetOptionProps, ListElementProps } from '../use-listbox';
import { fallbackItemHeight } from './common';
import { ItemProps } from './item';
import { renderOptions } from './render-options';
import scrollToIndex, { scrollOptionIntoView } from './scroll-to-index';

import styles from './styles.css.js';

export interface ListProps {
  listProps: ListElementProps;
  getOptionProps: GetOptionProps;
  options: ReadonlyArray<DropdownOption>;
  filteringValue: string;
  highlightType: HighlightType;
  selectionType: SelectionType;
  hasDropdownStatus?: boolean;
  listBottom?: React.ReactNode;
  screenReaderContent?: string;
  firstOptionSticky?: boolean;
  renderOption?: ItemProps['renderOption'];
  /**
   * How the highlighted option is scrolled into view. Defaults to `list`, which scrolls only the list element.
   * `nearest` scrolls the option into view through all scrollable ancestors.
   */
  scrollStrategy?: ScrollStrategy;
}

export type ScrollStrategy = 'list' | 'nearest';

export namespace ListProps {
  /** Scrolls the option at the given index into view. */
  export type ListRef = (index: number) => void;
}

const List = (
  {
    listProps,
    getOptionProps,
    options,
    filteringValue,
    highlightType,
    selectionType,
    hasDropdownStatus,
    listBottom,
    screenReaderContent,
    firstOptionSticky,
    renderOption,
    scrollStrategy = 'list',
  }: ListProps,
  ref: React.Ref<ListProps.ListRef>
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

  const menuRef = listProps.ref;

  const mergedRef = useMergeRefs(menuMeasureRef, menuRef);

  useImperativeHandle(
    ref,
    () => (index: number) => {
      const isSticky = firstOptionSticky && index === 0;
      if (highlightType.moveFocus && menuRef.current && !isSticky) {
        if (scrollStrategy === 'nearest') {
          scrollOptionIntoView({ index, menuEl: menuRef.current });
        } else {
          scrollToIndex({ index, menuEl: menuRef.current });
        }
      }
    },
    [firstOptionSticky, highlightType.moveFocus, menuRef, scrollStrategy]
  );

  const withScrollbar = !!width && width.inner < width.outer;

  return (
    <OptionsList {...listProps} ref={mergedRef} stickyItemBlockSize={stickyOptionBlockSize}>
      {renderOptions({
        renderOption,
        options,
        getOptionProps,
        filteringValue,
        idPrefix,
        highlightType,
        selectionType,
        hasDropdownStatus,
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

export default forwardRef(List);
