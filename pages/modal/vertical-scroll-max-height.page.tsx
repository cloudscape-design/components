// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import {
  Button,
  ButtonDropdown,
  DatePicker,
  DatePickerProps,
  DateRangePicker,
  DateRangePickerProps,
  Modal,
  Popover,
  PropertyFilter,
  Select,
  StatusIndicator,
  Toggle,
} from '~components';
import {
  PropertyFilterOperation,
  PropertyFilterOperator,
  PropertyFilterQuery,
  PropertyFilterToken,
} from '@cloudscape-design/collection-hooks';

export default function () {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = React.useState<PropertyFilterQuery>({
    tokens: [],
    operation: 'and' as PropertyFilterOperation,
  });
  const [date, setDate] = useState<DatePickerProps['value']>('');
  const [dateRange, setDateRange] = useState<DateRangePickerProps.Value | null>(null);
  const [expandToViewport, setExpandToViewport] = useState(false);

  const content = [];

  for (let i = 0; i < 10; i++) {
    content.push(
      <p key={i}>
        Bacon ipsum dolor amet jowl short ribs shankle prosciutto flank tenderloin tri-tip tongue. Meatloaf salami
        turducken bresaola ribeye flank shankle boudin sirloin. Picanha meatloaf short ribs chicken jowl andouille filet
        mignon spare ribs kevin rump corned beef. Cow pastrami beef ribs turkey kielbasa alcatra.
      </p>
    );
  }

  const buttonDropdownProps = {
    items: [
      { id: '1', text: 'Option 1' },
      { id: '2', text: 'Option 2' },
      { id: '3', text: 'Option 3' },
      { id: '4', text: 'Option 4' },
      { id: '5', text: 'Option 5' },
      { id: '6', text: 'Option 6' },
      { id: '7', text: 'Option 7' },
      { id: '8', text: 'Option 8' },
    ],
  };

  const propertyFilterProps = {
    onChange: ({ detail }: { detail: PropertyFilterQuery }) => setQuery(detail),
    query,
    i18nStrings: {
      filteringAriaLabel: 'your choice',
      dismissAriaLabel: 'Dismiss',
      groupValuesText: 'Values',
      groupPropertiesText: 'Properties',
      operatorsText: 'Operators',
      operationAndText: 'and',
      operationOrText: 'or',
      operatorLessText: 'Less than',
      operatorLessOrEqualText: 'Less than or equal',
      operatorGreaterText: 'Greater than',
      operatorGreaterOrEqualText: 'Greater than or equal',
      operatorContainsText: 'Contains',
      operatorDoesNotContainText: 'Does not contain',
      operatorEqualsText: 'Equals',
      operatorDoesNotEqualText: 'Does not equal',
      editTokenHeader: 'Edit filter',
      propertyText: 'Property',
      operatorText: 'Operator',
      valueText: 'Value',
      cancelActionText: 'Cancel',
      applyActionText: 'Apply',
      allPropertiesLabel: 'All properties',
      tokenLimitShowMore: 'Show more',
      tokenLimitShowFewer: 'Show fewer',
      clearFiltersText: 'Clear filters',
      removeTokenButtonAriaLabel: (token: PropertyFilterToken) =>
        `Remove token ${token.propertyKey} ${token.operator} ${token.value}`,
      enteredTextLabel: (text: string) => `Use: "${text}"`,
    },
    countText: '5 matches',
    expandToViewport: false,
    filteringOptions: [
      {
        propertyKey: 'instanceid',
        value: 'i-2dc5ce28a0328391',
      },
      {
        propertyKey: 'instanceid',
        value: 'i-d0312e022392efa0',
      },
      {
        propertyKey: 'instanceid',
        value: 'i-070eef935c1301e6',
      },
      {
        propertyKey: 'instanceid',
        value: 'i-3b44795b1fea36ac',
      },
      { propertyKey: 'state', value: 'Stopped' },
      { propertyKey: 'state', value: 'Stopping' },
      { propertyKey: 'state', value: 'Pending' },
      { propertyKey: 'state', value: 'Running' },
      {
        propertyKey: 'instancetype',
        value: 't3.small',
      },
      {
        propertyKey: 'instancetype',
        value: 't2.small',
      },
      { propertyKey: 'instancetype', value: 't3.nano' },
      {
        propertyKey: 'instancetype',
        value: 't2.medium',
      },
      {
        propertyKey: 'instancetype',
        value: 't3.medium',
      },
      {
        propertyKey: 'instancetype',
        value: 't2.large',
      },
      { propertyKey: 'instancetype', value: 't2.nano' },
      {
        propertyKey: 'instancetype',
        value: 't2.micro',
      },
      {
        propertyKey: 'instancetype',
        value: 't3.large',
      },
      {
        propertyKey: 'instancetype',
        value: 't3.micro',
      },
      { propertyKey: 'averagelatency', value: '17' },
      { propertyKey: 'averagelatency', value: '53' },
      { propertyKey: 'averagelatency', value: '73' },
      { propertyKey: 'averagelatency', value: '74' },
      { propertyKey: 'averagelatency', value: '107' },
      { propertyKey: 'averagelatency', value: '236' },
      { propertyKey: 'averagelatency', value: '242' },
      { propertyKey: 'averagelatency', value: '375' },
      { propertyKey: 'averagelatency', value: '402' },
      { propertyKey: 'averagelatency', value: '636' },
      { propertyKey: 'averagelatency', value: '639' },
      { propertyKey: 'averagelatency', value: '743' },
      { propertyKey: 'averagelatency', value: '835' },
      { propertyKey: 'averagelatency', value: '981' },
      { propertyKey: 'averagelatency', value: '995' },
    ],
    filteringProperties: [
      {
        key: 'instanceid',
        operators: ['=', '!=', ':', '!:'] as PropertyFilterOperator[],
        propertyLabel: 'Instance ID',
        groupValuesLabel: 'Instance ID values',
      },
      {
        key: 'state',
        operators: ['=', '!=', ':', '!:'] as PropertyFilterOperator[],
        propertyLabel: 'State',
        groupValuesLabel: 'State values',
      },
      {
        key: 'instancetype',
        operators: ['=', '!=', ':', '!:'] as PropertyFilterOperator[],
        propertyLabel: 'Instance type',
        groupValuesLabel: 'Instance type values',
      },
      {
        key: 'averagelatency',
        operators: ['=', '!=', '>', '<', '<=', '>='] as PropertyFilterOperator[],
        propertyLabel: 'Average latency',
        groupValuesLabel: 'Average latency values',
      },
    ],
  };

  const selectProps = {
    options: [
      {
        value: '1',
        label: 'Option 1',
      },
      {
        value: '2',
        label: 'Option 2',
      },
    ],
  };

  const interactiveElements = (
    <>
      <Popover
        dismissButton={false}
        position="top"
        size="small"
        triggerType="custom"
        content={<StatusIndicator type="success">Code snippet copied</StatusIndicator>}
        renderWithPortal={expandToViewport}
      >
        <Button iconName="copy">Copy</Button>
      </Popover>
      <DatePicker
        onChange={({ detail }) => setDate(detail.value)}
        value={date}
        openCalendarAriaLabel={selectedDate =>
          'Choose certificate expiry date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
        }
        nextMonthAriaLabel="Next month"
        placeholder="YYYY/MM/DD"
        previousMonthAriaLabel="Previous month"
        todayAriaLabel="Today"
      />
      <DateRangePicker
        onChange={({ detail }) => {
          if (detail.value) {
            setDateRange(detail.value);
          }
        }}
        value={dateRange}
        relativeOptions={[
          {
            key: 'previous-5-minutes',
            amount: 5,
            unit: 'minute',
            type: 'relative',
          },
          {
            key: 'previous-30-minutes',
            amount: 30,
            unit: 'minute',
            type: 'relative',
          },
          {
            key: 'previous-1-hour',
            amount: 1,
            unit: 'hour',
            type: 'relative',
          },
          {
            key: 'previous-6-hours',
            amount: 6,
            unit: 'hour',
            type: 'relative',
          },
        ]}
        isValidRange={() => ({ valid: true })}
        i18nStrings={{
          todayAriaLabel: 'Today',
          nextMonthAriaLabel: 'Next month',
          previousMonthAriaLabel: 'Previous month',
          customRelativeRangeDurationLabel: 'Duration',
          customRelativeRangeDurationPlaceholder: 'Enter duration',
          customRelativeRangeOptionLabel: 'Custom range',
          customRelativeRangeOptionDescription: 'Set a custom range in the past',
          customRelativeRangeUnitLabel: 'Unit of time',
          formatRelativeRange: e => {
            const n = 1 === e.amount ? e.unit : `${e.unit}s`;
            return `Last ${e.amount} ${n}`;
          },
          formatUnit: (e, n) => (1 === n ? e : `${e}s`),
          dateTimeConstraintText: 'Range is 6 to 30 days. For date, use YYYY/MM/DD. For time, use 24 hr format.',
          relativeModeTitle: 'Relative range',
          absoluteModeTitle: 'Absolute range',
          relativeRangeSelectionHeading: 'Choose a range',
          startDateLabel: 'Start date',
          endDateLabel: 'End date',
          startTimeLabel: 'Start time',
          endTimeLabel: 'End time',
          clearButtonLabel: 'Clear and dismiss',
          cancelButtonLabel: 'Cancel',
          applyButtonLabel: 'Apply',
        }}
        placeholder="Filter by a date and time range"
        expandToViewport={expandToViewport}
      />
      <ButtonDropdown {...buttonDropdownProps} expandToViewport={expandToViewport}>
        {`Button Dropdown`}
      </ButtonDropdown>
      <PropertyFilter
        {...propertyFilterProps}
        expandToViewport={expandToViewport}
        i18nStrings={{
          ...propertyFilterProps.i18nStrings,
          filteringPlaceholder: `Property Filter`,
        }}
      />
      <Select {...selectProps} expandToViewport={expandToViewport} selectedOption={selectProps.options[0]} />
    </>
  );

  return (
    <article>
      <h1>Vertical scroll modal</h1>
      <Button onClick={() => setVisible(true)}>Show modal</Button>
      <ScreenshotArea>
        <Modal
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <span>Modal title</span>{' '}
              <Toggle checked={expandToViewport} onChange={({ detail }) => setExpandToViewport(detail.checked)}>
                Expand to viewport
              </Toggle>
            </div>
          }
          visible={visible}
          onDismiss={() => setVisible(false)}
          closeAriaLabel="Close modal"
          footer={interactiveElements}
        >
          <div>
            <h3>Modal with vertical scroll</h3>
            <p>
              This is a modal which never vertically overflows the viewport. Interactive components with floating
              elements are positioned inside, both in the body and in the footer, to see how they behave:
            </p>
            <ul>
              <li>Popover</li>
              <li>Date Picker</li>
              <li>Button Dropdown</li>
              <li>Property Filter</li>
              <li>Select</li>
            </ul>
            <p>
              All these components except Popover have a prop called `expandToViewport`, which causes the floating parts
              of these components (such as dropdowns) to render outside of its container, thus being rendered on top of
              the modal, when set to `true`. You can toggle `expandToViewport` with the Toggle in the header.
            </p>
            <p>
              In the case of Popover, toggling this option in the header toggles the `renderWithPortal`, which is
              similar to `expandToViewport`. Still, unlike the other components, the floating parts of Popover _always_
              render outside of the container of the target element, even if `renderWithPortal` is not `true`.
            </p>
            <h3>And here goes some random content</h3>
            <p>
              To see and interact the interactive components placed inside the body of this modal, please scroll down.
            </p>
            <p>
              Bacon ipsum dolor amet cupim ham capicola meatball pastrami. Corned beef strip steak flank, drumstick
              short loin pork chop picanha. Landjaeger picanha spare ribs tongue chuck sausage pork belly, t-bone
              shankle short loin venison kevin. Ball tip t-bone leberkas flank, frankfurter pig corned beef spare ribs
              jerky pork loin shoulder tri-tip salami.
            </p>
            <p>
              Swine andouille pig pork belly pork chop meatball beef ribs prosciutto meatloaf spare ribs chuck shank
              pork loin. Capicola ham filet mignon chicken ground round pork leberkas bresaola shoulder shank strip
              steak. Kevin tri-tip pork chop short loin corned beef, beef drumstick doner. Beef kevin jerky tail.
            </p>
            {content}
            {interactiveElements}
            {content}
          </div>
        </Modal>
      </ScreenshotArea>
    </article>
  );
}
