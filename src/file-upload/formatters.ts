// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { formatDateTime } from '../internal/utils/date-time';

export function defaultFileSizeFormat(size: number): string {
  const KB = 1000;
  const MB = 1000 ** 2;
  return size < MB ? `${(size / KB).toFixed(2)} KB` : `${(size / MB).toFixed(2)} MB`;
}

export function defaultLastModifiedFormat(date: Date): string {
  return formatDateTime(date);
}
