// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { OpenAnnotation } from './annotation/open-annotation';
import { ClosedAnnotation } from './annotation/closed-annotation';
import { AnnotationContextProps } from './interfaces';
import { HotspotContext, hotspotContext } from './context';
import { fireNonCancelableEvent } from '../internal/events';
import { HotspotProps } from '../hotspot/interfaces';
import { useTelemetry } from '../internal/hooks/use-telemetry';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getStepInfo } from './utils';

export { AnnotationContextProps };

// constant empty array to keep hook dependency stable
const emptyTasks: ReadonlyArray<AnnotationContextProps.Task> = [];

export default function AnnotationContext({
  currentTutorial,
  children,
  onStepChange,
  onFinish: onFinishHandler,
  onStartTutorial,
  onExitTutorial,
  i18nStrings,
}: AnnotationContextProps): JSX.Element {
  useTelemetry('AnnotationContext');

  const [open, setOpen] = useState(true);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  useEffect(() => {
    // When a tutorial is started, we reset the progress to the first step.
    setCurrentStepIndex(0);
    setOpen(true);
  }, [currentTutorial, setOpen]);

  const [availableHotspots, setAvailableHotspots] = useState<Record<string, true | undefined>>({});
  // availableHotspots is mirrored in this ref to prevent endless loops
  // in between registerHotspot and unregisterHotspot callbacks.
  const availableHotspotsRef = useRef<Record<string, true | undefined>>(availableHotspots);

  const annotations = currentTutorial ? currentTutorial.tasks : emptyTasks;
  const { task, step, localIndex, taskIndex } = getStepInfo(annotations, currentStepIndex);
  const currentId = step?.hotspotId;
  const totalStepCount = annotations.map(a => a.steps.length).reduce((a, b) => a + b, 0);

  const id2index = useMemo(() => {
    const mapping: Record<string, number> = {};

    let counter = 0;
    for (const annotation of annotations) {
      for (const step of annotation.steps) {
        if (mapping[step.hotspotId] === undefined) {
          mapping[step.hotspotId] = counter;
        }
        counter++;
      }
    }

    return mapping;
  }, [annotations]);

  const openNextStep = useCallback(() => {
    const newStepIndex = Math.min(currentStepIndex + 1, totalStepCount);
    setCurrentStepIndex(newStepIndex);
    fireNonCancelableEvent(onStepChange, { step: newStepIndex, reason: 'next' });
  }, [currentStepIndex, onStepChange, totalStepCount]);

  const openPreviousStep = useCallback(() => {
    const newStepIndex = Math.max(currentStepIndex - 1, 0);
    setCurrentStepIndex(newStepIndex);
    fireNonCancelableEvent(onStepChange, { step: newStepIndex, reason: 'previous' });
  }, [onStepChange, currentStepIndex]);

  const onFinish = useCallback(() => fireNonCancelableEvent(onFinishHandler), [onFinishHandler]);

  /**
   * If the currently open hotspot disappears from the page (e.g. because of a react-router navigation),
   * this Effect detects the nearest available hotspot and changes to it. This allows us to e.g. automatically
   * advance to the first step on the new page (or the last step on the previous page, in case the user
   * navigates back).
   */
  const isCurrentHotspotAvailable = currentId ? availableHotspots[currentId] : null;
  useEffect(() => {
    if (!currentId || availableHotspotsRef.current[currentId]) {
      return;
    }

    const findNearestHotspot = () => {
      let nearestHotspot: string | undefined = undefined;
      let nearestDistance = Infinity;
      for (const hotspotId of Object.keys(availableHotspotsRef.current)) {
        const distanceFromCurrentHotspot = Math.abs(id2index[hotspotId] - currentStepIndex);
        if (distanceFromCurrentHotspot < nearestDistance) {
          nearestDistance = distanceFromCurrentHotspot;
          nearestHotspot = hotspotId;
        }
      }
      return nearestHotspot;
    };

    const nearestHotspot = findNearestHotspot();
    if (nearestHotspot) {
      const newStepIndex = id2index[nearestHotspot];
      setCurrentStepIndex(newStepIndex);
      setOpen(true);
      fireNonCancelableEvent(onStepChange, { step: newStepIndex, reason: 'auto-fallback' });
    }
  }, [annotations, isCurrentHotspotAvailable, currentId, currentStepIndex, id2index, onStepChange]);

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onOpen = useCallback(
    (stepIndex: number) => {
      setCurrentStepIndex(stepIndex);
      fireNonCancelableEvent(onStepChange, { step: stepIndex, reason: 'open' });
      setOpen(true);
    },
    [onStepChange, setOpen]
  );

  const idOfPreviousHotspot = getStepInfo(annotations, currentStepIndex - 1).step?.hotspotId;
  const idOfNextHotspot = getStepInfo(annotations, currentStepIndex + 1).step?.hotspotId;
  const previousHotspotIsAvailable =
    (idOfPreviousHotspot !== undefined && availableHotspots[idOfPreviousHotspot]) ?? false;
  const nextHotspotIsAvailable = (idOfNextHotspot !== undefined && availableHotspots[idOfNextHotspot]) ?? false;

  const getContentForId = useCallback(
    (id: string, direction: HotspotProps['direction']) => {
      if (currentTutorial?.completed) {
        return null;
      }

      const globalStepIndex = id2index[id];
      if (globalStepIndex === undefined) {
        // This hotspot is not used in the current tutorial.
        return null;
      }

      if (!task || !step || !open || id !== currentId) {
        const { task: currentTask, localIndex: currentStepIndex } = getStepInfo(annotations, globalStepIndex);
        return (
          <ClosedAnnotation
            globalStepIndex={globalStepIndex}
            i18nStrings={i18nStrings}
            onOpen={onOpen}
            focusOnRender={id === currentId}
            totalLocalSteps={currentTask ? currentTask.steps.length : 0}
            taskLocalStepIndex={currentStepIndex}
          />
        );
      }

      return (
        <OpenAnnotation
          i18nStrings={i18nStrings}
          direction={direction}
          title={i18nStrings.taskTitle(taskIndex, task.title)}
          content={step.content}
          alert={step.warningAlert}
          showPreviousButton={currentStepIndex !== 0}
          showFinishButton={currentStepIndex + 1 === totalStepCount}
          taskLocalStepIndex={localIndex}
          totalLocalSteps={task.steps.length}
          nextButtonEnabled={nextHotspotIsAvailable}
          onNextButtonClick={openNextStep}
          onFinish={onFinish}
          previousButtonEnabled={previousHotspotIsAvailable}
          onPreviousButtonClick={openPreviousStep}
          onDismiss={onDismiss}
        />
      );
    },
    [
      id2index,
      currentTutorial,
      task,
      step,
      open,
      currentId,
      currentStepIndex,
      i18nStrings,
      taskIndex,
      localIndex,
      totalStepCount,
      nextHotspotIsAvailable,
      openNextStep,
      onFinish,
      previousHotspotIsAvailable,
      openPreviousStep,
      onDismiss,
      onOpen,
      annotations,
    ]
  );

  const registerHotspot = useCallback(
    (id: string) => {
      if (!id2index || id2index[id] === undefined) {
        // This hotspot is not used in the current tutorial.
        return;
      }

      /*
        To ensure that all hotspots are immediately known to all triggered useEffects, we
        need to update the availableHotspotsRef BEFORE the setAvailableHotspots calls, since
        they will be batched and delayed until after the useEffects are run.
      */
      availableHotspotsRef.current = { ...availableHotspotsRef.current, [id]: true } as const;

      setAvailableHotspots(availableHotspots => {
        if (availableHotspots[id]) {
          return availableHotspots;
        }

        return { ...availableHotspots, [id]: true } as const;
      });
    },
    // We need to react on id2index changes for registering new hotspots when the map changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id2index]
  );

  const unregisterHotspot = useCallback((id: string) => {
    if (!availableHotspotsRef.current[id]) {
      // Prevents unnecessary re-renders.
      return;
    }

    /*
      To ensure that all hotspots are immediately known to all triggered useEffects, we
      need to update the availableHotspotsRef BEFORE the setAvailableHotspots calls, since
      they will be batched and delayed until after the useEffects are run.
    */
    availableHotspotsRef.current = removeKey(id, availableHotspotsRef.current);

    setAvailableHotspots(availableHotspots => {
      if (!availableHotspots[id]) {
        return availableHotspots;
      }

      return removeKey(id, availableHotspots);
    });
  }, []);

  const context: HotspotContext = {
    getContentForId,
    registerHotspot,
    unregisterHotspot,
    onStartTutorial,
    onExitTutorial,
    currentStepIndex,
    currentTutorial,
  };

  return <hotspotContext.Provider value={context}>{children}</hotspotContext.Provider>;
}

applyDisplayName(AnnotationContext, 'AnnotationContext');

function removeKey<T extends Record<string, unknown>>(key: keyof T, object: T) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: _, ...remainingObject } = object;
  return remainingObject;
}
