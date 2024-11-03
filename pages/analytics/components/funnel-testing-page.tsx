// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ComponentType, useLayoutEffect } from 'react';

import { AnalyticsPlugin, FunnelAnalytics, funnelAnalytics, FunnelEvent } from '~components/internal/analytics/funnel';
import { ConsoleLoggerPlugin } from '~components/internal/analytics/funnel/plugins/console-logger';
import { FunnelTestAPI } from '~components/internal/analytics/funnel/types/test-api';

declare global {
  interface Window {
    __funnelAnalytics?: FunnelAnalytics;
    __funnelTestAPI?: FunnelTestAPI;
  }
}

export class FunnelTestPlugin implements AnalyticsPlugin, FunnelTestAPI {
  public events: FunnelEvent[] = [];

  track(event: FunnelEvent): void {
    this.events.push(event);
  }

  getEventsByName(name: string): FunnelEvent[] {
    return this.events.filter(event => event.name === name);
  }

  getLastEvent(): FunnelEvent | undefined {
    return this.events[this.events.length - 1];
  }

  clear(): void {
    this.events.length = 0;
  }
}

export function withFunnelTestingApi<P extends object>(WrappedComponent: ComponentType<P>) {
  const WithFunnelTestingApi = (props: P) => {
    useLayoutEffect(() => {
      const testPlugin = new FunnelTestPlugin();

      window.__funnelAnalytics = funnelAnalytics;
      window.__funnelTestAPI = testPlugin;

      funnelAnalytics.addPlugin(testPlugin);
      funnelAnalytics.addPlugin(new ConsoleLoggerPlugin());
    }, []);

    return <WrappedComponent {...props} />;
  };

  return WithFunnelTestingApi;
}
