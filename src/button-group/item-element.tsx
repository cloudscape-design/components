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
    }: {
      item: ButtonGroupProps.Item;
      dropdownExpandToViewport?: boolean;
      onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails | ClickDetail>;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <>
        {item.type === 'icon-button' && <IconButtonItem ref={ref} item={item} onItemClick={onItemClick} />}
        {item.type === 'menu-dropdown' && (
          <MenuDropdownItem
            ref={ref}
            item={item}
            onItemClick={onItemClick}
            expandToViewport={dropdownExpandToViewport}
          />
        )}
      </>
    );
  }
);

export default ItemElement;
