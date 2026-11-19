// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { formatDate } from './format-date';
import { formatTime } from './format-time';

export function formatDateTime(date: Date) {
  return formatDate(date) + 'T' + formatTime(date);
}
