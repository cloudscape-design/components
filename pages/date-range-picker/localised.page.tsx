// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { Box, Checkbox, DateRangePicker, DateRangePickerProps, Link } from '~components';

import AppContext from '../app/app-context';
import {
  applyDisabledReason,
  checkIfDisabled,
  DateRangePickerDemoContext,
  dateRangePickerDemoDefaults,
  DisabledDate,
  relativeOptions,
} from './common';
import { makeIsValidFunction } from './is-valid-range';

const localisedUnits = {
  second: ['Sekunde', 'Sekunden'],
  minute: ['Minute', 'Minuten'],
  hour: ['Stunde', 'Stunden'],
  day: ['Tag', 'Tage'],
  week: ['Woche', 'Wochen'],
  month: ['Monat', 'Monate'],
  year: ['Jahr', 'Jahre'],
} as const;

function formatRelativeRange(range: DateRangePickerProps.RelativeValue): string {
  const unit = localisedUnits[range.unit][range.amount === 1 ? 0 : 1];
  return `Letzte ${range.amount} ${unit}`;
}

const i18nStrings: DateRangePickerProps['i18nStrings'] = {
  todayAriaLabel: 'Heute',
  nextMonthAriaLabel: 'Nächster Monat',
  previousMonthAriaLabel: 'Vorheriger Monat',
  customRelativeRangeDurationLabel: 'Dauer',
  customRelativeRangeDurationPlaceholder: 'Zeitdauer angeben',
  customRelativeRangeOptionLabel: 'Benutzerdefinierter Zeitraum',
  customRelativeRangeOptionDescription: 'Einen benutzerdefinierten Zeitraum in der Vergangenheit angeben',
  customRelativeRangeUnitLabel: 'Zeiteinheit',
  formatRelativeRange: formatRelativeRange,
  formatUnit: (unit, value) => localisedUnits[unit][value === 1 ? 0 : 1],
  dateTimeConstraintText: 'Zeitraum muss zwischen 6 und 30 Tagen betragen. Benutzen Sie das 24-Stunden-Format.',
  relativeModeTitle: 'Relativer Zeitraum',
  absoluteModeTitle: 'Absoluter Zeitraum',
  relativeRangeSelectionHeading: 'Einen Zeitraum wählen',
  startDateLabel: 'Startdatum',
  endDateLabel: 'Enddatum',
  startTimeLabel: 'Startzeit',
  endTimeLabel: 'Endzeit',
  clearButtonLabel: 'Löschen und schließen',
  cancelButtonLabel: 'Abbrechen',
  applyButtonLabel: 'Anwenden',
  renderSelectedAbsoluteRangeAriaLive: (startDate, endDate) => `Zeitraum ausgewählt von ${startDate} bis ${endDate}`,
};

const isValid = makeIsValidFunction({
  durationBetweenOneAndTwenty: 'Die Zeitdauer muss zwischen 1 und 20 liegen.',
  durationMissing: 'Sie müssen eine Zeitdauer angeben.',
  minimumStartDate: 'Der Zeitraum darf nicht vor 2018 beginnen.',
  noValueSelected: 'Sie müssen einen Zeitraum auswählen.',
  startDateMissing: 'Sie müssen ein Startdatum angeben.',
  endDateMissing: 'Sie müssen ein Enddatum angeben.',
});

export default function DatePickerScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DateRangePickerDemoContext);
  const [value, setValue] = useState<DateRangePickerProps['value']>(null);

  const monthOnly = urlParams.monthOnly ?? dateRangePickerDemoDefaults.monthOnly;
  const disabledDates =
    (urlParams.disabledDates as DisabledDate) ?? (dateRangePickerDemoDefaults.disabledDates as DisabledDate);
  const withDisabledReason = urlParams.withDisabledReason ?? dateRangePickerDemoDefaults.withDisabledReason;

  return (
    <Box padding="s">
      <h1>Date range picker simple version - localised</h1>
      <Link id="focus-dismiss-helper">Focusable element before the date range picker</Link>
      <br />
      <label>
        Disabled dates{' '}
        <select
          value={disabledDates}
          onChange={event =>
            setUrlParams({
              disabledDates: event.currentTarget.value as DisabledDate,
            })
          }
        >
          <option value="none">None (Default)</option>
          <option value="all">All</option>
          <option value="only-even">Only even</option>
          <option value="middle-of-page">Middle of {monthOnly ? 'year' : 'month'}</option>
          <option value="end-of-page">End of {monthOnly ? 'year' : 'month'}</option>
          <option value="start-of-page">Start of {monthOnly ? 'year' : 'month'}</option>
          <option value="overlapping-pages">Overlapping {monthOnly ? 'years' : 'months'}</option>
        </select>
      </label>
      <Checkbox
        checked={withDisabledReason}
        onChange={({ detail }) => setUrlParams({ withDisabledReason: detail.checked })}
      >
        Disabled reasons
      </Checkbox>
      <br />
      <DateRangePicker
        value={value}
        locale={'de-DE'}
        i18nStrings={i18nStrings}
        placeholder={'Nach einem Zeitraum filtern'}
        onChange={e => setValue(e.detail.value)}
        relativeOptions={relativeOptions}
        isValidRange={isValid}
        isDateEnabled={date => checkIfDisabled(date, disabledDates, monthOnly)}
        dateDisabledReason={date => applyDisabledReason(withDisabledReason, date, disabledDates, monthOnly)}
      />
      <br />
      <br />
      <Link id="focusable-element-after-date-picker">Focusable element after the date range picker</Link>
    </Box>
  );
}
