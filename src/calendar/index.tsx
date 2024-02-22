// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { CalendarProps } from './interfaces';
import InternalCalendar from './internal';

export { CalendarProps };

export default function Calendar({
  locale = '',
  isDateEnabled = () => true,
  granularity = 'day',
  ...props
}: CalendarProps) {
  const baseComponentProps = useBaseComponent('Calendar');
  return (
    <InternalCalendar
      {...props}
      {...baseComponentProps}
      locale={locale}
      isDateEnabled={isDateEnabled}
      granularity={granularity}
    />
  );
}

applyDisplayName(Calendar, 'Calendar');
