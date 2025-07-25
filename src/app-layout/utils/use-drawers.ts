// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import { fireNonCancelableEvent } from '../../internal/events';
import { useControllable } from '../../internal/hooks/use-controllable';
import { awsuiPluginsInternal } from '../../internal/plugins/api';
import { DrawersToggledListener } from '../../internal/plugins/controllers/drawers';
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

export interface OnChangeParams {
  initiatedByUserAction: boolean;
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

const DEFAULT_ON_CHANGE_PARAMS = { initiatedByUserAction: true };

function useRuntimeDrawers(
  disableRuntimeDrawers: boolean | undefined,
  activeDrawerId: string | null,
  onActiveDrawerChange: (newDrawerId: string | null, { initiatedByUserAction }: OnChangeParams) => void,
  activeGlobalDrawersIds: Array<string>,
  onActiveGlobalDrawersChange: (newDrawerId: string, { initiatedByUserAction }: OnChangeParams) => void
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
          onLocalDrawerChangeStable(defaultActiveLocalDrawer.id, { initiatedByUserAction: false });
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
        onGlobalDrawersChangeStable(drawer.id, { initiatedByUserAction: false });
      });
    });
    return () => {
      unsubscribe();
      setRuntimeDrawers({ localBefore: [], localAfter: [], global: [] });
    };
  }, [disableRuntimeDrawers, onGlobalDrawersChangeStable, onLocalDrawerChangeStable]);

  return runtimeDrawers;
}

function useDrawerRuntimeOpenClose(
  disableRuntimeDrawers: boolean | undefined,
  localDrawers: AppLayoutProps.Drawer[] | null,
  globalDrawers: AppLayoutProps.Drawer[],
  activeDrawerId: string | null,
  onActiveDrawerChange: (newDrawerId: string | null, { initiatedByUserAction }: OnChangeParams) => void,
  activeGlobalDrawersIds: Array<string>,
  onActiveGlobalDrawersChange: (newDrawerId: string, { initiatedByUserAction }: OnChangeParams) => void
) {
  const onDrawerOpened: DrawersToggledListener = useStableCallback((drawerId, params = DEFAULT_ON_CHANGE_PARAMS) => {
    const localDrawer = localDrawers?.find(drawer => drawer.id === drawerId);
    const globalDrawer = globalDrawers.find(drawer => drawer.id === drawerId);
    if (localDrawer && activeDrawerId !== drawerId) {
      onActiveDrawerChange(drawerId, params);
    }
    if (globalDrawer && !activeGlobalDrawersIds.includes(drawerId)) {
      onActiveGlobalDrawersChange(drawerId, params);
    }
  });

  const onDrawerClosed: DrawersToggledListener = useStableCallback((drawerId, params = DEFAULT_ON_CHANGE_PARAMS) => {
    const localDrawer = localDrawers?.find(drawer => drawer.id === drawerId);
    const globalDrawer = globalDrawers.find(drawer => drawer.id === drawerId);
    if (localDrawer && activeDrawerId === drawerId) {
      onActiveDrawerChange(null, params);
    }
    if (globalDrawer && activeGlobalDrawersIds.includes(drawerId)) {
      onActiveGlobalDrawersChange(drawerId, params);
    }
  });

  useEffect(() => {
    if (disableRuntimeDrawers) {
      return;
    }
    return awsuiPluginsInternal.appLayout.onDrawerOpened(onDrawerOpened);
  }, [disableRuntimeDrawers, onDrawerOpened]);

  useEffect(() => {
    if (disableRuntimeDrawers) {
      return;
    }
    return awsuiPluginsInternal.appLayout.onDrawerClosed(onDrawerClosed);
  }, [disableRuntimeDrawers, onDrawerClosed]);
}

function useDrawerRuntimeResize(
  disableRuntimeDrawers: boolean | undefined,
  onActiveDrawerResize: ({ id, size }: { id: string; size: number }) => void
) {
  const onRuntimeDrawerResize = useStableCallback((drawerId: string, size: number) => {
    onActiveDrawerResize({ id: drawerId, size });
  });

  useEffect(() => {
    if (disableRuntimeDrawers) {
      return;
    }

    return awsuiPluginsInternal.appLayout.onDrawerResize(onRuntimeDrawerResize);
  }, [disableRuntimeDrawers, onRuntimeDrawerResize]);
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
  const [expandedDrawerId, setExpandedDrawerId] = useState<string | null>(null);
  // FIFO queue that keeps track of open drawers, where the first element is the most recently opened drawer
  const drawersOpenQueue = useRef<Array<string>>([]);

  function onActiveDrawerResize({ id, size }: { id: string; size: number }) {
    setDrawerSizes(oldSizes => ({ ...oldSizes, [id]: size }));
    fireNonCancelableEvent(activeDrawer?.onResize, { id, size });
    const activeGlobalDrawer = runtimeGlobalDrawers.find(drawer => drawer.id === id);
    fireNonCancelableEvent(activeGlobalDrawer?.onResize, { id, size });
  }

  function onActiveDrawerChange(
    newDrawerId: string | null,
    { initiatedByUserAction }: OnChangeParams = DEFAULT_ON_CHANGE_PARAMS
  ) {
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

  function onActiveGlobalDrawersChange(
    drawerId: string,
    { initiatedByUserAction }: Partial<OnChangeParams> = DEFAULT_ON_CHANGE_PARAMS
  ) {
    const drawer = runtimeGlobalDrawers.find(drawer => drawer.id === drawerId);
    if (activeGlobalDrawersIds.includes(drawerId)) {
      setActiveGlobalDrawersIds(currentState => currentState.filter(id => id !== drawerId));
      onGlobalDrawerFocus?.(drawerId, false);
      drawersOpenQueue.current = drawersOpenQueue.current.filter(id => id !== drawerId);
      fireNonCancelableEvent(drawer?.onToggle, { isOpen: false, initiatedByUserAction });
      if (drawerId === expandedDrawerId) {
        setExpandedDrawerId(null);
      }
    } else if (drawerId) {
      onAddNewActiveDrawer?.(drawerId);
      setActiveGlobalDrawersIds(currentState => [drawerId, ...currentState].slice(0, DRAWERS_LIMIT!));
      onGlobalDrawerFocus?.(drawerId, true);
      drawersOpenQueue.current = [drawerId, ...drawersOpenQueue.current];
      fireNonCancelableEvent(drawer?.onToggle, { isOpen: true, initiatedByUserAction });
    }
  }

  const hasOwnDrawers = !!drawers;
  // support toolsOpen in runtime-drawers-only mode
  let activeDrawerIdResolved =
    toolsProps?.toolsOpen && !hasOwnDrawers
      ? TOOLS_DRAWER_ID
      : activeDrawerId !== TOOLS_DRAWER_ID
        ? activeDrawerId
        : null;
  const runtimeDrawers = useRuntimeDrawers(
    disableRuntimeDrawers,
    activeDrawerIdResolved,
    onActiveDrawerChange,
    activeGlobalDrawersIds,
    onActiveGlobalDrawersChange
  );
  const { localBefore, localAfter, global: runtimeGlobalDrawers } = runtimeDrawers;
  const combinedLocalDrawers = drawers
    ? [...localBefore, ...drawers, ...localAfter]
    : applyToolsDrawer(toolsProps, runtimeDrawers);
  const activeDrawer = combinedLocalDrawers?.find(drawer => drawer.id === activeDrawerIdResolved);
  // ensure that id is only defined when the drawer exists
  activeDrawerIdResolved = activeDrawer?.id ?? null;
  const activeGlobalDrawers = runtimeGlobalDrawers.filter(drawer => activeGlobalDrawersIds.includes(drawer.id));

  useDrawerRuntimeOpenClose(
    disableRuntimeDrawers,
    combinedLocalDrawers,
    runtimeGlobalDrawers,
    activeDrawerId,
    onActiveDrawerChange,
    activeGlobalDrawersIds,
    onActiveGlobalDrawersChange
  );

  useDrawerRuntimeResize(disableRuntimeDrawers, onActiveDrawerResize);

  const activeDrawerSize = activeDrawerIdResolved
    ? (drawerSizes[activeDrawerIdResolved] ?? activeDrawer?.defaultSize ?? toolsProps.toolsWidth)
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
    toolsProps?.toolsOpen ? toolsProps.toolsWidth : (activeDrawer?.defaultSize ?? MIN_DRAWER_SIZE),
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
    expandedDrawerId,
    setExpandedDrawerId,
  };
}
