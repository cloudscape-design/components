// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import { fireNonCancelableEvent } from '../../internal/events';
import { useControllable } from '../../internal/hooks/use-controllable';
import { awsuiPluginsInternal } from '../../internal/plugins/api';
import { sortByPriority } from '../../internal/plugins/helpers/utils';
import { AppLayoutProps } from '../interfaces';
import { convertRuntimeDrawers, DrawersLayout } from '../runtime-drawer';
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

const DRAWERS_LIMIT = 2;

function useRuntimeDrawers(
  disableRuntimeDrawers: boolean | undefined,
  activeDrawerId: string | null,
  onActiveDrawerChange: (newDrawerId: string | null, initiatedByUserAction?: boolean) => void,
  activeGlobalDrawersIds: Array<string>,
  onActiveGlobalDrawersChange: (newDrawerId: string, initiatedByUserAction?: boolean) => void,
  drawers: AppLayoutProps.Drawer[]
) {
  const [runtimeDrawers, setRuntimeDrawers] = useState<DrawersLayout>({
    localBefore: [],
    localAfter: [],
    global: [],
  });
  const onLocalDrawerChangeStable = useStableCallback(onActiveDrawerChange);
  const onGlobalDrawersChangeStable = useStableCallback(onActiveGlobalDrawersChange);

  const localDrawerWasOpenRef = useRef(false);
  localDrawerWasOpenRef.current = localDrawerWasOpenRef.current || !!activeDrawerId;
  const activeGlobalDrawersIdsRef = useRef<Array<string>>([]);
  activeGlobalDrawersIdsRef.current = activeGlobalDrawersIds;

  useEffect(() => {
    if (disableRuntimeDrawers) {
      return;
    }
    const unsubscribe = awsuiPluginsInternal.appLayout.onDrawersRegistered(drawers => {
      const localDrawers = drawers.filter(drawer => drawer.type !== 'global');
      const globalDrawers = drawers.filter(drawer => drawer.type === 'global');
      setRuntimeDrawers(convertRuntimeDrawers(localDrawers, globalDrawers));
      if (!localDrawerWasOpenRef.current) {
        const defaultActiveLocalDrawer = sortByPriority(localDrawers).find(drawer => drawer.defaultActive);
        if (defaultActiveLocalDrawer) {
          onLocalDrawerChangeStable(defaultActiveLocalDrawer.id);
        }
      }

      const drawersNotActiveByDefault = globalDrawers.filter(drawer => !drawer.defaultActive);
      const hasDrawersOpenByUserAction = drawersNotActiveByDefault.find(drawer =>
        activeGlobalDrawersIdsRef.current.includes(drawer.id)
      );
      if (hasDrawersOpenByUserAction || activeGlobalDrawersIdsRef.current.length === DRAWERS_LIMIT) {
        return;
      }

      const defaultActiveGlobalDrawers = sortByPriority(globalDrawers).filter(
        drawer => !activeGlobalDrawersIdsRef.current.includes(drawer.id) && drawer.defaultActive
      );
      defaultActiveGlobalDrawers.forEach(drawer => {
        onGlobalDrawersChangeStable(drawer.id);
      });
    });
    return () => {
      unsubscribe();
      setRuntimeDrawers({ localBefore: [], localAfter: [], global: [] });
    };
  }, [disableRuntimeDrawers, onGlobalDrawersChangeStable, onLocalDrawerChangeStable]);

  useEffect(() => {
    const unsubscribe = awsuiPluginsInternal.appLayout.onDrawerOpened(drawerId => {
      const localDrawer = [...runtimeDrawers.localBefore, ...drawers, ...runtimeDrawers.localAfter]?.find(
        drawer => drawer.id === drawerId
      );
      const globalDrawer = runtimeDrawers.global?.find(drawer => drawer.id === drawerId);
      if (localDrawer && activeDrawerId !== drawerId) {
        onActiveDrawerChange(drawerId, true);
      }
      if (globalDrawer && !activeGlobalDrawersIds.includes(drawerId)) {
        onActiveGlobalDrawersChange(drawerId, true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [
    activeDrawerId,
    activeGlobalDrawersIds,
    drawers,
    onActiveDrawerChange,
    runtimeDrawers,
    onActiveGlobalDrawersChange,
  ]);

  useEffect(() => {
    const unsubscribe = awsuiPluginsInternal.appLayout.onDrawerClosed(drawerId => {
      const localDrawer = [...runtimeDrawers.localBefore, ...drawers, ...runtimeDrawers.localAfter]?.find(
        drawer => drawer.id === drawerId
      );
      const globalDrawer = runtimeDrawers.global?.find(drawer => drawer.id === drawerId);
      if (localDrawer && activeDrawerId === drawerId) {
        onActiveDrawerChange(null, true);
      }
      if (globalDrawer && activeGlobalDrawersIds.includes(drawerId)) {
        onActiveGlobalDrawersChange(drawerId, true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [
    activeDrawerId,
    activeGlobalDrawersIds,
    drawers,
    onActiveDrawerChange,
    runtimeDrawers,
    onActiveGlobalDrawersChange,
  ]);

  return runtimeDrawers;
}

function applyToolsDrawer(toolsProps: ToolsProps, runtimeDrawers: DrawersLayout) {
  const drawers = [...runtimeDrawers.localBefore, ...runtimeDrawers.localAfter];
  if (drawers.length === 0 && toolsProps.disableDrawersMerge) {
    return null;
  }
  const toolsItem = getToolsDrawerItem(toolsProps);
  if (toolsItem) {
    drawers.unshift(toolsItem);
  }

  return drawers;
}

export const MIN_DRAWER_SIZE = 290;

type UseDrawersProps = Pick<AppLayoutProps, 'drawers' | 'activeDrawerId' | 'onDrawerChange'> & {
  __disableRuntimeDrawers?: boolean;
  onGlobalDrawerFocus?: (drawerId: string, open: boolean) => void;
  onAddNewActiveDrawer?: (drawerId: string) => void;
};

export function useDrawers(
  {
    drawers,
    activeDrawerId: controlledActiveDrawerId,
    onDrawerChange,
    onGlobalDrawerFocus,
    onAddNewActiveDrawer,
    __disableRuntimeDrawers: disableRuntimeDrawers,
  }: UseDrawersProps,
  ariaLabels: AppLayoutProps['ariaLabels'],
  toolsProps: ToolsProps
) {
  const [activeDrawerId = null, setActiveDrawerId] = useControllable(controlledActiveDrawerId, onDrawerChange, null, {
    componentName: 'AppLayout',
    controlledProp: 'activeDrawerId',
    changeHandler: 'onChange',
  });
  const [activeGlobalDrawersIds, setActiveGlobalDrawersIds] = useState<Array<string>>([]);
  const [drawerSizes, setDrawerSizes] = useState<Record<string, number>>({});
  // FIFO queue that keeps track of open drawers, where the first element is the most recently opened drawer
  const drawersOpenQueue = useRef<Array<string>>([]);

  function onActiveDrawerResize({ id, size }: { id: string; size: number }) {
    setDrawerSizes(oldSizes => ({ ...oldSizes, [id]: size }));
    fireNonCancelableEvent(activeDrawer?.onResize, { id, size });
    const activeGlobalDrawer = runtimeGlobalDrawers.find(drawer => drawer.id === id);
    fireNonCancelableEvent(activeGlobalDrawer?.onResize, { id, size });
  }

  function onActiveDrawerChange(newDrawerId: string | null, initiatedByUserAction = false) {
    setActiveDrawerId(newDrawerId);
    if (newDrawerId) {
      onAddNewActiveDrawer?.(newDrawerId);
    }
    if (hasOwnDrawers) {
      fireNonCancelableEvent(onDrawerChange, { activeDrawerId: newDrawerId });
    } else if (!toolsProps.toolsHide) {
      toolsProps.onToolsToggle(newDrawerId === TOOLS_DRAWER_ID);
    }

    if (newDrawerId) {
      drawersOpenQueue.current = [newDrawerId, ...drawersOpenQueue.current];
      const newDrawer = [...runtimeDrawers.localBefore, ...runtimeDrawers.localAfter]?.find(
        drawer => drawer.id === newDrawerId
      );
      fireNonCancelableEvent(newDrawer?.onToggle, { isOpen: true, initiatedByUserAction });
    }

    if (activeDrawerId) {
      drawersOpenQueue.current = drawersOpenQueue.current.filter(id => id !== activeDrawerId);
      const activeDrawer = [...runtimeDrawers.localBefore, ...runtimeDrawers.localAfter]?.find(
        drawer => drawer.id === activeDrawerId
      );
      fireNonCancelableEvent(activeDrawer?.onToggle, { isOpen: false, initiatedByUserAction });
    }
  }

  function onActiveGlobalDrawersChange(drawerId: string, initiatedByUserAction = false) {
    const drawer = runtimeGlobalDrawers.find(drawer => drawer.id === drawerId);
    if (activeGlobalDrawersIds.includes(drawerId)) {
      setActiveGlobalDrawersIds(currentState => currentState.filter(id => id !== drawerId));
      onGlobalDrawerFocus?.(drawerId, false);
      drawersOpenQueue.current = drawersOpenQueue.current.filter(id => id !== drawerId);
      fireNonCancelableEvent(drawer?.onToggle, { isOpen: false, initiatedByUserAction });
    } else if (drawerId) {
      onAddNewActiveDrawer?.(drawerId);
      setActiveGlobalDrawersIds(currentState => [drawerId, ...currentState].slice(0, DRAWERS_LIMIT!));
      onGlobalDrawerFocus?.(drawerId, true);
      drawersOpenQueue.current = [drawerId, ...drawersOpenQueue.current];
      fireNonCancelableEvent(drawer?.onToggle, { isOpen: true, initiatedByUserAction });
    }
  }

  const hasOwnDrawers = !!drawers;
  const runtimeDrawers = useRuntimeDrawers(
    disableRuntimeDrawers,
    activeDrawerId,
    onActiveDrawerChange,
    activeGlobalDrawersIds,
    onActiveGlobalDrawersChange,
    drawers ?? []
  );
  const { localBefore, localAfter, global: runtimeGlobalDrawers } = runtimeDrawers;
  const combinedLocalDrawers = drawers
    ? [...localBefore, ...drawers, ...localAfter]
    : applyToolsDrawer(toolsProps, runtimeDrawers);
  // support toolsOpen in runtime-drawers-only mode
  let activeDrawerIdResolved =
    toolsProps?.toolsOpen && !hasOwnDrawers
      ? TOOLS_DRAWER_ID
      : activeDrawerId !== TOOLS_DRAWER_ID
        ? activeDrawerId
        : null;
  const activeDrawer = combinedLocalDrawers?.find(drawer => drawer.id === activeDrawerIdResolved);
  // ensure that id is only defined when the drawer exists
  activeDrawerIdResolved = activeDrawer?.id ?? null;
  const activeGlobalDrawers = runtimeGlobalDrawers.filter(drawer => activeGlobalDrawersIds.includes(drawer.id));

  const activeDrawerSize = activeDrawerIdResolved
    ? drawerSizes[activeDrawerIdResolved] ?? activeDrawer?.defaultSize ?? toolsProps.toolsWidth
    : toolsProps.toolsWidth;
  const activeGlobalDrawersSizes: Record<string, number> = activeGlobalDrawersIds.reduce(
    (acc, currentGlobalDrawerId) => {
      const currentGlobalDrawer = runtimeGlobalDrawers.find(drawer => drawer.id === currentGlobalDrawerId);
      return {
        ...acc,
        [currentGlobalDrawerId]:
          drawerSizes[currentGlobalDrawerId] ?? currentGlobalDrawer?.defaultSize ?? MIN_DRAWER_SIZE,
      };
    },
    {}
  );
  const minGlobalDrawersSizes: Record<string, number> = runtimeGlobalDrawers.reduce((acc, globalDrawer) => {
    return {
      ...acc,
      [globalDrawer.id]: Math.min(globalDrawer.defaultSize ?? MIN_DRAWER_SIZE, MIN_DRAWER_SIZE),
    };
  }, {});
  const minDrawerSize = Math.min(
    toolsProps?.toolsOpen ? toolsProps.toolsWidth : activeDrawer?.defaultSize ?? MIN_DRAWER_SIZE,
    MIN_DRAWER_SIZE
  );

  return {
    ariaLabelsWithDrawers: ariaLabels,
    drawers: combinedLocalDrawers || undefined,
    activeDrawer,
    activeDrawerId: activeDrawerIdResolved,
    globalDrawers: runtimeGlobalDrawers,
    activeGlobalDrawers: activeGlobalDrawers,
    activeGlobalDrawersIds,
    activeGlobalDrawersSizes,
    activeDrawerSize,
    minDrawerSize,
    minGlobalDrawersSizes,
    drawerSizes,
    drawersOpenQueue: drawersOpenQueue.current,
    onActiveDrawerChange,
    onActiveDrawerResize,
    onActiveGlobalDrawersChange,
  };
}
