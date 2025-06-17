// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';

import { useRandomId } from '@cloudscape-design/component-toolkit/internal';

import { ComponentMetrics, PerformanceMetrics } from '../../analytics';
import { useFunnel } from '../../analytics/hooks/use-funnel';
import { JSONObject } from '../../analytics/interfaces';
import { useDebounceCallback } from '../use-debounce-callback';
import { useDOMAttribute } from '../use-dom-attribute';
import { useEffectOnUpdate } from '../use-effect-on-update';

/*
If the last user interaction is more than this time ago, it is not considered
to be the cause of the current loading state.
*/
const USER_ACTION_TIME_LIMIT = 1_000;

export interface UseTableInteractionMetricsProps<T> {
  elementRef: React.RefObject<HTMLElement>;
  instanceIdentifier: string | undefined;
  loading: boolean | undefined;
  items: readonly T[];
  itemCount: number;
  getComponentIdentifier: () => string | undefined;
  getComponentConfiguration: () => JSONObject;
  interactionMetadata: () => string;
}

export function useTableInteractionMetrics<T>({
  elementRef,
  items,
  itemCount,
  instanceIdentifier,
  getComponentIdentifier,
  getComponentConfiguration,
  loading = false,
  interactionMetadata,
}: UseTableInteractionMetricsProps<T>) {
  const taskInteractionId = useRandomId();
  const tableInteractionAttributes = useDOMAttribute(
    elementRef,
    'data-analytics-task-interaction-id',
    taskInteractionId
  );
  const { isInFunnel } = useFunnel();
  const lastUserAction = useRef<{ name: string; time: number } | null>(null);
  const capturedUserAction = useRef<string | null>(null);
  const loadingStartTime = useRef<number | null>(null);

  const metadata = useRef({ itemCount, getComponentIdentifier, getComponentConfiguration, interactionMetadata });
  metadata.current = { itemCount, getComponentIdentifier, getComponentConfiguration, interactionMetadata };

  useEffect(() => {
    if (isInFunnel) {
      return;
    }

    ComponentMetrics.componentMounted({
      taskInteractionId,
      componentName: 'table',
      componentConfiguration: metadata.current.getComponentConfiguration(),
    });
  }, [taskInteractionId, isInFunnel]);

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
  }, [instanceIdentifier, loading, taskInteractionId, isInFunnel]);

  const debouncedUpdated = useDebounceCallback(() => {
    ComponentMetrics.componentUpdated({
      taskInteractionId,
      componentName: 'table',
      actionType: lastUserAction.current?.name ?? '',
      componentConfiguration: metadata.current.getComponentConfiguration(),
    });
  });

  useEffectOnUpdate(() => {
    if (isInFunnel || loading) {
      return;
    }

    debouncedUpdated();
    // Note: items used as a dependency here to trigger updates as a side effect
  }, [taskInteractionId, isInFunnel, loading, items, debouncedUpdated]);

  return {
    tableInteractionAttributes,
    setLastUserAction: (name: string) => void (lastUserAction.current = { name, time: performance.now() }),
  };
}
