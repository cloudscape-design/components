// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { FunnelProvider } from '../internal/analytics/contexts/funnel-context';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import { ButtonContext } from '../internal/context/button-context';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { useFormFunnel } from './analytics/funnel';
import { FormProps } from './interfaces';
import InternalForm from './internal';

const BaseForm = ({ variant = 'full-page', errorText, ...props }: FormProps) => {
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

  const { funnelContext, buttonContextProps } = useFormFunnel({
    rootRef: baseComponentProps.__internalRootRef,
    analyticsMetadata,
    errorText,
  });

  return (
    <ButtonContext.Provider value={buttonContextProps}>
      <InternalForm
        {...props}
        {...baseComponentProps}
        {...funnelContext?.controller?.domAttributes}
        {...funnelContext?.controller?.currentStep.domAttributes}
        variant={variant}
        errorText={errorText}
        __injectAnalyticsComponentMetadata={true}
      />
    </ButtonContext.Provider>
  );
};

const Form = (props: FormProps) => (
  <FunnelProvider rootComponent="form">
    <BaseForm {...props} />
  </FunnelProvider>
);

applyDisplayName(Form, 'Form');

export { FormProps };
export default Form;
