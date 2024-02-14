// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CalendarProps } from './interfaces';
import { useInternalI18n } from '../i18n/context.js';
import { getDateLabel, renderMonthAndYear } from './utils/intl';

export default function useCalendarLabels({
  granularity,
  locale,
  i18nStrings,
  previousMonthAriaLabel,
  nextMonthAriaLabel,
  todayAriaLabel,
}: {
  granularity: CalendarProps.Granularity;
  locale: string;
  i18nStrings?: CalendarProps.I18nStrings;
  previousMonthAriaLabel?: string;
  nextMonthAriaLabel?: string;
  previousYearAriaLabel?: string;
  todayAriaLabel?: string;
}) {
  const i18n = useInternalI18n('calendar');

  const isMonthPicker = granularity === 'month';
  const previousButtonLabel = isMonthPicker
    ? i18n('previousYearAriaLabel', i18nStrings?.previousYearAriaLabel)
    : i18n('previousMonthAriaLabel', i18nStrings?.previousMonthAriaLabel ?? previousMonthAriaLabel);

  const nextButtonLabel = isMonthPicker
    ? i18n('nextYearAriaLabel', i18nStrings?.nextYearAriaLabel)
    : i18n('nextMonthAriaLabel', i18nStrings?.nextMonthAriaLabel ?? nextMonthAriaLabel);

  const currentDateLabel = isMonthPicker
    ? i18n('currentMonthAriaLabel', i18nStrings?.currentMonthAriaLabel)
    : i18n('todayAriaLabel', i18nStrings?.todayAriaLabel ?? todayAriaLabel);

  const renderDate = (date: Date) =>
    isMonthPicker ? date.toLocaleString(locale, { month: 'short' }) : date.getDate().toString();

  const renderDateAnnouncement = (date: Date, isCurrentDate: boolean) => {
    const formattedDate = isMonthPicker ? renderMonthAndYear(locale, date) : getDateLabel(locale, date, 'short');
    if (isCurrentDate && currentDateLabel) {
      return formattedDate + '. ' + currentDateLabel;
    }
    return formattedDate;
  };

  const renderHeaderText = (date: Date) =>
    isMonthPicker ? date.getFullYear().toString() : renderMonthAndYear(locale, date);

  return {
    previousButtonLabel,
    nextButtonLabel,
    renderDate,
    renderDateAnnouncement,
    renderHeaderText,
  };
}
