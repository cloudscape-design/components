// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';

import { FunnelMetrics } from '../internal/analytics';
import { AnalyticsFunnel, AnalyticsFunnelStep } from '../internal/analytics/components/analytics-funnel';
import { useFunnel, useFunnelNameSelector, useFunnelStep } from '../internal/analytics/hooks/use-funnel';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import { ButtonContext, ButtonContextProps } from '../internal/context/button-context';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FormProps } from './interfaces';
import InternalForm from './internal';

import headerStyles from '../header/styles.css.js';
import analyticsSelectors from './analytics-metadata/styles.css.js';

export { FormProps };

const FormWithAnalytics = ({ variant = 'full-page', actions, errorText, ...props }: FormProps) => {
  const {
    funnelIdentifier,
    funnelInteractionId,
    funnelProps,
    funnelSubmit,
    funnelNextOrSubmitAttempt,
    errorCount,
    submissionAttempt,
    funnelErrorContext,
  } = useFunnel();
  const { funnelStepProps } = useFunnelStep();

  const handleActionButtonClick: ButtonContextProps['onClick'] = ({ variant, formAction }) => {
    if (variant === 'primary' || (formAction === 'submit' && variant === 'normal')) {
      funnelNextOrSubmitAttempt();
      funnelSubmit();
    }
  };

  useEffect(() => {
    if (funnelInteractionId && errorText) {
      errorCount.current++;
      FunnelMetrics.funnelError({ funnelInteractionId, funnelIdentifier, funnelErrorContext });
      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        errorCount.current--;
      };
    }
  }, [funnelInteractionId, funnelIdentifier, errorText, submissionAttempt, errorCount, funnelErrorContext]);

  return (
    <ButtonContext.Provider value={{ onClick: handleActionButtonClick }}>
      <InternalForm
        variant={variant}
        actions={actions}
        errorText={errorText}
        {...props}
        {...funnelProps}
        {...funnelStepProps}
        __injectAnalyticsComponentMetadata={true}
      />
    </ButtonContext.Provider>
  );
};

export default function Form({ variant = 'full-page', ...props }: FormProps) {
  const analyticsMetadata = getAnalyticsMetadataProps(props as BasePropsWithAnalyticsMetadata);
  const baseComponentProps = useBaseComponent(
    'Form',
    {
      props: {
        variant,
        flowType: analyticsMetadata?.flowType,
      },
      metadata: {
        hasResourceType: Boolean(analyticsMetadata?.resourceType),
        hasInstanceIdentifier: Boolean(analyticsMetadata?.instanceIdentifier),
      },
    },
    analyticsMetadata
  );
  const inheritedFunnelNameSelector = useFunnelNameSelector();
  const funnelNameSelector =
    inheritedFunnelNameSelector || `.${analyticsSelectors.header} .${headerStyles['heading-text']}`;

  return (
    <AnalyticsFunnel
      funnelIdentifier={analyticsMetadata?.instanceIdentifier}
      funnelFlowType={analyticsMetadata?.flowType}
      funnelErrorContext={analyticsMetadata?.errorContext}
      funnelResourceType={analyticsMetadata?.resourceType}
      funnelType="single-page"
      optionalStepNumbers={[]}
      totalFunnelSteps={1}
      funnelNameSelectors={() => [funnelNameSelector, `.${analyticsSelectors.header}`]}
    >
      <AnalyticsFunnelStep
        stepIdentifier={analyticsMetadata?.instanceIdentifier}
        stepErrorContext={analyticsMetadata?.errorContext}
        stepNumber={1}
      >
        <FormWithAnalytics variant={variant} {...props} {...baseComponentProps} />
      </AnalyticsFunnelStep>
    </AnalyticsFunnel>
  );
}

applyDisplayName(Form, 'Form');
