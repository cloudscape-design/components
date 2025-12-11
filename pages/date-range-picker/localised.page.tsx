// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { DateRangePicker, FormField } from '~components';
import messages from '~components/i18n/messages/all.de';

import { SimplePage } from '../app/templates';
import { Settings, useDateRangePickerSettings } from './common';
import { makeIsDateValidFunction, makeIsMonthValidFunction } from './is-valid-range';

const localizedErrors = {
  durationBetweenOneAndTwenty: 'Die Zeitdauer muss zwischen 1 und 20 liegen.',
  durationMissing: 'Sie müssen eine Zeitdauer angeben.',
  minimumStartDate: 'Der Zeitraum darf nicht vor 2018 beginnen.',
  noValueSelected: 'Sie müssen einen Zeitraum auswählen.',
  notLongEnough: 'Der ausgewählte Datumsbereich ist zu klein. Wählen Sie einen Bereich von mindestens einem Monat.',
  startDateMissing: 'Sie müssen ein Startdatum angeben.',
  endDateMissing: 'Sie müssen ein Enddatum angeben.',
};

// Locale-specific placeholder formats
const localePlaceholders: Record<string, { date: string; time: string }> = {
  de: { date: 'JJJJ-MM-TT', time: 'hh:mm:ss' },
  en: { date: 'YYYY-MM-DD', time: 'hh:mm:ss' },
  es: { date: 'AAAA-MM-DD', time: 'hh:mm:ss' },
  fr: { date: 'AAAA-MM-JJ', time: 'hh:mm:ss' },
  it: { date: 'AAAA-MM-GG', time: 'hh:mm:ss' },
};

export default function DatePickerScenario() {
  const { props, settings, setSettings } = useDateRangePickerSettings({ hasValue: false });

  // Get locale from browser or default to German
  const currentLocale = navigator.language.split('-')[0] || 'de';
  const placeholders = localePlaceholders[currentLocale] || localePlaceholders.de;

  // Localized placeholders based on detected locale
  const localizedI18nStrings = {
    ...props.i18nStrings,
    startDatePlaceholder: placeholders.date,
    endDatePlaceholder: placeholders.date,
    startTimePlaceholder: placeholders.time,
    endTimePlaceholder: placeholders.time,
  };

  return (
    <SimplePage
      title="Date range picker: localized"
      settings={<Settings settings={settings} setSettings={setSettings} />}
      i18n={{ messages: [messages], locale: 'de-DE' }}
    >
      <FormField label="Date Range Picker field">
        <DateRangePicker
          {...props}
          locale={currentLocale}
          i18nStrings={localizedI18nStrings}
          placeholder="Nach einem Zeitraum filtern"
          isValidRange={value =>
            props.granularity === 'month'
              ? makeIsMonthValidFunction(localizedErrors)(value)
              : makeIsDateValidFunction(localizedErrors)(value)
          }
        />
      </FormField>
    </SimplePage>
  );
}
