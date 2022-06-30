// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export const isoToDisplay = (value: string) => value.replace(/-/g, '/');
export const displayToIso = (value: string) => value.replace(/\//g, '-');
export const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

// we cannot use new Date(string) constructor, because it produces GMT time that may have different date than the local
export const parseDate = (value: string): Date => {
  const [year, month, day] = value.split('-');
  return new Date(Number(year), (Number(month) || 1) - 1, Number(day) || 1);
};
