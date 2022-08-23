// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import OptionsList from '../../internal/components/options-list';
import React, { forwardRef, useImperativeHandle } from 'react';
import { renderOptions } from '../utils/render-options';
import { MenuProps, GetOptionProps } from '../utils/use-select';
import { DropdownOption } from '../../internal/components/option/interfaces';
import { scrollUntilVisible } from '../../internal/utils/scrollable-containers';

import styles from './styles.css.js';

export interface SelectListProps {
  menuProps: MenuProps;
  getOptionProps: GetOptionProps;
  filteredOptions: ReadonlyArray<DropdownOption>;
  filteringValue: string;
  highlightedType: 'mouse' | 'keyboard';
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
    highlightedType,
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
      const item = menuRef.current?.querySelector(`[data-mouse-target="${index}"]`);
      if (highlightedType === 'keyboard' && item) {
        scrollUntilVisible(item as HTMLElement);
      }
    },
    [highlightedType, menuRef]
  );

  return (
    <OptionsList {...menuProps}>
      {renderOptions({
        options: filteredOptions,
        getOptionProps,
        filteringValue,
        highlightedType,
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
