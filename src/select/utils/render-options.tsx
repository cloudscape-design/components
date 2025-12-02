// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { DropdownOption } from '../../internal/components/option/interfaces';
import { NestedDropdownOption, unflattenOptions } from '../../internal/components/option/utils/unflatten-options';
import { HighlightType } from '../../internal/components/options-list/utils/use-highlight-option';
import { VirtualItem } from '../../internal/vendor/react-virtual';
import Item from '../parts/item';
import MultiselectItem from '../parts/multiselect-item';
import OptionGroup from '../parts/option-group';
import { getItemProps } from './get-item-props';

interface RenderOptionProps {
  options: ReadonlyArray<DropdownOption>;
  getOptionProps: any;
  filteringValue: string;
  highlightType: HighlightType;
  idPrefix: string;
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
  idPrefix,
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
  const getNestedItemProps = ({ index, option }: NestedDropdownOption) => {
    const virtualItem = virtualItems && virtualItems[index];
    const globalIndex = virtualItem ? virtualItem.index : index;
    return getItemProps({
      option,
      index: globalIndex,
      getOptionProps,
      filteringValue: option.type === 'select-all' ? '' : filteringValue,
      checkboxes,
    });
  };

  const renderListItem = (props: any, index: number) => {
    const virtualItem = virtualItems && virtualItems[index];
    const globalIndex = virtualItem ? virtualItem.index : index;

    const isLastItem = index === options.length - 1;
    const padBottom = !hasDropdownStatus && isLastItem;
    const ListItem = useInteractiveGroups ? MultiselectItem : Item;
    const isSticky = firstOptionSticky && globalIndex === 0;

    // Adjust virtual position to create 1px overlap between consecutive selected items
    // When firstOptionSticky is enabled (enableSelectAll), the select-all option needs to be shifted down by 1,
    // and all subsequent items need to be shifted up by (index + 1) instead of just index
    let adjustedVirtualPosition: number | undefined = undefined;

    if (!virtualItem) {
      adjustedVirtualPosition = undefined;
    } else if (!firstOptionSticky) {
      // Shift every item up by one to create a 1px overlap
      adjustedVirtualPosition = virtualItem.start - index * 1;
    } else if (globalIndex === 0) {
      // Shift select-all down by one
      adjustedVirtualPosition = virtualItem.start + 1;
    } else {
      // Shift items down by 2 if first item is sticky
      adjustedVirtualPosition = virtualItem.start + 2 - index * 1;
    }

    return (
      <ListItem
        key={globalIndex}
        {...props}
        virtualPosition={adjustedVirtualPosition}
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
  return unflattenedOptions.map(nestedDropdownOption => {
    const index = nestedDropdownOption.index;
    const props = getNestedItemProps(nestedDropdownOption);

    if (nestedDropdownOption.type === 'parent') {
      const { children } = nestedDropdownOption;
      const optionId = props.id ?? `${idPrefix}-option-${index}`;
      return (
        <OptionGroup
          key={`group-${index}`}
          virtual={virtualItems?.[index] !== undefined}
          ariaLabelledby={optionId}
          ariaDisabled={props['aria-disabled']}
        >
          {renderListItem(props, index)}
          {children.map(child => (
            <React.Fragment key={child.index}>{renderListItem(getNestedItemProps(child), child.index)}</React.Fragment>
          ))}
        </OptionGroup>
      );
    }

    return renderListItem(props, index);
  });
};
