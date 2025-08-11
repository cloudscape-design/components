// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { CalendarProps } from './interfaces.js';
import InternalCalendar from './internal.js';

export { CalendarProps };

export default function Calendar({
  locale = '',
  isDateEnabled = () => true,
  granularity = 'day',
  ...props
}: CalendarProps) {
  const baseComponentProps = useBaseComponent('Calendar', {
    props: { granularity },
    metadata: {
      hasDisabledReasons: Boolean(props.dateDisabledReason),
    },
  });
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
