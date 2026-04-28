// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IPerformanceMetrics } from '../analytics/interfaces';

export const stub: IPerformanceMetrics = {
  tableInteraction(): void {},
  taskCompletionData(): void {},
  modalPerformanceData(): void {},
};

export let value: IPerformanceMetrics = stub;

export function set(provider: IPerformanceMetrics) {
  value = provider;
}
