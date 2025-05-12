// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { IComponentMetrics, IFunnelMetrics } from '~components/internal/analytics/interfaces';

const logMethod = (methodName: string) => (props: any) => {
  console.log(methodName, props);
};

export const FunnelLogger: IFunnelMetrics = {
  funnelStart: (props: any) => {
    const funnelInteractionId = new Date().toISOString();
    console.log('funnelStart', { ...props, funnelInteractionId });
    return funnelInteractionId;
  },
  funnelError: logMethod('funnelError'),
  funnelComplete: logMethod('funnelComplete'),
  funnelSuccessful: logMethod('funnelSuccessful'),
  funnelCancelled: logMethod('funnelCancelled'),
  funnelChange: logMethod('funnelChange'),
  funnelStepStart: logMethod('funnelStepStart'),
  funnelStepComplete: logMethod('funnelStepComplete'),
  funnelStepNavigation: logMethod('funnelStepNavigation'),
  funnelStepError: logMethod('funnelStepError'),
  funnelStepChange: logMethod('funnelStepChange'),
  funnelSubStepStart: logMethod('funnelSubStepStart'),
  funnelSubStepComplete: logMethod('funnelSubStepComplete'),
  funnelSubStepError: logMethod('funnelSubStepError'),
  helpPanelInteracted: logMethod('helpPanelInteracted'),
  externalLinkInteracted: logMethod('externalLinkInteracted'),
};

export const ComponentMetricsLogger: IComponentMetrics = {
  componentMounted: (props: any) => {
    const funnelInteractionId = new Date().toISOString();
    console.log('componentMounted', { ...props, funnelInteractionId });
    return funnelInteractionId;
  },

  componentUpdated: logMethod('componentUpdated'),
};
