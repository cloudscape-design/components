// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AnalyticsPlugin, FunnelEvent } from '../types';

export class FunnelEventDispatcher {
  private plugins: AnalyticsPlugin[] = [];

  dispatch(event: FunnelEvent) {
    this.plugins.forEach(plugin => plugin.track(event));
  }

  addPlugin(plugin: AnalyticsPlugin) {
    this.plugins.push(plugin);
  }
}
