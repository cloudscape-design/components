// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AlertProps } from '../../alert/interfaces';
import { FlashbarProps } from '../../flashbar/interfaces';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function persistFlashbarDismiss(persistenceConfig: FlashbarProps.PersistenceConfig): Promise<void> {
  // No-op
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function retrieveFlashbarDismiss(persistenceConfig: FlashbarProps.PersistenceConfig): Promise<void> {
  // No-op
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function persistAlertDismiss(persistenceConfig: AlertProps.PersistenceConfig): Promise<void> {
  // No-op
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, require-await
export async function retrieveAlertDismiss(persistenceConfig: AlertProps.PersistenceConfig): Promise<boolean> {
  return false;
}
