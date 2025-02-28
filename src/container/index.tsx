// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { AnalyticsFunnelSubStep } from '../internal/analytics/components/analytics-funnel.js';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component/index.js';
import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { getExternalProps } from '../internal/utils/external-props.js';
import { GeneratedAnalyticsMetadataContainerComponent } from './analytics-metadata/interfaces.js';
import { ContainerProps } from './interfaces.js';
import { InternalContainerAsSubstep } from './internal.js';

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
      props: {
        disableContentPaddings,
        disableHeaderPaddings,
        fitHeight,
        variant,
      },
      metadata: {
        hasInstanceIdentifier: Boolean(analyticsMetadata?.instanceIdentifier),
      },
    },
    analyticsMetadata
  );
  const externalProps = getExternalProps(props);

  const analyticsComponentMetadata: GeneratedAnalyticsMetadataContainerComponent = {
    name: 'awsui.Container',
    label: { root: 'self' },
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
