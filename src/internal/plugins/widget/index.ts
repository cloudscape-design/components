// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getExternalProps } from '../../utils/external-props';
import { getAppLayoutInitialMessages, getAppLayoutMessageHandler, pushInitialMessage } from './core';
import {
  AppLayoutUpdateMessage,
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
 * Interact with already registered app layout drawers
 * @param message
 */
export function updateDrawer<T = unknown>(message: AppLayoutUpdateMessage<T>) {
  if (message.type === 'updateDrawerConfig') {
    getAppLayoutInitialMessages().forEach(initialMessage => {
      if (initialMessage.payload.id === message.payload.id) {
        initialMessage.payload = { ...initialMessage.payload, ...message.payload };
      }
    });
  }
  getAppLayoutMessageHandler()?.(message as WidgetMessage<unknown>);
}
