// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MutableRefObject, useEffect } from 'react';

import { PageContext, useFunnel } from '../../../internal/analytics/funnel/hooks/use-funnel';
import { AnalyticsMetadata } from '../../../internal/analytics/interfaces';
import { ButtonContextProps } from '../../../internal/context/button-context';
import { FormProps } from '../../interfaces';

import analyticsSelectors from '../../analytics-metadata/styles.css.js';

const getFunnelName = (rootRef: MutableRefObject<HTMLElement>, pageContext: PageContext) => {
  const headerElement = rootRef.current.querySelector<HTMLHeadingElement>(
    ['h1', 'h2', 'h3'].map(heading => `.${analyticsSelectors.header} ${heading}`).join(',')
  );

  return headerElement?.innerText || pageContext.getPageName() || '';
};

interface UseFormFunnel {
  rootRef: MutableRefObject<HTMLElement>;
  analyticsMetadata: AnalyticsMetadata;
  errorText: FormProps['errorText'];
}

export const useFormFunnel = ({ rootRef, analyticsMetadata, errorText }: UseFormFunnel) => {
  const { funnelContext, pageContext } = useFunnel();

  useEffect(() => {
    const funnelName = getFunnelName(rootRef, pageContext);
    const resourceType = analyticsMetadata.resourceType ?? (pageContext.getResourceType() || '');

    funnelContext?.controller?.setFunnelType('single-page');
    funnelContext?.controller?.setMetadata({ ...analyticsMetadata, resourceType });
    funnelContext?.controller?.setName(funnelName);
    funnelContext?.controller?.currentStep.setName(funnelName);
    funnelContext?.controller?.currentStep.setMetadata({ ...analyticsMetadata, resourceType });
  }, [funnelContext?.controller, pageContext, rootRef, analyticsMetadata]);

  useEffect(() => {
    funnelContext?.controller?.start();

    return () => {
      funnelContext?.controller?.complete();
    };
  }, [funnelContext?.controller]);

  useEffect(() => {
    if (!errorText) {
      return;
    }

    const errorTextValue = rootRef.current.querySelector<HTMLElement>(`.${analyticsSelectors.error}`)?.innerText || '';
    funnelContext?.controller?.error({ errorText: errorTextValue, scope: { context: 'funnel', source: 'form' } });
  }, [funnelContext, rootRef, errorText]);

  const buttonContextProps: ButtonContextProps = {
    onClick: ({ variant }) => {
      if (variant === 'primary') {
        funnelContext?.controller?.submit();
      }
    },
    onLoadingChange: ({ value, variant }) => {
      if (variant === 'primary' && typeof value === 'boolean') {
        funnelContext?.controller?.validate(value);
      }
    },
  };

  return { funnelContext, buttonContextProps };
};
