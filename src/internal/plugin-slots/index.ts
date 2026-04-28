// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as analyticsComponent from './analytics-component';
import * as analyticsFunnel from './analytics-funnel';
import * as analyticsPerformance from './analytics-performance';

// Single source of truth. Adding a new plugin = adding one entry here + the slot module.
const slots = {
  'analytics-funnel': analyticsFunnel,
  'analytics-performance': analyticsPerformance,
  'analytics-component': analyticsComponent,
};

// Derived from the slots object.
export type PluginMap = { [K in keyof typeof slots]: (typeof slots)[K]['stub'] };

export function setPlugin<K extends keyof PluginMap>(name: K, provider: PluginMap[K]): void {
  slots[name].set(provider as any);
}

export function definePlugin<K extends keyof PluginMap>(name: K, provider: Partial<PluginMap[K]>): PluginMap[K] {
  return { ...slots[name].stub, ...provider } as PluginMap[K];
}
