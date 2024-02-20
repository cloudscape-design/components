// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CalendarProps } from '../calendar/interfaces';
import { getDateLabel, renderMonthAndYear } from '../calendar/utils/intl';

export function isValidFullDate({ date, granularity }: { date: string; granularity: CalendarProps.Granularity }) {
  const regex = granularity === 'month' ? /^\d{4}-\d{2}(-\d{2})?$/ : /^\d{4}-\d{2}-\d{2}$/;
  return !!date.match(regex);
}

export function getSelectedDateLabel({
  date,
  granularity,
  locale,
}: {
  date: Date;
  granularity: CalendarProps.Granularity;
  locale: string;
}) {
  return granularity === 'month' ? renderMonthAndYear(locale, date) : getDateLabel(locale, date);
}
