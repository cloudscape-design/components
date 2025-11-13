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

export let persistFlashbarDismiss = async function (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  persistenceConfig: FlashbarProps.PersistenceConfig
): Promise<void> {
  // No-op
};

export let retrieveFlashbarDismiss = async function (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  persistenceConfig: FlashbarProps.PersistenceConfig
): Promise<boolean> {
  const result = await new Promise<boolean>(resolve => resolve(false));
  return result;
};

export let persistAlertDismiss = async function (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  persistenceConfig: AlertProps.PersistenceConfig
): Promise<void> {
  // No-op
};

export let retrieveAlertDismiss = async function (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  persistenceConfig: AlertProps.PersistenceConfig
): Promise<boolean> {
  const result = await new Promise<boolean>(resolve => resolve(false));
  return result;
};
