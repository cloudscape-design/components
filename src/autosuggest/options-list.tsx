// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useSelectVisibleOption, useHighlightVisibleOption } from './controller';
import { AutosuggestItemsHandlers, AutosuggestItemsState, getParentGroup } from './options-controller';
import { AutosuggestItem, AutosuggestProps } from './interfaces';
import VirtualList from './virtual-list';
import PlainList from './plain-list';

import { useAnnouncement } from '../select/utils/use-announcement';
import { OptionGroup } from '../internal/components/option/interfaces';

export interface AutosuggestOptionsListProps
  extends Pick<
    AutosuggestProps,
    'enteredTextLabel' | 'virtualScroll' | 'selectedAriaLabel' | 'renderHighlightedAriaLive'
  > {
  autosuggestItemsState: AutosuggestItemsState;
  autosuggestItemsHandlers: AutosuggestItemsHandlers;
  selectOption: (option: AutosuggestItem) => void;
  highlightedOptionId?: string;
  highlightText: string;
  listId: string;
  controlId: string;
  handleLoadMore: () => void;
  hasDropdownStatus?: boolean;
  listBottom?: React.ReactNode;
}

const isInteractive = (option?: AutosuggestItem) => {
  return !!option && !option.disabled && option.type !== 'parent';
};

const isHighlightable = (option?: AutosuggestItem) => {
  return !!option && option.type !== 'parent';
};

const createMouseEventHandler = (handler: (index: number) => void) => (itemIndex: number) => {
  // prevent mouse events to avoid losing focus from the input
  if (itemIndex > -1) {
    handler(itemIndex);
  }
};

export default function AutosuggestOptionsList({
  autosuggestItemsState,
  autosuggestItemsHandlers,
  selectOption,
  highlightedOptionId,
  highlightText,
  listId,
  controlId,
  enteredTextLabel,
  handleLoadMore,
  hasDropdownStatus,
  virtualScroll,
  selectedAriaLabel,
  renderHighlightedAriaLive,
  listBottom,
}: AutosuggestOptionsListProps) {
  const highlightVisibleOption = useHighlightVisibleOption(
    autosuggestItemsState.items,
    autosuggestItemsHandlers.setHighlightedIndexWithMouse,
    isHighlightable
  );
  const selectVisibleOption = useSelectVisibleOption(autosuggestItemsState.items, selectOption, isInteractive);
  const handleMouseUp = createMouseEventHandler(selectVisibleOption);
  const handleMouseMove = createMouseEventHandler(highlightVisibleOption);

  const ListComponent = virtualScroll ? VirtualList : PlainList;

  const announcement = useAnnouncement({
    announceSelected: true,
    highlightedOption: autosuggestItemsState.highlightedOption,
    getParent: option => getParentGroup(option)?.option as undefined | OptionGroup,
    selectedAriaLabel,
    renderHighlightedAriaLive,
  });

  return (
    <ListComponent
      listBottom={listBottom}
      handleLoadMore={handleLoadMore}
      autosuggestItemsState={autosuggestItemsState}
      highlightText={highlightText}
      enteredTextLabel={enteredTextLabel}
      highlightedA11yProps={highlightedOptionId ? { id: highlightedOptionId } : {}}
      hasDropdownStatus={hasDropdownStatus}
      menuProps={{ id: listId, ariaLabelledby: controlId, onMouseUp: handleMouseUp, onMouseMove: handleMouseMove }}
      screenReaderContent={announcement}
    />
  );
}
