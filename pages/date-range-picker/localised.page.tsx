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

export default function DatePickerScenario() {
  const { props, settings, setSettings } = useDateRangePickerSettings({ hasValue: false });
  return (
    <SimplePage
      title="Date range picker: localized"
      settings={<Settings settings={settings} setSettings={setSettings} />}
      i18n={{ messages: [messages], locale: 'de-DE' }}
    >
      <FormField label="Date Range Picker field">
        <DateRangePicker
          {...props}
          locale="de"
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
