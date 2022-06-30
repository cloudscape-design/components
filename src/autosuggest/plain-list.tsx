// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

import OptionsList, { OptionsListProps } from '../internal/components/options-list';
import { scrollUntilVisible } from '../internal/utils/scrollable-containers';
import { getBaseProps } from '../internal/base-component';

import AutosuggestOption from './autosuggest-option';
import { AutosuggestProps, AutosuggestItem } from './interfaces';
import styles from './styles.css.js';

export interface ListProps {
  menuProps: Omit<OptionsListProps, 'children'>;
  handleLoadMore: () => void;
  filteredItems: AutosuggestItem[];
  usingMouse: React.MutableRefObject<boolean>;
  highlightedOption?: AutosuggestItem;
  enteredTextLabel: AutosuggestProps.EnteredTextLabel;
  highlightedA11yProps: Record<string, string | number | boolean>;
  hasDropdownStatus?: boolean;
  highlightText: string;
  listBottom?: React.ReactNode;
  screenReaderContent?: string;
}

namespace PlainListProps {
  export type PlainListRef = (index: number) => void;
}

export const getOptionProps = (
  index: number,
  item: AutosuggestItem,
  filteredItems: AutosuggestItem[],
  highlightedA11yProps: ListProps['highlightedA11yProps'],
  highlightedOption?: ListProps['highlightedOption'],
  hasDropdownStatus?: boolean
) => {
  const nativeAttributes = item === highlightedOption ? highlightedA11yProps : {};
  const baseOptionProps = getBaseProps(nativeAttributes);
  const isLastItem = index === filteredItems.length - 1;
  const isNotEnteredTextItem = filteredItems.length > 1;
  const padBottom = !hasDropdownStatus && isNotEnteredTextItem && isLastItem;

  return { nativeAttributes, padBottom, ...baseOptionProps };
};

const PlainList = (
  {
    handleLoadMore,
    filteredItems,
    usingMouse,
    menuProps,
    highlightedOption,
    enteredTextLabel,
    highlightedA11yProps,
    hasDropdownStatus,
    highlightText,
    listBottom,
    screenReaderContent,
  }: ListProps,
  ref: React.Ref<PlainListProps.PlainListRef>
) => {
  const listRef = useRef<HTMLUListElement>(null);
  useImperativeHandle(
    ref,
    () => (index: number) => {
      const item = listRef.current?.querySelector(`[data-mouse-target="${index}"]`);
      if (!usingMouse.current && item) {
        scrollUntilVisible(item as HTMLElement);
      }
    },
    [usingMouse, listRef]
  );

  return (
    <OptionsList
      {...menuProps}
      onLoadMore={handleLoadMore}
      open={true}
      ref={listRef}
      // to prevent closing the list when clicking the scrollbar on IE11
      nativeAttributes={{ unselectable: 'on' }}
    >
      {filteredItems.map((item, index) => {
        const optionProps = getOptionProps(
          index,
          item,
          filteredItems,
          highlightedA11yProps,
          highlightedOption,
          hasDropdownStatus
        );

        return (
          <AutosuggestOption
            highlightText={highlightText}
            option={item}
            highlighted={item === highlightedOption}
            key={index}
            data-mouse-target={index}
            enteredTextLabel={enteredTextLabel}
            screenReaderContent={screenReaderContent}
            {...optionProps}
          />
        );
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
