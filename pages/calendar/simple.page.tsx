// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import Calendar from '~components/calendar';
import Dropdown from '~components/internal/components/dropdown';
import i18nStrings from './i18n-strings';

export default function CalendarPage() {
  return (
    <article>
      <h1>Calendar page for a11y tests</h1>
      <Dropdown
        stretchWidth={true}
        stretchHeight={true}
        open={true}
        onDropdownClose={() => {}}
        onMouseDown={() => {}}
        trigger={null}
      >
        <Calendar
          value="2021-8-20"
          onChange={() => {}}
          locale="en-GB"
          ariaLabel="Certificate expiration date, calendar"
          startOfWeek={1}
          isDateEnabled={date => date.getDay() !== 6 && date.getDay() !== 0}
          i18nStrings={i18nStrings}
        />
        <Calendar
          value=""
          onChange={() => {}}
          locale="en-GB"
          ariaLabel="Scheduled launch date, calendar"
          startOfWeek={1}
          isDateEnabled={date => date.getDay() !== 6 && date.getDay() !== 0}
          i18nStrings={i18nStrings}
        />
      </Dropdown>
    </article>
  );
}
