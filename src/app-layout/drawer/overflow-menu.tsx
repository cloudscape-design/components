// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import InternalButtonDropdown from '../../button-dropdown/internal';
import { ButtonDropdownProps, InternalButtonDropdownProps } from '../../button-dropdown/interfaces';
import { CancelableEventHandler } from '../../internal/events';
import { AppLayoutProps } from '../interfaces';
import testutilStyles from '../test-classes/styles.css.js';

interface OverflowMenuProps {
  items: Array<AppLayoutProps.Drawer>;
  onItemClick: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  customTriggerBuilder?: InternalButtonDropdownProps['customTriggerBuilder'];
  ariaLabel?: string;
}

export default function OverflowMenu({ items, onItemClick, customTriggerBuilder, ariaLabel }: OverflowMenuProps) {
  return (
    <InternalButtonDropdown
      items={items.map(item => ({
        id: item.id,
        text: item.ariaLabels.drawerName,
        iconName: item.trigger.iconName,
        iconSvg: item.trigger.iconSvg,
        badge: item.badge,
      }))}
      className={testutilStyles['overflow-menu']}
      onItemClick={onItemClick}
      ariaLabel={ariaLabel}
      variant="icon"
      customTriggerBuilder={customTriggerBuilder}
      expandToViewport={true}
    />
  );
}
