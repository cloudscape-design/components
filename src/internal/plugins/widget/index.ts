// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getExternalProps } from '../../utils/external-props';
import { reportRuntimeApiWarning } from '../helpers/metrics';
import {
  getAppLayoutInitialMessages,
  getAppLayoutMessageHandler,
  getBreadcrumbsConsumer,
  pushInitialMessage,
  setBreadcrumbsConsumer,
  setInitialMessage,
} from './core';
import {
  AppLayoutUpdateMessage,
  BreadcrumbsConsumerPayload,
  BreadcrumbsConsumerRegistration,
  DrawerPayload,
  FeatureNotificationsPayload,
  FeatureNotificationsPayloadPublic,
  RegisterDrawerMessage,
  RegisterFeatureNotificationsMessage,
  WidgetMessage,
} from './interfaces';

/**
 * Registers a new left runtime drawer to app layout
 * @param drawer
 */
export function registerLeftDrawer(drawer: DrawerPayload) {
  const message: RegisterDrawerMessage = { type: 'registerLeftDrawer', payload: drawer };
  pushInitialMessage(message);
  getAppLayoutMessageHandler()?.(message as WidgetMessage<unknown>);
}

/**
 * Registers a new bottom runtime drawer to app layout
 * @param drawer
 */
export function registerBottomDrawer(drawer: DrawerPayload) {
  const message: RegisterDrawerMessage = { type: 'registerBottomDrawer', payload: { ...drawer, position: 'bottom' } };
  pushInitialMessage(message);
  getAppLayoutMessageHandler()?.(message as WidgetMessage<unknown>);
}

/**
 * Registers a new feature notifications runtime drawer to app layout
 * @param payload
 */
export function registerFeatureNotifications<T>(payload: FeatureNotificationsPayload<T>) {
  const message: RegisterFeatureNotificationsMessage<T> = {
    type: 'registerFeatureNotifications',
    payload,
  };
  pushInitialMessage(message);
  getAppLayoutMessageHandler()?.(message as WidgetMessage<unknown>);
}
export function registerFeatureNotificationsPublic<T>(payload: FeatureNotificationsPayloadPublic<T>) {
  registerFeatureNotifications(getExternalProps(payload));
}

export function showFeaturePromptIfPossible() {
  updateDrawer({ type: 'showFeaturePromptIfPossible' });
}

export function clearFeatureNotifications() {
  updateDrawer({ type: 'clearFeatureNotifications' });
}

/**
 * Registers the surface that renders breadcrumbs outside App Layout.
 */
export function registerBreadcrumbsConsumer(payload: BreadcrumbsConsumerPayload): BreadcrumbsConsumerRegistration {
  if (getBreadcrumbsConsumer()) {
    reportRuntimeApiWarning(
      'breadcrumbs',
      'A breadcrumbs consumer is already registered. This registration is ignored.'
    );
    return { registered: false, unregister: () => {} };
  }

  const consumer = { ...payload, token: {} };
  setBreadcrumbsConsumer(consumer);
  payload.onBreadcrumbsChange(null);

  return {
    registered: true,
    unregister: () => {
      if (getBreadcrumbsConsumer()?.token === consumer.token) {
        setBreadcrumbsConsumer(undefined);
      }
    },
  };
}

/**
 * Interact with already registered app layout drawers
 * @param message
 */
export function updateDrawer<T = unknown>(message: AppLayoutUpdateMessage<T>) {
  const initialMessages = getAppLayoutInitialMessages();
  if (message.type === 'updateDrawerConfig') {
    initialMessages.forEach(initialMessage => {
      if (initialMessage.payload.id === message.payload.id) {
        initialMessage.payload = { ...initialMessage.payload, ...message.payload };
      }
    });
  }

  if (message.type === 'clearFeatureNotifications') {
    setInitialMessage(initialMessages.filter(initialMessage => initialMessage.type !== 'registerFeatureNotifications'));
  }
  getAppLayoutMessageHandler()?.(message as WidgetMessage<unknown>);
}
