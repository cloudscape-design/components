// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import PlainList from '../../autosuggest/plain-list';
import VirtualList from '../../autosuggest/virtual-list';
import { MenuItemsHandlers, MenuItemsState } from '../core/menu-state';
import { PromptInputProps } from '../interfaces';

interface MenuDropdownProps {
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
}

const createMouseEventHandler = (handler: (index: number) => void) => (itemIndex: number) => {
  if (itemIndex > -1) {
    handler(itemIndex);
  }
};

export default function MenuDropdown({
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
}: MenuDropdownProps) {
  const handleMouseUp = createMouseEventHandler(menuItemsHandlers.selectVisibleOptionWithMouse);
  const handleMouseMove = createMouseEventHandler(menuItemsHandlers.highlightVisibleOptionWithMouse);

  const ListComponent = menu.virtualScroll ? VirtualList : PlainList;

  return (
    <ListComponent
      listBottom={listBottom}
      handleLoadMore={handleLoadMore}
      autosuggestItemsState={menuItemsState}
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
    />
  );
}
