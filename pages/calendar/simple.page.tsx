// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import Calendar from '~components/date-picker/calendar';
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
          selectedDate={new Date('2021-8-20')}
          focusedDate={null}
          displayedDate={new Date('2021-8-13')}
          locale="en-EN"
          startOfWeek={1}
          isDateEnabled={date => date.getDay() !== 6 && date.getDay() !== 0}
          calendarHasFocus={true}
          nextMonthLabel="Next month"
          previousMonthLabel="Previous month"
          todayAriaLabel="Today"
          onChangeMonth={() => {}}
          onSelectDate={() => {}}
          onFocusDate={() => {}}
        />
        <Calendar
          selectedDate={null}
          focusedDate={null}
          displayedDate={new Date()}
          locale="en-EN"
          startOfWeek={1}
          isDateEnabled={date => date.getDay() !== 6 && date.getDay() !== 0}
          calendarHasFocus={false}
          nextMonthLabel="Next month"
          previousMonthLabel="Previous month"
          todayAriaLabel="Today"
          onChangeMonth={() => {}}
          onSelectDate={() => {}}
          onFocusDate={() => {}}
        />
      </Dropdown>
    </article>
  );
}
