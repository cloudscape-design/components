// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function joinDateTime(dateString: string, timeString: string) {
  return `${dateString}T${timeString}`;
}

export function splitDateTime(dateStr: string) {
  const [date = '', time = ''] = dateStr.split('T');
  return { date, time };
}
