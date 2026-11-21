// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Autosuggest from '~components/autosuggest';
import Box from '~components/box';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import ButtonGroup from '~components/button-group';
import Container from '~components/container';
import DatePicker from '~components/date-picker';
import DateRangePicker, { DateRangePickerProps } from '~components/date-range-picker';
import Grid from '~components/grid';
import Header from '~components/header';
import Modal from '~components/modal';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import Popover from '~components/popover';
import PropertyFilter, { PropertyFilterProps } from '~components/property-filter';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import ToggleButton from '~components/toggle-button';

import { generateDropdownOptions } from './component-data';

function Buttons() {
  const [selectedSegment, setSelectedSegment] = useState('seg-1');
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(false);
  const [toggle4, setToggle4] = useState(true);
  const [toggle5, setToggle5] = useState(false);
  const [toggle6, setToggle6] = useState(true);

  return (
    <SpaceBetween size="l">
      <SpaceBetween direction="horizontal" size="m" alignItems="center">
        <Button variant="primary">Primary button</Button>
        <Button variant="normal">Secondary button</Button>
        <Button iconName="refresh" ariaLabel="Icon in normal button" />
        <Button variant="link">Tertiary button</Button>
      </SpaceBetween>
      <SpaceBetween direction="horizontal" size="m" alignItems="center">
        <Button variant="primary" disabled={true}>
          Primary button
        </Button>
        <Button variant="normal" disabled={true}>
          Secondary button
        </Button>
        <Button iconName="refresh" disabled={true} ariaLabel="Disabled refresh button" />
        <Button variant="link" disabled={true}>
          Tertiary button
        </Button>
      </SpaceBetween>
      <SpaceBetween direction="horizontal" size="m" alignItems="center">
        <Button variant="inline-icon" iconName="copy" ariaLabel="Inline icon button" />
        <Button variant="icon" iconName="add-plus" ariaLabel="Icon button" />
        <ButtonGroup
          ariaLabel="Button group"
          items={[
            { type: 'icon-button', id: 'copy', iconName: 'upload', text: 'Upload files' },
            { type: 'icon-button', id: 'expand', iconName: 'expand', text: 'Go full page' },
          ]}
          variant="icon"
        />
      </SpaceBetween>
      <SpaceBetween direction="horizontal" size="m" alignItems="center">
        <ToggleButton
          onChange={({ detail }) => setToggle1(detail.pressed)}
          pressed={toggle1}
          iconName="star"
          pressedIconName="star-filled"
        >
          Toggle button
        </ToggleButton>
        <ToggleButton
          onChange={({ detail }) => setToggle2(detail.pressed)}
          pressed={toggle2}
          iconName="star"
          pressedIconName="star-filled"
        >
          Toggle button
        </ToggleButton>
        <ToggleButton
          onChange={({ detail }) => setToggle3(detail.pressed)}
          pressed={toggle3}
          iconName="star"
          pressedIconName="star-filled"
          ariaLabel="Toggle button"
        />
        <ToggleButton
          onChange={({ detail }) => setToggle4(detail.pressed)}
          pressed={toggle4}
          iconName="star"
          pressedIconName="star-filled"
          ariaLabel="Toggle button pressed"
        />
        <ToggleButton
          variant="icon"
          onChange={({ detail }) => setToggle5(detail.pressed)}
          pressed={toggle5}
          iconName="star"
          pressedIconName="star-filled"
          ariaLabel="Toggle button icon"
        />
        <ToggleButton
          variant="icon"
          onChange={({ detail }) => setToggle6(detail.pressed)}
          pressed={toggle6}
          iconName="star"
          pressedIconName="star-filled"
          ariaLabel="Toggle button icon pressed"
        />
      </SpaceBetween>
      <SegmentedControl
        selectedId={selectedSegment}
        onChange={({ detail }) => setSelectedSegment(detail.selectedId)}
        label="Default segmented control"
        options={[
          { text: 'Segment 1', id: 'seg-1' },
          { text: 'Segment 2', id: 'seg-2' },
          { text: 'Segment 3', id: 'seg-3' },
        ]}
      />
    </SpaceBetween>
  );
}

function Inputs() {
  const multiSelectOptions = generateDropdownOptions() as MultiselectProps.Options;
  const [selectedItems, setSelectedItems] = useState([
    multiSelectOptions[1],
    multiSelectOptions[3],
  ] as MultiselectProps.Options);
  const [dateValue, setDateValue] = useState('2018-01-02');
  const [dateRangeValue, setDateRangeValue] = useState<DateRangePickerProps['value']>(null);
  const [autosuggestValue, setAutosuggestValue] = useState('');

  return (
    <Grid>
      <SpaceBetween size="s" direction="horizontal">
        <Multiselect
          options={multiSelectOptions}
          placeholder="Multiselect"
          selectedOptions={selectedItems}
          onChange={({ detail }) => setSelectedItems(detail.selectedOptions)}
        />
        <Multiselect disabled={true} placeholder="Disabled multi-select" selectedOptions={selectedItems} />
        <Multiselect readOnly={true} placeholder="Read-only multi-select" selectedOptions={selectedItems} />
      </SpaceBetween>
      <SpaceBetween size="s" direction="horizontal">
        <Autosuggest
          value={autosuggestValue}
          onChange={({ detail }) => setAutosuggestValue(detail.value)}
          options={[
            { value: 'us-east-1', label: 'US East (N. Virginia)' },
            { value: 'us-west-2', label: 'US West (Oregon)' },
            { value: 'eu-west-1', label: 'Europe (Ireland)' },
          ]}
          placeholder="Autosuggest"
          ariaLabel="Autosuggest example"
        />
        <Autosuggest
          value="Disabled"
          onChange={() => {}}
          options={[]}
          disabled={true}
          placeholder="Disabled"
          ariaLabel="Disabled autosuggest"
        />
        <Autosuggest
          value="Read-only"
          onChange={() => {}}
          options={[]}
          readOnly={true}
          placeholder="Read-only"
          ariaLabel="Read-only autosuggest"
        />
      </SpaceBetween>
      <SpaceBetween direction="horizontal" size="l">
        <DatePicker
          value={dateValue}
          placeholder="Datepicker"
          openCalendarAriaLabel={() => 'Open calendar'}
          onChange={({ detail }) => setDateValue(detail.value)}
        />
        <DateRangePicker
          value={dateRangeValue}
          onChange={({ detail }) => setDateRangeValue(detail.value)}
          relativeOptions={[
            { key: 'previous-5-minutes', amount: 5, unit: 'minute', type: 'relative' },
            { key: 'previous-30-minutes', amount: 30, unit: 'minute', type: 'relative' },
            { key: 'previous-1-hour', amount: 1, unit: 'hour', type: 'relative' },
          ]}
          isValidRange={range => {
            if (range?.type === 'absolute') {
              const [startDateWithoutTime] = range.startDate.split('T');
              const [endDateWithoutTime] = range.endDate.split('T');
              if (!startDateWithoutTime || !endDateWithoutTime) {
                return { valid: false, errorMessage: 'The selected date range is incomplete.' };
              }
            }
            return { valid: true };
          }}
          i18nStrings={{}}
          placeholder="Filter by a date and time range"
        />
      </SpaceBetween>
    </Grid>
  );
}

export default function ButtonsInputsDropdowns() {
  const [query, setQuery] = React.useState<PropertyFilterProps.Query>({ tokens: [], operation: 'and' });
  const [modalVisible, setModalVisible] = React.useState(false);
  return (
    <SpaceBetween size="s">
      <Header variant="h2">Buttons, inputs, and dropdowns</Header>
      <Box>
        <Container variant="stacked">
          <SpaceBetween size="l">
            <Grid gridDefinition={[{ colspan: { default: 12, xxs: 6 } }, { colspan: { default: 12, xxs: 6 } }]}>
              <Buttons />
              <Inputs />
            </Grid>
            <PropertyFilter
              query={query}
              onChange={({ detail }) => setQuery(detail)}
              countText="5 matches"
              enableTokenGroups={true}
              expandToViewport={true}
              filteringAriaLabel="Find distributions"
              filteringOptions={[
                { propertyKey: 'instanceid', value: 'i-2dc5ce28a0328391' },
                { propertyKey: 'instanceid', value: 'i-d0312e022392efa0' },
                { propertyKey: 'state', value: 'Stopped' },
                { propertyKey: 'state', value: 'Running' },
                { propertyKey: 'instancetype', value: 't3.small' },
                { propertyKey: 'instancetype', value: 't2.small' },
              ]}
              filteringPlaceholder="Find distributions"
              filteringProperties={[
                {
                  key: 'instanceid',
                  operators: ['=', '!=', ':', '!:'],
                  propertyLabel: 'Instance ID',
                  groupValuesLabel: 'Instance ID values',
                },
                {
                  key: 'state',
                  operators: [{ operator: '=', tokenType: 'enum' }, { operator: '!=', tokenType: 'enum' }, ':', '!:'],
                  propertyLabel: 'State',
                  groupValuesLabel: 'State values',
                },
                {
                  key: 'instancetype',
                  operators: [{ operator: '=', tokenType: 'enum' }, { operator: '!=', tokenType: 'enum' }, ':', '!:'],
                  propertyLabel: 'Instance type',
                  groupValuesLabel: 'Instance type values',
                },
              ]}
            />
          </SpaceBetween>
        </Container>
        <Container variant="stacked">
          <Grid
            gridDefinition={[
              { colspan: { default: 12, xxs: 4 } },
              { colspan: { default: 12, xxs: 4 } },
              { colspan: { default: 12, xxs: 4 } },
            ]}
          >
            <SpaceBetween size="s">
              <ButtonDropdown
                items={[
                  { text: 'Edit', id: 'edit', iconName: 'edit' },
                  { text: 'Delete', id: 'delete', iconName: 'remove' },
                  { text: 'Duplicate', id: 'duplicate', iconName: 'copy' },
                  {
                    text: 'More actions',
                    id: 'more',
                    items: [
                      { text: 'Export', id: 'export' },
                      { text: 'Share', id: 'share' },
                    ],
                  },
                ]}
              >
                Actions
              </ButtonDropdown>
              <ButtonDropdown
                items={[
                  { text: 'Edit', id: 'edit' },
                  { text: 'Delete', id: 'delete', disabled: true },
                ]}
                variant="primary"
              >
                Primary dropdown
              </ButtonDropdown>
              <ButtonDropdown
                items={[
                  { text: 'Edit', id: 'edit' },
                  { text: 'Delete', id: 'delete' },
                ]}
                disabled={true}
              >
                Disabled dropdown
              </ButtonDropdown>
            </SpaceBetween>

            <SpaceBetween size="s">
              <Popover
                header="Memory usage"
                content="This instance is using 72% of its allocated memory."
                triggerType="custom"
              >
                <StatusIndicator type="warning">High memory</StatusIndicator>
              </Popover>
              <Popover
                header="Latency info"
                content="Average latency over the last 5 minutes is 42ms."
                triggerType="custom"
              >
                <StatusIndicator type="success">Normal latency</StatusIndicator>
              </Popover>
              <StatusIndicator type="info">Normal latency</StatusIndicator>
              <StatusIndicator type="error">Error latency</StatusIndicator>
              <StatusIndicator type="pending">Pending instance</StatusIndicator>
              <Popover dismissButton={false} position="top" size="small" content="Copied!" triggerType="custom">
                <Button iconName="copy" variant="inline-icon" ariaLabel="Copy" />
              </Popover>
            </SpaceBetween>

            <SpaceBetween size="s">
              <Button onClick={() => setModalVisible(true)}>Open modal</Button>
              <Modal
                visible={modalVisible}
                onDismiss={() => setModalVisible(false)}
                header="Delete resource"
                footer={
                  <Box float="right">
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button variant="link" onClick={() => setModalVisible(false)}>
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={() => setModalVisible(false)}>
                        Delete
                      </Button>
                    </SpaceBetween>
                  </Box>
                }
              >
                Are you sure you want to delete this resource? This action cannot be undone.
              </Modal>
            </SpaceBetween>
          </Grid>
        </Container>
      </Box>
    </SpaceBetween>
  );
}
