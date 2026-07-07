// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* istanbul ignore file */
/* eslint-disable require-await, @typescript-eslint/no-unused-vars */

import { AlertProps } from '../../alert/interfaces';
import { FlashbarProps } from '../../flashbar/interfaces';
import { FeatureNotificationsPersistenceConfig } from '../plugins/widget/interfaces';

interface PersistenceFunction {
  persistFlashbarDismiss?: (persistenceConfig: FlashbarProps.PersistenceConfig) => Promise<void>;
  retrieveFlashbarDismiss?: (persistenceConfig: FlashbarProps.PersistenceConfig) => Promise<boolean>;
  persistAlertDismiss?: (persistenceConfig: AlertProps.PersistenceConfig) => Promise<void>;
  retrieveAlertDismiss?: (persistenceConfig: AlertProps.PersistenceConfig) => Promise<boolean>;
  persistFeatureNotifications?: (
    persistenceConfig: FeatureNotificationsPersistenceConfig,
    value: Record<string, string>
  ) => Promise<void>;
  retrieveFeatureNotifications?: (
    persistenceConfig: FeatureNotificationsPersistenceConfig
  ) => Promise<Record<string, string>>;
}

export function setPersistenceFunctionsForTesting(functions: PersistenceFunction) {
  if (functions.persistFlashbarDismiss) {
    persistFlashbarDismiss = functions.persistFlashbarDismiss;
  }
  if (functions.retrieveFlashbarDismiss) {
    retrieveFlashbarDismiss = functions.retrieveFlashbarDismiss;
  }
  if (functions.persistAlertDismiss) {
    persistAlertDismiss = functions.persistAlertDismiss;
  }
  if (functions.retrieveAlertDismiss) {
    retrieveAlertDismiss = functions.retrieveAlertDismiss;
  }
  if (functions.persistFeatureNotifications) {
    persistFeatureNotifications = functions.persistFeatureNotifications;
  }
  if (functions.retrieveFeatureNotifications) {
    retrieveFeatureNotifications = functions.retrieveFeatureNotifications;
  }
}

export let persistFlashbarDismiss = async function (persistenceConfig: FlashbarProps.PersistenceConfig): Promise<void> {
  return Promise.resolve();
};

export let retrieveFlashbarDismiss = async function (
  persistenceConfig: FlashbarProps.PersistenceConfig
): Promise<boolean> {
  return Promise.resolve(false);
};

export let persistAlertDismiss = async function (persistenceConfig: AlertProps.PersistenceConfig): Promise<void> {
  return Promise.resolve();
};

export let retrieveAlertDismiss = async function (persistenceConfig: AlertProps.PersistenceConfig): Promise<boolean> {
  return Promise.resolve(false);
};

export let persistFeatureNotifications = async function (
  persistenceConfig: FeatureNotificationsPersistenceConfig,

  value: Record<string, string>
): Promise<void> {
  return Promise.resolve();
};

export let retrieveFeatureNotifications = async function (
  persistenceConfig: FeatureNotificationsPersistenceConfig
): Promise<Record<string, string>> {
  return Promise.resolve({});
};
