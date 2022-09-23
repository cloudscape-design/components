// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DatePickerI18n {
  nextMonthAriaLabel: string;
  'openCalendarAriaLabel:empty': string;
  'openCalendarAriaLabel:selected': ({ selectedDate }: { selectedDate: string }) => string;
  previousMonthAriaLabel: string;
  todayAriaLabel: string;
}
