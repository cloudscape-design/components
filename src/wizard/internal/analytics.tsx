// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PACKAGE_SOURCE, PACKAGE_VERSION } from '../../internal/environment';
import { Metrics } from '../../internal/metrics';
import { WizardProps } from '../interfaces';

const metrics = new Metrics(PACKAGE_SOURCE, PACKAGE_VERSION);

const prefix = 'csa_wizard';

const createEventType = (eventType: string) => `${prefix}_${eventType}`;
const createEventContext = (stepIndex = 0) => `${prefix}_step${stepIndex + 1}`;
const createEventDetail = (stepIndex = 0) => `step${stepIndex + 1}`;

// A custom time cache is used to not clear the timer between navigation attempts
// This allows us the ability to track time to attempt each step as well as the time to complete
// each step
const timeCache: Record<string, number> = {};
const timeStart = (key = 'current') => {
  timeCache[key] = Date.now();
};

const timeEnd = (key = 'current', clear = false) => {
  const start = timeCache[key];
  // No start time is available when starting the first step
  if (!start) {
    return undefined;
  }

  if (clear) {
    delete timeCache[key];
  }

  return (Date.now() - start) / 1000; // Convert to seconds
};

export const trackStartWizard = () => {
  timeStart(prefix);
};

export const trackStartStep = (stepIndex?: number) => {
  const eventContext = createEventContext(stepIndex);

  // End the timer of the previous step
  const time = timeEnd();

  // Start a new timer of the current step
  timeStart();

  metrics.sendPanoramaMetric({
    eventContext,
    eventDetail: createEventDetail(stepIndex),
    eventType: createEventType('step'),
    ...(time !== undefined && { eventValue: time.toString() }),
  });
};

export const trackNavigate = (
  activeStepIndex: number,
  requestedStepIndex: number,
  reason: WizardProps.NavigationReason
) => {
  const eventContext = createEventContext(activeStepIndex);
  const time = timeEnd();

  metrics.sendPanoramaMetric({
    eventContext,
    eventDetail: createEventDetail(requestedStepIndex),
    eventType: createEventType('navigate'),
    eventValue: { reason, ...(time !== undefined && { time }) },
  });
};

export const trackSubmit = (stepIndex: number) => {
  const eventContext = createEventContext(stepIndex);
  // End the timer of the wizard
  const time = timeEnd(prefix);

  metrics.sendPanoramaMetric({
    eventContext,
    eventDetail: createEventDetail(stepIndex),
    eventType: createEventType('submit'),
    ...(time !== undefined && { eventValue: time.toString() }),
  });
};
