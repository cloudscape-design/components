// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState } from 'react';

import {
  Badge,
  DateRangePicker,
  DateRangePickerProps,
  FormField,
  Input,
  Select,
  SelectProps,
  SpaceBetween,
} from '~components';
import { applyTheme, Theme } from '~components/theming';

const relativeOptions: Array<{
  label: string;
  value: DateRangePickerProps.RelativeValue;
}> = [
  { label: 'Last 30 minutes', value: { amount: 30, unit: 'minute', type: 'relative', key: 'last-30-minutes' } },
  { label: 'Last 1 hour', value: { amount: 1, unit: 'hour', type: 'relative', key: 'last-1-hour' } },
  { label: 'Last 2 hours', value: { amount: 2, unit: 'hour', type: 'relative', key: 'last-2-hours' } },
  { label: 'Today', value: { amount: 0, unit: 'day', type: 'relative', key: 'today' } },
  { label: 'Yesterday', value: { amount: 1, unit: 'day', type: 'relative', key: 'yesterday' } },
  { label: 'Last 24 hours', value: { amount: 24, unit: 'hour', type: 'relative', key: 'last-24-hours' } },
  { label: 'Last 7 days', value: { amount: 7, unit: 'day', type: 'relative', key: 'last-7-days' } },
  { label: 'Last 30 days', value: { amount: 30, unit: 'day', type: 'relative', key: 'last-30-days' } },
  { label: 'Last 365 days', value: { amount: 365, unit: 'day', type: 'relative', key: 'last-365-days' } },
];

const unitOptions: SelectProps.Options = [
  { value: 'minute', label: 'Minutes' },
  { value: 'hour', label: 'Hours' },
  { value: 'day', label: 'Days' },
  { value: 'week', label: 'Weeks' },
  { value: 'month', label: 'Months' },
  { value: 'year', label: 'Years' },
];

const timezoneOptions: SelectProps.Options = [
  { value: '0', label: 'UTC+00:00', description: 'Coordinated Universal Time (UTC, GMT)' },
  { value: '-300', label: 'UTC-05:00', description: 'Eastern Standard Time (EST)' },
  { value: '-360', label: 'UTC-06:00', description: 'Central Standard Time (CST)' },
  { value: '-420', label: 'UTC-07:00', description: 'Mountain Standard Time (MST)' },
  { value: '-480', label: 'UTC-08:00', description: 'Pacific Standard Time (PST)' },
  { value: '60', label: 'UTC+01:00', description: 'Central European Time (CET)' },
  { value: '330', label: 'UTC+05:30', description: 'India Standard Time (IST)' },
  { value: '540', label: 'UTC+09:00', description: 'Japan Standard Time (JST)' },
];

function getSelectedKey(selected: DateRangePickerProps.RelativeValue | null): string | null {
  if (!selected) {
    return null;
  }
  return selected.key ?? null;
}

const theme: Theme = {
  tokens: {
    fontFamilyBase: "'Amazon Ember', 'Helvetica Neue', Roboto, Arial, sans-serif",
    colorBorderButtonNormalDefault: { light: '#1b232d', dark: '#f3f3f7' },
    colorBorderButtonNormalHover: { light: '#1b232d', dark: '#F9F9FB' },
    colorBorderButtonNormalActive: { light: '#1b232d', dark: '#F9F9FB' },
    colorBackgroundButtonNormalHover: { light: '#F6F6F9', dark: '#1B232D' },
    colorBackgroundButtonNormalActive: { light: '#EBEBF0', dark: '#131920' },
    colorTextButtonNormalDefault: { light: '#1b232d', dark: '#f3f3f7' },
    colorTextButtonNormalHover: { light: '#1b232d', dark: '#F9F9FB' },
    colorTextButtonNormalActive: { light: '#1b232d', dark: '#F9F9FB' },
    colorBackgroundButtonPrimaryDefault: { light: '#ff9900', dark: '#ff9900' },
    colorBackgroundButtonPrimaryHover: { light: '#fa6f00', dark: '#fa6f00' },
    colorBackgroundButtonPrimaryActive: { light: '#ff9900', dark: '#ff9900' },
    colorTextButtonPrimaryDefault: '#0f141a',
    colorTextButtonPrimaryHover: '#0f141a',
    colorTextButtonPrimaryActive: '#0f141a',
    colorBackgroundButtonLinkHover: { light: '#F6F6F9', dark: '#333843' },
    colorBackgroundButtonLinkActive: { light: '#EBEBF0', dark: '#131920' },
    colorTextLinkButtonNormalDefault: { light: '#1b232d', dark: '#F9F9FB' },
    colorBackgroundToggleButtonNormalPressed: { light: '#EBEBF0', dark: '#131920' },
    colorBorderToggleButtonNormalPressed: { light: '#1b232d', dark: '#F9F9FB' },
    colorTextToggleButtonNormalPressed: { light: '#1b232d', dark: '#F9F9FB' },
    colorBackgroundControlChecked: { light: '#1b232d', dark: '#F9F9FB' },
    colorTextLinkDefault: { light: '#0f141a', dark: '#CCCCD1' },
    colorTextLinkHover: { light: '#424650', dark: '#FFFFFF' },
    colorTextAccent: { light: '#1b232d', dark: '#F9F9FB' },
    colorBorderItemFocused: { light: '#1b232d', dark: '#F9F9FB' },
    colorBorderItemSelected: { light: '#1b232d', dark: '#F9F9FB' },
    colorBackgroundItemSelected: { light: '#F6F6F9', dark: '#06080A' },
    colorBackgroundLayoutToggleSelectedDefault: { light: '#1b232d', dark: '#F9F9FB' },
    colorBackgroundSegmentActive: { light: '#1b232d', dark: '#F9F9FB' },
    colorBackgroundSliderRangeDefault: { light: '#1b232d', dark: '#F9F9FB' },
    colorBackgroundSliderHandleDefault: { light: '#1b232d', dark: '#F9F9FB' },
    colorBackgroundProgressBarValueDefault: { light: '#1b232d', dark: '#F9F9FB' },
    colorBackgroundNotificationGreen: { light: '#008559', dark: '#008559' },
    colorBackgroundNotificationBlue: { light: '#0033CC', dark: '#0033CC' },
    colorTextNotificationDefault: { light: '#ffffff', dark: '#ffffff' },
    colorTextStatusInfo: { light: '#0033CC', dark: '#7598FF' },
    colorTextDropdownItemFilterMatch: { light: '#1b232d', dark: '#F9F9FB' },
    colorBackgroundDropdownItemFilterMatch: { light: '#F3F3F7', dark: '#06080A' },
    colorTextBreadcrumbCurrent: { light: '#1b232d', dark: '#F9F9FB' },
    fontSizeHeadingXl: '20px',
    lineHeightHeadingXl: '28px',
    fontWeightHeadingXl: '700',
    fontSizeHeadingL: '18px',
    lineHeightHeadingL: '22px',
    fontWeightHeadingL: '700',
    fontSizeHeadingM: '16px',
    lineHeightHeadingM: '20px',
    fontWeightHeadingM: '700',
    fontSizeHeadingS: '14px',
    lineHeightHeadingS: '18px',
    fontWeightHeadingS: '700',
    fontSizeHeadingXs: '12px',
    lineHeightHeadingXs: '16px',
    fontWeightHeadingXs: '700',
    fontWeightButton: '700',
    borderWidthButton: '1px',
    borderWidthToken: '1px',
    borderWidthAlert: '0px',
    // borderItemWidth: '1px',
    borderRadiusAlert: '2px',
    borderRadiusBadge: '16px',
    borderRadiusButton: '8px',
    borderRadiusContainer: '12px',
    borderRadiusDropdown: '8px',
    borderRadiusDropzone: '8px',
    borderRadiusFlashbar: '4px',
    borderRadiusItem: '8px',
    borderRadiusInput: '8px',
    borderRadiusPopover: '8px',
    borderRadiusTabsFocusRing: '10px',
    borderRadiusToken: '8px',
    borderRadiusTutorialPanelItem: '4px',
    borderWidthAlertInlineStart: '2px',
    spaceAlertVertical: '4px',
    borderWidthIconSmall: '1.5px',
    borderWidthIconNormal: '1.5px',
    borderWidthIconMedium: '1.75px',
    borderWidthIconBig: '2px',
    borderWidthIconLarge: '2.5px',
  },
  referenceTokens: {
    color: {
      primary: {
        seed: '#1b232d',
      },
    },
  },
  contexts: {
    header: {
      tokens: {
        colorBorderButtonNormalDefault: '#f3f3f7',
        colorBorderButtonNormalHover: '#F9F9FB',
        colorBorderButtonNormalActive: '#F9F9FB',
        colorBackgroundButtonNormalHover: '#1B232D',
        colorBackgroundButtonNormalActive: '#131920',
        colorTextButtonNormalDefault: '#f3f3f7',
        colorTextButtonNormalHover: '#F9F9FB',
        colorTextButtonNormalActive: '#F9F9FB',
        colorBackgroundButtonPrimaryDefault: '#F9F9FB',
        colorBackgroundButtonPrimaryHover: '#FFFFFF',
        colorBackgroundButtonPrimaryActive: '#F9F9FB',
        colorTextButtonPrimaryDefault: '#131920',
        colorTextButtonPrimaryHover: '#131920',
        colorTextButtonPrimaryActive: '#131920',
        colorTextLinkDefault: '#CCCCD1',
      },
    },
    flashbar: {
      tokens: {
        colorBackgroundNotificationGreen: { light: '#008559', dark: '#008559' },
        colorBackgroundNotificationBlue: { light: '#0033cc', dark: '#0033cc' },
        colorTextNotificationDefault: { light: '#ffffff', dark: '#ffffff' },
      },
    },
    alert: {
      tokens: {
        colorBackgroundStatusInfo: { light: '#f6f6f9', dark: '#232b37' },
        colorBackgroundStatusWarning: { light: '#f6f6f9', dark: '#232b37' },
        colorBackgroundStatusError: { light: '#f6f6f9', dark: '#232b37' },
        colorBackgroundStatusSuccess: { light: '#f6f6f9', dark: '#232b37' },
        colorTextStatusInfo: { light: '#0033CC', dark: '#7598FF' },
        colorBorderStatusInfo: { light: '#0033CC', dark: '#7598FF' },
      },
    },
  },
};

import { SimplePage } from '../app/templates';

function DateRangePickerPage() {
  const [value, setValue] = useState<DateRangePickerProps.Value | null>({
    amount: 1,
    unit: 'hour',
    type: 'relative',
    key: 'last-1-hour',
  });

  const [customAmount, setCustomAmount] = useState('3');
  const [customUnit, setCustomUnit] = useState<SelectProps.Option>({ value: 'hour', label: 'Hours' });
  const [selectedTimezone, setSelectedTimezone] = useState<SelectProps.Option>(timezoneOptions[0]);

  const timeOffset = selectedTimezone.value ? parseInt(selectedTimezone.value, 10) : 0;

  const timezoneLabel =
    selectedTimezone.description
      ?.match(/\(([^)]+)\)/)?.[1]
      ?.split(',')[0]
      ?.trim() ??
    selectedTimezone.label ??
    'UTC';

  const renderRelativeRangeContent = (
    selectedRange: DateRangePickerProps.RelativeValue | null,
    setSelectedRange: (value: DateRangePickerProps.RelativeValue) => void
  ) => {
    return (
      <SpaceBetween size="l">
        <FormField label="Relative range">
          <Select
            selectedOption={
              relativeOptions
                .map(o => ({ value: o.value.key!, label: o.label }))
                .find(o => o.value === getSelectedKey(selectedRange)) ?? null
            }
            options={relativeOptions.map(o => ({ value: o.value.key!, label: o.label }))}
            placeholder="Choose a range"
            onChange={({ detail }) => {
              const option = relativeOptions.find(o => o.value.key === detail.selectedOption.value);
              if (option) {
                setSelectedRange(option.value);
              }
            }}
          />
        </FormField>

        {/* Custom duration inputs */}
        <div style={{ borderTop: '1px solid #e9ebed', paddingTop: '16px' }}>
          <SpaceBetween size="s" direction="horizontal">
            <FormField label="Duration" constraintText="Up to 4 digits.">
              <Input
                type="number"
                value={customAmount}
                onChange={({ detail }) => {
                  if (detail.value.length <= 4) {
                    setCustomAmount(detail.value);
                    const amount = parseInt(detail.value, 10);
                    if (!isNaN(amount) && amount > 0 && customUnit.value) {
                      setSelectedRange({
                        amount,
                        unit: customUnit.value as DateRangePickerProps.TimeUnit,
                        type: 'relative',
                      });
                    }
                  }
                }}
              />
            </FormField>
            <FormField label="Unit of time">
              <Select
                selectedOption={customUnit}
                options={unitOptions}
                onChange={({ detail }) => {
                  setCustomUnit(detail.selectedOption);
                  const amount = parseInt(customAmount, 10);
                  if (!isNaN(amount) && amount > 0 && detail.selectedOption.value) {
                    setSelectedRange({
                      amount,
                      unit: detail.selectedOption.value as DateRangePickerProps.TimeUnit,
                      type: 'relative',
                    });
                  }
                }}
              />
            </FormField>
          </SpaceBetween>
        </div>

        {/* Timezone selector */}
        <div style={{ borderTop: '1px solid #e9ebed', paddingTop: '12px' }}>
          <FormField label="Timezone">
            <Select
              selectedOption={selectedTimezone}
              options={timezoneOptions}
              onChange={({ detail }) => setSelectedTimezone(detail.selectedOption)}
            />
          </FormField>
        </div>
      </SpaceBetween>
    );
  };

  const i18nStrings: DateRangePickerProps['i18nStrings'] = {
    ariaLabel: 'Filter by a date and time range',
    todayAriaLabel: 'Today',
    nextMonthAriaLabel: 'Next month',
    previousMonthAriaLabel: 'Previous month',
    nextYearAriaLabel: 'Next year',
    previousYearAriaLabel: 'Previous year',
    currentMonthAriaLabel: 'This month',
    customRelativeRangeDurationLabel: 'Duration',
    customRelativeRangeDurationPlaceholder: 'Enter duration',
    customRelativeRangeOptionLabel: 'Custom range',
    customRelativeRangeOptionDescription: 'Set a custom range in the past',
    customRelativeRangeUnitLabel: 'Unit of time',
    formatRelativeRange: range => {
      const unit = range.amount === 1 ? range.unit : `${range.unit}s`;
      return `Last ${range.amount} ${unit}`;
    },
    formatUnit: (unit, val) => (val === 1 ? unit : `${unit}s`),
    dateTimeConstraintText: 'Range must be between 6 and 30 days. Use 24 hour format.',
    modeSelectionLabel: 'Timeframe',
    relativeModeTitle: 'Relative',
    absoluteModeTitle: 'Absolute',
    relativeRangeSelectionHeading: 'Choose a range',
    startDateLabel: 'Start date',
    endDateLabel: 'End date',
    startTimeLabel: 'Start time',
    endTimeLabel: 'End time',
    clearButtonLabel: 'Clear and dismiss',
    cancelButtonLabel: 'Cancel',
    applyButtonLabel: 'Apply',
    errorIconAriaLabel: 'Error',
    renderSelectedAbsoluteRangeAriaLive: (startDate, endDate) => `Range selected from ${startDate} to ${endDate}`,
  };

  const isValidRange: DateRangePickerProps.ValidationFunction = range => {
    if (range === null) {
      return { valid: false, errorMessage: 'You need to select a range.' };
    }
    if (range.type === 'relative' && isNaN(range.amount)) {
      return { valid: false, errorMessage: 'You need to provide a duration.' };
    }
    if (range.type === 'relative' && (range.amount < 0 || range.amount > 9999)) {
      return { valid: false, errorMessage: 'Duration must be between 0 and 9999.' };
    }
    return { valid: true };
  };

  return (
    <SimplePage title="Date range picker with custom relative content">
      <FormField label="Date range picker">
        <DateRangePicker
          value={value}
          onChange={({ detail }) => setValue(detail.value)}
          relativeOptions={[]}
          isValidRange={isValidRange}
          i18nStrings={i18nStrings}
          placeholder="Filter by date and time range"
          timeOffset={timeOffset}
          renderRelativeRangeContent={renderRelativeRangeContent}
          rangeSelectorMode="default"
          customTriggerContent={<Badge color="severity-low">{timezoneLabel}</Badge>}
        />
      </FormField>
    </SimplePage>
  );
}

export default function ThemedComponentsPage() {
  useLayoutEffect(() => {
    applyTheme({
      theme,
      baseThemeId: 'visual-refresh',
    });
  }, []);

  return (
    <div style={{ padding: 15 }}>
      <h1>Themed components</h1>
      <DateRangePickerPage />
    </div>
  );
}
