// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { BetaDrawersProps } from '../drawer/interfaces';
import { useControllable } from '../../internal/hooks/use-controllable';
import { fireNonCancelableEvent, NonCancelableCustomEvent } from '../../internal/events';
import { awsuiPluginsInternal } from '../../internal/plugins/api';
import { sortByPriority } from '../../internal/plugins/helpers/utils';
import { convertRuntimeDrawers, DrawersLayout } from '../runtime-api';
import { AppLayoutProps } from '../interfaces';
import { togglesConfig } from '../toggles';

export const TOOLS_DRAWER_ID = 'awsui-internal-tools';
export const USER_SETTINGS_DRAWER_ID = 'awsui-user-settings';

interface ToolsProps {
  toolsHide: boolean | undefined;
  toolsOpen: boolean | undefined;
  toolsWidth: number;
  tools: React.ReactNode | undefined;
  onToolsToggle: (newOpen: boolean) => void;
  ariaLabels: AppLayoutProps.Labels | undefined;
}

function getToolsDrawerItem(props: ToolsProps): AppLayoutProps.Drawer | null {
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
      drawerName: mainLabel ?? '',
    },
    trigger: {
      iconName: iconName,
    },
  };
}

function getUserSettingsDrawerItem(userSettingsContent: React.ReactNode | undefined): AppLayoutProps.Drawer {
  return {
    id: USER_SETTINGS_DRAWER_ID,
    content: userSettingsContent,
    defaultSize: 500,
    resizable: true,
    ariaLabels: {
      drawerName: 'user settings drawer',
    },
    trigger: {
      iconName: 'settings',
    },
  };
}

function useRuntimeDrawers(
  disableRuntimeDrawers: boolean | undefined,
  activeDrawerId: string | null,
  onActiveDrawerChange: (newDrawerId: string | null) => void
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

function isBetaDrawers(drawers: unknown): drawers is BetaDrawersProps {
  return typeof drawers === 'object' && !!drawers && !Array.isArray(drawers) && 'items' in drawers;
}

function convertBetaApi(drawers: BetaDrawersProps, ariaLabels: AppLayoutProps['ariaLabels']) {
  return {
    drawers: drawers.items.map(
      (betaDrawer): AppLayoutProps.Drawer => ({
        ...betaDrawer,
        ariaLabels: { drawerName: betaDrawer.ariaLabels?.content ?? '', ...betaDrawer.ariaLabels },
        onResize: event => {
          fireNonCancelableEvent(betaDrawer.onResize, { size: event.detail.size, id: betaDrawer.id });
          fireNonCancelableEvent(drawers.onResize, { size: event.detail.size, id: betaDrawer.id });
        },
      })
    ),
    controlledActiveDrawerId: drawers.activeDrawerId,
    onDrawerChange: (event: NonCancelableCustomEvent<{ activeDrawerId: string | null }>) =>
      fireNonCancelableEvent(drawers.onChange, event.detail.activeDrawerId),
    ariaLabels: {
      ...ariaLabels,
      drawers: drawers.ariaLabel,
      drawersOverflow: drawers.overflowAriaLabel,
      drawersOverflowWithBadge: drawers.overflowWithBadgeAriaLabel,
    },
  };
}

function applyToolsDrawer(
  toolsProps: ToolsProps,
  runtimeDrawers: DrawersLayout,
  userSettingsContent: React.ReactNode | undefined
) {
  const drawers = [...runtimeDrawers.before, getUserSettingsDrawerItem(userSettingsContent), ...runtimeDrawers.after];
  if (drawers.length === 0) {
    return null;
  }
  const toolsItem = getToolsDrawerItem(toolsProps);
  if (toolsItem) {
    drawers.unshift(toolsItem);
  }

  return drawers;
}

type UseDrawersProps = Pick<AppLayoutProps, 'drawers' | 'activeDrawerId' | 'onDrawerChange'> & {
  __disableRuntimeDrawers?: boolean;
};

export function useDrawers(
  {
    drawers,
    activeDrawerId: controlledActiveDrawerId,
    onDrawerChange,
    __disableRuntimeDrawers: disableRuntimeDrawers,
  }: UseDrawersProps,
  userSettingsContent: React.ReactNode | undefined,
  ariaLabels: AppLayoutProps['ariaLabels'],
  toolsProps: ToolsProps
) {
  if (isBetaDrawers(drawers)) {
    ({ drawers, controlledActiveDrawerId, onDrawerChange, ariaLabels } = convertBetaApi(drawers, ariaLabels));
  }

  const [activeDrawerId = null, setActiveDrawerId] = useControllable(controlledActiveDrawerId, onDrawerChange, null, {
    componentName: 'AppLayout',
    controlledProp: 'activeDrawerId',
    changeHandler: 'onChange',
  });
  const [drawerSizes, setDrawerSizes] = useState<Record<string, number>>({});

  function onActiveDrawerResize({ id, size }: { id: string; size: number }) {
    setDrawerSizes(oldSizes => ({ ...oldSizes, [id]: size }));
    fireNonCancelableEvent(activeDrawer?.onResize, { id, size });
  }

  function onActiveDrawerChange(newDrawerId: string | null) {
    setActiveDrawerId(newDrawerId);
    if (hasOwnDrawers) {
      fireNonCancelableEvent(onDrawerChange, { activeDrawerId: newDrawerId });
    } else if (!toolsProps.toolsHide) {
      toolsProps.onToolsToggle(newDrawerId === TOOLS_DRAWER_ID);
    }
  }

  const hasOwnDrawers = !!drawers;
  const runtimeDrawers = useRuntimeDrawers(disableRuntimeDrawers, activeDrawerId, onActiveDrawerChange);
  const combinedDrawers = drawers
    ? [...runtimeDrawers.before, ...drawers, getUserSettingsDrawerItem(userSettingsContent), ...runtimeDrawers.after]
    : applyToolsDrawer(toolsProps, runtimeDrawers, userSettingsContent);
  // support toolsOpen in runtime-drawers-only mode
  let activeDrawerIdResolved = toolsProps?.toolsOpen && !hasOwnDrawers ? TOOLS_DRAWER_ID : activeDrawerId;
  const activeDrawer = combinedDrawers?.find(drawer => drawer.id === activeDrawerIdResolved);
  // ensure that id is only defined when the drawer exists
  activeDrawerIdResolved = activeDrawer?.id ?? null;

  return {
    ariaLabelsWithDrawers: ariaLabels,
    drawers: combinedDrawers || undefined,
    activeDrawer,
    activeDrawerId: activeDrawerIdResolved,
    activeDrawerSize: activeDrawerIdResolved
      ? drawerSizes[activeDrawerIdResolved] ?? activeDrawer?.defaultSize ?? toolsProps.toolsWidth
      : toolsProps.toolsWidth,
    onActiveDrawerChange,
    onActiveDrawerResize,
  };
}
