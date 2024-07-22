// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { AnalyticsFunnelSubStep } from '../internal/analytics/components/analytics-funnel';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { GeneratedAnalyticsMetadataContainerComponent } from './analytics-metadata/interfaces';
import { ContainerProps } from './interfaces';
import { InternalContainerAsSubstep } from './internal';

export { ContainerProps };

export default function Container({
  variant = 'default',
  disableHeaderPaddings = false,
  disableContentPaddings = false,
  fitHeight = false,
  ...props
}: ContainerProps) {
  const analyticsMetadata = getAnalyticsMetadataProps(props as BasePropsWithAnalyticsMetadata);
  const baseComponentProps = useBaseComponent(
    'Container',
    {
      props: { disableContentPaddings, disableHeaderPaddings, fitHeight, variant },
    },
    analyticsMetadata
  );
  const externalProps = getExternalProps(props);

  const analyticsComponentMetadata: GeneratedAnalyticsMetadataContainerComponent = {
    name: 'awsui.Container',
    label: '',
  };

  return (
    <AnalyticsFunnelSubStep
      subStepIdentifier={analyticsMetadata?.instanceIdentifier}
      subStepErrorContext={analyticsMetadata?.errorContext}
    >
      <InternalContainerAsSubstep
        variant={variant}
        disableContentPaddings={disableContentPaddings}
        disableHeaderPaddings={disableHeaderPaddings}
        fitHeight={fitHeight}
        {...props}
        {...externalProps}
        {...baseComponentProps}
        {...getAnalyticsMetadataAttribute({ component: analyticsComponentMetadata })}
      />
    </AnalyticsFunnelSubStep>
  );
}

applyDisplayName(Container, 'Container');
