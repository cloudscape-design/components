// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { reportRuntimeApiWarning } from '../helpers/metrics';
import { InitialMessage, WidgetMessage } from './interfaces';

const storageKeyMessageHandler = Symbol.for('awsui-widget-api-message-handler');
const storageKeyInitialMessages = Symbol.for('awsui-widget-api-initial-messages');
const storageKeyReadyDeferCallbacks = Symbol.for('awsui-widget-api-ready-defer');

interface WindowWithApi extends Window {
  [storageKeyMessageHandler]: MessageHandler | undefined;
  [storageKeyInitialMessages]: Array<InitialMessage<unknown>> | undefined;
  [storageKeyReadyDeferCallbacks]: Array<(value?: unknown) => void> | undefined;
}

const oneTimeMessageTypes = ['emit-notification'];

type MessageHandler = (event: WidgetMessage<unknown>) => void;

function getWindow() {
  return window as Window as WindowWithApi;
}

export function getAppLayoutMessageHandler() {
  const win = getWindow();
  return win[storageKeyMessageHandler];
}

export function getAppLayoutInitialMessages<T>(): Array<InitialMessage<T>> {
  const initialMessages = getWindow()[storageKeyInitialMessages] ?? [];
  getWindow()[storageKeyInitialMessages] = initialMessages.filter(
    message => !oneTimeMessageTypes.includes(message.type)
  );
  return initialMessages as Array<InitialMessage<T>>;
}

export function pushInitialMessage<T>(message: InitialMessage<T>) {
  const win = getWindow();
  win[storageKeyInitialMessages] = win[storageKeyInitialMessages] ?? [];
  win[storageKeyInitialMessages].push(message as InitialMessage<unknown>);
}

export function registerAppLayoutHandler(handler: MessageHandler) {
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
