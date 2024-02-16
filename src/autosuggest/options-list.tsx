// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AutosuggestItemsHandlers, AutosuggestItemsState } from './options-controller';
import { AutosuggestProps } from './interfaces';
import VirtualList from './virtual-list';
import PlainList from './plain-list';

import { useAnnouncement } from '../select/utils/use-announcement';

export interface AutosuggestOptionsListProps
  extends Pick<AutosuggestProps, 'virtualScroll' | 'selectedAriaLabel' | 'renderHighlightedAriaLive'> {
  statusType: AutosuggestProps.StatusType;
  autosuggestItemsState: AutosuggestItemsState;
  autosuggestItemsHandlers: AutosuggestItemsHandlers;
  highlightedOptionId?: string;
  highlightText: string;
  listId: string;
  controlId: string;
  handleLoadMore: () => void;
  hasDropdownStatus?: boolean;
  listBottom?: React.ReactNode;
  ariaDescribedby?: string;
}

const createMouseEventHandler = (handler: (index: number) => void) => (itemIndex: number) => {
  // prevent mouse events to avoid losing focus from the input
  if (itemIndex > -1) {
    handler(itemIndex);
  }
};

export default function AutosuggestOptionsList({
  statusType,
  autosuggestItemsState,
  autosuggestItemsHandlers,
  highlightedOptionId,
  highlightText,
  listId,
  controlId,
  handleLoadMore,
  hasDropdownStatus,
  virtualScroll,
  selectedAriaLabel,
  renderHighlightedAriaLive,
  listBottom,
  ariaDescribedby,
}: AutosuggestOptionsListProps) {
  const handleMouseUp = createMouseEventHandler(autosuggestItemsHandlers.selectVisibleOptionWithMouse);
  const handleMouseMove = createMouseEventHandler(autosuggestItemsHandlers.highlightVisibleOptionWithMouse);

  const ListComponent = virtualScroll ? VirtualList : PlainList;

  const announcement = useAnnouncement({
    announceSelected: autosuggestItemsState.highlightedOption?.value === highlightText,
    highlightedOption: autosuggestItemsState.highlightedOption,
    getParent: option => autosuggestItemsState.getItemGroup(option),
    selectedAriaLabel,
    renderHighlightedAriaLive,
  });

  return (
    <ListComponent
      listBottom={listBottom}
      handleLoadMore={handleLoadMore}
      autosuggestItemsState={autosuggestItemsState}
      highlightText={highlightText}
      highlightedA11yProps={highlightedOptionId ? { id: highlightedOptionId } : {}}
      hasDropdownStatus={hasDropdownStatus}
      menuProps={{
        id: listId,
        ariaLabelledby: controlId,
        onMouseUp: handleMouseUp,
        onMouseMove: handleMouseMove,
        ariaDescribedby,
        statusType,
      }}
      screenReaderContent={announcement}
    />
  );
}
