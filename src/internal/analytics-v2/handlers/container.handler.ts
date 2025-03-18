// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AnalyticsElement, FunnelSubStepConfig, Handler } from '../interfaces';
import { getFunnelSubsteps, getParentFunnelElement, isInComponent } from '../utils/browser';
import { getFunnel } from '../utils/funnel';
import { getContainerHeaderText } from '../utils/page';

export const render: Handler = event => {
  // Ignore if container is nested in another container
  if (isInComponent(event.target, 'Container')) {
    return;
  }

  const element = event.target as AnalyticsElement;
  const name = getContainerHeaderText(event.target) || 'Unknown Substep';
  const substepConfig: FunnelSubStepConfig = { name };

  element.__analytics__ = substepConfig;
  element.setAttribute('data-analytics-node', 'substep');

  const funnel = getFunnel(element);

  if (!funnel) {
    return;
  }

  const funnelEl = getParentFunnelElement(element);
  if (!funnelEl) {
    return;
  }

  const substepElems = getFunnelSubsteps(funnelEl);
  substepElems.forEach((substepElem, index) => {
    (substepElem.__analytics__ as FunnelSubStepConfig).number = index + 1;
  });

  const substepConfigs = substepElems.map(substepElem => substepElem.__analytics__);
  funnel.activeStep?.registerSubsteps(substepConfigs);
};
