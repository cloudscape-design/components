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

// Identifies the live registration so a superseded one's cleanup can be ignored.
let currentConsumerToken: object | null = null;

/**
 * Registers the surface that draws global breadcrumbs outside App Layout. The callback receives the
 * current trail on registration (or null), then on every change, and App Layout stops drawing its own
 * copy meanwhile. Drawing is exclusive, so registering replaces any active consumer.
 *
 * Returns the unsubscribe function -- the only way to deregister, usable directly as an effect
 * cleanup. It is inert once superseded.
 */
export function registerBreadcrumbsConsumer(payload: BreadcrumbsConsumerPayload) {
  const token = {};
  currentConsumerToken = token;
  const message: RegisterBreadcrumbsConsumerMessage = { type: 'registerBreadcrumbsConsumer', payload };
  // Single consumer, so a queued registration is replaced rather than stacked.
  setInitialMessage(getAppLayoutInitialMessages().filter(m => m.type !== 'registerBreadcrumbsConsumer'));
  pushInitialMessage(message);
  getAppLayoutMessageHandler()?.(message as WidgetMessage<unknown>);
  return () => {
    if (currentConsumerToken !== token) {
      return;
    }
    currentConsumerToken = null;
    deregisterBreadcrumbsConsumer();
  };
}

function deregisterBreadcrumbsConsumer() {
  setInitialMessage(
    getAppLayoutInitialMessages().filter(initialMessage => initialMessage.type !== 'registerBreadcrumbsConsumer')
  );
  const message: DeregisterBreadcrumbsConsumerMessage = { type: 'deregisterBreadcrumbsConsumer' };
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
      // The breadcrumbs consumer is not addressed by id and must not be matched here.
      if (initialMessage.type === 'registerBreadcrumbsConsumer') {
        return;
      }
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
