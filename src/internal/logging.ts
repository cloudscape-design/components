// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { isDevelopment } from './is-development';

const messageCache: Record<string, true | undefined> = {};

export function warnOnce(component: string, message: string): void {
  if (isDevelopment) {
    const warning = `[AwsUi] [${component}] ${message}`;
    if (!messageCache[warning]) {
      messageCache[warning] = true;
      console.warn(warning);
    }
  }
}
