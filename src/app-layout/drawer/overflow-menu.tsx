// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import {
  ButtonDropdownProps,
  InternalButtonDropdownProps,
  InternalItemOrGroup,
} from '../../button-dropdown/interfaces';
import InternalButtonDropdown from '../../button-dropdown/internal';
import { CancelableEventHandler } from '../../internal/events';
import { AppLayoutProps } from '../interfaces';

import testutilStyles from '../test-classes/styles.css.js';

type Drawer = AppLayoutProps.Drawer & { active?: boolean };

interface OverflowMenuProps {
  items: Array<Drawer>;
  onItemClick: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  customTriggerBuilder?: InternalButtonDropdownProps['customTriggerBuilder'];
  ariaLabel?: string;
  globalDrawersStartIndex?: number;
}

const mapDrawerToItem = (drawer: Drawer) => ({
  id: drawer.id,
  text: drawer.ariaLabels.drawerName,
  iconName: drawer.trigger!.iconName,
  iconSvg: drawer.trigger!.iconSvg,
  badge: drawer.badge,
  checked: drawer.active,
});

export default function OverflowMenu({
  items: drawers,
  onItemClick,
  customTriggerBuilder,
  ariaLabel,
  globalDrawersStartIndex,
}: OverflowMenuProps) {
  const itemsFlatList = drawers.map(mapDrawerToItem);
  let items: ReadonlyArray<InternalItemOrGroup>;
  if (globalDrawersStartIndex !== undefined && globalDrawersStartIndex > 0) {
    items = [
      { items: itemsFlatList.slice(0, globalDrawersStartIndex) },
      { items: itemsFlatList.slice(globalDrawersStartIndex) },
    ];
  } else {
    items = itemsFlatList;
  }

  return (
    <InternalButtonDropdown
      items={items}
      className={testutilStyles['overflow-menu']}
      onItemClick={onItemClick}
      ariaLabel={ariaLabel}
      variant="icon"
      customTriggerBuilder={customTriggerBuilder}
      expandToViewport={true}
    />
  );
}
