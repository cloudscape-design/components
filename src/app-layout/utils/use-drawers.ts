// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { DrawerItem, InternalDrawerProps } from '../drawer/interfaces';
import { useControllable } from '../../internal/hooks/use-controllable';
import { fireNonCancelableEvent } from '../../internal/events';
import { awsuiPluginsInternal } from '../../internal/plugins/api';
import { sortByPriority } from '../../internal/plugins/helpers/utils';
import { convertRuntimeDrawers, DrawersLayout } from '../runtime-api';
import { AppLayoutProps } from '../interfaces';
import { togglesConfig } from '../toggles';

export const TOOLS_DRAWER_ID = 'awsui-internal-tools';

interface ToolsProps {
  toolsHide: boolean | undefined;
  toolsOpen: boolean | undefined;
  toolsWidth: number;
  tools: React.ReactNode | undefined;
  onToolsChange: AppLayoutProps['onToolsChange'];
  ariaLabels: AppLayoutProps.Labels | undefined;
}

type DrawerChangeHandler = (newDrawerId: string | undefined) => void;

function getToolsDrawerItem(props: ToolsProps): DrawerItem | null {
  if (props.toolsHide) {
    return null;
  }
  const { iconName, getLabels } = togglesConfig.tools;
  const { mainLabel, closeLabel, openLabel } = getLabels(props.ariaLabels);
  return {
    id: TOOLS_DRAWER_ID,
    content: props.tools,
    resizable: false,
    ariaLabels: {
      triggerButton: openLabel,
      closeButton: closeLabel,
      content: mainLabel,
    },
    trigger: {
      iconName: iconName,
    },
  };
}

function useRuntimeDrawers(
  disableRuntimeDrawers: boolean | undefined,
  activeDrawerId: string | undefined,
  onActiveDrawerChange: DrawerChangeHandler
) {
  const [runtimeDrawers, setRuntimeDrawers] = useState<DrawersLayout>({ before: [], after: [] });
  const onActiveDrawerChangeStable = useStableCallback(onActiveDrawerChange);

  const drawerWasOpenRef = useRef(false);
  drawerWasOpenRef.current = drawerWasOpenRef.current || !!activeDrawerId;

  useEffect(() => {
    if (disableRuntimeDrawers) {
      return;
    }
    const unsubscribe = awsuiPluginsInternal.appLayout.onDrawersRegistered(drawers => {
      setRuntimeDrawers(convertRuntimeDrawers(drawers));
      if (!drawerWasOpenRef.current) {
        const defaultActiveDrawer = sortByPriority(drawers).find(drawer => drawer.defaultActive);
        if (defaultActiveDrawer) {
          onActiveDrawerChangeStable(defaultActiveDrawer.id);
        }
      }
    });
    return () => {
      unsubscribe();
      setRuntimeDrawers({ before: [], after: [] });
    };
  }, [disableRuntimeDrawers, onActiveDrawerChangeStable]);

  return runtimeDrawers;
}

function applyToolsDrawer(toolsProps: ToolsProps, runtimeDrawers: DrawersLayout) {
  const drawers = [...runtimeDrawers.before, ...runtimeDrawers.after];
  if (drawers.length === 0) {
    return null;
  }
  const toolsItem = getToolsDrawerItem(toolsProps);
  if (toolsItem) {
    drawers.unshift(toolsItem);
  }

  return drawers;
}

export function useDrawers(
  {
    drawers: ownDrawers,
    __disableRuntimeDrawers: disableRuntimeDrawers,
  }: InternalDrawerProps & { __disableRuntimeDrawers?: boolean },
  toolsProps: ToolsProps
) {
  const [activeDrawerId, setActiveDrawerId] = useControllable(
    ownDrawers?.activeDrawerId,
    ownDrawers?.onChange,
    undefined,
    {
      componentName: 'AppLayout',
      controlledProp: 'activeDrawerId',
      changeHandler: 'onChange',
    }
  );
  const [drawerSizes, setDrawerSizes] = useState<Record<string, number>>({});

  function onActiveDrawerResize({ id, size }: { id: string; size: number }) {
    setDrawerSizes(oldSizes => ({ ...oldSizes, [id]: size }));
    fireNonCancelableEvent(activeDrawer?.onResize, { id, size });
    fireNonCancelableEvent(ownDrawers?.onResize, { id, size });
  }

  function onActiveDrawerChange(newDrawerId: string | undefined) {
    setActiveDrawerId(newDrawerId);
    if (hasOwnDrawers) {
      fireNonCancelableEvent(ownDrawers?.onChange, newDrawerId);
    } else if (!toolsProps.toolsHide) {
      fireNonCancelableEvent(toolsProps.onToolsChange, { open: newDrawerId === TOOLS_DRAWER_ID });
    }
  }

  const hasOwnDrawers = !!ownDrawers?.items;
  const runtimeDrawers = useRuntimeDrawers(disableRuntimeDrawers, activeDrawerId, onActiveDrawerChange);
  const combinedDrawers = hasOwnDrawers
    ? [...runtimeDrawers.before, ...ownDrawers.items, ...runtimeDrawers.after]
    : applyToolsDrawer(toolsProps, runtimeDrawers);
  // support toolsOpen in runtime-drawers-only mode
  let activeDrawerIdResolved = toolsProps.toolsOpen && !hasOwnDrawers ? TOOLS_DRAWER_ID : activeDrawerId;
  const activeDrawer = combinedDrawers?.find(drawer => drawer.id === activeDrawerIdResolved);
  // ensure that id is only defined when the drawer exists
  activeDrawerIdResolved = activeDrawer?.id;

  return {
    ariaLabel: ownDrawers?.ariaLabel,
    overflowAriaLabel: ownDrawers?.overflowAriaLabel,
    overflowWithBadgeAriaLabel: ownDrawers?.overflowWithBadgeAriaLabel,
    drawers: combinedDrawers,
    activeDrawer,
    activeDrawerId: activeDrawerIdResolved,
    activeDrawerSize: activeDrawerIdResolved
      ? drawerSizes[activeDrawerIdResolved] ?? activeDrawer?.defaultSize ?? toolsProps.toolsWidth
      : toolsProps.toolsWidth,
    onActiveDrawerChange,
    onActiveDrawerResize,
  };
}
