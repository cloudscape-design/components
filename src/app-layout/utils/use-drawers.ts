// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import { fireNonCancelableEvent } from '../../internal/events';
import { useControllable } from '../../internal/hooks/use-controllable';
import { usePrevious } from '../../internal/hooks/use-previous';
import { awsuiPluginsInternal } from '../../internal/plugins/api';
import { sortByPriority } from '../../internal/plugins/helpers/utils';
import { AppLayoutProps, AppLayoutPropsWithDefaults } from '../interfaces';
import { convertRuntimeDrawers, DrawersLayout } from '../runtime-api';
import { togglesConfig } from '../toggles';

export const TOOLS_DRAWER_ID = 'awsui-internal-tools';

interface ToolsProps {
  toolsHide: boolean | undefined;
  toolsOpen: boolean | undefined;
  toolsWidth: number;
  tools: React.ReactNode | undefined;
  onToolsToggle: (newOpen: boolean) => void;
  ariaLabels: AppLayoutProps.Labels | undefined;
  disableDrawersMerge?: boolean;
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

function useRuntimeDrawers(
  disableRuntimeDrawers: boolean | undefined,
  activeDrawersIds: Array<string>,
  onActiveDrawerChange: (newDrawerId: string | null) => void
) {
  const [runtimeDrawers, setRuntimeDrawers] = useState<DrawersLayout>({ before: [], after: [] });
  const onActiveDrawerChangeStable = useStableCallback(onActiveDrawerChange);

  const openedDrawersRef = useRef<Array<string>>(activeDrawersIds);
  openedDrawersRef.current = activeDrawersIds;

  useEffect(() => {
    if (disableRuntimeDrawers) {
      return;
    }
    const unsubscribe = awsuiPluginsInternal.appLayout.onDrawersRegistered(drawers => {
      setRuntimeDrawers(convertRuntimeDrawers(drawers));
      const defaultActiveDrawer = sortByPriority(drawers).find(
        drawer => !openedDrawersRef.current.includes(drawer.id) && drawer.defaultActive
      );
      if (defaultActiveDrawer) {
        onActiveDrawerChangeStable(defaultActiveDrawer.id);
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
  if (drawers.length === 0 && toolsProps.disableDrawersMerge) {
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
  __activeDrawersLimit?: number;
  __activeDrawersIds?: AppLayoutPropsWithDefaults['__activeDrawersIds'];
  __onDrawersChange?: AppLayoutPropsWithDefaults['__onDrawersChange'];
};

export function useDrawers(
  {
    drawers,
    activeDrawerId: controlledActiveDrawerId,
    onDrawerChange,
    __disableRuntimeDrawers: disableRuntimeDrawers,
    __activeDrawersLimit: activeDrawersLimit,
    __activeDrawersIds,
    __onDrawersChange,
  }: UseDrawersProps,
  ariaLabels: AppLayoutProps['ariaLabels'],
  toolsProps: ToolsProps
) {
  const [activeDrawerId = null] = useControllable(controlledActiveDrawerId, onDrawerChange, null, {
    componentName: 'AppLayout',
    controlledProp: 'activeDrawerId',
    changeHandler: 'onChange',
  });
  const activeDrawersIdsDefault = toolsProps.toolsOpen ? [TOOLS_DRAWER_ID] : [];
  const [activeDrawersIds = [], setActiveDrawersIds] = useControllable<Array<string>>(
    __activeDrawersIds!,
    __onDrawersChange,
    activeDrawersIdsDefault,
    {
      componentName: 'AppLayout',
      controlledProp: 'activeDrawerId',
      changeHandler: 'onChange',
    }
  );
  const toolsOpenPrevious = usePrevious(toolsProps.toolsOpen);

  const [drawerSizes, setDrawerSizes] = useState<Record<string, number>>({});
  const hasOwnDrawers = !!drawers;

  const onActiveDrawerChange = useCallback(
    (newDrawerId: string | null) => {
      let newActiveDrawersIds: Array<string>;
      if (newDrawerId && activeDrawersIds.includes(newDrawerId)) {
        newActiveDrawersIds = activeDrawersIds.filter(id => id !== newDrawerId);
      } else if (newDrawerId) {
        newActiveDrawersIds = [newDrawerId, ...activeDrawersIds].slice(0, activeDrawersLimit!);
      } else {
        newActiveDrawersIds = [];
      }

      setActiveDrawersIds(newActiveDrawersIds);

      if (hasOwnDrawers) {
        fireNonCancelableEvent(__onDrawersChange, { activeDrawersIds: newActiveDrawersIds });
      }

      // close the tools drawer when it occupies the rightmost position, and a new drawer takes the leftmost position.
      if (activeDrawersIds.includes(TOOLS_DRAWER_ID) && !newActiveDrawersIds.includes(TOOLS_DRAWER_ID)) {
        toolsProps.onToolsToggle(false);
      }

      if (!toolsProps.toolsHide && newDrawerId === TOOLS_DRAWER_ID) {
        toolsProps.onToolsToggle(!activeDrawersIds.includes(TOOLS_DRAWER_ID));
      }
    },
    [__onDrawersChange, activeDrawersIds, activeDrawersLimit, hasOwnDrawers, setActiveDrawersIds, toolsProps]
  );

  useEffect(() => {
    if (toolsProps.toolsHide || toolsProps.toolsOpen === undefined || toolsProps.toolsOpen === toolsOpenPrevious) {
      return;
    }

    if (
      (toolsProps.toolsOpen && !activeDrawersIds.includes(TOOLS_DRAWER_ID)) ||
      (!toolsProps.toolsOpen && activeDrawersIds.includes(TOOLS_DRAWER_ID))
    ) {
      onActiveDrawerChange(TOOLS_DRAWER_ID);
    }
  }, [toolsProps.toolsHide, toolsProps.toolsOpen, activeDrawersIds, onActiveDrawerChange, toolsOpenPrevious]);

  function onActiveDrawerResize({ id, size }: { id: string; size: number }) {
    const currentActiveDrawer = combinedDrawers?.find(drawer => drawer.id === id);
    setDrawerSizes(oldSizes => ({ ...oldSizes, [id]: size }));
    fireNonCancelableEvent(currentActiveDrawer?.onResize, { id, size });
  }

  const runtimeDrawers = useRuntimeDrawers(disableRuntimeDrawers, activeDrawersIds, onActiveDrawerChange);
  const combinedDrawers = drawers
    ? [...runtimeDrawers.before, ...drawers, ...runtimeDrawers.after]
    : applyToolsDrawer(toolsProps, runtimeDrawers);
  // support toolsOpen in runtime-drawers-only mode
  let activeDrawerIdResolved = toolsProps?.toolsOpen && !hasOwnDrawers ? TOOLS_DRAWER_ID : activeDrawerId;
  const activeDrawer = combinedDrawers?.find(drawer => drawer.id === activeDrawerIdResolved);
  const activeDrawers = combinedDrawers?.filter(drawer => activeDrawersIds.includes(drawer.id));
  // ensure that id is only defined when the drawer exists
  activeDrawerIdResolved = activeDrawer?.id ?? null;

  const activeDrawerSize = activeDrawerIdResolved
    ? drawerSizes[activeDrawerIdResolved] ?? activeDrawer?.defaultSize ?? toolsProps.toolsWidth
    : 0;
  const minDrawerSize = Math.min(activeDrawer?.defaultSize ?? 290, 290);
  const minDrawersSizes = activeDrawers?.map(drawer => Math.min(drawer?.defaultSize ?? 290, 290));

  return {
    ariaLabelsWithDrawers: ariaLabels,
    drawers: combinedDrawers || undefined,
    activeDrawer,
    activeDrawerId: activeDrawerIdResolved,
    activeDrawers,
    activeDrawersIds,
    drawerSizes,
    activeDrawerSize,
    minDrawersSizes,
    minDrawerSize,
    onActiveDrawerChange,
    onActiveDrawerResize,
  };
}
