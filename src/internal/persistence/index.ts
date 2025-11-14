// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* istanbul ignore file */

import { AlertProps } from '../../alert/interfaces';
import { FlashbarProps } from '../../flashbar/interfaces';

interface PersistenceFunction {
  persistFlashbarDismiss?: (persistenceConfig: FlashbarProps.PersistenceConfig) => Promise<void>;
  retrieveFlashbarDismiss?: (persistenceConfig: FlashbarProps.PersistenceConfig) => Promise<boolean>;
  persistAlertDismiss?: (persistenceConfig: AlertProps.PersistenceConfig) => Promise<void>;
  retrieveAlertDismiss?: (persistenceConfig: AlertProps.PersistenceConfig) => Promise<boolean>;
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
}

// eslint-disable-next-line require-await
export let persistFlashbarDismiss = async function (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  persistenceConfig: FlashbarProps.PersistenceConfig
): Promise<void> {
  return Promise.resolve();
};

// eslint-disable-next-line require-await
export let retrieveFlashbarDismiss = async function (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  persistenceConfig: FlashbarProps.PersistenceConfig
): Promise<boolean> {
  return Promise.resolve(false);
};

// eslint-disable-next-line require-await
export let persistAlertDismiss = async function (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  persistenceConfig: AlertProps.PersistenceConfig
): Promise<void> {
  return Promise.resolve();
};

// eslint-disable-next-line require-await
export let retrieveAlertDismiss = async function (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  persistenceConfig: AlertProps.PersistenceConfig
): Promise<boolean> {
  return Promise.resolve(false);
};
