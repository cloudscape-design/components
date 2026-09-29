// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
export * from '../internal/plugins/widget/interfaces';
import {
  clearFeatureNotifications,
  registerBreadcrumbsConsumer,
  registerFeatureNotificationsPublic,
  showFeaturePromptIfPossible,
} from '../internal/plugins/widget/index';

export { registerBreadcrumbsConsumer };

export const featureNotifications = {
  registerFeatureNotifications: registerFeatureNotificationsPublic,
  showFeaturePromptIfPossible,
  clearFeatureNotifications,
};
