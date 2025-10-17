// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getAppLayoutMessageHandler, pushInitialMessage } from './core';
import { AppLayoutUpdateMessage, DrawerPayload, RegisterDrawerMessage } from './interfaces';

/**
 * Registers a new ai runtime drawer to app layout
 * @param drawer
 */
export function registerLeftDrawer(drawer: DrawerPayload) {
  const message: RegisterDrawerMessage = { type: 'registerLeftDrawer', payload: drawer };
  pushInitialMessage(message);
  getAppLayoutMessageHandler()?.(message);
}

/**
 * Registers a new bottom runtime drawer to app layout
 * @param drawer
 */
export function registerBottomDrawer(drawer: DrawerPayload) {
  const message: RegisterDrawerMessage = { type: 'registerBottomDrawer', payload: { ...drawer, position: 'bottom' } };
  pushInitialMessage(message);
  getAppLayoutMessageHandler()?.(message);
}

/**
 * Interact with already registered app layout drawers
 * @param message
 */
export function updateDrawer(message: AppLayoutUpdateMessage) {
  getAppLayoutMessageHandler()?.(message);
}
