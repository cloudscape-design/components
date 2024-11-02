// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ComponentType, useLayoutEffect } from 'react';

import { FunnelTestAPI, FunnelTestEvent } from '~components/internal/analytics/funnel/test-api';

declare global {
  interface Window {
    __funnelTestAPI?: FunnelTestAPI;
  }
}

function initializeFunnelTestAPI() {
  if (typeof window === 'undefined') {
    return;
  }

  const events: FunnelTestEvent[] = [];

  window.__funnelTestAPI = {
    events,
    getEventsByAction: (action: string) => events.filter(event => event.action === action),
    getLastEvent: () => (events.length > 0 ? events[events.length - 1] : undefined),
    clear: () => {
      events.length = 0;
    },
  };
}

export function withFunnelTestingApi<P extends object>(WrappedComponent: ComponentType<P>) {
  const WithFunnelTestingApi = (props: P) => {
    useLayoutEffect(() => {
      initializeFunnelTestAPI();
    }, []);

    return <WrappedComponent {...props} />;
  };

  return WithFunnelTestingApi;
}
