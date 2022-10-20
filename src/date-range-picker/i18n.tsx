// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

// eslint-disable-next-line @cloudscape-design/ban-files
import DateRangePicker, { DateRangePickerProps } from './index';
import { useI18NContext } from '../i18n/context';

type DateRangePickerI18nProps = DateRangePickerProps & {
  i18nStrings: Partial<DateRangePickerProps['i18nStrings']>;
};

export default function DateRangePickerI18nComponent(props: DateRangePickerI18nProps) {
  const i18n = useI18NContext('date-range-picker');
  return <DateRangePicker {...props} i18nStrings={{ ...props.i18nStrings, ...i18n.i18nStrings }} />;
}
