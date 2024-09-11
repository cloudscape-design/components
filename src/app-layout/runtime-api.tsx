// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { DrawerConfig as RuntimeDrawerConfig } from '../internal/plugins/controllers/drawers';
import { RuntimeContentWrapper } from '../internal/plugins/helpers';
import { sortByPriority } from '../internal/plugins/helpers/utils';
import VisibilityStateManager from '../internal/plugins/helpers/visibility-state-manager';
import { AppLayoutProps } from './interfaces';

export interface DrawersLayout {
  before: Array<AppLayoutProps.Drawer>;
  after: Array<AppLayoutProps.Drawer>;
}

const visibilityStateManagerMap = new Map<string, VisibilityStateManager>();

export function convertRuntimeDrawers(drawers: Array<RuntimeDrawerConfig>): DrawersLayout {
  const converted = drawers.map(
    ({
      mountContent,
      unmountContent,
      trigger,
      ...runtimeDrawer
    }): AppLayoutProps.Drawer & {
      orderPriority?: number;
      onShow?: NonCancelableEventHandler;
      onHide?: NonCancelableEventHandler;
    } => {
      let visibilityStateManager: VisibilityStateManager;
      if (visibilityStateManagerMap.has(runtimeDrawer.id)) {
        visibilityStateManager = visibilityStateManagerMap.get(runtimeDrawer.id)!;
      } else {
        visibilityStateManager = new VisibilityStateManager();
        visibilityStateManagerMap.set(runtimeDrawer.id, visibilityStateManager);
      }

      return {
        ...runtimeDrawer,
        ariaLabels: { drawerName: runtimeDrawer.ariaLabels.content ?? '', ...runtimeDrawer.ariaLabels },
        trigger: trigger
          ? {
              iconSvg: (
                // eslint-disable-next-line react/no-danger
                <span dangerouslySetInnerHTML={{ __html: trigger.iconSvg }} />
              ),
            }
          : undefined,
        content: (
          <RuntimeContentWrapper
            key={runtimeDrawer.id}
            mountContent={mountContent}
            unmountContent={unmountContent}
            registerVisibilityCallback={visibilityStateManager.registerVisibilityCallback}
          />
        ),
        onResize: event => {
          fireNonCancelableEvent(runtimeDrawer.onResize, { size: event.detail.size, id: runtimeDrawer.id });
        },
        onShow: visibilityStateManager.show,
        onHide: visibilityStateManager.hide,
      };
    }
  );
  const sorted = sortByPriority(converted);
  return {
    before: sorted.filter(item => (item.orderPriority ?? 0) > 0),
    after: sorted.filter(item => (item.orderPriority ?? 0) <= 0),
  };
}
