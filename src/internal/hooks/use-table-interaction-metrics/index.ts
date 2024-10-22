// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';

import { PerformanceMetrics } from '../../analytics';
import { useEffectOnUpdate } from '../use-effect-on-update';

/*
If the last user interaction is more than this time ago, it is not considered
to be the cause of the current loading state.
*/
const USER_ACTION_TIME_LIMIT = 1_000;

export interface UseTableInteractionMetricsProps {
  instanceIdentifier: string | undefined;
  loading: boolean | undefined;
  itemCount: number;
  getComponentIdentifier: () => string | undefined;
  interactionMetadata: () => string;
}

export function useTableInteractionMetrics({
  itemCount,
  instanceIdentifier,
  getComponentIdentifier,
  loading = false,
  interactionMetadata,
}: UseTableInteractionMetricsProps) {
  const lastUserAction = useRef<{ name: string; time: number } | null>(null);
  const capturedUserAction = useRef<string | null>(null);
  const loadingStartTime = useRef<number | null>(null);

  const metadata = useRef({ itemCount, getComponentIdentifier, interactionMetadata });
  metadata.current = { itemCount, getComponentIdentifier, interactionMetadata };
  useEffect(() => {
    if (loading) {
      loadingStartTime.current = performance.now();

      if (lastUserAction.current && lastUserAction.current.time > performance.now() - USER_ACTION_TIME_LIMIT) {
        capturedUserAction.current = lastUserAction.current.name;
      } else {
        capturedUserAction.current = null;
      }
    }
  }, [loading]);

  useEffectOnUpdate(() => {
    if (!loading && loadingStartTime.current !== null) {
      const loadingDuration = performance.now() - loadingStartTime.current;
      loadingStartTime.current = null;

      PerformanceMetrics.tableInteraction({
        userAction: capturedUserAction.current ?? '',
        interactionTime: Math.round(loadingDuration),
        interactionMetadata: metadata.current.interactionMetadata(),
        componentIdentifier: metadata.current.getComponentIdentifier(),
        instanceIdentifier,
        noOfResourcesInTable: metadata.current.itemCount,
      });
    }
  }, [instanceIdentifier, loading]);

  return {
    setLastUserAction: (name: string) => void (lastUserAction.current = { name, time: performance.now() }),
  };
}
