// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useRef, useState } from 'react';

import { fireNonCancelableEvent } from '../../../internal/events';
import { metrics } from '../../../internal/metrics';
import { DrawerPayload as RuntimeAiDrawerConfig, WidgetMessage } from '../../../internal/plugins/widget/interfaces';
import { mapRuntimeConfigToAiDrawer } from '../../runtime-drawer';

export interface OnChangeParams {
  initiatedByUserAction: boolean;
}

const DEFAULT_ON_CHANGE_PARAMS = { initiatedByUserAction: true };

const MIN_DRAWER_SIZE = 400;

interface UseDrawersProps {
  onAiDrawerFocus: () => void;
  expandedDrawerId: string | null;
  setExpandedDrawerId: (value: string | null) => void;
}

export function useAiDrawer({ onAiDrawerFocus, expandedDrawerId, setExpandedDrawerId }: UseDrawersProps) {
  const [runtimeDrawer, setRuntimeDrawer] = useState<RuntimeAiDrawerConfig | null>(null);
  const [activeAiDrawerId, setActiveAiDrawerId] = useState<string | null>(null);
  const [size, setSize] = useState<number | null>(null);
  const aiDrawerWasOpenRef = useRef(false);
  aiDrawerWasOpenRef.current = aiDrawerWasOpenRef.current || !!activeAiDrawerId;

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
      fireNonCancelableEvent(runtimeDrawer?.onToggle, { isOpen: true, initiatedByUserAction });
    }

    if (activeAiDrawerId) {
      fireNonCancelableEvent(runtimeDrawer?.onToggle, { isOpen: false, initiatedByUserAction });

      if (activeAiDrawerId === expandedDrawerId) {
        setExpandedDrawerId?.(null);
      }
    }

    onAiDrawerFocus?.();
  }

  function checkId(newId: string) {
    if (runtimeDrawer && runtimeDrawer.id !== newId) {
      metrics.sendOpsMetricObject('awsui-widget-drawer-incorrect-id', { oldId: runtimeDrawer.id, newId });
    }
  }

  function aiDrawerMessageHandler(event: WidgetMessage) {
    if (event.type === 'registerLeftDrawer') {
      setRuntimeDrawer(event.payload);
      if (!aiDrawerWasOpenRef.current && event.payload.defaultActive) {
        onActiveAiDrawerChange(event.payload.id, { initiatedByUserAction: false });
      }
      return;
    }

    switch (event.type) {
      case 'updateDrawerConfig':
        checkId(event.payload.id);
        setRuntimeDrawer(current => (current ? { ...current, ...event.payload } : current));
        break;
      case 'openDrawer':
        checkId(event.payload.id);
        onActiveAiDrawerChange(event.payload.id, { initiatedByUserAction: false });
        break;
      case 'closeDrawer':
        checkId(event.payload.id);
        onActiveAiDrawerChange(null, { initiatedByUserAction: false });
        break;
      case 'resizeDrawer':
        checkId(event.payload.id);
        onActiveAiDrawerResize(event.payload.size);
        break;
      case 'expandDrawer':
        checkId(event.payload.id);
        setExpandedDrawerId(event.payload.id);
        break;
      case 'exitExpandedMode':
        setExpandedDrawerId(null);
        break;
    }
  }

  const aiDrawer = runtimeDrawer && mapRuntimeConfigToAiDrawer(runtimeDrawer);
  const activeAiDrawer = activeAiDrawerId && activeAiDrawerId === aiDrawer?.id ? aiDrawer : null;
  const activeAiDrawerSize = activeAiDrawerId ? (size ?? activeAiDrawer?.defaultSize ?? MIN_DRAWER_SIZE) : 0;
  const minAiDrawerSize = Math.min(activeAiDrawer?.defaultSize ?? MIN_DRAWER_SIZE, MIN_DRAWER_SIZE);

  return {
    aiDrawer,
    aiDrawerMessageHandler,
    onActiveAiDrawerChange,
    activeAiDrawer,
    activeAiDrawerId,
    activeAiDrawerSize,
    minAiDrawerSize,
    onActiveAiDrawerResize,
  };
}
