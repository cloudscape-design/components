// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DateRangePickerProps } from '~components';

interface IsValidFunctionLocalisation {
  durationBetweenOneAndTwenty: string;
  durationMissing: string;
  minimumStartDate: string;
  noValueSelected: string;
  startDateMissing: string;
  endDateMissing: string;
}

export function makeIsValidFunction(
  localisation: IsValidFunctionLocalisation
): DateRangePickerProps.ValidationFunction {
  return (range: DateRangePickerProps.Value | null) => {
    if (range === null) {
      return {
        valid: false,
        errorMessage: localisation.noValueSelected,
      };
    }

    if (range.type === 'relative') {
      if (isNaN(range.amount)) {
        return {
          valid: false,
          errorMessage: localisation.durationMissing,
        };
      }

      if (range.amount > 20 || range.amount < 1) {
        return {
          valid: false,
          errorMessage: localisation.durationBetweenOneAndTwenty,
        };
      }
    }

    if (range.type === 'absolute') {
      const [startDateWithoutTime] = range.startDate.split('T');
      const [endDateWithoutTime] = range.endDate.split('T');

      if (!startDateWithoutTime) {
        return {
          valid: false,
          errorMessage: localisation.startDateMissing,
        };
      }

      if (!endDateWithoutTime) {
        return {
          valid: false,
          errorMessage: localisation.endDateMissing,
        };
      }

      if (range.startDate < '2018-01-01T00:00:00') {
        return {
          valid: false,
          errorMessage: localisation.minimumStartDate,
        };
      }
    }
    return { valid: true };
  };
}
