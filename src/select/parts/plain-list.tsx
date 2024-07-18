// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useImperativeHandle } from 'react';

import { DropdownOption } from '../../internal/components/option/interfaces';
import OptionsList from '../../internal/components/options-list';
import { HighlightType } from '../../internal/components/options-list/utils/use-highlight-option';
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
  const menuRef = menuProps.ref;
  useImperativeHandle(
    ref,
    () => (index: number) => {
      const item = menuRef.current?.querySelector<HTMLElement>(`[data-mouse-target="${index}"]`);
      if (highlightType.moveFocus && item) {
        scrollElementIntoView(item);
      }
    },
    [highlightType, menuRef]
  );

  return (
    <OptionsList {...menuProps}>
      {renderOptions({
        options: filteredOptions,
        getOptionProps,
        filteringValue,
        highlightType,
        checkboxes,
        hasDropdownStatus,
        useInteractiveGroups,
        screenReaderContent,
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
