// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AutosuggestItemsHandlers, AutosuggestItemsState, getParentGroup } from './options-controller';
import { AutosuggestProps } from './interfaces';
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
  highlightedOptionId?: string;
  highlightText: string;
  listId: string;
  controlId: string;
  handleLoadMore: () => void;
  hasDropdownStatus?: boolean;
  listBottom?: React.ReactNode;
}

const createMouseEventHandler = (handler: (index: number) => void) => (itemIndex: number) => {
  // prevent mouse events to avoid losing focus from the input
  if (itemIndex > -1) {
    handler(itemIndex);
  }
};

export default function AutosuggestOptionsList({
  autosuggestItemsState,
  autosuggestItemsHandlers,
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
  const handleMouseUp = createMouseEventHandler(autosuggestItemsHandlers.selectVisibleOptionWithMouse);
  const handleMouseMove = createMouseEventHandler(autosuggestItemsHandlers.highlightVisibleOptionWithMouse);

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
