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
      tooltipItemId,
      isFeedbackTooltip,
      dropdownExpandToViewport,
      onItemClick,
    }: {
      item: ButtonGroupProps.Item;
      tooltipItemId: string | null;
      isFeedbackTooltip: boolean;
      dropdownExpandToViewport?: boolean;
      onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails | ClickDetail>;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    switch (item.type) {
      case 'icon-button':
        return (
          <IconButtonItem
            ref={ref}
            item={item}
            onItemClick={onItemClick}
            tooltipItemId={tooltipItemId}
            isFeedbackTooltip={isFeedbackTooltip}
          />
        );
      case 'menu-dropdown':
        return (
          <MenuDropdownItem
            ref={ref}
            item={item}
            tooltipItemId={tooltipItemId}
            onItemClick={onItemClick}
            expandToViewport={dropdownExpandToViewport}
          />
        );
      default:
        return null;
    }
  }
);

export default ItemElement;
