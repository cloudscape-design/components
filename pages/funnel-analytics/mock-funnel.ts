// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IFunnelMetrics } from '~components/internal/analytics/interfaces';

const funnelMetricsLog: { action: string; resolvedProps?: any; props: any }[] = [];
(window as any).__awsuiFunnelMetrics__ = funnelMetricsLog;

export const MockedFunnelMetrics: IFunnelMetrics = {
  funnelStart(props): string {
    const funnelName = document.querySelector(props.funnelNameSelector)?.innerHTML;
    console.log({ action: 'funnelStart', props, resolvedProps: { funnelName } });
    return 'mocked-funnel-id';
  },

  funnelError(props): void {
    console.log({ action: 'funnelError', props });
  },

  funnelComplete(props): void {
    console.log({ action: 'funnelComplete', props });
  },

  funnelSuccessful(props): void {
    console.log({ action: 'funnelSuccessful', props });
  },

  funnelCancelled(props): void {
    console.log({ action: 'funnelCancelled', props });
  },

  funnelChange(props): void {
    console.log({ action: 'funnelChange', props });
  },

  funnelStepStart(props): void {
    const stepName = document.querySelector(props.stepNameSelector!)?.innerHTML;
    console.log({ action: 'funnelStepStart', props, resolvedProps: { stepName } });
  },

  funnelStepComplete(props): void {
    const stepName = document.querySelector(props.stepNameSelector!)?.innerHTML;
    console.log({ action: 'funnelStepComplete', props, resolvedProps: { stepName } });
  },

  funnelStepNavigation(props): void {
    const stepName = document.querySelector(props.stepNameSelector!)?.innerHTML;
    // const subStepAllElements = document.querySelectorAll(props.subStepAllSelector); // TODO: Does not work

    console.log({ action: 'funnelStepNavigation', props, resolvedProps: { stepName } });
  },

  funnelStepError(props): void {
    const stepName = document.querySelector(props.stepNameSelector!)?.innerHTML;
    console.log({ action: 'funnelStepError', props, resolvedProps: { stepName } });
  },

  funnelStepChange(props): void {
    const stepName = document.querySelector(props.stepNameSelector!)?.innerHTML;
    console.log({ action: 'funnelStepChange', props, resolvedProps: { stepName } });
  },

  funnelSubStepStart(props): void {
    const stepName = document.querySelector(props.stepNameSelector!)?.innerHTML;
    const subStepName = document.querySelector(props.subStepNameSelector)?.innerHTML;
    const subStepAllElements = document.querySelectorAll(props.subStepAllSelector);
    const subStepElement = document.querySelector(props.subStepSelector);

    console.log({
      action: 'funnelSubStepStart',
      props,
      resolvedProps: { stepName, subStepName, subStepAllElements, subStepElement },
    });
  },

  funnelSubStepComplete(props): void {
    const stepName = document.querySelector(props.stepNameSelector!)?.innerHTML;
    const subStepName = document.querySelector(props.subStepNameSelector)?.innerHTML;
    const subStepAllElements = document.querySelectorAll(props.subStepAllSelector);
    const subStepElement = document.querySelector(props.subStepSelector);

    console.log({
      action: 'funnelSubStepComplete',
      props,
      resolvedProps: { stepName, subStepName, subStepAllElements, subStepElement },
    });
  },

  funnelSubStepError(props): void {
    const stepName = document.querySelector(props.stepNameSelector!)?.innerHTML;
    const subStepName = document.querySelector(props.subStepNameSelector)?.innerHTML;
    const fieldLabel = document.querySelector(props.fieldLabelSelector!)?.innerHTML;
    const fieldError = document.querySelector(props.fieldErrorSelector!)?.innerHTML;

    console.log({
      action: 'funnelSubStepError',
      props,
      resolvedProps: { fieldLabel, fieldError, stepName, subStepName },
    });
  },

  helpPanelInteracted(props): void {
    const stepName = document.querySelector(props.stepNameSelector!)?.innerHTML;
    const subStepName = document.querySelector(props.subStepNameSelector)?.innerHTML;
    const subStepElement = document.querySelectorAll(props.subStepSelector);
    const subStepAllElements = document.querySelectorAll(props.subStepAllSelector);
    const element = document.querySelector(props.elementSelector);

    console.log({
      action: 'helpPanelInteracted',
      props,
      resolvedProps: { stepName, subStepName, subStepAllElements, element, subStepElement },
    });
  },

  externalLinkInteracted(props): void {
    const stepName = document.querySelector(props.stepNameSelector!)?.innerHTML;
    const subStepName = document.querySelector(props.subStepNameSelector)?.innerHTML;
    const subStepElement = document.querySelectorAll(props.subStepSelector);
    const subStepAllElements = document.querySelectorAll(props.subStepAllSelector);
    const element = document.querySelector(props.elementSelector);

    console.log({
      action: 'externalLinkInteracted',
      props,
      resolvedProps: { stepName, subStepName, subStepAllElements, element, subStepElement },
    });
  },
};
