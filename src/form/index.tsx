// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useLayoutEffect } from 'react';

import { FunnelProvider } from '../internal/analytics/contexts/funnel-context';
import { useFunnelContext } from '../internal/analytics/hooks/use-funnel';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import { ButtonContext, ButtonContextProps } from '../internal/context/button-context';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FormProps } from './interfaces';
import InternalForm from './internal';

import analyticsSelectors from './analytics-metadata/styles.css.js';

const FunnelEnabledForm = ({ variant = 'full-page', actions, errorText, ...props }: FormProps) => {
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

  const funnel = useFunnelContext();
  const controller = funnel?.controller;

  useLayoutEffect(() => {
    if (!controller) {
      return;
    }

    const funnelName =
      (baseComponentProps.__internalRootRef.current as HTMLElement)?.querySelector<HTMLElement>(
        ['h1', 'h2', 'h3'].map(heading => `.${analyticsSelectors.header} ${heading}`).join(',')
      )?.innerText || '';

    controller.setMetadata(analyticsMetadata);
    controller.setName(funnelName);
    controller.currentStep.setName(funnelName);
    controller.currentStep.setMetadata(analyticsMetadata);

    controller.start();

    return () => {
      controller?.complete();
    };

    // Don't rerun hook on funnel object changes. We're only interested in on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const errorTextValue =
      (baseComponentProps.__internalRootRef.current as HTMLElement).querySelector<HTMLElement>(analyticsSelectors.error)
        ?.innerText || '';
    funnel?.controller?.error({ errorText: errorTextValue, scope: { type: 'funnel' } });
  }, [errorText, funnel, baseComponentProps.__internalRootRef]);

  const handleButtonClick: ButtonContextProps['onClick'] = ({ variant }) => {
    if (variant === 'primary') {
      funnel?.controller?.submit();
    }
  };

  const handleButtonLoadingChange: ButtonContextProps['onLoadingChange'] = ({ value, variant }) => {
    if (variant === 'primary' && typeof value === 'boolean') {
      funnel?.controller?.validate(Boolean(value));
    }
  };

  return (
    <InternalForm
      {...props}
      {...baseComponentProps}
      {...funnel?.controller?.domAttributes}
      {...funnel?.controller?.currentStep.domAttributes}
      variant={variant}
      actions={
        <ButtonContext.Provider value={{ onClick: handleButtonClick, onLoadingChange: handleButtonLoadingChange }}>
          {actions}
        </ButtonContext.Provider>
      }
      errorText={errorText}
      __injectAnalyticsComponentMetadata={true}
    />
  );
};

applyDisplayName(Form, 'Form');

export { FormProps };
export default function Form(props: FormProps) {
  return (
    <FunnelProvider rootComponent="form">
      <FunnelEnabledForm {...props} />
    </FunnelProvider>
  );
}
