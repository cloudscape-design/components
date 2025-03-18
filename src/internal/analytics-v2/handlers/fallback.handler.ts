// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Handler } from '../interfaces';
import { getFunnel, getSubstepConfig } from '../utils/funnel';

export const mount: Handler = () => {};
export const unmount: Handler = () => {};
export const click: Handler = () => {};

export const focus: Handler = ({ target }) => {
  const funnel = getFunnel(target);

  if (!funnel) {
    return;
  }

  const substepConfig = getSubstepConfig(target);
  if (!substepConfig) {
    funnel.activeStep?.setActiveSubstep(null);
    return;
  }

  funnel.activeStep?.setActiveSubstep(substepConfig.number);
};

export const blur: Handler = () => {};
