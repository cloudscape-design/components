// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getExternalProps } from '../../utils/external-props';
import { getAppLayoutInitialMessages, getAppLayoutMessageHandler, pushInitialMessage, setInitialMessage } from './core';
import {
  AppLayoutUpdateMessage,
  BreadcrumbsConsumerPayload,
  DeregisterBreadcrumbsConsumerMessage,
  DrawerPayload,
  FeatureNotificationsPayload,
  FeatureNotificationsPayloadPublic,
  RegisterBreadcrumbsConsumerMessage,
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
 * Registers a consumer that draws App Layout's breadcrumbs somewhere else -- for example a global
 * navigation header owning the page header in its own React root and bundle.
 *
 * The callback is invoked with the current breadcrumbs as soon as App Layout picks the registration
 * up (or null if there are none), then on every change. App Layout stops drawing its own copy while
 * a consumer is registered, so exactly one trail is present at a time.
 *
 * Returns a function that deregisters the consumer, so it can be used directly as an effect cleanup.
 */
export function registerBreadcrumbsConsumer(payload: BreadcrumbsConsumerPayload) {
  const message: RegisterBreadcrumbsConsumerMessage = { type: 'registerBreadcrumbsConsumer', payload };
  pushInitialMessage(message);
  getAppLayoutMessageHandler()?.(message as WidgetMessage<unknown>);
  return () => deregisterBreadcrumbsConsumer(payload.id);
}

/**
 * Removes a previously registered breadcrumbs consumer, returning rendering to App Layout.
 */
export function deregisterBreadcrumbsConsumer(id: string) {
  const initialMessages = getAppLayoutInitialMessages();
  setInitialMessage(
    initialMessages.filter(
      initialMessage => !(initialMessage.type === 'registerBreadcrumbsConsumer' && initialMessage.payload.id === id)
    )
  );
  const message: DeregisterBreadcrumbsConsumerMessage = { type: 'deregisterBreadcrumbsConsumer', payload: { id } };
  getAppLayoutMessageHandler()?.(message as WidgetMessage<unknown>);
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
