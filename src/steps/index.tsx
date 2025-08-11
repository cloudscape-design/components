// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component/index.js';
import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { getExternalProps } from '../internal/utils/external-props.js';
import { StepsProps } from './interfaces.js';
import InternalSteps from './internal.js';

export { StepsProps };

const Steps = ({ steps, ...props }: StepsProps) => {
  const baseProps = getBaseProps(props);
  const baseComponentProps = useBaseComponent('Steps');
  const externalProps = getExternalProps(props);

  return <InternalSteps {...baseProps} {...baseComponentProps} {...externalProps} steps={steps} />;
};

applyDisplayName(Steps, 'Steps');
export default Steps;
