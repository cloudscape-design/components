// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import { DropdownOption } from '../option/interfaces';
import { ItemProps } from './parts/item';
import List, { ListProps } from './parts/list';
import { GetOptionProps, ListElementProps, UseListboxApi } from './use-listbox';

export interface ListboxProps {
  /** The controller returned by `useListbox`. */
  controller: UseListboxApi;
  /** The options the controller was created with (already flattened). */
  options: ReadonlyArray<DropdownOption>;
  /** Merged over the controller's list props, such as aria attributes. */
  listProps?: Partial<ListElementProps>;
  /** Overrides the controller's option props, for example to add test attributes. */
  getOptionProps?: GetOptionProps;
  renderOption?: ItemProps['renderOption'];
}

/**
 * Renders the list for a `useListbox` controller and scrolls the highlighted option into view.
 */
export default function Listbox({
  controller,
  options,
  listProps,
  getOptionProps = controller.getOptionProps,
  renderOption,
}: ListboxProps) {
  const scrollToIndex = useRef<ListProps.ListRef>(null);
  // Keyboard highlights, including the one added on focus entry, scroll into view. Mouse highlights don't
  // (`List` checks `moveFocus`), and focus from a pointer adds no highlight.
  useEffect(() => {
    scrollToIndex.current?.(controller.highlightedIndex);
  }, [controller.highlightedIndex]);

  const mergedListProps = { ...controller.getListProps(), ...listProps };

  return (
    <List
      ref={scrollToIndex}
      listProps={mergedListProps}
      getOptionProps={getOptionProps}
      options={options}
      highlightType={controller.highlightType}
      selectionType={controller.selection.selectionType}
      screenReaderContent={controller.announcement}
      renderOption={renderOption}
    />
  );
}
