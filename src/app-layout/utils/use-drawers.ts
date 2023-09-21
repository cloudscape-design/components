// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { InternalDrawerProps } from '../drawer/interfaces';
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
  ariaLabels: AppLayoutProps.Labels | undefined;
}

function getToolsDrawerItem(props: ToolsProps) {
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
  onActiveDrawerChange: (id: string | undefined) => void
) {
  const [runtimeDrawers, setRuntimeDrawers] = useState<DrawersLayout>({ before: [], after: [] });

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
          onActiveDrawerChange(defaultActiveDrawer.id);
        }
      }
    });
    return () => {
      unsubscribe();
      setRuntimeDrawers({ before: [], after: [] });
    };
  }, [disableRuntimeDrawers, onActiveDrawerChange]);

  return runtimeDrawers;
}

export function useDrawers(
  {
    drawers: ownDrawers,
    __disableRuntimeDrawers: disableRuntimeDrawers,
  }: InternalDrawerProps & { __disableRuntimeDrawers?: boolean },
  toolsProps: ToolsProps
) {
  const toolsDrawer = getToolsDrawerItem(toolsProps);

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

  const onActiveDrawerChange = useStableCallback((newDrawerId: string | undefined) => {
    setActiveDrawerId(newDrawerId);
    fireNonCancelableEvent(ownDrawers?.onChange, newDrawerId);
  });

  const runtimeDrawers = useRuntimeDrawers(disableRuntimeDrawers, activeDrawerId, onActiveDrawerChange);
  const combinedDrawers = [...runtimeDrawers.before, ...(ownDrawers?.items ?? []), ...runtimeDrawers.after];
  if (toolsDrawer && combinedDrawers.length > 0) {
    combinedDrawers.unshift(toolsDrawer);
  }
  // support toolsOpen in runtime-drawers-only mode
  let activeDrawerIdResolved =
    toolsProps.toolsOpen && (ownDrawers?.items ?? []).length === 0 ? TOOLS_DRAWER_ID : activeDrawerId;
  const activeDrawer = combinedDrawers.find(drawer => drawer.id === activeDrawerIdResolved);
  // ensure that id is only defined when the drawer exists
  activeDrawerIdResolved = activeDrawer?.id;

  function onActiveDrawerResize({ id, size }: { id: string; size: number }) {
    setDrawerSizes(oldSizes => ({ ...oldSizes, [id]: size }));
    fireNonCancelableEvent(ownDrawers?.onResize, { id, size });
  }

  return {
    ariaLabel: ownDrawers?.ariaLabel,
    overflowAriaLabel: ownDrawers?.overflowAriaLabel,
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
