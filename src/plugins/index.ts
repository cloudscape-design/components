// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
export * from '../internal/plugins/widget/interfaces';
export { awsuiPlugins } from '../internal/plugins/api';
export { definePlugin } from '../internal/plugin-slots';
export type { PluginMap } from '../internal/plugin-slots';
export type { IFunnelMetrics, IPerformanceMetrics, IComponentMetrics } from '../internal/analytics/interfaces';
import {
  clearFeatureNotifications,
  registerFeatureNotificationsPublic,
  showFeaturePromptIfPossible,
} from '../internal/plugins/widget/index';

export const featureNotifications = {
  registerFeatureNotifications: registerFeatureNotificationsPublic,
  showFeaturePromptIfPossible,
  clearFeatureNotifications,
};
