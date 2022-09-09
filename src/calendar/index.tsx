// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { CalendarProps } from './interfaces';
import InternalCalendar from './internal';

export { CalendarProps };

export default function Calendar({ locale = '', isDateEnabled = () => true, ...props }: CalendarProps) {
  return <InternalCalendar {...props} locale={locale} isDateEnabled={isDateEnabled} />;
}
