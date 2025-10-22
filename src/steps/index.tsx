// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { StepsProps } from './interfaces';
import InternalSteps from './internal';

export { StepsProps };

const Steps = ({ steps, orientation = 'vertical', ...props }: StepsProps) => {
  const baseProps = getBaseProps(props);
  const baseComponentProps = useBaseComponent('Steps');
  const externalProps = getExternalProps(props);

  return (
    <InternalSteps {...baseProps} {...baseComponentProps} {...externalProps} steps={steps} orientation={orientation} />
  );
};

applyDisplayName(Steps, 'Steps');
export default Steps;
