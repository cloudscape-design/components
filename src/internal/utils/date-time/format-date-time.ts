// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { formatDate } from './format-date.js';
import { formatTime } from './format-time.js';

export function formatDateTime(date: Date) {
  return formatDate(date) + 'T' + formatTime(date);
}
