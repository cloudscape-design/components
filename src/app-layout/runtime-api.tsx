// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { DrawerConfig as RuntimeDrawerConfig } from '../internal/plugins/controllers/drawers';
import { RuntimeContentWrapper } from '../internal/plugins/helpers';
import { DrawerItem } from './drawer/interfaces';
import { sortByPriority } from '../internal/plugins/helpers/utils';

export interface DrawersLayout {
  before: Array<DrawerItem>;
  after: Array<DrawerItem>;
}

export function convertRuntimeDrawers(drawers: Array<RuntimeDrawerConfig>): DrawersLayout {
  const converted = drawers.map(({ mountContent, unmountContent, trigger, ...runtimeDrawer }) => ({
    ...runtimeDrawer,
    trigger: {
      iconSvg: (
        // eslint-disable-next-line react/no-danger
        <span dangerouslySetInnerHTML={{ __html: trigger.iconSvg }} />
      ),
    },
    content: (
      <RuntimeContentWrapper key={runtimeDrawer.id} mountContent={mountContent} unmountContent={unmountContent} />
    ),
  }));
  const sorted = sortByPriority(converted);
  return {
    before: sorted.filter(item => (item.orderPriority ?? 0) > 0),
    after: sorted.filter(item => (item.orderPriority ?? 0) <= 0),
  };
}
