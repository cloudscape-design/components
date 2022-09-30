// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import Calendar from '~components/calendar';
import Dropdown from '~components/internal/components/dropdown';

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
          startOfWeek={1}
          isDateEnabled={date => date.getDay() !== 6 && date.getDay() !== 0}
          nextMonthAriaLabel="Next month"
          previousMonthAriaLabel="Previous month"
          todayAriaLabel="Today"
        />
        <Calendar
          value=""
          onChange={() => {}}
          locale="en-GB"
          startOfWeek={1}
          isDateEnabled={date => date.getDay() !== 6 && date.getDay() !== 0}
          nextMonthAriaLabel="Next month"
          previousMonthAriaLabel="Previous month"
          todayAriaLabel="Today"
        />
      </Dropdown>
    </article>
  );
}
