// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import { DropdownOption } from '../option/interfaces';
import { ItemProps } from './parts/item';
import List, { ListProps, ScrollStrategy } from './parts/list';
import { GetOptionProps, ListElementProps, UseListboxApi } from './use-listbox';

/** `List`, or any component with the same props and imperative scroll ref, such as Select's `VirtualList`. */
export type ListComponentType = React.ComponentType<ListProps & React.RefAttributes<ListProps.ListRef>>;

export interface ListboxProps {
  /** The controller returned by `useListbox` (or by `useSelectDropdown` as `optionList`). */
  controller: UseListboxApi;
  /** The options the controller was created with (already flattened, filtered and with select-all). */
  options: ReadonlyArray<DropdownOption>;
  /** Merged over the controller's list props, such as aria attributes, `statusType` and `onLoadMore`. */
  listProps?: Partial<ListElementProps>;
  /** Overrides the controller's option props, for example to add test attributes. */
  getOptionProps?: GetOptionProps;
  /** The list component to render. Defaults to `List`. Select and Multiselect pass `VirtualList`. */
  listComponent?: ListComponentType;
  /** Content rendered as the last list row, such as a non-sticky status footer. */
  listBottom?: React.ReactNode;
  hasDropdownStatus?: boolean;
  filteringValue?: string;
  firstOptionSticky?: boolean;
  renderOption?: ItemProps['renderOption'];
  /**
   * How the highlighted option is scrolled into view. Defaults to `list`, which scrolls only the list element.
   * With `nearest`, keyboard moves scroll the option into view through all scrollable ancestors, and the
   * highlight added on focus entry does not scroll (native focus scrolling already applies).
   */
  scrollStrategy?: ScrollStrategy;
}

/**
 * Renders the list for a `useListbox` controller and scrolls the highlighted option into view.
 * It renders no wrapper element, so it can be the direct flex child of a dropdown.
 */
export default function Listbox({
  controller,
  options,
  listProps,
  getOptionProps = controller.getOptionProps,
  listComponent: ListComponent = List,
  listBottom,
  hasDropdownStatus,
  filteringValue = '',
  firstOptionSticky,
  renderOption,
  scrollStrategy = 'list',
}: ListboxProps) {
  const scrollToIndex = useRef<ListProps.ListRef>(null);
  // Keyboard highlights, including the one added on focus entry, scroll into view. Mouse highlights don't
  // (`List` checks `moveFocus`), and focus from a pointer adds no highlight.
  useEffect(() => {
    scrollToIndex.current?.(controller.highlightedIndex);
  }, [controller.highlightedIndex]);

  const mergedListProps = { ...controller.getListProps(), ...listProps };

  return (
    <ListComponent
      ref={scrollToIndex}
      listProps={mergedListProps}
      getOptionProps={getOptionProps}
      options={options}
      filteringValue={filteringValue}
      highlightType={controller.highlightType}
      selectionType={controller.selection.selectionType}
      hasDropdownStatus={hasDropdownStatus}
      listBottom={listBottom}
      screenReaderContent={controller.announcement}
      firstOptionSticky={firstOptionSticky}
      renderOption={renderOption}
      scrollStrategy={scrollStrategy}
    />
  );
}
