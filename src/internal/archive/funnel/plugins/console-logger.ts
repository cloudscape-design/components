// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AnalyticsPlugin, FunnelEvent } from '../types';

export class ConsoleLoggerPlugin implements AnalyticsPlugin {
  track(event: FunnelEvent) {
    const context = event.context.path.join(' > ');

    console.groupCollapsed(`🎯 Funnel Event: ${event.name}`);
    console.log(`Path: ${context}`);
    console.log('Context:', event.context);
    console.log('Metadata:', event.metadata);
    if (event.details) {
      console.log('Details:', event.details);
    }
    console.groupEnd();
  }
}
