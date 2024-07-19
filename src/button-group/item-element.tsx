// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import { ButtonGroupProps } from './interfaces.js';
import { CancelableEventHandler, ClickDetail } from '../internal/events/index.js';
import IconButtonItem from './icon-button-item.js';
import MenuDropdownItem from './menu-dropdown-item.js';

const ItemElement = forwardRef(
  (
    {
      item,
      dropdownExpandToViewport,
      onItemClick,
      onDrowdownOpen,
    }: {
      item: ButtonGroupProps.Item;
      dropdownExpandToViewport?: boolean;
      onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails | ClickDetail>;
      onDrowdownOpen: (id: string, open: boolean) => void;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    switch (item.type) {
      case 'icon-button':
        return <IconButtonItem ref={ref} item={item} onItemClick={onItemClick} />;
      case 'menu-dropdown':
        return (
          <MenuDropdownItem
            ref={ref}
            item={item}
            onItemClick={onItemClick}
            onDrowdownOpen={onDrowdownOpen}
            expandToViewport={dropdownExpandToViewport}
          />
        );
      default:
        return null;
    }
  }
);

export default ItemElement;
