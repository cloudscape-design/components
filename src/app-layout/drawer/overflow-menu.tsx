// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import InternalButtonDropdown from '../../button-dropdown/internal';
import { ButtonDropdownProps, InternalButtonDropdownProps } from '../../button-dropdown/interfaces';
import { CancelableEventHandler } from '../../internal/events';
import { DrawerItem } from './interfaces';
import { AppLayoutProps } from '../interfaces';

interface OverflowMenuProps {
  items: Array<DrawerItem | AppLayoutProps.Drawer>;
  onItemClick: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  customTriggerBuilder?: InternalButtonDropdownProps['customTriggerBuilder'];
  ariaLabel?: string;
}

export default function OverflowMenu({ items, onItemClick, customTriggerBuilder, ariaLabel }: OverflowMenuProps) {
  return (
    <InternalButtonDropdown
      items={items.map(item => ({
        id: item.id,
        text: 'drawerName' in item.ariaLabels ? item.ariaLabels?.drawerName : item.ariaLabels?.content || 'Content',
        iconName: 'iconName' in item.trigger ? item.trigger.iconName : undefined,
        iconSvg: 'iconSvg' in item.trigger ? item.trigger.iconSvg : undefined,
        badge: item.badge,
      }))}
      onItemClick={onItemClick}
      ariaLabel={ariaLabel}
      variant="icon"
      customTriggerBuilder={customTriggerBuilder}
      expandToViewport={true}
    />
  );
}
