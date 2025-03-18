// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { funnelCache } from '../cache';
import { Funnel, FunnelStep } from '../funnel';
import {
  AnalyticsElement,
  FunnelConfig,
  FunnelStepConfig,
  FunnelSubStepConfig,
  Handler,
  MountDetail,
  PropertyChangeDetail,
  WizardMountConfig,
} from '../interfaces';
import { getFunnelSubsteps, isInComponent } from '../utils/browser';
import { getFunnel } from '../utils/funnel';
import { getLastBreadcrumbText } from '../utils/page';

export const mount: Handler<MountDetail> = event => {
  const funnelName = getLastBreadcrumbText() || 'Unknown funnel';

  const analyticsElement = event.target as AnalyticsElement;
  const wizardMountConfig = (event.detail?.configuration as any).analytics as WizardMountConfig; // FIXME

  const funnelConfig: FunnelConfig = {
    name: funnelName,
    type: 'multi-page',
    stepConfiguration: wizardMountConfig?.stepConfiguration || [],
  };

  analyticsElement.setAttribute('data-analytics-node', 'funnel');
  analyticsElement.__analytics__ = funnelConfig;

  const funnel = new Funnel(funnelConfig);

  const funnelSteps = wizardMountConfig.stepConfiguration.map(stepConfig => new FunnelStep(stepConfig));
  const activeStep =
    funnelSteps[wizardMountConfig.activeStepIndex] ||
    new FunnelStep({ name: 'Unknown step', isOptional: false, number: 1 });

  const substepElems = getFunnelSubsteps(analyticsElement);
  substepElems.forEach((substepElem, index) => {
    (substepElem.__analytics__ as FunnelSubStepConfig).number = index + 1;
  });

  const substepConfigs = substepElems.map(substepElem => substepElem.__analytics__);
  activeStep.registerSubsteps(substepConfigs);

  funnel.steps = funnelSteps;
  funnel.setActiveStep(activeStep);
  funnelCache.set(analyticsElement, funnel);

  if (!isInComponent(event.target, 'AppLayout')) {
    funnel.start();
  }
};

export const unmount: Handler = ({ target }) => {
  const funnel = getFunnel(target);
  if (!funnel) {
    console.warn('Could not find funnel for form unmount');
    return;
  }

  funnel.complete();
  funnelCache.delete(target);
};

export const stepMount: Handler<FunnelStepConfig> = event => {
  const analyticsElement = event.target as AnalyticsElement;
  analyticsElement.setAttribute('data-analytics-node', 'step');
  analyticsElement.__analytics__ = event.detail!;

  const funnel = getFunnel(event.target);
  if (!funnel) {
    return;
  }

  const substepElems = getFunnelSubsteps(analyticsElement);
  substepElems.forEach((substepElem, index) => {
    (substepElem.__analytics__ as FunnelSubStepConfig).number = index + 1;
  });

  funnel.activeStep?.registerSubsteps(substepElems.map(substepElem => substepElem.__analytics__));
};

export const stepUnmount: Handler = () => {};
export const stepNavigation: Handler<FunnelStepConfig> = () => {};

export const propertyChange: Handler<PropertyChangeDetail> = event => {
  if (!event.detail) {
    return;
  }

  const funnel = getFunnel(event.target);
  switch (event.detail.name) {
    case 'activeStepIndex': {
      funnel?.setActiveStepIndex(event.detail.value);
      break;
    }
    default:
  }
};

export const submit: Handler = ({ target }) => {
  const funnel = getFunnel(target);
  if (!funnel) {
    console.warn('Could not find funnel for wizard submit');
    return;
  }

  funnel.submit();
};
