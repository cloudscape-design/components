// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import PlainList from '../../autosuggest/plain-list';
import VirtualList from '../../autosuggest/virtual-list';
import { useAnnouncement } from '../../select/utils/use-announcement';
import { PromptInputProps } from '../interfaces';
import { MenuItemsHandlers, MenuItemsState } from './menu-controller';

interface MenuOptionsListProps {
  menu: PromptInputProps.MenuDefinition;
  statusType: PromptInputProps.MenuDefinition['statusType'];
  menuItemsState: MenuItemsState;
  menuItemsHandlers: MenuItemsHandlers;
  highlightedOptionId?: string;
  highlightText: string;
  listId: string;
  controlId: string;
  handleLoadMore: () => void;
  hasDropdownStatus?: boolean;
  listBottom?: React.ReactNode;
  ariaDescribedby?: string;
  selectedMenuItemAriaLabel?: string;
  renderHighlightedMenuItemAriaLive?: PromptInputProps['renderHighlightedMenuItemAriaLive'];
}

const createMouseEventHandler = (handler: (index: number) => void) => (itemIndex: number) => {
  // prevent mouse events to avoid losing focus from the input
  if (itemIndex > -1) {
    handler(itemIndex);
  }
};

export default function MenuOptionsList({
  menu,
  statusType,
  menuItemsState,
  menuItemsHandlers,
  highlightedOptionId,
  highlightText,
  listId,
  controlId,
  handleLoadMore,
  hasDropdownStatus,
  listBottom,
  ariaDescribedby,
  selectedMenuItemAriaLabel,
  renderHighlightedMenuItemAriaLive,
}: MenuOptionsListProps) {
  const handleMouseUp = createMouseEventHandler(menuItemsHandlers.selectVisibleOptionWithMouse);
  const handleMouseMove = createMouseEventHandler(menuItemsHandlers.highlightVisibleOptionWithMouse);

  const ListComponent = menu.virtualScroll ? VirtualList : PlainList;

  const announcement = useAnnouncement({
    highlightText,
    announceSelected: false,
    highlightedOption: menuItemsState.highlightedOption,
    getParent: option => menuItemsState.getItemGroup(option),
    selectedAriaLabel: selectedMenuItemAriaLabel,
    renderHighlightedAriaLive: renderHighlightedMenuItemAriaLive,
  });

  return (
    <ListComponent
      listBottom={listBottom}
      handleLoadMore={handleLoadMore}
      autosuggestItemsState={menuItemsState as any}
      highlightText={highlightText}
      highlightedA11yProps={highlightedOptionId ? { id: highlightedOptionId } : {}}
      hasDropdownStatus={hasDropdownStatus}
      menuProps={{
        id: listId,
        ariaLabelledby: controlId,
        onMouseUp: handleMouseUp,
        onMouseMove: handleMouseMove,
        ariaDescribedby,
        statusType: statusType ?? 'finished',
      }}
      screenReaderContent={announcement}
    />
  );
}
