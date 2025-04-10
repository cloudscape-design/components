// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';

import { ComponentMetrics, PerformanceMetrics } from '../../analytics';
import { useFunnel } from '../../analytics/hooks/use-funnel';
import { JSONObject } from '../../analytics/interfaces';
import { useDOMAttribute } from '../use-dom-attribute';
import { useEffectOnUpdate } from '../use-effect-on-update';
import { useRandomId } from '../use-unique-id';

/*
If the last user interaction is more than this time ago, it is not considered
to be the cause of the current loading state.
*/
const USER_ACTION_TIME_LIMIT = 1_000;

export interface UseTableInteractionMetricsProps {
  elementRef: React.RefObject<HTMLElement>;
  instanceIdentifier: string | undefined;
  loading: boolean | undefined;
  itemCount: number;
  getComponentIdentifier: () => string | undefined;
  getComponentConfiguration: () => JSONObject;
  interactionMetadata: () => string;
}

export function useTableInteractionMetrics({
  elementRef,
  itemCount,
  instanceIdentifier,
  getComponentIdentifier,
  getComponentConfiguration,
  loading = false,
  interactionMetadata,
}: UseTableInteractionMetricsProps) {
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

    console.log('componentMounted', {
      taskInteractionId,
      componentName: 'table',
      componentConfiguration: metadata.current.getComponentConfiguration(),
    });

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

      if (!isInFunnel) {
        console.log('componentUpdated', {
          taskInteractionId,
          componentName: 'table',
          actionType: capturedUserAction.current ?? '',
          componentConfiguration: metadata.current.getComponentConfiguration(),
        });

        ComponentMetrics.componentUpdated({
          taskInteractionId,
          componentName: 'table',
          actionType: capturedUserAction.current ?? '',
          componentConfiguration: metadata.current.getComponentConfiguration(),
        });
      }
    }
  }, [instanceIdentifier, loading, taskInteractionId, isInFunnel]);

  return {
    tableInteractionAttributes,
    setLastUserAction: (name: string) => void (lastUserAction.current = { name, time: performance.now() }),
  };
}
