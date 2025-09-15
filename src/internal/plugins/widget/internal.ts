// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { reportRuntimeApiWarning } from '../helpers/metrics';
import { Defer } from '../helpers/utils';
import { AppLayoutMessage, AppLayoutUpdateMessage, DrawerPayload, RegisterDrawerMessage } from './interfaces';

const storageKeyMessageHandler = Symbol.for('awsui-widget-api-message-handler');
const storageKeyInitialMessages = Symbol.for('awsui-widget-api-initial-messages');
const appLayoutReadyDefer = new Defer();

interface WindowWithApi extends Window {
  [storageKeyMessageHandler]: AppLayoutHandler | undefined;
  [storageKeyInitialMessages]: Array<RegisterDrawerMessage> | undefined;
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
  appLayoutReadyDefer?.resolve();
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
  return appLayoutReadyDefer.promise;
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
