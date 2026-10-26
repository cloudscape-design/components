// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useImperativeHandle } from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { useMergeRefs, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { DropdownOption } from '../../option/interfaces';
import OptionsList from '../../options-list';
import { HighlightType } from '../../options-list/utils/use-highlight-option';
import { SelectionType } from '../selection/interfaces';
import { GetOptionProps, ListElementProps } from '../use-listbox';
import { ItemProps } from './item';
import { renderOptions } from './render-options';
import { scrollOptionIntoView } from './scroll-to-index';

export interface ListProps {
  listProps: ListElementProps;
  getOptionProps: GetOptionProps;
  options: ReadonlyArray<DropdownOption>;
  highlightType: HighlightType;
  selectionType: SelectionType;
  screenReaderContent?: string;
  renderOption?: ItemProps['renderOption'];
}

export namespace ListProps {
  /** Scrolls the option at the given index into view. */
  export type ListRef = (index: number) => void;
}

const List = (
  { listProps, getOptionProps, options, highlightType, selectionType, screenReaderContent, renderOption }: ListProps,
  ref: React.Ref<ListProps.ListRef>
) => {
  const idPrefix = useUniqueId('select-list-');

  const [width, menuMeasureRef] = useContainerQuery(rect => ({
    inner: rect.contentBoxWidth,
    outer: rect.borderBoxWidth,
  }));

  const menuRef = listProps.ref;

  const mergedRef = useMergeRefs(menuMeasureRef, menuRef);

  // The list is not its own scroll container, so the highlighted option is scrolled into view through all
  // scrollable ancestors.
  useImperativeHandle(
    ref,
    () => (index: number) => {
      if (highlightType.moveFocus && menuRef.current) {
        scrollOptionIntoView({ index, menuEl: menuRef.current });
      }
    },
    [highlightType.moveFocus, menuRef]
  );

  const withScrollbar = !!width && width.inner < width.outer;

  return (
    <OptionsList {...listProps} ref={mergedRef}>
      {renderOptions({
        renderOption,
        options,
        getOptionProps,
        filteringValue: '',
        idPrefix,
        highlightType,
        selectionType,
        screenReaderContent,
        withScrollbar,
      })}
    </OptionsList>
  );
};

export default forwardRef(List);
