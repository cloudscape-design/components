// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import { Header } from '@cloudscape-design/components';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import ButtonGroup from '@cloudscape-design/components/button-group';
import Container from '@cloudscape-design/components/container';
import DatePicker from '@cloudscape-design/components/date-picker';
import DateRangePicker, { DateRangePickerProps } from '@cloudscape-design/components/date-range-picker';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Grid from '@cloudscape-design/components/grid';
import Link from '@cloudscape-design/components/link';
import Modal from '@cloudscape-design/components/modal';
import Multiselect, { MultiselectProps } from '@cloudscape-design/components/multiselect';
import Popover from '@cloudscape-design/components/popover';
import PropertyFilter, { PropertyFilterProps } from '@cloudscape-design/components/property-filter';
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import ToggleButton from '@cloudscape-design/components/toggle-button';

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
            {
              type: 'icon-button',
              id: 'copy',
              iconName: 'upload',
              text: 'Upload files',
            },
            {
              type: 'icon-button',
              id: 'expand',
              iconName: 'expand',
              text: 'Go full page',
            },
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
      <SpaceBetween direction="horizontal" size="m" alignItems="center">
        <ToggleButton pressed={true} iconName="star" pressedIconName="star-filled" disabled={true}>
          Toggle button
        </ToggleButton>
        <ToggleButton pressed={false} iconName="star" pressedIconName="star-filled" disabled={true}>
          Toggle button
        </ToggleButton>
        <ToggleButton
          pressed={false}
          iconName="star"
          pressedIconName="star-filled"
          disabled={true}
          ariaLabel="Toggle button disabled"
        />
        <ToggleButton
          pressed={true}
          iconName="star"
          pressedIconName="star-filled"
          disabled={true}
          ariaLabel="Toggle button disabled pressed"
        />
        <ToggleButton
          variant="icon"
          pressed={false}
          iconName="star"
          pressedIconName="star-filled"
          disabled={true}
          ariaLabel="Toggle button icon disabled"
        />
        <ToggleButton
          variant="icon"
          pressed={true}
          iconName="star"
          pressedIconName="star-filled"
          disabled={true}
          ariaLabel="Toggle button icon disabled pressed"
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
            { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
            { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
          ]}
          placeholder="Autosuggest"
          ariaLabel="Autosuggest example"
        />
        <Autosuggest
          value="Disabled"
          onChange={() => {}}
          options={[]}
          disabled={true}
          placeholder="Disabled autosuggest"
          ariaLabel="Disabled autosuggest"
        />
        <Autosuggest
          value="Read-only value"
          onChange={() => {}}
          options={[]}
          readOnly={true}
          placeholder="Read-only autosuggest"
          ariaLabel="Read-only autosuggest"
        />
      </SpaceBetween>
      <SpaceBetween direction="horizontal" size="l">
        <DatePicker
          value={dateValue}
          placeholder="Datepicker"
          openCalendarAriaLabel={() => 'Open calendar'}
          onChange={({ detail }) => {
            setDateValue(detail.value);
          }}
        />
        <DateRangePicker
          value={dateRangeValue}
          onChange={({ detail }) => setDateRangeValue(detail.value)}
          relativeOptions={[
            { key: 'previous-5-minutes', amount: 5, unit: 'minute', type: 'relative' },
            { key: 'previous-30-minutes', amount: 30, unit: 'minute', type: 'relative' },
            { key: 'previous-1-hour', amount: 1, unit: 'hour', type: 'relative' },
            { key: 'previous-6-hours', amount: 6, unit: 'hour', type: 'relative' },
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
      </SpaceBetween>
      <SpaceBetween size="xl" direction="horizontal">
        <SpaceBetween size="s">
          <ExpandableSection variant="footer" headerText="Expandable section">
            Expanded
          </ExpandableSection>
        </SpaceBetween>
      </SpaceBetween>
    </Grid>
  );
}

export default function ButtonsInputsDropdowns() {
  const [query, setQuery] = React.useState<PropertyFilterProps.Query>({
    tokens: [],
    operation: 'and',
  });
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
              ]}
              filteringPlaceholder="Find distributions"
              filteringProperties={[
                {
                  key: 'instanceid',
                  operators: ['=', '!=', ':', '!:', '^', '!^'],
                  propertyLabel: 'Instance ID',
                  groupValuesLabel: 'Instance ID values',
                },
                {
                  key: 'state',
                  operators: [
                    { operator: '=', tokenType: 'enum' },
                    { operator: '!=', tokenType: 'enum' },
                    ':',
                    '!:',
                    '^',
                    '!^',
                  ],
                  propertyLabel: 'State',
                  groupValuesLabel: 'State values',
                },
                {
                  key: 'instancetype',
                  operators: [
                    { operator: '=', tokenType: 'enum' },
                    { operator: '!=', tokenType: 'enum' },
                    ':',
                    '!:',
                    '^',
                    '!^',
                  ],
                  propertyLabel: 'Instance type',
                  groupValuesLabel: 'Instance type values',
                },
                {
                  key: 'averagelatency',
                  operators: ['=', '!=', '>', '<', '<=', '>='],
                  propertyLabel: 'Average latency',
                  groupValuesLabel: 'Average latency values',
                },
              ]}
            />
          </SpaceBetween>
        </Container>
        <Container
          header={
            <Header
              variant="h2"
              description={
                <>
                  To further customize spaces/sizes for specific components, the Core’s StyleAPI can be used. Refer to
                  the{' '}
                  <Link
                    external={true}
                    href="https://core.cloudscape.aws.dev/foundation/visual-foundation/customizing-the-foundation/styling/#implementation"
                  >
                    implementation guidelines
                  </Link>
                </>
              }
            >
              Extra small size for key atomic components using StyleAPI
            </Header>
          }
          variant="stacked"
        >
          <Box padding={{ vertical: 'm' }}>
            <SpaceBetween size="l">
              <SpaceBetween direction="horizontal" size="s">
                <Button variant="normal" style={{ root: { paddingBlock: '1px', paddingInline: '8px' } }}>
                  Secondary button
                </Button>
                <Button variant="link" style={{ root: { paddingBlock: '1px', paddingInline: '8px' } }}>
                  Tertiary button
                </Button>
                <Button
                  iconName="settings"
                  variant="icon"
                  style={{ root: { paddingBlock: '1px', paddingInline: '3px' } }}
                />
                <Button
                  iconName="add-plus"
                  variant="icon"
                  style={{ root: { paddingBlock: '1px', paddingInline: '3px' } }}
                />
                {/* <ButtonGroup
                  onItemClick={({ detail }) =>
                    ["like", "dislike"].includes(detail.id) &&
                    setFeedback(detail.pressed ? detail.id : "")
                  }
                  style={{
                    root: {
                      paddingBlock: "0px",
                      paddingInline: "2px",
                    },
                    item: {
                      
                    }
                  }}
                  ariaLabel="Main navigation"
                  items={[
                    {
                      type: "icon-button",
                      id: "view-full",
                      text: "View",
                      iconName: "view-full"
                    },
                    {
                      type: "icon-button",
                      id: "folder",
                      text: "Folder",
                      iconName: "folder"
                    },
                    {
                      type: "icon-button",
                      id: "status-positive",
                      text: "Analytics",
                      iconName: "status-positive"
                    }
                  ]}
                  variant="icon"
                /> */}
              </SpaceBetween>
              {/* <SpaceBetween direction="horizontal" size="s">
                <Input
                  onChange={({ detail }) => setValue(detail.value)}
                  value={value}
                  placeholder="Enter resource policy"
                />
                <Select
                  selectedOption={selectedOption}
                  onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
                  options={[
                    { label: 'US East (N. Virginia)', value: 'us-east-1', description: 'us-east-1', tags: ['Recommended'] },
                    { label: 'US West (Oregon)', value: 'us-west-2', description: 'us-west-2' },
                    { label: 'Europe (Ireland)', value: 'eu-west-1', description: 'eu-west-1', labelTag: 'New' },
                  ]}
                  placeholder="Select a region"
                  renderOption={
                    ({ item, filterText }) => {
                      if (
                        item.type === "group" ||
                        item.type === "item"
                      ) {
                        return (
                          <div
                            style={{
                              paddingBlock: "20px",
                              paddingInlineStart:
                                item.type === "item" && item.parent
                                  ? "32px"
                                  : "12px",
                              paddingInlineEnd: "12px",
                              color: item.disabled
                                ? "lightgrey"
                                : "black",
                              opacity: item.disabled ? 0.6 : 1,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              outline: "solid 2px red"
                            }}
                          >
                            <SpaceBetween size="xxxs">
                              <Box fontSize="body-m" margin="xxxs">
                                {item.option.label}
                              </Box>
                              <Box
                                fontSize="body-s"
                                fontWeight="light"
                                margin="xxxs"
                              >
                                {item.option.description}
                              </Box>
                            </SpaceBetween>
                            <SpaceBetween
                              size="xxxs"
                              direction="horizontal"
                              alignItems="end"
                            >
                              {item.option.tags?.map(tag => (
                                <div>{tag}</div>
                              ))}
                            </SpaceBetween>
                          </div>
                        );
                      } else if (item.type === "trigger") {
                        return (
                          <div
                            style={{
                              paddingInline: "12px",
                              paddingBlock: "20px",
                              display: "flex",
                              alignItems: "center",
                              outline: "solid 2px red"
                            }}
                          >
                            <SpaceBetween size="xxxs">
                              <Box fontSize="body-m" margin="xxxs">
                                {item.option.label}
                              </Box>
                              <Box
                                fontSize="body-s"
                                fontWeight="light"
                                margin="xxxs"
                              >
                                {item.option.description}
                              </Box>
                            </SpaceBetween>
                            <SpaceBetween
                              size="xxxs"
                              direction="horizontal"
                            >

                            </SpaceBetween>
                          </div>
                        );
                      }
                      return null;
                    }
                  }
                />
              </SpaceBetween> */}
            </SpaceBetween>
          </Box>
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
                content="Average latency over the last 5 minutes is 42ms, which is within normal range."
                triggerType="custom"
              >
                <StatusIndicator type="success">Normal latency</StatusIndicator>
              </Popover>
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
