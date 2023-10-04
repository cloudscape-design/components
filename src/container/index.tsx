// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { InternalContainerAsSubstep } from './internal';
import { ContainerProps } from './interfaces';
import { getExternalProps } from '../internal/utils/external-props';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { AnalyticsFunnelSubStep } from '../internal/analytics/components/analytics-funnel';

export { ContainerProps };

export default function Container({
  variant = 'default',
  disableHeaderPaddings = false,
  disableContentPaddings = false,
  ...props
}: ContainerProps) {
  const baseComponentProps = useBaseComponent('Container');
  const externalProps = getExternalProps(props);

  return (
    <AnalyticsFunnelSubStep>
      <InternalContainerAsSubstep
        variant={variant}
        disableContentPaddings={disableContentPaddings}
        disableHeaderPaddings={disableHeaderPaddings}
        {...props}
        {...externalProps}
        {...baseComponentProps}
      />
    </AnalyticsFunnelSubStep>
  );
}

applyDisplayName(Container, 'Container');
