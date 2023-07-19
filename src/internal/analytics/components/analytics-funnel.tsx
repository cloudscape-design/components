// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  FunnelStepContext,
  FunnelSubStepContext,
  FunnelContext,
  FunnelContextValue,
  FunnelStepContextValue,
  FunnelState,
  FunnelSubStepContextValue,
} from '../context/analytics-context';
import { useFunnel } from '../hooks/use-funnel';
import { useUniqueId } from '../../hooks/use-unique-id';
import { useVisualRefresh } from '../../hooks/use-visual-mode';

import { PACKAGE_VERSION } from '../../environment';

import { FunnelMetrics } from '../';
import { FunnelProps, FunnelStepProps } from '../interfaces';

import {
  DATA_ATTR_FUNNEL_STEP,
  getFunnelNameSelector,
  getNameFromSelector,
  getSubStepAllSelector,
  getSubStepNameSelector,
  getSubStepSelector,
} from '../selectors';

export const FUNNEL_VERSION = '1.0';

type AnalyticsFunnelProps = { children?: React.ReactNode } & Pick<
  FunnelProps,
  'funnelType' | 'optionalStepNumbers' | 'totalFunnelSteps'
>;

export const AnalyticsFunnel = ({ children, ...props }: AnalyticsFunnelProps) => {
  const [funnelInteractionId, setFunnelInteractionId] = useState<string>('');
  const [submissionAttempt, setSubmissionAttempt] = useState(0);
  const isVisualRefresh = useVisualRefresh();
  const funnelState = useRef<FunnelState>('default');
  const errorCount = useRef<number>(0);
  const loadingButtonCount = useRef<number>(0);

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
    // Reset the state, in case the component was re-mounted.
    funnelState.current = 'default';

    const funnelInteractionId = FunnelMetrics.funnelStart({
      funnelNameSelector: getFunnelNameSelector(),
      optionalStepNumbers: props.optionalStepNumbers,
      funnelType: props.funnelType,
      totalFunnelSteps: props.totalFunnelSteps,
      componentVersion: PACKAGE_VERSION,
      theme: isVisualRefresh ? 'vr' : 'classic',
      funnelVersion: FUNNEL_VERSION,
    });

    setFunnelInteractionId(funnelInteractionId);

    /*
      A funnel counts as "successful" if it is unmounted after being "complete".
    */
    /* eslint-disable react-hooks/exhaustive-deps */
    return () => {
      if (funnelState.current === 'validating') {
        // Finish the validation phase early.
        FunnelMetrics.funnelComplete({ funnelInteractionId });
        funnelState.current = 'complete';
      }

      if (funnelState.current === 'complete') {
        FunnelMetrics.funnelSuccessful({ funnelInteractionId });
      } else {
        FunnelMetrics.funnelCancelled({ funnelInteractionId });
        funnelState.current = 'cancelled';
      }
    };
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const funnelSubmit = () => {
    funnelState.current = 'validating';

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
        FunnelMetrics.funnelComplete({ funnelInteractionId });
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
    setFunnelInteractionId,
    funnelType: props.funnelType,
    optionalStepNumbers: props.optionalStepNumbers,
    totalFunnelSteps: props.totalFunnelSteps,
    funnelSubmit,
    funnelCancel,
    submissionAttempt,
    funnelNextOrSubmitAttempt,
    funnelState,
    errorCount,
    loadingButtonCount,
  };

  return <FunnelContext.Provider value={funnelContextValue}>{children}</FunnelContext.Provider>;
};

type AnalyticsFunnelStepProps = {
  children?: React.ReactNode | ((props: FunnelStepContextValue) => React.ReactNode);
} & Pick<FunnelStepProps, 'stepNumber' | 'stepNameSelector'>;

export const AnalyticsFunnelStep = ({ children, stepNumber, stepNameSelector }: AnalyticsFunnelStepProps) => {
  const { funnelInteractionId, funnelState } = useFunnel();

  const funnelStepProps = { [DATA_ATTR_FUNNEL_STEP]: stepNumber };

  // This useEffect hook is used to track the start and completion of interaction with the step.
  // On mount, if there is a valid funnel interaction id, it calls the 'funnelStepStart' method from FunnelMetrics
  // to record the beginning of the interaction with the current step.
  // On unmount, it does a similar thing but this time calling 'funnelStepComplete' to record the completion of the interaction.
  useEffect(() => {
    const stepName = getNameFromSelector(stepNameSelector);

    if (funnelInteractionId && funnelState.current === 'default') {
      FunnelMetrics.funnelStepStart({
        funnelInteractionId,
        stepNumber,
        stepName,
        stepNameSelector,
        subStepAllSelector: getSubStepAllSelector(),
      });
    }

    return () => {
      //eslint-disable-next-line react-hooks/exhaustive-deps
      if (funnelInteractionId && funnelState.current !== 'cancelled') {
        FunnelMetrics.funnelStepComplete({
          funnelInteractionId,
          stepNumber,
          stepName,
          stepNameSelector,
          subStepAllSelector: getSubStepAllSelector(),
        });
      }
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funnelInteractionId, stepNumber, stepNameSelector]);

  const contextValue: FunnelStepContextValue = { stepNumber, stepNameSelector, funnelStepProps };
  return (
    <FunnelStepContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </FunnelStepContext.Provider>
  );
};
interface AnalyticsFunnelSubStepProps {
  children?: React.ReactNode;
}

export const AnalyticsFunnelSubStep = ({ children }: AnalyticsFunnelSubStepProps) => {
  const subStepId = useUniqueId('substep');
  const subStepSelector = getSubStepSelector(subStepId);
  const subStepNameSelector = getSubStepNameSelector(subStepId);
  const subStepRef = useRef<HTMLDivElement | null>(null);

  const newContext: FunnelSubStepContextValue = {
    subStepSelector,
    subStepNameSelector,
    subStepId,
    subStepRef,
    isNestedSubStep: false,
  };

  const inheritedContext = { ...useContext(FunnelSubStepContext), isNestedSubStep: true };

  const context = inheritedContext.subStepId ? inheritedContext : newContext;

  return <FunnelSubStepContext.Provider value={context}>{children}</FunnelSubStepContext.Provider>;
};
