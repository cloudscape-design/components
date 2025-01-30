// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import {
  getAnalyticsLabelAttribute,
  getAnalyticsMetadataAttribute,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { InternalContainerAsSubstep } from '../container/internal';
import { AnalyticsFunnelSubStep } from '../internal/analytics/components/analytics-funnel';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { GeneratedAnalyticsMetadataExpandableSectionComponent } from './analytics-metadata/interfaces';
import { InternalVariant } from './interfaces';

import analyticsSelectors from './analytics-metadata/styles.css.js';

interface ExpandableSectionContainerProps extends InternalBaseComponentProps {
  className?: string;
  header: React.ReactNode;
  children?: React.ReactNode;
  variant: InternalVariant;
  expanded: boolean | undefined;
  disableContentPaddings: boolean | undefined;
  __injectAnalyticsComponentMetadata?: boolean;
}

export const ExpandableSectionContainer = ({
  className,
  children,
  header,
  variant,
  expanded,
  disableContentPaddings,
  __internalRootRef,
  __injectAnalyticsComponentMetadata,
  ...rest
}: ExpandableSectionContainerProps) => {
  const analyticsMetadata = getAnalyticsMetadataProps(rest as BasePropsWithAnalyticsMetadata);
  const analyticsComponentMetadata: GeneratedAnalyticsMetadataExpandableSectionComponent = {
    name: 'awsui.ExpandableSection',
    label: { root: 'self' },
    properties: { variant, expanded: `${!!expanded}` },
  };

  const metadataAttribute = __injectAnalyticsComponentMetadata
    ? getAnalyticsMetadataAttribute({ component: analyticsComponentMetadata })
    : {};

  if (variant === 'container' || variant === 'stacked') {
    return (
      <AnalyticsFunnelSubStep
        subStepIdentifier={analyticsMetadata?.instanceIdentifier}
        subStepErrorContext={analyticsMetadata?.errorContext}
      >
        <InternalContainerAsSubstep
          {...rest}
          className={className}
          header={header}
          variant={variant === 'stacked' ? 'stacked' : 'default'}
          disableContentPaddings={disableContentPaddings || !expanded}
          disableHeaderPaddings={true}
          __hiddenContent={!expanded}
          __internalRootRef={__internalRootRef}
          {...metadataAttribute}
        >
          {children}
        </InternalContainerAsSubstep>
      </AnalyticsFunnelSubStep>
    );
  }

  return (
    <div
      className={className}
      {...rest}
      ref={__internalRootRef}
      {...metadataAttribute}
      {...getAnalyticsLabelAttribute(`.${analyticsSelectors['header-label']}`)}
    >
      {header}
      {children}
    </div>
  );
};
