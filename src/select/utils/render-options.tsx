// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { DropdownOption } from '../../internal/components/option/interfaces';
import { unflattenOptions } from '../../internal/components/option/utils/unflatten-options';
import { HighlightType } from '../../internal/components/options-list/utils/use-highlight-option';
import { VirtualItem } from '../../internal/vendor/react-virtual';
import Item from '../parts/item';
import MultiselectItem from '../parts/multiselect-item';
import { getItemProps } from './get-item-props';

interface RenderOptionProps {
  options: ReadonlyArray<DropdownOption>;
  getOptionProps: any;
  filteringValue: string;
  highlightType: HighlightType;
  checkboxes?: boolean;
  hasDropdownStatus?: boolean;
  virtualItems?: VirtualItem[];
  useInteractiveGroups?: boolean;
  screenReaderContent?: string;
  ariaSetsize?: number;
  withScrollbar: boolean;
  firstOptionSticky?: boolean;
  stickyOptionRef?: React.Ref<HTMLDivElement>;
}

export const renderOptions = ({
  options,
  getOptionProps,
  filteringValue,
  highlightType,
  checkboxes = false,
  hasDropdownStatus,
  virtualItems,
  useInteractiveGroups,
  screenReaderContent,
  ariaSetsize,
  withScrollbar,
  firstOptionSticky,
  stickyOptionRef,
}: RenderOptionProps) => {
  const renderListItem = (option: DropdownOption, index: number) => {
    const virtualItem = virtualItems && virtualItems[index];
    const globalIndex = virtualItem ? virtualItem.index : index;
    const props = getItemProps({
      option,
      index: globalIndex,
      getOptionProps,
      filteringValue: option.type === 'select-all' ? '' : filteringValue,
      checkboxes,
    });

    const isLastItem = index === options.length - 1;
    const padBottom = !hasDropdownStatus && isLastItem;
    const ListItem = useInteractiveGroups ? MultiselectItem : Item;
    const isSticky = firstOptionSticky && globalIndex === 0;

    return (
      <ListItem
        key={globalIndex}
        {...props}
        virtualPosition={virtualItem && virtualItem.start}
        ref={isSticky && stickyOptionRef ? stickyOptionRef : virtualItem && virtualItem.measureRef}
        padBottom={padBottom}
        screenReaderContent={screenReaderContent}
        ariaPosinset={globalIndex + 1}
        ariaSetsize={ariaSetsize}
        highlightType={highlightType.type}
        withScrollbar={withScrollbar}
        sticky={isSticky}
      />
    );
  };

  const unflattenedOptions = unflattenOptions(options);
  return unflattenedOptions.map((nestedDropdownOption, i) => {
    if (nestedDropdownOption.type === 'parent') {
      return (
        <div role="group" key={i}>
          {renderListItem(nestedDropdownOption.option, nestedDropdownOption.index)}
          {nestedDropdownOption.children.map((child, j) => (
            <React.Fragment key={j}>{renderListItem(child.option, child.index)}</React.Fragment>
          ))}
        </div>
      );
    }
    return renderListItem(nestedDropdownOption.option, nestedDropdownOption.index);
  });
};
