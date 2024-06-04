// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { ButtonGroupProps } from './interfaces';
import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import { CancelableEventHandler, fireCancelableEvent } from '../internal/events';
import { hasLoadingItems, toDropdownItems } from './utils';
import ButtonDropdown from '../button-dropdown/internal';

export default function MoreItems({
  items,
  onItemClick,
  dropdownExpandToViewport,
  ariaLabel,
}: {
  items: ButtonGroupProps.ItemOrGroup[];
  onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
  dropdownExpandToViewport?: boolean;
  ariaLabel?: string;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownItems = toDropdownItems(items);
  const loading = hasLoadingItems(items);

  const onClickHandler = (event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => {
    const itemId = event.detail.id;

    if (onItemClick) {
      fireCancelableEvent(onItemClick, { id: itemId }, event);
    }
  };

  return (
    <ButtonDropdown
      variant="icon"
      loading={loading}
      mainAction={{ iconName: 'ellipsis', text: 'More' }}
      items={dropdownItems}
      onItemClick={(event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => onClickHandler(event)}
      expandToViewport={dropdownExpandToViewport}
      ref={dropdownRef}
      ariaLabel={ariaLabel}
    />
  );
}
