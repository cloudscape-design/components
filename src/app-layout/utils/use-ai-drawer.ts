// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef, useState } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import { fireNonCancelableEvent } from '../../internal/events';
import { awsuiPluginsInternalWidgetized } from '../../internal/plugins/api';
import { DrawersToggledListener } from '../../internal/plugins/controllers/drawers';
import { AppLayoutProps } from '../interfaces';
import { mapRuntimeConfigToDrawer, RuntimeDrawer } from '../runtime-drawer';

export interface OnChangeParams {
  initiatedByUserAction: boolean;
}

const DEFAULT_ON_CHANGE_PARAMS = { initiatedByUserAction: true };

function useRuntimeAiDrawer(
  isEnabled: boolean,
  activeAiDrawerId: string | null,
  onActiveAiDrawerChange: (newDrawerId: string | null, { initiatedByUserAction }: OnChangeParams) => void
) {
  const [aiDrawer, setAiDrawer] = useState<RuntimeDrawer | null>(null);
  const onAiDrawersChangeStable = useStableCallback(onActiveAiDrawerChange);
  const aiDrawerWasOpenRef = useRef(false);
  aiDrawerWasOpenRef.current = aiDrawerWasOpenRef.current || !!activeAiDrawerId;

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const unsubscribe = awsuiPluginsInternalWidgetized!.appLayout!.onAiDrawerRegistered(aiDrawer => {
      if (!aiDrawer) {
        return;
      }
      setAiDrawer(mapRuntimeConfigToDrawer(aiDrawer));
      if (!aiDrawerWasOpenRef.current && aiDrawer?.defaultActive) {
        onAiDrawersChangeStable(aiDrawer.id, { initiatedByUserAction: false });
      }
    });
    return () => {
      unsubscribe();
      setAiDrawer(null);
    };
  }, [isEnabled, onAiDrawersChangeStable]);

  return aiDrawer;
}

function useAiDrawerRuntimeOpenClose(
  isEnabled: boolean,
  aiDrawer: AppLayoutProps.Drawer | null,
  activeAiDrawerId: string | null,
  onActiveAiDrawerChange: (newDrawerId: string | null, { initiatedByUserAction }: OnChangeParams) => void
) {
  const onDrawerOpened: DrawersToggledListener = useStableCallback((drawerId, params = DEFAULT_ON_CHANGE_PARAMS) => {
    if (aiDrawer && aiDrawer?.id === drawerId) {
      onActiveAiDrawerChange(drawerId, params);
    }
  });

  const onDrawerClosed: DrawersToggledListener = useStableCallback((drawerId, params = DEFAULT_ON_CHANGE_PARAMS) => {
    if (aiDrawer && activeAiDrawerId === drawerId) {
      onActiveAiDrawerChange(null, params);
    }
  });

  useEffect(() => {
    if (!isEnabled) {
      return;
    }
    return awsuiPluginsInternalWidgetized!.appLayout!.onAiDrawerOpened(onDrawerOpened);
  }, [isEnabled, onDrawerOpened]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }
    return awsuiPluginsInternalWidgetized!.appLayout!.onAiDrawerClosed(onDrawerClosed);
  }, [isEnabled, onDrawerClosed]);
}

function useAiDrawerRuntimeResize(isEnabled: boolean, onActiveDrawerResize: (size: number) => void) {
  const onRuntimeDrawerResize = useStableCallback((_, size: number) => {
    onActiveDrawerResize(size);
  });

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    return awsuiPluginsInternalWidgetized!.appLayout!.onAiDrawerResize(onRuntimeDrawerResize);
  }, [isEnabled, onRuntimeDrawerResize]);
}

export const MIN_DRAWER_SIZE = 290;

interface UseDrawersProps {
  isEnabled: boolean;
  onAiDrawerFocus: () => void;
  expandedDrawerId: string | null;
  setExpandedDrawerId: (value: string | null) => void;
}

export function useAiDrawer({ isEnabled, onAiDrawerFocus, expandedDrawerId, setExpandedDrawerId }: UseDrawersProps) {
  const [activeAiDrawerId, setActiveAiDrawerId] = useState<string | null>(null);
  const [size, setSize] = useState<number | null>(null);

  function onActiveAiDrawerResize(size: number) {
    setSize(size);
    fireNonCancelableEvent(activeAiDrawer?.onResize, { id: activeAiDrawerId, size });
  }

  function onActiveAiDrawerChange(
    newDrawerId: string | null,
    { initiatedByUserAction }: OnChangeParams = DEFAULT_ON_CHANGE_PARAMS
  ) {
    setActiveAiDrawerId(newDrawerId);

    if (newDrawerId) {
      fireNonCancelableEvent(aiDrawer?.onToggle, { isOpen: true, initiatedByUserAction });
    }

    if (activeAiDrawerId) {
      fireNonCancelableEvent(aiDrawer?.onToggle, { isOpen: false, initiatedByUserAction });

      if (activeAiDrawerId === expandedDrawerId) {
        setExpandedDrawerId?.(null);
      }
    }

    onAiDrawerFocus?.();
  }

  const aiDrawer = useRuntimeAiDrawer(isEnabled, activeAiDrawerId, onActiveAiDrawerChange);
  useAiDrawerRuntimeOpenClose(isEnabled, aiDrawer, activeAiDrawerId, onActiveAiDrawerChange);
  useAiDrawerRuntimeResize(isEnabled, onActiveAiDrawerResize);
  const activeAiDrawer = activeAiDrawerId && activeAiDrawerId === aiDrawer?.id ? aiDrawer : null;
  const activeAiDrawerSize = activeAiDrawerId ? (size ?? activeAiDrawer?.defaultSize ?? MIN_DRAWER_SIZE) : 0;
  const minAiDrawerSize = Math.min(activeAiDrawer?.defaultSize ?? MIN_DRAWER_SIZE, MIN_DRAWER_SIZE);

  return {
    aiDrawer,
    onActiveAiDrawerChange,
    activeAiDrawer,
    activeAiDrawerId,
    activeAiDrawerSize,
    minAiDrawerSize,
    onActiveAiDrawerResize,
  };
}
