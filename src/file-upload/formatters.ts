// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { formatDateTime } from '../internal/utils/date-time';
import { FileUploadProps } from './interfaces';

export function formatFileLastModified(date: Date, i18nStrings: FileUploadProps.I18nStrings): string {
  return i18nStrings.formatFileTimestamp?.(date) ?? formatDateTime(date);
}

export function formatFileSize(size: number, i18nStrings: FileUploadProps.I18nStrings): string {
  return i18nStrings?.formatFileSize?.(size) ?? defaultFormat(size);
}

function defaultFormat(size: number): string {
  const KB = 1000;
  const MB = 1000 ** 2;
  return size < MB ? `${(size / KB).toFixed(2)} KB` : `${(size / MB).toFixed(2)} MB`;
}
