// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { reportRuntimeApiWarning } from '../helpers/metrics';
import { BreadcrumbsConsumerPayload, InitialMessage, WidgetMessage } from './interfaces';

const storageKeyMessageHandler = Symbol.for('awsui-widget-api-message-handler');
const storageKeyInitialMessages = Symbol.for('awsui-widget-api-initial-messages');
const storageKeyReadyDeferCallbacks = Symbol.for('awsui-widget-api-ready-defer');
const storageKeyBreadcrumbsConsumer = Symbol.for('awsui-widget-api-breadcrumbs-consumer');
const storageKeyBreadcrumbsConsumerListeners = Symbol.for('awsui-widget-api-breadcrumbs-consumer-listeners');

export interface BreadcrumbsConsumer extends BreadcrumbsConsumerPayload {
  token: object;
}

interface WindowWithApi extends Window {
  [storageKeyMessageHandler]: MessageHandler | undefined;
  [storageKeyInitialMessages]: Array<InitialMessage<unknown>> | undefined;
  [storageKeyReadyDeferCallbacks]: Array<(value?: unknown) => void> | undefined;
  [storageKeyBreadcrumbsConsumer]: BreadcrumbsConsumer | undefined;
  [storageKeyBreadcrumbsConsumerListeners]: Set<(consumer: BreadcrumbsConsumer | undefined) => void> | undefined;
}

const oneTimeMessageTypes = ['emit-notification'];

type MessageHandler = (event: WidgetMessage<unknown>) => void;

function getWindow() {
  return window as Window as WindowWithApi;
}

function getBreadcrumbsRegistryWindow(currentWindow = getWindow()): WindowWithApi {
  try {
    const parentWindow = currentWindow.parent as WindowWithApi;
    if (parentWindow === currentWindow) {
      return currentWindow;
    }
    // Accessing custom properties verifies that the parent is same-origin.
    void parentWindow[storageKeyBreadcrumbsConsumer];
    return getBreadcrumbsRegistryWindow(parentWindow);
  } catch {
    return currentWindow;
  }
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

export function setInitialMessage(message: Array<InitialMessage<unknown>>) {
  const win = getWindow();
  win[storageKeyInitialMessages] = message;
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

export function getBreadcrumbsConsumer() {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return getBreadcrumbsRegistryWindow()[storageKeyBreadcrumbsConsumer];
}

export function setBreadcrumbsConsumer(consumer: BreadcrumbsConsumer | undefined) {
  const win = getBreadcrumbsRegistryWindow();
  win[storageKeyBreadcrumbsConsumer] = consumer;
  win[storageKeyBreadcrumbsConsumerListeners]?.forEach(listener => listener(consumer));
}

export function subscribeBreadcrumbsConsumer(listener: (consumer: BreadcrumbsConsumer | undefined) => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }
  const win = getBreadcrumbsRegistryWindow();
  win[storageKeyBreadcrumbsConsumerListeners] ??= new Set();
  win[storageKeyBreadcrumbsConsumerListeners].add(listener);
  return () => {
    win[storageKeyBreadcrumbsConsumerListeners]?.delete(listener);
  };
}

export function clearBreadcrumbsConsumer() {
  setBreadcrumbsConsumer(undefined);
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
