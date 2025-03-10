// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Handler } from '../interfaces';
import { getParentFunnelElement, getParentStepElement } from '../utils/browser';
import { getFunnel, getSubstepConfig } from '../utils/funnel';
import { requestNextTick } from '../utils/handler';

export const render: Handler = ({ detail, target }) => {
  if (!detail?.configuration.analytics) {
    return;
  }

  target.setAttribute('data-analytics-property-type', detail.configuration.analytics.type);

  const funnel = getFunnel(target);
  if (funnel) {
    requestNextTick(() => {
      const substepConfig = getSubstepConfig(target);
      if (substepConfig) {
        if (funnel.activeStep?.activeSubstep) {
          funnel.activeStep?.activeSubstep?.error(undefined, target.innerText);
        } else if (substepConfig.number) {
          funnel.activeStep?.substeps[substepConfig.number - 1].error(undefined, target.innerText);
        } else {
          console.warn('Could not associate substep with alert error');
          funnel.activeStep?.error(target.innerText);
        }
      } else if (getParentStepElement(target)) {
        funnel.activeStep?.error(target.innerText);
      } else if (getParentFunnelElement(target)) {
        funnel.error();
      }
    });
  }
};
