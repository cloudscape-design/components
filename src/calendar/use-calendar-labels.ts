// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CalendarProps } from './interfaces';
import { useInternalI18n } from '../i18n/context.js';
import { getDateLabel, renderMonthAndYear } from './utils/intl';

export default function useCalendarLabels({
  locale,
  i18nStrings,
  previousMonthAriaLabel,
  nextMonthAriaLabel,
  todayAriaLabel,
}: {
  locale: string;
  i18nStrings?: CalendarProps.I18nStrings;
  previousMonthAriaLabel?: string;
  nextMonthAriaLabel?: string;
  previousYearAriaLabel?: string;
  todayAriaLabel?: string;
}) {
  const i18n = useInternalI18n('calendar');

  const previousButtonLabel = i18n(
    'previousMonthAriaLabel',
    i18nStrings?.previousMonthAriaLabel ?? previousMonthAriaLabel
  );

  const nextButtonLabel = i18n('nextMonthAriaLabel', i18nStrings?.nextMonthAriaLabel ?? nextMonthAriaLabel);

  const currentDateLabel = i18n('todayAriaLabel', i18nStrings?.todayAriaLabel ?? todayAriaLabel);

  const renderDate = (date: Date) => date.getDate().toString();

  const renderDateAnnouncement = (date: Date, isCurrentDate: boolean) => {
    const formattedDate = getDateLabel(locale, date, 'short');
    if (isCurrentDate && currentDateLabel) {
      return formattedDate + '. ' + currentDateLabel;
    }
    return formattedDate;
  };

  const renderHeaderText = (date: Date) => renderMonthAndYear(locale, date);

  return {
    previousButtonLabel,
    nextButtonLabel,
    renderDate,
    renderDateAnnouncement,
    renderHeaderText,
  };
}
