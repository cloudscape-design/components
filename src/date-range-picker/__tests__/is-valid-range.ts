// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DateRangePickerProps } from '../interfaces';

export const isValidRange: DateRangePickerProps.ValidationFunction = (range: DateRangePickerProps.Value | null) => {
  if (range === null) {
    return {
      valid: false,
      errorMessage: 'No range selected',
    };
  }

  if (range.type === 'relative' && isNaN(range.amount)) {
    return {
      valid: false,
      errorMessage: 'Duration missing',
    };
  }

  if (range.type === 'absolute') {
    const [startDateWithoutTime] = range.startDate.split('T');
    const [endDateWithoutTime] = range.endDate.split('T');

    if (!startDateWithoutTime) {
      return {
        valid: false,
        errorMessage: 'Start date missing',
      };
    }

    if (!endDateWithoutTime) {
      return {
        valid: false,
        errorMessage: 'End date missing',
      };
    }
  }
  return { valid: true };
};
