// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef, useState } from 'react';

import { fireNonCancelableEvent } from '../../../internal/events';
import { usePrevious } from '../../../internal/hooks/use-previous';
import { DrawerPayload as RuntimeAiDrawerConfig, WidgetMessage } from '../../../internal/plugins/widget/interfaces';
import { getLimitedValue } from '../../../split-panel/utils/size-utils';
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
  getMaxAiDrawerSize: () => number;
}

export function useAiDrawer({
  onAiDrawerFocus,
  expandedDrawerId,
  setExpandedDrawerId,
  getMaxAiDrawerSize,
}: UseDrawersProps) {
  const [runtimeDrawer, setRuntimeDrawer] = useState<RuntimeAiDrawerConfig | null>(null);
  const [activeAiDrawerId, setActiveAiDrawerId] = useState<string | null>(null);
  const [size, setSize] = useState<number | null>(null);
  const aiDrawerWasOpenRef = useRef(false);
  aiDrawerWasOpenRef.current = aiDrawerWasOpenRef.current || !!activeAiDrawerId;
  const prevExpandedDrawerId = usePrevious(expandedDrawerId);

  const aiDrawer = runtimeDrawer && mapRuntimeConfigToAiDrawer(runtimeDrawer);

  useEffect(() => {
    if (prevExpandedDrawerId !== expandedDrawerId && (expandedDrawerId === aiDrawer?.id || expandedDrawerId === null)) {
      fireNonCancelableEvent(runtimeDrawer?.onToggleFocusMode, {
        isExpanded: !!expandedDrawerId,
      });
    }
  }, [runtimeDrawer?.onToggleFocusMode, expandedDrawerId, prevExpandedDrawerId, aiDrawer]);

  function onActiveAiDrawerResize(size: number) {
    const limitedSize = getLimitedValue(minAiDrawerSize, size, getMaxAiDrawerSize());
    setSize(limitedSize);
    fireNonCancelableEvent(activeAiDrawer?.onResize, { id: activeAiDrawerId, size: limitedSize });
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
        setRuntimeDrawer(current => (current ? { ...current, ...event.payload } : current));
        break;
      case 'openDrawer':
        onActiveAiDrawerChange(event.payload.id, { initiatedByUserAction: false });
        break;
      case 'closeDrawer':
        onActiveAiDrawerChange(null, { initiatedByUserAction: false });
        break;
      case 'resizeDrawer':
        onActiveAiDrawerResize(event.payload.size);
        break;
    }
  }

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
