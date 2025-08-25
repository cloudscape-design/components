// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef, useState } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import { fireNonCancelableEvent } from '../../internal/events';
import { metrics } from '../../internal/metrics';
import { AppLayoutMessage, DrawerPayload as RuntimeAiDrawerConfig } from '../../internal/plugins/widget/interfaces';
import { getAppLayoutInitialState, registerAppLayoutHandler } from '../../internal/plugins/widget/internal';
import { assertNever } from '../../internal/types';
import { mapRuntimeConfigToAiDrawer } from '../runtime-drawer';

export interface OnChangeParams {
  initiatedByUserAction: boolean;
}

const DEFAULT_ON_CHANGE_PARAMS = { initiatedByUserAction: true };

function useRuntimeAiDrawer(
  isEnabled: boolean,
  activeAiDrawerId: string | null,
  onActiveAiDrawerChange: (newDrawerId: string | null, { initiatedByUserAction }: OnChangeParams) => void,
  onActiveAiDrawerResize: (size: number) => void
) {
  const [aiDrawer, setAiDrawer] = useState<RuntimeAiDrawerConfig | null>(null);
  const appLayoutMessageHandler = useStableCallback((event: AppLayoutMessage) => {
    if (event.type === 'registerDrawer') {
      setAiDrawer(event.payload);
      if (!aiDrawerWasOpenRef.current && event.payload.defaultActive) {
        onAiDrawersChangeStable(event.payload.id, { initiatedByUserAction: false });
      }
      return;
    }
    if (aiDrawer && aiDrawer.id !== event.payload.id) {
      metrics.sendOpsMetricObject('awsui-widget-drawer-incorrect-id', { oldId: aiDrawer?.id, newId: event.payload.id });
      return;
    }
    switch (event.type) {
      case 'updateDrawerConfig':
        setAiDrawer(current => (current ? { ...current, ...event.payload } : current));
        break;
      case 'openDrawer':
        onActiveAiDrawerChangeStable(event.payload.id, { initiatedByUserAction: false });
        break;
      case 'closeDrawer':
        onActiveAiDrawerChangeStable(null, { initiatedByUserAction: false });
        break;
      case 'resizeDrawer':
        onActiveAiDrawerResizeStable(event.payload.size);
        break;
      default:
        /* istanbul ignore next: this code is not intended to be visited */
        assertNever(event);
    }
  });
  const onAiDrawersChangeStable = useStableCallback(onActiveAiDrawerChange);
  const onActiveAiDrawerResizeStable = useStableCallback(onActiveAiDrawerResize);
  const onActiveAiDrawerChangeStable = useStableCallback(onActiveAiDrawerChange);
  const aiDrawerWasOpenRef = useRef(false);
  aiDrawerWasOpenRef.current = aiDrawerWasOpenRef.current || !!activeAiDrawerId;

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const initialDrawerMessage = getAppLayoutInitialState()?.find(message => message.type === 'registerDrawer');
    if (initialDrawerMessage && initialDrawerMessage.type === 'registerDrawer') {
      setAiDrawer(initialDrawerMessage.payload);
      if (!aiDrawerWasOpenRef.current && initialDrawerMessage.payload.defaultActive) {
        onAiDrawersChangeStable(initialDrawerMessage.payload.id, { initiatedByUserAction: false });
      }
    }

    const unsubscribe = registerAppLayoutHandler(appLayoutMessageHandler);
    return () => {
      unsubscribe();
      setAiDrawer(null);
    };
  }, [isEnabled, appLayoutMessageHandler, onAiDrawersChangeStable, onActiveAiDrawerResizeStable]);

  return aiDrawer && mapRuntimeConfigToAiDrawer(aiDrawer);
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

  const aiDrawer = useRuntimeAiDrawer(isEnabled, activeAiDrawerId, onActiveAiDrawerChange, onActiveAiDrawerResize);
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
