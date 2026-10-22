// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { MultiselectProps } from '../../../../multiselect/interfaces';
import { SelectProps } from '../../../../select/interfaces';
import Item, { ItemParentProps } from '../../../../select/parts/item';
import MultiselectItem, { MultiselectItemParentProps } from '../../../../select/parts/multiselect-item';
import { VirtualItem } from '../../../vendor/react-virtual';
import { DropdownOption } from '../../option/interfaces';
import { NestedDropdownOption, unflattenOptions } from '../../option/utils/unflatten-options';
import { HighlightType } from '../../options-list/utils/use-highlight-option';
import { SelectionType } from '../selection/interfaces';
import { getItemProps } from './get-item-props';
import ListboxItem, { ItemParentProps as ListboxItemParentProps } from './item';
import OptionGroup from './option-group';

interface RenderOptionProps {
  options: ReadonlyArray<DropdownOption>;
  getOptionProps: any;
  filteringValue: string;
  highlightType: HighlightType;
  idPrefix: string;
  /**
   * When set, options render with the shared listbox item for this selection type. When omitted, the Select
   * and Multiselect items are used, picked by `useInteractiveGroups`.
   */
  selectionType?: SelectionType;
  checkboxes?: boolean;
  hasDropdownStatus?: boolean;
  virtualItems?: VirtualItem[];
  useInteractiveGroups?: boolean;
  screenReaderContent?: string;
  ariaSetsize?: number;
  withScrollbar: boolean;
  firstOptionSticky?: boolean;
  stickyOptionRef?: React.Ref<HTMLDivElement>;
  renderOption?: SelectProps.SelectOptionItemRenderer | MultiselectProps.MultiselectOptionItemRenderer;
}

export const renderOptions = ({
  options,
  getOptionProps,
  filteringValue,
  highlightType,
  idPrefix,
  selectionType,
  checkboxes = false,
  hasDropdownStatus,
  virtualItems,
  useInteractiveGroups,
  screenReaderContent,
  ariaSetsize,
  withScrollbar,
  firstOptionSticky,
  stickyOptionRef,
  renderOption,
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

  const renderListItem = (
    props: any,
    index: number,
    parentProps?: ItemParentProps | MultiselectItemParentProps | ListboxItemParentProps
  ) => {
    const virtualItem = virtualItems && virtualItems[index];
    const globalIndex = virtualItem ? virtualItem.index : index;

    const isLastItem = index === options.length - 1;
    const padBottom = !hasDropdownStatus && isLastItem;
    const ListItem = selectionType ? ListboxItem : useInteractiveGroups ? MultiselectItem : Item;
    const isSticky = firstOptionSticky && globalIndex === 0;

    return (
      <ListItem
        index={index}
        virtualIndex={virtualItem ? virtualItem.index : undefined}
        key={globalIndex}
        {...props}
        {...(selectionType ? { selectionType } : {})}
        virtualPosition={virtualItem?.start}
        ref={isSticky && stickyOptionRef ? stickyOptionRef : virtualItem && virtualItem.measureRef}
        padBottom={padBottom}
        screenReaderContent={screenReaderContent}
        ariaPosinset={globalIndex + 1}
        ariaSetsize={ariaSetsize}
        highlightType={highlightType.type}
        withScrollbar={withScrollbar}
        sticky={isSticky}
        renderOption={renderOption}
        parentProps={parentProps}
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
            <React.Fragment key={child.index}>
              {renderListItem(getNestedItemProps(child), child.index, {
                option: nestedDropdownOption.option,
                disabled: nestedDropdownOption.option.disabled ?? false,
                index: index,
                virtualIndex: virtualItems?.[index]?.index ?? undefined,
                highlighted: props.highlighted ?? false,
                selected: props.selected ?? false,
                indeterminate: props.indeterminate ?? false,
              })}
            </React.Fragment>
          ))}
        </OptionGroup>
      );
    }

    return renderListItem(props, index);
  });
};
