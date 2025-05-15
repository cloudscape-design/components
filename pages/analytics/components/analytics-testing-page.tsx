// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ComponentType, useLayoutEffect } from 'react';

import { setComponentMetrics } from '~components/internal/analytics';
import { TestAPI } from '~components/internal/analytics/helpers/test-api';

import { ComponentMetricsLogger } from '../mocks/mock-component-metrics';

declare global {
  interface Window {
    __analytics?: {
      __tableInteractionAPI?: TestAPI;
    };
  }
}

export function withAnalyticsTestingApi<P extends object>(WrappedComponent: ComponentType<P>) {
  const WithAnalyticsTestingApi = (props: P) => {
    useLayoutEffect(() => {
      window.__analytics = {
        __tableInteractionAPI: new TestAPI(),
      };

      setComponentMetrics(ComponentMetricsLogger);
    }, []);

    return <WrappedComponent {...props} />;
  };

  return WithAnalyticsTestingApi;
}
