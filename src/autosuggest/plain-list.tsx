// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

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
  highlightedIndex: number;
  enteredTextLabel: AutosuggestProps.EnteredTextLabel;
  highlightedA11yProps: Record<string, string | number | boolean>;
  hasDropdownStatus?: boolean;
  highlightText: string;
  listBottom?: React.ReactNode;
  screenReaderContent?: string;
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

const PlainList = ({
  handleLoadMore,
  filteredItems,
  usingMouse,
  menuProps,
  highlightedOption,
  highlightedIndex,
  enteredTextLabel,
  highlightedA11yProps,
  hasDropdownStatus,
  highlightText,
  listBottom,
  screenReaderContent,
}: ListProps) => {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const item = listRef.current?.querySelector(`[data-mouse-target="${highlightedIndex}"]`);
    if (!usingMouse.current && item) {
      scrollUntilVisible(item as HTMLElement);
    }
  }, [usingMouse, highlightedIndex]);

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
            isKeyboard={!usingMouse.current}
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

export default PlainList;
