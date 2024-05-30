// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import { ButtonGroupProps } from './interfaces';
import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import { CancelableEventHandler, fireCancelableEvent } from '../internal/events';
import {
  InternalItem as ButtonDropdownInternalItem,
  InternalItemOrGroup as ButtonDropdownInternalItemOrGroup,
} from '../button-dropdown/interfaces';
import ButtonDropdown from '../button-dropdown/internal';
import Tooltip from './tooltip';
import StatusIndicator from '../status-indicator/internal';

export default function ItemsDropdown({
  items,
  onItemClick,
  dropdownExpandToViewport,
}: {
  items: ButtonGroupProps.Item[];
  onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
  dropdownExpandToViewport?: boolean;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverText, setPopoverText] = useState('');

  const onClickHandler = (event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => {
    const itemId = event.detail.id;
    setPopoverText('');

    for (const item of items) {
      if (item.type !== 'button') {
        continue;
      }

      if (item.id === itemId && item.actionPopoverText) {
        setPopoverText(item.actionPopoverText);
        setPopoverOpen(true);
        break;
      }
    }

    if (onItemClick) {
      fireCancelableEvent(onItemClick, { id: itemId }, event);
    }
  };

  const onPopoverClose = () => {
    setPopoverOpen(false);
  };

  const onPointerDown = () => {
    setPopoverOpen(false);
  };

  const trackKey = items.map(item => (item.type === 'button' ? item.id : '')).join('-');

  return (
    <div ref={dropdownRef} onPointerDown={onPointerDown}>
      <ButtonDropdown
        variant="icon"
        mainAction={{ iconName: 'ellipsis', text: 'More' }}
        items={itemsToDropdownItems(items)}
        onItemClick={(event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => onClickHandler(event)}
        expandToViewport={dropdownExpandToViewport}
        ref={dropdownRef}
        ariaLabel="More actions"
      />
      <Tooltip
        trackRef={dropdownRef}
        trackKey={trackKey}
        open={popoverOpen && popoverText.length > 0}
        close={onPopoverClose}
        content={<StatusIndicator type="success">{popoverText}</StatusIndicator>}
      />
    </div>
  );
}

function itemsToDropdownItems(items: readonly ButtonGroupProps.Item[]) {
  const internalItems: ButtonDropdownInternalItemOrGroup[] = [];

  for (const item of items) {
    if (item.type === 'button') {
      const dropdownItem: ButtonDropdownInternalItem = {
        id: item.id,
        text: item.text,
        lang: item.lang,
        disabled: item.disabled,
        description: item.description,
        iconAlt: item.iconAlt,
        iconName: item.iconName,
        iconUrl: item.iconUrl,
        iconSvg: item.iconSvg,
      };

      internalItems.push(dropdownItem);
    }
  }

  return internalItems;
}
