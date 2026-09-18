// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getExternalProps } from '../../utils/external-props';
import { reportRuntimeApiWarning } from '../helpers/metrics';
import { getAppLayoutInitialMessages, getAppLayoutMessageHandler, pushInitialMessage, setInitialMessage } from './core';
import {
  AppLayoutUpdateMessage,
  BreadcrumbsConsumerPayload,
  BreadcrumbsConsumerRegistration,
  DrawerPayload,
  FeatureNotificationsPayload,
  FeatureNotificationsPayloadPublic,
  RegisterBreadcrumbsExternalConsumerMessage,
  RegisterDrawerMessage,
  RegisterFeatureNotificationsMessage,
  UnregisterBreadcrumbsExternalConsumerMessage,
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
  const initialMessages = getAppLayoutInitialMessages();
  if (initialMessages.some(message => message.type === 'registerBreadcrumbsExternalConsumer')) {
    reportRuntimeApiWarning(
      'breadcrumbs',
      'A breadcrumbs consumer is already registered. This registration is ignored.'
    );
    return { registered: false, unregister: () => {} };
  }

  let active = true;
  const message: RegisterBreadcrumbsExternalConsumerMessage = {
    type: 'registerBreadcrumbsExternalConsumer',
    payload,
  };
  pushInitialMessage(message);
  payload.onBreadcrumbsChange(null);
  getAppLayoutMessageHandler()?.(message as WidgetMessage<unknown>);

  return {
    registered: true,
    unregister: () => {
      if (!active) {
        return;
      }
      active = false;
      const initialMessages = getAppLayoutInitialMessages();
      setInitialMessage(
        initialMessages.filter(initialMessage => initialMessage.type !== 'registerBreadcrumbsExternalConsumer')
      );
      const unregisterMessage: UnregisterBreadcrumbsExternalConsumerMessage = {
        type: 'unregisterBreadcrumbsExternalConsumer',
        payload: undefined,
      };
      getAppLayoutMessageHandler()?.(unregisterMessage as WidgetMessage<unknown>);
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
      if (
        (initialMessage.type === 'registerLeftDrawer' || initialMessage.type === 'registerBottomDrawer') &&
        initialMessage.payload.id === message.payload.id
      ) {
        initialMessage.payload = { ...initialMessage.payload, ...message.payload };
      }
    });
  }

  if (message.type === 'clearFeatureNotifications') {
    setInitialMessage(initialMessages.filter(initialMessage => initialMessage.type !== 'registerFeatureNotifications'));
  }
  getAppLayoutMessageHandler()?.(message as WidgetMessage<unknown>);
}
