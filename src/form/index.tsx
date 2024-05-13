// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FormProps } from './interfaces';
import InternalForm from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

import { AnalyticsFunnel, AnalyticsFunnelStep } from '../internal/analytics/components/analytics-funnel';
import { ButtonContext, ButtonContextProps } from '../internal/context/button-context';
import { useFunnel, useFunnelNameSelector, useFunnelStep } from '../internal/analytics/hooks/use-funnel';

import formStyles from './styles.css.js';
import headerStyles from '../header/styles.css.js';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import { FunnelMetrics } from '../internal/analytics';

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

  const handleActionButtonClick: ButtonContextProps['onClick'] = ({ variant }) => {
    if (variant === 'primary') {
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
      />
    </ButtonContext.Provider>
  );
};

export default function Form({ variant = 'full-page', ...props }: FormProps) {
  const analyticsMetadata = getAnalyticsMetadataProps(props as BasePropsWithAnalyticsMetadata);
  const baseComponentProps = useBaseComponent('Form', { props: { variant } }, analyticsMetadata);
  const inheritedFunnelNameSelector = useFunnelNameSelector();
  const funnelNameSelector = inheritedFunnelNameSelector || `.${headerStyles['heading-text']}`;

  return (
    <AnalyticsFunnel
      funnelIdentifier={analyticsMetadata?.instanceIdentifier}
      funnelFlowType={analyticsMetadata?.flowType}
      funnelErrorContext={analyticsMetadata?.errorContext}
      funnelType="single-page"
      optionalStepNumbers={[]}
      totalFunnelSteps={1}
      funnelNameSelectors={[funnelNameSelector, `.${formStyles.header}`]}
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
