// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import DateRangePickerPresets, { DateRangePickerPresetsProps } from '~components/date-range-picker-presets';
import FormField from '~components/form-field';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

const i18nStrings: NonNullable<DateRangePickerPresetsProps['i18nStrings']> = {
  formatRelativeRange: ({ amount, unit }) => `Last ${amount} ${amount === 1 ? unit : `${unit}s`}`,
  formatUnit: (unit, value) => (value === 1 ? unit : `${unit}s`),
  relativeRangeSelectionHeading: 'Choose a range',
  customRelativeRangeOptionLabel: 'Custom range',
  customRelativeRangeOptionDescription: 'Set a custom range in the past',
  customRelativeRangeDurationLabel: 'Duration',
  customRelativeRangeDurationPlaceholder: 'Enter duration',
  customRelativeRangeUnitLabel: 'Unit of time',
};

const relativeOptions: DateRangePickerPresetsProps['relativeOptions'] = [
  { key: 'last-5-minutes', amount: 5, unit: 'minute', type: 'relative' },
  { key: 'last-30-minutes', amount: 30, unit: 'minute', type: 'relative' },
  { key: 'last-1-hour', amount: 1, unit: 'hour', type: 'relative' },
  { key: 'last-6-hours', amount: 6, unit: 'hour', type: 'relative' },
  { key: 'last-24-hours', amount: 24, unit: 'hour', type: 'relative' },
];

export default function DateRangePickerPresetsPage() {
  const [value, setValue] = useState<DateRangePickerPresetsProps['value']>(null);

  const handleChange: DateRangePickerPresetsProps['onChange'] = ({ detail }) => {
    setValue(detail.value);
  };

  return (
    <Box padding="l">
      <SpaceBetween size="xl">
        <Header variant="h1">DateRangePickerPresets — dev page</Header>

        <ScreenshotArea>
          <SpaceBetween size="l">
            {/* --- Standard presets --- */}
            <FormField label="Standard presets (with custom range)">
              <DateRangePickerPresets
                value={value}
                relativeOptions={relativeOptions}
                onChange={handleChange}
                i18nStrings={i18nStrings}
              />
            </FormField>

            <Box>
              <b>Selected value:</b>
              <Box variant="pre">{JSON.stringify(value, undefined, 2)}</Box>
            </Box>

            {/* --- No presets (custom range only) --- */}
            <FormField label="No presets — custom range only">
              <DateRangePickerPresets value={null} relativeOptions={[]} i18nStrings={i18nStrings} />
            </FormField>

            {/* --- Date-only mode --- */}
            <FormField label="Date-only mode">
              <DateRangePickerPresets
                value={null}
                relativeOptions={[
                  { key: 'last-7-days', amount: 7, unit: 'day', type: 'relative' },
                  { key: 'last-30-days', amount: 30, unit: 'day', type: 'relative' },
                ]}
                dateOnly={true}
                i18nStrings={i18nStrings}
              />
            </FormField>

            {/* --- Month granularity --- */}
            <FormField label="Month granularity">
              <DateRangePickerPresets
                value={null}
                relativeOptions={[
                  { key: 'last-1-month', amount: 1, unit: 'month', type: 'relative' },
                  { key: 'last-3-months', amount: 3, unit: 'month', type: 'relative' },
                  { key: 'last-6-months', amount: 6, unit: 'month', type: 'relative' },
                ]}
                granularity="month"
                i18nStrings={i18nStrings}
              />
            </FormField>

            {/* --- Custom renderContent override --- */}
            <FormField label="Custom renderContent override">
              <DateRangePickerPresets
                value={null}
                relativeOptions={relativeOptions}
                i18nStrings={i18nStrings}
                renderContent={(_val, setVal) => (
                  <SpaceBetween size="xs" direction="horizontal">
                    {relativeOptions.map(option => (
                      <button
                        key={option.key}
                        onClick={() => setVal(option)}
                        style={{ cursor: 'pointer', padding: '4px 12px' }}
                      >
                        {i18nStrings.formatRelativeRange!(option)}
                      </button>
                    ))}
                  </SpaceBetween>
                )}
              />
            </FormField>
          </SpaceBetween>
        </ScreenshotArea>
      </SpaceBetween>
    </Box>
  );
}
