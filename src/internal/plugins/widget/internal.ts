// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { reportRuntimeApiWarning } from '../helpers/metrics';
import { AppLayoutMessage, AppLayoutUpdateMessage, DrawerPayload, RegisterDrawerMessage } from './interfaces';

const storageKeyMessageHandler = Symbol.for('awsui-widget-api-message-handler');
const storageKeyInitialMessages = Symbol.for('awsui-widget-api-initial-messages');
const storageKeyReadyDeferCallbacks = Symbol.for('awsui-widget-api-ready-defer');

interface WindowWithApi extends Window {
  [storageKeyMessageHandler]: AppLayoutHandler | undefined;
  [storageKeyInitialMessages]: Array<RegisterDrawerMessage> | undefined;
  [storageKeyReadyDeferCallbacks]: Array<(value?: unknown) => void> | undefined;
}

type AppLayoutHandler = (event: AppLayoutMessage) => void;

function getWindow() {
  return window as Window as WindowWithApi;
}

function getAppLayoutMessageHandler() {
  const win = getWindow();
  return win[storageKeyMessageHandler];
}

export function getAppLayoutInitialState() {
  return getWindow()[storageKeyInitialMessages];
}

export function registerAppLayoutHandler(handler: AppLayoutHandler) {
  const win = getWindow();
  if (win[storageKeyMessageHandler]) {
    reportRuntimeApiWarning('AppLayoutWidget', 'Double registration attempt, the old handler will be overridden');
  }
  win[storageKeyMessageHandler] = handler;
  win[storageKeyReadyDeferCallbacks]?.forEach(fn => fn());
  win[storageKeyReadyDeferCallbacks] = [];
  return () => {
    win[storageKeyMessageHandler] = undefined;
  };
}

export function clearInitialMessages() {
  getWindow()[storageKeyInitialMessages] = undefined;
}

/**
 * Returns whether there is an app layout present on this page or not
 */
export function isAppLayoutReady() {
  return !!getAppLayoutMessageHandler();
}

/**
 * Returns a promise that resolves once the app layout has loaded
 */
export function whenAppLayoutReady() {
  if (isAppLayoutReady()) {
    return Promise.resolve();
  }
  const win = getWindow();
  win[storageKeyReadyDeferCallbacks] = win[storageKeyReadyDeferCallbacks] ?? [];
  return new Promise(resolve => win[storageKeyReadyDeferCallbacks]?.push(resolve));
}

/**
 * Registers a new runtime drawer to app layout
 * @param drawer
 */
export function registerLeftDrawer(drawer: DrawerPayload) {
  const win = getWindow();
  const message: RegisterDrawerMessage = { type: 'registerLeftDrawer', payload: drawer };
  win[storageKeyInitialMessages] = win[storageKeyInitialMessages] ?? [];
  win[storageKeyInitialMessages].push(message);
  getAppLayoutMessageHandler()?.(message);
}

/**
 * Interact with already registered app layout drawers
 * @param message
 */
export function updateDrawer(message: AppLayoutUpdateMessage) {
  getAppLayoutMessageHandler()?.(message);
}
