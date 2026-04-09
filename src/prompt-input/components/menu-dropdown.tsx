// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef } from 'react';

import PlainList from '../../autosuggest/plain-list';
import VirtualList from '../../autosuggest/virtual-list';
import InternalLiveRegion, { InternalLiveRegionRef } from '../../live-region/internal';
import { useAnnouncement } from '../../select/utils/use-announcement';
import { MenuItemsHandlers, MenuItemsState } from '../core/menu-state';
import { PromptInputProps } from '../interfaces';

/** Props for the menu options list rendered inside the trigger dropdown. */
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

  const announcement = useAnnouncement({
    highlightText,
    announceSelected: false,
    highlightedOption: menuItemsState.highlightedOption,
    getParent: option => menuItemsState.getItemGroup(option),
  });

  // Force re-announcement when the filtered items list changes.
  // The screenReaderContent on SelectableItem only works for keyboard
  // navigation (highlight moving between existing items). When filtering
  // replaces the entire list, new items mount already highlighted and
  // the SR doesn't pick up the initial textContent set.
  const liveRegionRef = useRef<InternalLiveRegionRef>(null);
  const prevItemsLengthRef = useRef(menuItemsState.items.length);
  useEffect(() => {
    if (menuItemsState.items.length !== prevItemsLengthRef.current && announcement) {
      liveRegionRef.current?.reannounce();
    }
    prevItemsLengthRef.current = menuItemsState.items.length;
  }, [menuItemsState.items.length, announcement]);

  return (
    <>
      <InternalLiveRegion ref={liveRegionRef} tagName="span" hidden={true}>
        {announcement}
      </InternalLiveRegion>
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
        screenReaderContent={announcement}
      />
    </>
  );
}
