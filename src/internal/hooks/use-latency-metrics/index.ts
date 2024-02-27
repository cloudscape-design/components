// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';
import { useIdFallback } from '../use-unique-id';
import { useEffectOnUpdate } from '../use-effect-on-update';
import { isInViewport } from './is-in-viewport';
import { metrics } from '../../analytics/metrics';

/*
If the last user interaction is more than this time ago, it is not considered
to be the cause of the current loading state.
*/
const USER_ACTION_TIME_LIMIT = 1_000;

export interface UseLatencyMetricsProps {
  componentName: string;
  elementRef: React.RefObject<HTMLElement>;
  instanceId: string | undefined;
  loading?: boolean | undefined;
  componentType?: 'spinner' | undefined;
}

export function useLatencyMetrics({
  componentName,
  componentType,
  elementRef,
  instanceId,
  ...props
}: UseLatencyMetricsProps) {
  const lifecycleId = useIdFallback();
  const lastUserAction = useRef<{ name: string; time: number } | undefined>(undefined);
  const capturedUserAction = useRef<string | undefined>(undefined);

  const loading = props.loading || componentType === 'spinner';
  const loadingAtMount = useRef(loading);

  const loadingStartTime = useRef<undefined | number>(undefined);
  if (loading && loadingStartTime.current === undefined) {
    loadingStartTime.current = performance.now();

    if (lastUserAction.current && lastUserAction.current.time > Date.now() - USER_ACTION_TIME_LIMIT) {
      capturedUserAction.current = lastUserAction.current.name;
    } else {
      capturedUserAction.current = undefined;
    }
  }

  useEffect(() => {
    if (!elementRef.current) {
      return;
    }
    const loading = loadingAtMount.current;

    const timestamp = Date.now();

    const cleanup = isInViewport(elementRef.current!, inViewport => {
      emitMetric(
        {
          type: 'mounted',
          lifecycleId,
          componentName,
          inViewport,
          metadata: { instanceId },
          loading,
          loadingDuration: undefined,
          userAction: capturedUserAction.current,
        },
        timestamp
      );
    });

    return () => {
      cleanup();

      if (loadingStartTime.current !== undefined) {
        const loadingDuration = performance.now() - loadingStartTime.current;

        emitMetric(
          {
            type: componentType === 'spinner' ? 'loading-finished' : 'loading-cancelled',
            lifecycleId,
            componentName,
            inViewport: undefined,
            metadata: { instanceId },
            loading,
            loadingDuration,
            userAction: capturedUserAction.current,
          },
          Date.now()
        );
      }
    };
  }, [componentName, componentType, elementRef, instanceId, lifecycleId]);

  useEffectOnUpdate(() => {
    if (componentType === 'spinner') {
      // The spinner component is handled in the other effect above.
      return;
    }
    if (loading) {
      emitMetric(
        {
          type: 'loading-started',
          lifecycleId,
          componentName,
          inViewport: undefined,
          metadata: { instanceId },
          loading,
          loadingDuration: undefined,
          userAction: capturedUserAction.current,
        },
        Date.now()
      );
    } else {
      if (loadingStartTime.current === undefined) {
        return;
      }
      const loadingDuration = performance.now() - loadingStartTime.current;
      loadingStartTime.current = undefined;

      emitMetric(
        {
          type: 'loading-finished',
          lifecycleId,
          componentName,
          inViewport: undefined,
          metadata: { instanceId },
          loading,
          loadingDuration,
          userAction: capturedUserAction.current,
        },
        Date.now()
      );
    }
  }, [componentName, componentType, instanceId, lifecycleId, loading]);

  return {
    setLastUserAction: (name: string) => void (lastUserAction.current = { name, time: Date.now() }),
  };
}

interface EventDetail {
  type: 'mounted' | 'loading-started' | 'loading-finished' | 'loading-cancelled';
  lifecycleId: string;
  componentName: string;
  inViewport: boolean | undefined;
  metadata: { instanceId: string | undefined };
  loading: boolean;
  loadingDuration: number | undefined;
  userAction: string | undefined;
}

function emitMetric(eventDetail: EventDetail, timestamp: number) {
  metrics.sendPanoramaMetric({ eventType: 'awsui-latency', eventDetail: JSON.stringify(eventDetail), timestamp });
}
