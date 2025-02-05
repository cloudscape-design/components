// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { Box, Checkbox, DateRangePicker, DateRangePickerProps, FormField, Link } from '~components';

import AppContext from '../app/app-context';
import {
  applyDisabledReason,
  checkIfDisabled,
  DateRangePickerDemoContext,
  dateRangePickerDemoDefaults,
  DisabledDate,
  relativeOptions,
} from './common';
import { makeIsDateValidFunction, makeIsMonthValidFunction } from './is-valid-range';

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
  relativeModeTitle: 'Relativer Zeitraum',
  absoluteModeTitle: 'Absoluter Zeitraum',
  relativeRangeSelectionHeading: 'Einen Zeitraum wählen',
  cancelButtonLabel: 'Abbrechen',
  clearButtonLabel: 'Löschen und schließen',
  applyButtonLabel: 'Anwenden',
  customRelativeRangeOptionLabel: 'Benutzerdefinierter Zeitraum',
  customRelativeRangeOptionDescription: 'Einen benutzerdefinierten Zeitraum in der Vergangenheit angeben',
  customRelativeRangeUnitLabel: 'Zeiteinheit',
  customRelativeRangeDurationLabel: 'Dauer',
  customRelativeRangeDurationPlaceholder: 'Zeitdauer angeben',
  startMonthLabel: 'Startmonat',
  startDateLabel: 'Startdatum',
  startTimeLabel: 'Startzeit',
  endMonthLabel: 'Endmonat',
  endDateLabel: 'Enddatum',
  endTimeLabel: 'Endzeit',
  dateTimeConstraintText: 'Zeitraum muss zwischen 6 und 30 Tagen betragen. Benutzen Sie das 24-Stunden-Format.',
  monthConstraintText: 'Für den Monat verwenden Sie JJJJ/MM.',
  dateConstraintText: 'Für das Datum verwenden Sie JJJJ/MM/TT.',
  errorIconAriaLabel: 'Fehler',
  renderSelectedAbsoluteRangeAriaLive: (startDate, endDate) => `Zeitraum ausgewählt von ${startDate} bis ${endDate}`,
  todayAriaLabel: 'Heute',
  nextMonthAriaLabel: 'Nächster Monat',
  previousMonthAriaLabel: 'Vorheriger Monat',
  previousYearAriaLabel: 'Letztes Jahr',
  nextYearAriaLabel: 'Nächstes Jahr',
  currentMonthAriaLabel: 'Dieser Monat',
  formatRelativeRange: formatRelativeRange,
  formatUnit: (unit, value) => localisedUnits[unit][value === 1 ? 0 : 1],
  relativeRangeSelectionMonthlyDescription:
    '"Jede Option repräsentiert den gesamten Monat, gerechnet vom ersten bis zum letzten Tag.',
};

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
  const { urlParams, setUrlParams } = useContext(AppContext as DateRangePickerDemoContext);
  const [value, setValue] = useState<DateRangePickerProps['value']>(null);

  const monthOnly = urlParams.monthOnly ?? dateRangePickerDemoDefaults.monthOnly;
  const dateOnly = urlParams.dateOnly ?? dateRangePickerDemoDefaults.dateOnly;
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
      <Checkbox
        disabled={monthOnly}
        checked={dateOnly}
        onChange={({ detail }) => setUrlParams({ dateOnly: detail.checked })}
      >
        Date-only
      </Checkbox>
      <Checkbox checked={monthOnly} onChange={({ detail }) => setUrlParams({ monthOnly: detail.checked })}>
        Month-only
      </Checkbox>
      <br />
      <FormField label="Date Range Picker field">
        <DateRangePicker
          value={value}
          locale={'de-DE'}
          i18nStrings={i18nStrings}
          placeholder={'Nach einem Zeitraum filtern'}
          onChange={e => setValue(e.detail.value)}
          relativeOptions={relativeOptions}
          isValidRange={value =>
            monthOnly
              ? makeIsMonthValidFunction(localizedErrors)(value)
              : makeIsDateValidFunction(localizedErrors)(value)
          }
          granularity={monthOnly ? 'month' : 'day'}
          dateOnly={dateOnly}
          isDateEnabled={date => checkIfDisabled(date, disabledDates, monthOnly)}
          dateDisabledReason={date => applyDisabledReason(withDisabledReason, date, disabledDates, monthOnly)}
        />
      </FormField>
      <br />
      <br />
      <Link id="focusable-element-after-date-picker">Focusable element after the date range picker</Link>
    </Box>
  );
}
