// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { DateRangePickerProps } from '~components';

interface IsValidFunctionL10n {
  durationBetweenOneAndTwenty: string;
  durationMissing: string;
  notLongEnough: string;
  minimumStartDate: string;
  noValueSelected: string;
  startDateMissing: string;
  endDateMissing: string;
}

export function makeIsDateValidFunction(l10n: IsValidFunctionL10n): DateRangePickerProps.ValidationFunction {
  return (range: DateRangePickerProps.Value | null) => {
    if (range === null) {
      return {
        valid: false,
        errorMessage: l10n.noValueSelected,
      };
    }

    if (range.type === 'relative') {
      if (isNaN(range.amount)) {
        return {
          valid: false,
          errorMessage: l10n.durationMissing,
        };
      }

      if (range.amount > 20 || range.amount < 1) {
        return {
          valid: false,
          errorMessage: l10n.durationBetweenOneAndTwenty,
        };
      }
    }

    if (range.type === 'absolute') {
      const [startDateWithoutTime] = range.startDate.split('T');
      const [endDateWithoutTime] = range.endDate.split('T');

      if (!startDateWithoutTime && !endDateWithoutTime) {
        return {
          valid: false,
          errorMessage: l10n.noValueSelected,
        };
      }

      if (!startDateWithoutTime) {
        return {
          valid: false,
          errorMessage: l10n.startDateMissing,
        };
      }

      if (!endDateWithoutTime) {
        return {
          valid: false,
          errorMessage: l10n.endDateMissing,
        };
      }

      if (range.startDate < '2018-01-01T00:00:00') {
        return {
          valid: false,
          errorMessage: l10n.minimumStartDate,
        };
      }
    }
    return { valid: true };
  };
}

export function makeIsMonthValidFunction(l10n: IsValidFunctionL10n): DateRangePickerProps.ValidationFunction {
  return (range: DateRangePickerProps.Value | null) => {
    if (range === null) {
      return {
        valid: false,
        errorMessage: l10n.noValueSelected,
      };
    }
    if (range.type === 'absolute') {
      if (!range.startDate && !range.endDate) {
        return {
          valid: false,
          errorMessage: l10n.noValueSelected,
        };
      }

      if (!range.startDate) {
        return {
          valid: false,
          errorMessage: l10n.startDateMissing,
        };
      }

      if (!range.endDate) {
        return {
          valid: false,
          errorMessage: l10n.endDateMissing,
        };
      }

      if (new Date(range.startDate).getTime() - new Date(range.endDate).getTime() > 0) {
        return {
          valid: false,
          errorMessage: l10n.minimumStartDate,
        };
      }
    } else if (range.type === 'relative') {
      if (isNaN(range.amount)) {
        return {
          valid: false,
          errorMessage: l10n.durationMissing,
        };
      }

      if ((range.unit === 'month' && range.amount < 1) || range.amount === 0) {
        return {
          valid: false,
          errorMessage: l10n.notLongEnough,
        };
      }
    }
    return { valid: true };
  };
}
