// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useRef, useState } from 'react';

import { fireNonCancelableEvent } from '../../../internal/events';
import { DrawerPayload, WidgetMessage } from '../../../internal/plugins/widget/interfaces';
import { mapRuntimeConfigToDrawer } from '../../runtime-drawer';

export interface OnChangeParams {
  initiatedByUserAction: boolean;
}

const DEFAULT_ON_CHANGE_PARAMS = { initiatedByUserAction: true };

const MIN_DRAWER_SIZE = 400;

interface UseDrawersProps {
  onBottomDrawerFocus: () => void;
  expandedDrawerId: string | null;
  setExpandedDrawerId: (value: string | null) => void;
  drawersOpenQueue: Array<string>;
}

export function useBottomDrawers({
  onBottomDrawerFocus,
  expandedDrawerId,
  setExpandedDrawerId,
  drawersOpenQueue,
}: UseDrawersProps) {
  const [activeBottomDrawerId, setActiveBottomDrawerId] = useState<string | null>(null);
  const [drawerSizes, setDrawerSizes] = useState<Record<string, number>>({});
  const [runtimeBottomDrawers, setRuntimeBottomDrawers] = useState<Array<DrawerPayload>>([]);
  const bottomDrawerWasOpenRef = useRef(false);
  bottomDrawerWasOpenRef.current = bottomDrawerWasOpenRef.current || !!activeBottomDrawerId;
  const bottomDrawers = runtimeBottomDrawers.map(mapRuntimeConfigToDrawer);

  function onActiveBottomDrawerResize({ id, size }: { id: string; size: number }) {
    setDrawerSizes(oldSizes => ({ ...oldSizes, [id]: size }));
    fireNonCancelableEvent(activeBottomDrawer?.onResize, { id, size });
  }

  function onActiveBottomDrawerChange(
    drawerId: string | null,
    { initiatedByUserAction }: Partial<OnChangeParams> = DEFAULT_ON_CHANGE_PARAMS
  ) {
    const drawer = bottomDrawers.find(drawer => drawer.id === (drawerId || activeBottomDrawerId));
    setActiveBottomDrawerId(drawerId);
    fireNonCancelableEvent(drawer?.onToggle, { isOpen: !!drawerId, initiatedByUserAction });
    if (activeBottomDrawerId === expandedDrawerId) {
      setExpandedDrawerId(null);
    }
    if (drawerId) {
      drawersOpenQueue = [drawerId, ...drawersOpenQueue];
    } else {
      drawersOpenQueue = drawersOpenQueue.filter(id => id !== activeBottomDrawerId);
    }
    onBottomDrawerFocus?.();
  }

  // TODO !!!
  // function checkId(newId: string) {
  //   if (runtimeDrawer && runtimeDrawer.id !== newId) {
  //     metrics.sendOpsMetricObject('awsui-widget-drawer-incorrect-id', { oldId: runtimeDrawer.id, newId });
  //   }
  // }

  function bottomDrawersMessageHandler(event: WidgetMessage) {
    if (event.type === 'registerBottomDrawer') {
      if (bottomDrawers.find(drawer => drawer.id === event.payload.id)) {
        return;
      }
      setRuntimeBottomDrawers(existingBottomDrawers => [...existingBottomDrawers, event.payload]);
      if (!bottomDrawerWasOpenRef.current && event.payload.defaultActive) {
        onActiveBottomDrawerChange(event.payload.id, { initiatedByUserAction: false });
      }
      return;
    }

    switch (event.type) {
      case 'updateDrawerConfig':
        setRuntimeBottomDrawers(existingBottomDrawers => {
          return existingBottomDrawers.map(drawer => {
            if (drawer.id === event.payload.id) {
              return {
                ...drawer,
                ...event.payload,
              };
            }

            return drawer;
          });
        });
        break;
      case 'openDrawer':
        onActiveBottomDrawerChange(event.payload.id, { initiatedByUserAction: false });
        break;
      case 'closeDrawer':
        onActiveBottomDrawerChange(null, { initiatedByUserAction: false });
        break;
      case 'resizeDrawer':
        onActiveBottomDrawerResize({ id: event.payload.id, size: event.payload.size });
        break;
      case 'expandDrawer':
        setExpandedDrawerId(event.payload.id);
        break;
      case 'exitExpandedMode':
        setExpandedDrawerId(null);
        break;
    }
  }
  const activeBottomDrawer = activeBottomDrawerId
    ? bottomDrawers.find(drawer => drawer.id === activeBottomDrawerId)
    : null;
  const activeBottomDrawerSize = activeBottomDrawerId
    ? (drawerSizes[activeBottomDrawerId] ?? activeBottomDrawer?.defaultSize ?? MIN_DRAWER_SIZE)
    : 0;
  const minBottomDrawerSize = Math.min(activeBottomDrawer?.defaultSize ?? MIN_DRAWER_SIZE, MIN_DRAWER_SIZE);

  return {
    bottomDrawers,
    activeBottomDrawer,
    onActiveBottomDrawerChange,
    activeBottomDrawerSize,
    minBottomDrawerSize,
    onActiveBottomDrawerResize,
    bottomDrawersMessageHandler,
  };
}
