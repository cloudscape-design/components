// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IComponentMetrics } from '../analytics/interfaces';

export const stub: IComponentMetrics = {
  componentMounted(): string {
    return '';
  },
  componentUpdated(): void {},
};

export let value: IComponentMetrics = stub;

export function set(provider: IComponentMetrics) {
  value = provider;
}
