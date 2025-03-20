// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useImperativeHandle } from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import { DropdownOption } from '../../internal/components/option/interfaces';
import OptionsList from '../../internal/components/options-list';
import { HighlightType } from '../../internal/components/options-list/utils/use-highlight-option';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import { scrollElementIntoView } from '../../internal/utils/scrollable-containers';
import { renderOptions } from '../utils/render-options';
import { GetOptionProps, MenuProps } from '../utils/use-select';

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
  stickyIndices?: number[];
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
  }: SelectListProps,
  ref: React.Ref<SelectListProps.SelectListRef>
) => {
  const [width, menuMeasureRef] = useContainerQuery(
    rect => ({ inner: rect.contentBoxWidth, outer: rect.borderBoxWidth }),
    []
  );

  const menuRef = menuProps.ref;

  const mergedRef = useMergeRefs(menuMeasureRef, menuRef);

  useImperativeHandle(
    ref,
    () => (index: number) => {
      const item = menuRef.current?.querySelector<HTMLElement>(`[data-mouse-target="${index}"]`);
      if (highlightType.moveFocus && item) {
        // In edge case dropdown can be very small, scrolling can cause side effect AWSUI-60318
        if (menuRef.current?.clientHeight !== undefined && menuRef.current?.clientHeight > 15) {
          /* istanbul ignore next: clientHeight always returns 0 in JSDOM, the line is covered by integ tests */
          scrollElementIntoView(item);
        }
      }
    },
    [highlightType, menuRef]
  );

  const hasScrollbar = !!width && width.inner < width.outer;

  return (
    <OptionsList {...menuProps} ref={mergedRef}>
      {renderOptions({
        options: filteredOptions,
        getOptionProps,
        filteringValue,
        highlightType,
        checkboxes,
        hasDropdownStatus,
        useInteractiveGroups,
        screenReaderContent,
        withScrollbar: hasScrollbar,
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
