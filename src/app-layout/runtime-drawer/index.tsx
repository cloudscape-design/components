// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef } from 'react';

import { fireNonCancelableEvent } from '../../internal/events';
import { DrawerConfig as RuntimeDrawerConfig } from '../../internal/plugins/controllers/drawers';
import { sortByPriority } from '../../internal/plugins/helpers/utils';
import { AppLayoutProps } from '../interfaces';
import { ActiveDrawersContext } from '../utils/visibility-context';

export interface DrawersLayout {
  global: Array<AppLayoutProps.Drawer>;
  localBefore: Array<AppLayoutProps.Drawer>;
  localAfter: Array<AppLayoutProps.Drawer>;
}

type VisibilityCallback = (isVisible: boolean) => void;

interface RuntimeContentWrapperProps {
  id?: string;
  mountContent: RuntimeDrawerConfig['mountContent'];
  unmountContent: RuntimeDrawerConfig['unmountContent'];
}

function RuntimeDrawerWrapper({ mountContent, unmountContent, id }: RuntimeContentWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const visibilityChangeCallback = useRef<VisibilityCallback | null>(null);
  const activeDrawersIds = useContext(ActiveDrawersContext);
  const isVisible = !!id && activeDrawersIds.includes(id);

  useEffect(() => {
    const container = ref.current!;
    mountContent(container, {
      onVisibilityChange: cb => {
        visibilityChangeCallback.current = cb;
      },
    });
    return () => {
      unmountContent(container);
      visibilityChangeCallback.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    visibilityChangeCallback.current?.(isVisible);
  }, [isVisible]);

  return <div ref={ref}></div>;
}

const mapRuntimeConfigToDrawer = (
  runtimeConfig: RuntimeDrawerConfig
): AppLayoutProps.Drawer & {
  orderPriority?: number;
} => {
  const { mountContent, unmountContent, trigger, ...runtimeDrawer } = runtimeConfig;

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
      <RuntimeDrawerWrapper
        key={runtimeDrawer.id}
        mountContent={mountContent}
        unmountContent={unmountContent}
        id={runtimeDrawer.id}
      />
    ),
    onResize: event => {
      fireNonCancelableEvent(runtimeDrawer.onResize, { size: event.detail.size, id: runtimeDrawer.id });
    },
  };
};

export function convertRuntimeDrawers(
  localDrawers: Array<RuntimeDrawerConfig>,
  globalDrawers: Array<RuntimeDrawerConfig>
): DrawersLayout {
  const converted = localDrawers.map(mapRuntimeConfigToDrawer);
  const sorted = sortByPriority(converted);
  return {
    global: sortByPriority(globalDrawers.map(mapRuntimeConfigToDrawer)),
    localBefore: sorted.filter(item => (item.orderPriority ?? 0) > 0),
    localAfter: sorted.filter(item => (item.orderPriority ?? 0) <= 0),
  };
}
