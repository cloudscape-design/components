// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef, useState } from 'react';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { PACKAGE_VERSION, THEME } from '../../environment';
import { useDebounceCallback } from '../../hooks/use-debounce-callback';
import { useVisualRefresh } from '../../hooks/use-visual-mode';
import { nodeBelongs } from '../../utils/node-belongs';
import {
  FunnelContext,
  FunnelContextValue,
  FunnelState,
  FunnelStepContext,
  FunnelStepContextValue,
  FunnelSubStepContext,
  FunnelSubStepContextValue,
} from '../context/analytics-context';
import { useFunnel, useFunnelStep } from '../hooks/use-funnel';
import { FunnelMetrics, PerformanceMetrics } from '../index';
import {
  AnalyticsMetadata,
  FunnelStartProps,
  FunnelStepProps,
  StepConfiguration,
  SubStepConfiguration,
  TaskCompletionDataProps,
} from '../interfaces';
import {
  DATA_ATTR_FUNNEL_STEP,
  DATA_ATTR_RESOURCE_TYPE,
  getFunnelNameSelector,
  getSubStepAllSelector,
  getSubStepNameSelector,
  getSubStepSelector,
  getTextFromSelector,
} from '../selectors';

const FUNNEL_VERSION = '1.4';

interface AnalyticsFunnelProps {
  mounted?: boolean;
  children?: React.ReactNode;
  stepConfiguration?: StepConfiguration[];
  funnelNameSelectors?: () => string[];
  funnelType: FunnelStartProps['funnelType'];
  optionalStepNumbers: FunnelStartProps['optionalStepNumbers'];
  totalFunnelSteps: FunnelStartProps['totalFunnelSteps'];
  funnelIdentifier?: AnalyticsMetadata['instanceIdentifier'];
  funnelFlowType?: AnalyticsMetadata['flowType'];
  funnelErrorContext?: AnalyticsMetadata['errorContext'];
  funnelResourceType?: AnalyticsMetadata['resourceType'];
}

export const AnalyticsFunnel = (props: AnalyticsFunnelProps) => {
  const { isInFunnel } = useFunnel();
  /*
   If the current funnel component is a Form (i.e. single-page funnel), it should
   defer its funnel-handling to a parent Form element, if present.
   Wizards (i.e. multi-page funnels) always take highest precedence for handling funnels,
   and do not defer to any other element.
  */
  if (isInFunnel && props.funnelType === 'single-page') {
    return <>{props.children}</>;
  }

  return <InnerAnalyticsFunnel {...props} />;
};

export const CREATION_EDIT_FLOW_DONE_EVENT_NAME = 'awsui-creation-edit-flow-done';
const dispatchCreateEditFlowDoneEvent = () => {
  try {
    window.top?.document.dispatchEvent(new Event(CREATION_EDIT_FLOW_DONE_EVENT_NAME));
  } catch {
    // probably because of cross-origin error, then do not dispatch the event
  }
};

const onFunnelCancelled = ({
  funnelInteractionId,
  funnelIdentifier,
}: {
  funnelInteractionId: string;
  funnelIdentifier?: string;
}) => {
  FunnelMetrics.funnelCancelled({ funnelInteractionId, funnelIdentifier });
};

const onFunnelComplete = (taskCompletionDataProps: TaskCompletionDataProps) => {
  FunnelMetrics.funnelComplete({
    funnelInteractionId: taskCompletionDataProps.taskInteractionId,
    funnelIdentifier: taskCompletionDataProps.taskIdentifier,
  });
  PerformanceMetrics.taskCompletionData(taskCompletionDataProps);
  dispatchCreateEditFlowDoneEvent();
};

function evaluateSelectors(selectors: string[], defaultSelector: string) {
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      return selector;
    }
  }

  return defaultSelector;
}

const InnerAnalyticsFunnel = ({ mounted = true, children, stepConfiguration, ...props }: AnalyticsFunnelProps) => {
  const [funnelInteractionId, setFunnelInteractionId] = useState<string>('');
  const [submissionAttempt, setSubmissionAttempt] = useState(0);
  const isVisualRefresh = useVisualRefresh();
  const funnelState = useRef<FunnelState>('default');
  const funnelNameSelector = useRef<string>(getFunnelNameSelector());
  const errorCount = useRef<number>(0);
  const loadingButtonCount = useRef<number>(0);
  const wizardCount = useRef<number>(0);
  const latestFocusCleanupFunction = useRef<undefined | (() => void)>(undefined);
  const formSubmitStartTime = useRef<number>(0);
  // This useEffect hook is run once on component mount to initiate the funnel analytics.
  // It first calls the 'funnelStart' method from FunnelMetrics, providing all necessary details
  // about the funnel, and receives a unique interaction id.
  // This unique interaction id is then stored in the state for further use.
  //
  // On component unmount, it checks whether the funnel was successfully completed.
  // Based on this, it either calls 'funnelComplete' or 'funnelCancelled' method from FunnelMetrics.
  //
  // The eslint-disable is required as we deliberately want this effect to run only once on mount and unmount,
  // hence we do not provide any dependencies.
  useEffect(() => {
    if (!mounted) {
      return;
    }

    /*
      We run this effect with a delay, in order to detect whether this funnel contains a Wizard.
      If it does contain a Wizard, that Wizard should take precedence for handling the funnel, and
      this current funnel component should do nothing.
    */
    let funnelInteractionId: string;
    const handle = setTimeout(() => {
      funnelNameSelector.current = evaluateSelectors(props.funnelNameSelectors?.() || [], getFunnelNameSelector());
      if (props.funnelType === 'single-page' && wizardCount.current > 0) {
        return;
      }

      // Reset the state, in case the component was re-mounted.
      funnelState.current = 'default';
      const funnelName = getTextFromSelector(funnelNameSelector.current) ?? '';

      const singleStepFlowStepConfiguration = [
        {
          number: 1,
          isOptional: false,
          name: funnelName,
          stepIdentifier: props.funnelIdentifier,
        },
      ];

      let componentTheme = THEME;
      if (THEME === 'polaris') {
        // This is the only place we specify the theme as classic so we cannot reuse the getVisualTheme function :(
        componentTheme = isVisualRefresh ? 'vr' : 'classic';
      }

      funnelInteractionId = FunnelMetrics.funnelStart({
        funnelName,
        funnelIdentifier: props.funnelIdentifier,
        flowType: props.funnelFlowType,
        funnelNameSelector: funnelNameSelector.current,
        optionalStepNumbers: props.optionalStepNumbers,
        funnelType: props.funnelType,
        totalFunnelSteps: props.totalFunnelSteps,
        componentVersion: PACKAGE_VERSION,
        componentTheme: componentTheme,
        funnelVersion: FUNNEL_VERSION,
        stepConfiguration: stepConfiguration ?? singleStepFlowStepConfiguration,
        resourceType: props.funnelResourceType || getTextFromSelector(`[${DATA_ATTR_RESOURCE_TYPE}]`),
      });

      setFunnelInteractionId(funnelInteractionId);
    }, 1);

    /*
      A funnel counts as "successful" if it is unmounted after being "complete".
    */
    /* eslint-disable react-hooks/exhaustive-deps */
    return () => {
      clearTimeout(handle);
      if (props.funnelType === 'single-page' && wizardCount.current > 0) {
        return;
      }

      if (funnelState.current === 'validating') {
        // Finish the validation phase early.
        const taskCompletionDataProps: TaskCompletionDataProps = {
          taskIdentifier: props.funnelIdentifier,
          taskType: props.funnelType,
          timeToRespondAfterFormSubmit: performance.now() - formSubmitStartTime.current,
          taskInteractionId: funnelInteractionId,
          taskFlowType: props.funnelFlowType,
        };
        onFunnelComplete(taskCompletionDataProps);
        funnelState.current = 'complete';
      }

      if (funnelState.current === 'complete') {
        FunnelMetrics.funnelSuccessful({ funnelInteractionId, funnelIdentifier: props.funnelIdentifier });
      } else {
        funnelState.current = 'cancelled';
        onFunnelCancelled({ funnelInteractionId, funnelIdentifier: props.funnelIdentifier });
      }
    };
  }, [mounted]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const funnelSubmit = () => {
    funnelState.current = 'validating';
    formSubmitStartTime.current = performance.now();
    /*
      When the user attempts to submit the form, we wait for 50 milliseconds before checking
      if any form validation errors are present. This value was chosen to give enough time
      for validation and rerendering to occur, but be low enough that the user will not
      be able to take further action in the meantime.
    */
    const VALIDATION_WAIT_DELAY = 50;
    /*
     Loading is expected to take longer than validation, so we can keep the pressure on the CPU low.
     */
    const LOADING_WAIT_DELAY = 100;

    const checkForCompleteness = () => {
      if (funnelState.current === 'complete') {
        return;
      }

      if (loadingButtonCount.current > 0) {
        setTimeout(checkForCompleteness, LOADING_WAIT_DELAY);
        return;
      }

      if (errorCount.current === 0) {
        /*
          If no validation errors are rendered, we treat the funnel as complete.
        */
        const taskCompletionDataProps: TaskCompletionDataProps = {
          taskIdentifier: props.funnelIdentifier,
          taskType: props.funnelType,
          timeToRespondAfterFormSubmit: performance.now() - formSubmitStartTime.current,
          taskInteractionId: funnelInteractionId,
          taskFlowType: props.funnelFlowType,
        };
        onFunnelComplete(taskCompletionDataProps);
        funnelState.current = 'complete';
      } else {
        funnelState.current = 'default';
      }
    };
    setTimeout(checkForCompleteness, VALIDATION_WAIT_DELAY);
  };

  const funnelNextOrSubmitAttempt = () => setSubmissionAttempt(i => i + 1);

  const funnelCancel = () => {};

  const funnelContextValue: FunnelContextValue = {
    funnelInteractionId,
    funnelIdentifier: props.funnelIdentifier,
    funnelFlowType: props.funnelFlowType,
    funnelErrorContext: props.funnelErrorContext,
    setFunnelInteractionId,
    funnelType: props.funnelType,
    optionalStepNumbers: props.optionalStepNumbers,
    totalFunnelSteps: props.totalFunnelSteps,
    funnelNameSelector: funnelNameSelector.current,
    funnelSubmit,
    funnelCancel,
    submissionAttempt,
    funnelNextOrSubmitAttempt,
    funnelState,
    errorCount,
    loadingButtonCount,
    latestFocusCleanupFunction,
    isInFunnel: true,
    wizardCount,
  };

  return <FunnelContext.Provider value={funnelContextValue}>{children}</FunnelContext.Provider>;
};

interface AnalyticsFunnelStepProps {
  mounted?: boolean;
  stepIdentifier?: AnalyticsMetadata['instanceIdentifier'];
  stepErrorContext?: AnalyticsMetadata['errorContext'];
  children?: React.ReactNode | ((props: FunnelStepContextValue) => React.ReactNode);
  stepNameSelector?: FunnelStepProps['stepNameSelector'];
  stepNumber: FunnelStepProps['stepNumber'];
}

export const AnalyticsFunnelStep = (props: AnalyticsFunnelStepProps) => {
  /*
   This wrapper is used to apply a `key` property to the actual (inner) AnalyticsFunnelStep
   element. This allows us to keep the state and effects separate per step.
   */
  return <InnerAnalyticsFunnelStep {...props} key={props.stepNumber} />;
};

function getSubStepConfiguration(): SubStepConfiguration[] {
  const subSteps = Array.from(document.querySelectorAll<HTMLElement>(getSubStepAllSelector()));

  const subStepConfiguration = subSteps.map((substep, index) => {
    const subStepIdentifier = (substep as any)?.__awsuiMetadata__?.analytics?.instanceIdentifier;
    const name = substep.querySelector<HTMLElement>(getSubStepNameSelector())?.innerText?.trim() ?? '';

    return {
      name,
      number: index + 1,
      subStepIdentifier,
    };
  });
  return subStepConfiguration;
}

function useStepChangeListener(stepNumber: number, handler: (stepConfiguration: SubStepConfiguration[]) => void) {
  const subStepConfiguration = useRef(new Map<number, SubStepConfiguration[] | undefined>());
  /*
   Chosen so that it's hopefully shorter than a user interaction, but gives enough time for the
   amount of containers to stabilise.
  */
  const SUBSTEP_CHANGE_DEBOUNCE = 50;

  const listenForSubStepChanges = useRef(false);
  useEffect(() => {
    // We prevent emitting the event on the first render.
    const handle = setTimeout(() => (listenForSubStepChanges.current = true), SUBSTEP_CHANGE_DEBOUNCE);

    return () => {
      clearTimeout(handle);
      listenForSubStepChanges.current = false;
    };
  }, []);

  useEffect(() => {
    const handle = setTimeout(
      () => subStepConfiguration.current.set(stepNumber, getSubStepConfiguration()),
      SUBSTEP_CHANGE_DEBOUNCE
    );
    return () => {
      clearTimeout(handle);
    };
  }, [stepNumber]);

  /* We debounce this handler, so that multiple containers can change at once without causing
  too many events. */
  const stepChangeCallback = useDebounceCallback(() => {
    // We don't want to emit the event after the component has been unmounted.
    if (!listenForSubStepChanges.current) {
      return;
    }

    subStepConfiguration.current.set(stepNumber, getSubStepConfiguration());
    handler(subStepConfiguration.current.get(stepNumber)!);
  }, SUBSTEP_CHANGE_DEBOUNCE);

  return { onStepChange: stepChangeCallback, subStepConfiguration };
}

const InnerAnalyticsFunnelStep = ({
  mounted = true,
  children,
  stepNumber,
  stepIdentifier,
  stepErrorContext,
  ...rest
}: AnalyticsFunnelStepProps) => {
  const { funnelInteractionId, funnelIdentifier, funnelNameSelector, funnelState, funnelType } = useFunnel();
  const parentStep = useFunnelStep();
  const parentStepExists = parentStep.isInStep;
  const parentStepFunnelInteractionId = parentStep.funnelInteractionId;

  const funnelStepProps = { [DATA_ATTR_FUNNEL_STEP]: stepNumber };

  const subStepCount = useRef<number>(0);

  const stepNameSelector = rest.stepNameSelector || funnelNameSelector;
  const { onStepChange, subStepConfiguration } = useStepChangeListener(stepNumber, subStepConfiguration => {
    if (!funnelInteractionId) {
      return;
    }

    FunnelMetrics.funnelStepChange({
      stepIdentifier,
      funnelIdentifier,
      funnelInteractionId,
      stepNumber,
      stepNameSelector,
      subStepAllSelector: getSubStepAllSelector(),
      totalSubSteps: subStepCount.current,
      subStepConfiguration,
    });
  });

  useEffect(() => {
    if (!funnelInteractionId) {
      // This step is not inside an active funnel.
      return;
    }

    if (mounted) {
      return;
    }

    const stepName = getTextFromSelector(stepNameSelector);
    const handler = setTimeout(() => {
      if (funnelState.current !== 'cancelled') {
        FunnelMetrics.funnelStepComplete({
          funnelIdentifier,
          funnelInteractionId,
          stepIdentifier,
          stepNumber,
          stepName,
          stepNameSelector,
          subStepAllSelector: getSubStepAllSelector(),
          totalSubSteps: subStepCount.current,
        });
      }
    }, 0);

    return () => {
      clearTimeout(handler);
    };
  }, [
    stepIdentifier,
    funnelIdentifier,
    funnelInteractionId,
    stepNumber,
    stepNameSelector,
    funnelState,
    parentStepExists,
    funnelType,
    parentStepFunnelInteractionId,
    mounted,
  ]);

  // This useEffect hook is used to track the start and completion of interaction with the step.
  // On mount, if there is a valid funnel interaction id, it calls the 'funnelStepStart' method from FunnelMetrics
  // to record the beginning of the interaction with the current step.
  // On unmount, it does a similar thing but this time calling 'funnelStepComplete' to record the completion of the interaction.
  useEffect(() => {
    if (!funnelInteractionId) {
      // This step is not inside an active funnel.
      return;
    }

    if (parentStepExists && parentStepFunnelInteractionId) {
      /*
       This step is inside another step, which already reports events as
       part of an active funnel (i.e. that step is not a parent of a Wizard).
       Thus, this current step does not need to report any events.
       */
      return;
    }

    const stepName = getTextFromSelector(stepNameSelector);

    if (funnelState.current === 'default') {
      FunnelMetrics.funnelStepStart({
        stepIdentifier,
        funnelIdentifier,
        funnelInteractionId,
        stepNumber,
        stepName,
        stepNameSelector,
        subStepAllSelector: getSubStepAllSelector(),
        totalSubSteps: subStepCount.current,
        subStepConfiguration: getSubStepConfiguration(),
      });
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (funnelState.current !== 'cancelled') {
        FunnelMetrics.funnelStepComplete({
          funnelIdentifier,
          funnelInteractionId,
          stepIdentifier,
          stepNumber,
          stepName,
          stepNameSelector,
          subStepAllSelector: getSubStepAllSelector(),
          // eslint-disable-next-line react-hooks/exhaustive-deps
          totalSubSteps: subStepCount.current,
        });
      }
    };
  }, [
    stepIdentifier,
    funnelIdentifier,
    funnelInteractionId,
    stepNumber,
    stepNameSelector,
    funnelState,
    parentStepExists,
    funnelType,
    parentStepFunnelInteractionId,
  ]);

  const contextValue: FunnelStepContextValue = {
    stepIdentifier,
    stepNumber,
    stepNameSelector,
    funnelStepProps,
    subStepCount,
    isInStep: true,
    funnelInteractionId,
    onStepChange,
    subStepConfiguration,
    stepErrorContext,
  };

  /*
    If this step is inside another step which already reports events as part of an active
    funnel (i.e. that step is not a parent of a Wizard), the current step becomes invisible
    in the hierarchy by passing the context of its parent through.
  */
  const effectiveContextValue = parentStepExists && parentStepFunnelInteractionId ? parentStep : contextValue;

  return (
    <FunnelStepContext.Provider value={effectiveContextValue}>
      {typeof children === 'function' ? children(effectiveContextValue) : children}
    </FunnelStepContext.Provider>
  );
};
interface AnalyticsFunnelSubStepProps {
  subStepIdentifier?: AnalyticsMetadata['instanceIdentifier'];
  subStepErrorContext?: AnalyticsMetadata['errorContext'];
  children?: React.ReactNode | ((props: FunnelSubStepContextValue) => React.ReactNode);
}

export const AnalyticsFunnelSubStep = ({
  children,
  subStepIdentifier,
  subStepErrorContext,
}: AnalyticsFunnelSubStepProps) => {
  const subStepId = useUniqueId('substep');
  const subStepSelector = getSubStepSelector(subStepId);
  const subStepNameSelector = getSubStepNameSelector(subStepId);
  const subStepRef = useRef<HTMLDivElement | null>(null);
  const { subStepCount, onStepChange } = useFunnelStep();
  const mousePressed = useRef<boolean>(false);
  const isFocusedSubStep = useRef<boolean>(false);
  const focusCleanupFunction = useRef<undefined | (() => void)>(undefined);
  const { funnelState, funnelInteractionId } = useFunnel();
  const { stepNumber, stepNameSelector } = useFunnelStep();

  const newContext: FunnelSubStepContextValue = {
    subStepIdentifier,
    subStepErrorContext,
    subStepSelector,
    subStepNameSelector,
    subStepId,
    subStepRef,
    mousePressed,
    isFocusedSubStep,
    focusCleanupFunction,
    isNestedSubStep: false,
  };

  const inheritedContext = { ...useContext(FunnelSubStepContext), isNestedSubStep: true };

  const isNested = Boolean(inheritedContext.subStepId);

  useEffect(() => {
    if (!isNested) {
      subStepCount.current++;
      onStepChange();

      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        subStepCount.current--;
        onStepChange();
      };
    }
  }, [isNested, subStepCount, onStepChange]);

  const context = isNested ? inheritedContext : newContext;

  useEffect(() => {
    if (isNested || !subStepRef.current) {
      return;
    }

    const onMouseDown = () => (mousePressed.current = true);

    const onMouseUp = async () => {
      mousePressed.current = false;

      if (!isFocusedSubStep.current) {
        return;
      }

      /*
        Some mouse events result in an element being focused. However,
        this happens only _after_ the onMouseUp event. We yield the
        event loop here, so that `document.activeElement` has the
        correct new value.
      */
      await new Promise(r => setTimeout(r, 1));

      if (!subStepRef.current || !document.activeElement || !nodeBelongs(subStepRef.current, document.activeElement)) {
        isFocusedSubStep.current = false;

        /*
         Run this substep's own focus cleanup function if another substep
         hasn't already done it for us.
         */
        focusCleanupFunction.current?.();
      }
    };
    const controller = new AbortController();
    window.addEventListener('mousedown', onMouseDown, { signal: controller.signal });
    window.addEventListener('mouseup', onMouseUp, { signal: controller.signal });
    return () => {
      controller.abort();
    };
  }, [
    funnelInteractionId,
    funnelState,
    stepNameSelector,
    stepNumber,
    subStepNameSelector,
    subStepSelector,
    focusCleanupFunction,
    isNested,
    subStepRef,
  ]);

  return (
    <FunnelSubStepContext.Provider value={context}>
      {typeof children === 'function' ? children(context) : children}
    </FunnelSubStepContext.Provider>
  );
};
