// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const BYTES_BASE = 1024;
const BYTES_DECIMALS = 2;
const BYTES_SIZES = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export function formatDefault(value: string | undefined) {
  return value ? value : '-';
}

export function formatSize(bytes: number | undefined) {
  if (bytes === undefined) {
    return '-';
  }
  if (bytes === 0) {
    return `0 ${BYTES_SIZES[0]}`;
  }
  const i = Math.floor(Math.log(bytes) / Math.log(BYTES_BASE));
  return parseFloat((bytes / Math.pow(BYTES_BASE, i)).toFixed(BYTES_DECIMALS)) + ' ' + BYTES_SIZES[i];
}
