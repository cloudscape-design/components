// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AnalyticsPlugin, FunnelEvent } from '../types';

export class DOMEventPlugin implements AnalyticsPlugin {
  track(event: FunnelEvent) {
    document.dispatchEvent(
      new CustomEvent('awsui:funnel-event', {
        detail: event,
      })
    );
  }
}
