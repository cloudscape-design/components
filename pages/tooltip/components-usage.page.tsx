// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import ButtonGroup from '~components/button-group';
import Calendar from '~components/calendar';
import Container from '~components/container';
import DateRangePicker from '~components/date-range-picker';
import Header from '~components/header';
import SegmentedControl from '~components/segmented-control';
import Select from '~components/select';
import Slider from '~components/slider';
import SpaceBetween from '~components/space-between';
import Tabs from '~components/tabs';
import TokenGroup from '~components/token-group';

const actionsItems = [
  { id: 'connect', text: 'Connect', disabledReason: 'Instance must be running.', disabled: true },
  { id: 'details', text: 'View details', disabledReason: 'A single instance needs to be selected.', disabled: true },
  {
    id: 'manage-state',
    text: 'Manage instance state',
    disabledReason: 'Instance state must not be pending or stopping.',
    disabled: true,
  },
  {
    text: 'Instance Settings',
    id: 'settings',
    items: [
      {
        id: 'auto-scaling',
        text: 'Attach to Auto Scaling Group',
        disabledReason: 'Instance must be running and not already be attached to an Auto Scaling Group.',
        disabled: true,
      },
      { id: 'termination-protection', text: 'Change termination protections' },
      { id: 'stop-protection', text: 'Change stop protection' },
    ],
  },
];

const selectableGroupItems = [
  {
    text: 'Settings group',
    id: 'setting-group',
    items: [
      { text: 'Setting', id: 'setting', itemType: 'checkbox', checked: true, disabled: false },
      {
        text: 'Disabled setting',
        id: 'disabled-setting',
        itemType: 'checkbox',
        checked: true,
        disabled: true,
        disabledReason: 'This setting is disabled',
      },
    ],
  },
];

export default function TooltipComponentsUsage() {
  const [selectedTab, setSelectedTab] = React.useState('first');
  const [selectedSegment, setSelectedSegment] = React.useState('segment-1');
  const [selectedDate, setSelectedDate] = React.useState('');
  const [dateRangeValue, setDateRangeValue] = React.useState<any>(null);
  const [selectedOption, setSelectedOption] = React.useState<any>(null);
  const [tokens, setTokens] = React.useState([
    { label: 'Token 1', dismissLabel: 'Remove Token 1' },
    { label: 'Token 2', dismissLabel: 'Remove Token 2' },
  ]);
  const [sliderValue, setSliderValue] = React.useState(50);

  return (
    <div style={{ padding: '50px' }}>
      <h1>Components Using Tooltips</h1>
      <p>Examples of how tooltip is used across different Cloudscape components.</p>

      <SpaceBetween size="l">
        <Container header={<Header variant="h2">BreadcrumbGroup</Header>}>
          <p>Breadcrumb items show tooltips when text is truncated.</p>
          <BreadcrumbGroup
            items={[
              { text: 'Home', href: '#' },
              { text: 'Service', href: '#' },
              { text: 'Very Long Page Name That Gets Truncated', href: '#' },
              { text: 'Current Page', href: '#' },
            ]}
            ariaLabel="Breadcrumbs"
          />
        </Container>

        <Container header={<Header variant="h2">Descriptions in ButtonDropdown</Header>}>
          <p>Dropdown items with disabled reasons show tooltips.</p>
          <SpaceBetween size="m">
            <ButtonDropdown items={actionsItems} expandableGroups={true}>
              Actions
            </ButtonDropdown>

            <ButtonDropdown items={actionsItems} disabled={true} disabledReason="disabled reason">
              Disabled Dropdown
            </ButtonDropdown>

            <ButtonDropdown
              items={actionsItems}
              ariaLabel="Instance actions"
              mainAction={{ text: 'Launch instance', disabled: true, disabledReason: 'disabled reason' }}
              variant="primary"
            />

            <ButtonDropdown items={selectableGroupItems}>Selectable example</ButtonDropdown>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">ButtonGroup</Header>}>
          <p>Button group menu items show tooltips for additional context.</p>
          <ButtonGroup
            variant="icon"
            items={[
              { type: 'icon-button', id: 'copy', text: 'Copy', iconName: 'copy' },
              { type: 'icon-button', id: 'paste', text: 'Paste', iconName: 'file' },
              {
                type: 'menu-dropdown',
                id: 'more',
                text: 'More',
                items: [
                  { id: 'cut', text: 'Cut', description: 'Cut to clipboard' },
                  { id: 'delete', text: 'Delete', description: 'Remove item' },
                ],
              },
            ]}
          />
        </Container>

        <Container header={<Header variant="h2">Select</Header>}>
          <p>Select options with descriptions show tooltips.</p>
          <Select
            selectedOption={selectedOption}
            onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
            options={[
              {
                label: 'Option 1',
                value: '1',
                description: 'This is option 1 description',
              },
              {
                label: 'Option 2',
                value: '2',
                description: 'This is option 2 description',
              },
              { label: 'Option 3', value: '3' },
            ]}
            placeholder="Choose an option"
          />
        </Container>

        <Container header={<Header variant="h2">SegmentedControl</Header>}>
          <p>Segmented control items show tooltips for disabled states.</p>
          <SegmentedControl
            selectedId={selectedSegment}
            onChange={({ detail }) => setSelectedSegment(detail.selectedId)}
            label="Segmented control with tooltips"
            options={[
              { text: 'Segment 1', id: 'segment-1' },
              { text: 'Segment 2', id: 'segment-2' },
              { text: 'Disabled', id: 'segment-3', disabled: true },
            ]}
          />
        </Container>

        <Container header={<Header variant="h2">Tabs</Header>}>
          <p>Tab labels can show tooltips for additional information.</p>
          <Tabs
            activeTabId={selectedTab}
            onChange={({ detail }) => setSelectedTab(detail.activeTabId)}
            tabs={[
              { id: 'first', label: 'First tab', content: 'First tab content' },
              { id: 'second', label: 'Second tab', content: 'Second tab content' },
              { id: 'third', label: 'Third tab (disabled)', disabled: true },
            ]}
          />
        </Container>

        <Container header={<Header variant="h2">Calendar</Header>}>
          <p>Calendar dates show tooltips with additional information.</p>
          <Calendar
            value={selectedDate}
            onChange={({ detail }) => setSelectedDate(detail.value)}
            locale="en-US"
            ariaLabel="Select date"
          />
        </Container>

        <Container header={<Header variant="h2">DateRangePicker</Header>}>
          <p>Date range picker uses tooltips for date information.</p>
          <DateRangePicker
            value={dateRangeValue}
            onChange={({ detail }) => setDateRangeValue(detail.value)}
            placeholder="Select date range"
            relativeOptions={[
              { key: 'previous-7-days', amount: 7, unit: 'day', type: 'relative' },
              { key: 'previous-30-days', amount: 30, unit: 'day', type: 'relative' },
            ]}
            isValidRange={() => ({ valid: true })}
          />
        </Container>

        <Container header={<Header variant="h2">TokenGroup</Header>}>
          <p>Tokens show tooltips when truncated or for additional context.</p>
          <TokenGroup
            items={tokens}
            onDismiss={({ detail: { itemIndex } }) => {
              setTokens(tokens.filter((_, i) => i !== itemIndex));
            }}
          />
        </Container>

        <Container header={<Header variant="h2">Button (Disabled)</Header>}>
          <p>Disabled buttons show tooltips with disabled reasons.</p>
          <SpaceBetween size="m" direction="horizontal">
            <Button disabled={true} disabledReason="You don't have permission to perform this action">
              Edit
            </Button>
            <Button variant="primary" disabled={true} disabledReason="Complete all required fields first">
              Submit
            </Button>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Icon Buttons</Header>}>
          <p>Icon-only buttons commonly use tooltips to explain their action.</p>
          <SpaceBetween size="m" direction="horizontal">
            <Button iconName="edit" variant="icon" ariaLabel="Edit" />
            <Button iconName="remove" variant="icon" ariaLabel="Delete" />
            <Button iconName="download" variant="icon" ariaLabel="Download" />
            <Button iconName="settings" variant="icon" ariaLabel="Settings" />
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Slider</Header>}>
          <p>Slider shows current value in a tooltip.</p>
          <Slider
            value={sliderValue}
            onChange={({ detail }) => setSliderValue(detail.value)}
            min={0}
            max={100}
            ariaLabel="Slider example"
          />
        </Container>

        <Container header={<Header variant="h2">FileTokenGroup</Header>}>
          <p>File tokens show tooltips for file information and dismissal.</p>
          <p>
            <em>Note: FileTokenGroup uses internal tooltip for file details display.</em>
          </p>
        </Container>

        <Container header={<Header variant="h2">Summary</Header>}>
          <div style={{ padding: '16px', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
            <h3>Components Currently Using Tooltips:</h3>
            <ul>
              <li>
                <strong>BreadcrumbGroup</strong> - Truncated breadcrumb text
              </li>
              <li>
                <strong>ButtonDropdown</strong> - Item descriptions and disabled reasons
              </li>
              <li>
                <strong>ButtonGroup</strong> - Menu item descriptions
              </li>
              <li>
                <strong>Select</strong> - Option descriptions
              </li>
              <li>
                <strong>SegmentedControl</strong> - Disabled segment explanations
              </li>
              <li>
                <strong>Tabs</strong> - Additional tab information
              </li>
              <li>
                <strong>Calendar</strong> - Date information
              </li>
              <li>
                <strong>DateRangePicker</strong> - Date selection hints
              </li>
              <li>
                <strong>TokenGroup</strong> - Truncated token labels
              </li>
              <li>
                <strong>Button</strong> - Disabled reasons
              </li>
              <li>
                <strong>Icon Buttons</strong> - Action explanations
              </li>
              <li>
                <strong>Slider</strong> - Current value display
              </li>
              <li>
                <strong>FileTokenGroup</strong> - File information tooltips
              </li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              <strong>Note:</strong> Most components use the internal tooltip implementation. Your new public Tooltip
              component should support these same use cases.
            </p>
          </div>
        </Container>
      </SpaceBetween>
    </div>
  );
}
