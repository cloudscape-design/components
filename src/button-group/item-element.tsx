// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import { ButtonGroupProps } from './interfaces.js';
import { ButtonProps } from '../button/interfaces.js';
import IconButtonItem from './icon-button-item.js';
import MenuDropdownItem from './menu-dropdown-item.js';

const ItemElement = forwardRef(
  (
    {
      item,
      onItemClick,
      dropdownExpandToViewport,
    }: {
      item: ButtonGroupProps.IconButton | ButtonGroupProps.MenuDropdown;
      onItemClick?: (event: CustomEvent) => void;
      dropdownExpandToViewport?: boolean;
    },
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    if (item.type === 'icon-button') {
      return <IconButtonItem ref={ref} item={item} onItemClick={onItemClick} />;
    } else {
      return (
        <MenuDropdownItem
          ref={ref}
          item={item}
          onItemClick={onItemClick}
          dropdownExpandToViewport={dropdownExpandToViewport}
        />
      );
    }
  }
);

export default ItemElement;
