// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import {
  Modal,
  Button,
  SpaceBetween,
  Autosuggest,
  ButtonDropdown,
  DatePicker,
  DateRangePicker,
  DateRangePickerProps,
  Multiselect,
  MultiselectProps,
  Popover,
} from '~components';

export default function () {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');
  const [dateRangeValue, setDateRangeValue] = useState<DateRangePickerProps['value']>(null);
  const [selectedOptions, setSelectedOptions] = useState<MultiselectProps['selectedOptions']>([
    {
      label: 'Option 1',
      value: '1',
      description: 'This is a description',
    },
  ]);

  return (
    <article>
      <h1>Simple modal</h1>
      <Button onClick={() => setVisible(true)}>Show modal</Button>
      <Modal
        header="Delete instance"
        visible={visible}
        onDismiss={() => setVisible(false)}
        closeAriaLabel="Close modal"
        footer={
          <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="link">Cancel</Button>
            <Button variant="primary">Delete</Button>
          </span>
        }
      >
        <SpaceBetween size={'xs'}>
          <Autosuggest
            onChange={({ detail }) => setValue(detail.value)}
            value={value}
            options={[
              { value: 'Suggestion 1' },
              { value: 'Suggestion 2' },
              { value: 'Suggestion 3' },
              { value: 'Suggestion 4' },
            ]}
            ariaLabel="Autosuggest example with suggestions"
            placeholder="Enter value"
            empty="No matches found"
          />

          <ButtonDropdown
            items={[
              { text: 'Delete', id: 'rm', disabled: false },
              { text: 'Move', id: 'mv', disabled: false },
              { text: 'Rename', id: 'rn', disabled: true },
              {
                id: 'view',
                text: 'View metrics',
                href: 'https://example.com',
                external: true,
                externalIconAriaLabel: '(opens in new tab)',
              },
            ]}
          >
            Short
          </ButtonDropdown>

          <DatePicker
            onChange={({ detail }) => setValue(detail.value)}
            value={value}
            openCalendarAriaLabel={selectedDate =>
              'Choose certificate expiry date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
            }
            placeholder="YYYY/MM/DD"
          />

          <DateRangePicker
            onChange={({ detail }) => setDateRangeValue(detail.value)}
            value={dateRangeValue}
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
            isValidRange={range => {
              if (range?.type === 'absolute') {
                const [startDateWithoutTime] = range.startDate.split('T');
                const [endDateWithoutTime] = range.endDate.split('T');
                if (!startDateWithoutTime || !endDateWithoutTime) {
                  return {
                    valid: false,
                    errorMessage:
                      'The selected date range is incomplete. Select a start and end date for the date range.',
                  };
                }
              }
              return { valid: true };
            }}
            i18nStrings={{}}
            placeholder="Filter by a date and time range"
          />

          <Multiselect
            selectedOptions={selectedOptions}
            onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
            options={[
              {
                label: 'Option 1',
                value: '1',
                description: 'This is a description',
              },
              {
                label: 'Option 2',
                value: '2',
                iconName: 'unlocked',
                labelTag: 'This is a label tag',
              },
              {
                label: 'Option 3 (disabled)',
                value: '3',
                iconName: 'share',
                tags: ['Tags go here', 'Tag1', 'Tag2'],
                disabled: true,
              },
              {
                label: 'Option 4',
                value: '4',
                filteringTags: ['filtering', 'tags', 'these are filtering tags'],
              },
              { label: 'Option 5', value: '5' },
            ]}
            placeholder="Choose options"
          />

          <Popover
            header="Memory Error"
            content="This instance contains insufficient memory. Stop the instance, choose a different instance type with more memory, and restart it."
          >
            Error
          </Popover>

          <Popover
            dismissButton={false}
            position="top"
            size="small"
            triggerType="custom"
            content={'Code snippet copied'}
          >
            <Button iconName="copy">Copy</Button>
          </Popover>
        </SpaceBetween>
      </Modal>
    </article>
  );
}
