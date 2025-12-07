// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '~components/app-layout';
import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import ButtonGroup from '~components/button-group';
import Calendar from '~components/calendar';
import Container from '~components/container';
import DateRangePicker, { DateRangePickerProps } from '~components/date-range-picker';
import FileTokenGroup, { FileTokenGroupProps } from '~components/file-token-group';
import Header from '~components/header';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import SegmentedControl from '~components/segmented-control';
import Select, { SelectProps } from '~components/select';
import Slider from '~components/slider';
import SpaceBetween from '~components/space-between';
import Tabs from '~components/tabs';
import Token from '~components/token';

import ScreenshotArea from '../utils/screenshot-area';

export default function InternalTooltipExamples() {
  return (
    <>
      <Box padding="l">
        <SpaceBetween size="l">
          <Header variant="h1">Internal Tooltip - Current Implementations</Header>

          <FileInputItemExample />
          <IconButtonItemExample />
          <IconToggleButtonItemExample />
          <MenuDropdownItemExample />
          <ButtonExample />
          <SelectItemExample />
          <MultiselectItemExample />
          <TokenExample />
          <FileTokenGroupExample />
          <SegmentedControlExample />
          <BreadcrumbGroupExample />
          <SliderExample />
          <CalendarExample />
          <DateRangePickerExample />
          <TabsExample />
          <AppLayoutTriggerButtonExample />
        </SpaceBetween>
      </Box>
    </>
  );
}

function FileInputItemExample() {
  return (
    <Container header={<Header variant="h2">ButtonGroup - FileInputItem</Header>}>
      <ScreenshotArea>
        <ButtonGroup
          variant="icon"
          items={[
            { type: 'icon-button', id: 'copy', text: 'Copy', iconName: 'copy' },
            { type: 'icon-button', id: 'cut', text: 'Cut', iconName: 'file' },
            {
              type: 'icon-file-input',
              id: 'file-upload',
              text: 'Upload file',
              accept: 'image/*',
              multiple: true,
            },
          ]}
        />
      </ScreenshotArea>
    </Container>
  );
}

function IconButtonItemExample() {
  return (
    <Container header={<Header variant="h2">ButtonGroup - IconButtonItem</Header>}>
      <ScreenshotArea>
        <ButtonGroup
          variant="icon"
          items={[
            { type: 'icon-button', id: 'settings', text: 'Settings', iconName: 'settings' },
            { type: 'icon-button', id: 'refresh', text: 'Refresh', iconName: 'refresh' },
            { type: 'icon-button', id: 'download', text: 'Download', iconName: 'download' },
          ]}
        />
      </ScreenshotArea>
    </Container>
  );
}

function IconToggleButtonItemExample() {
  return (
    <Container header={<Header variant="h2">ButtonGroup - IconToggleButtonItem</Header>}>
      <ScreenshotArea>
        <ButtonGroup
          variant="icon"
          items={[
            {
              type: 'icon-toggle-button',
              id: 'toggle1',
              text: 'Favorite',
              iconName: 'star',
              pressedIconName: 'star-filled',
              pressed: false,
            },
            {
              type: 'icon-toggle-button',
              id: 'toggle2',
              text: 'Like',
              iconName: 'thumbs-up',
              pressedIconName: 'thumbs-up-filled',
              pressed: true,
            },
            {
              type: 'icon-toggle-button',
              id: 'toggle3',
              text: 'Lock',
              iconName: 'lock-private',
              pressedIconName: 'unlocked',
              pressed: false,
            },
          ]}
        />
      </ScreenshotArea>
    </Container>
  );
}

function MenuDropdownItemExample() {
  return (
    <Container header={<Header variant="h2">ButtonGroup - MenuDropdownItem</Header>}>
      <ScreenshotArea>
        <ButtonGroup
          variant="icon"
          items={[
            { type: 'icon-button', id: 'edit', text: 'Edit', iconName: 'edit' },
            { type: 'icon-button', id: 'delete', text: 'Delete', iconName: 'remove' },
            {
              type: 'menu-dropdown',
              id: 'menu',
              text: 'More actions',
              items: [
                { id: 'copy', text: 'Copy' },
                { id: 'move', text: 'Move' },
                { id: 'rename', text: 'Rename' },
                { id: 'share', text: 'Share' },
              ],
            },
          ]}
        />
      </ScreenshotArea>
    </Container>
  );
}

function ButtonExample() {
  return (
    <Container header={<Header variant="h2">Button (Disabled Reason)</Header>}>
      <ScreenshotArea>
        <SpaceBetween direction="horizontal" size="xs">
          <Button variant="primary" disabled={true} disabledReason="Action cannot be performed at this time">
            Primary disabled
          </Button>
          <Button variant="normal" disabled={true} disabledReason="Insufficient permissions to perform this action">
            Normal disabled
          </Button>
          <Button variant="icon" iconName="settings" disabled={true} disabledReason="Settings are locked" />
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function SelectItemExample() {
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option | null>(null);

  return (
    <Container header={<Header variant="h2">Select - Item (Disabled Reason)</Header>}>
      <ScreenshotArea>
        <Select
          selectedOption={selectedOption}
          onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
          options={[
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
            {
              label: 'Disabled option',
              value: '3',
              disabled: true,
              disabledReason: 'This option is currently unavailable due to maintenance',
            },
            {
              label: 'Another disabled option',
              value: '4',
              disabled: true,
              disabledReason: 'Insufficient permissions to select this option',
            },
            { label: 'Option 5', value: '5' },
          ]}
          placeholder="Choose an option"
        />
      </ScreenshotArea>
    </Container>
  );
}

function MultiselectItemExample() {
  const [selectedOptions, setSelectedOptions] = useState<MultiselectProps.Options>([]);

  return (
    <Container header={<Header variant="h2">Multiselect - Item (Disabled Reason)</Header>}>
      <ScreenshotArea>
        <Multiselect
          selectedOptions={selectedOptions}
          onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
          options={[
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
            {
              label: 'Disabled option',
              value: '3',
              disabled: true,
              disabledReason: 'This option is currently unavailable',
            },
            {
              label: 'Another disabled option',
              value: '4',
              disabled: true,
              disabledReason: 'Premium feature - upgrade required',
            },
            { label: 'Option 5', value: '5' },
            { label: 'Option 6', value: '6' },
          ]}
          placeholder="Choose options"
        />
      </ScreenshotArea>
    </Container>
  );
}

function TokenExample() {
  return (
    <Container header={<Header variant="h2">Token (Inline with Tooltip)</Header>}>
      <ScreenshotArea>
        <Box>
          <SpaceBetween direction="horizontal" size="xs">
            <div style={{ maxWidth: '150px' }}>
              <Token
                label="Very long label that will be truncated and show a tooltip"
                dismissLabel="Remove token"
                onDismiss={() => {}}
                tooltipContent="Very long label that will be truncated and show a tooltip"
              />
            </div>
            <div style={{ maxWidth: '180px' }}>
              <Token
                label="Another very long token label demonstrating overflow behavior"
                dismissLabel="Remove token"
                onDismiss={() => {}}
                tooltipContent="Another very long token label demonstrating overflow behavior"
              />
            </div>
          </SpaceBetween>
        </Box>
      </ScreenshotArea>
    </Container>
  );
}

function FileTokenGroupExample() {
  const [items, setItems] = useState<FileTokenGroupProps.Item[]>([
    { file: new File(['content'], 'document.pdf', { type: 'application/pdf' }) },
    {
      file: new File(['content'], 'very-long-filename-that-will-be-truncated-and-show-a-tooltip.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      }),
    },
    {
      file: new File(['content'], 'another-extremely-long-filename-that-demonstrates-tooltip-behavior.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
    },
  ]);

  return (
    <Container header={<Header variant="h2">FileTokenGroup - FileToken (Truncated Filename)</Header>}>
      <ScreenshotArea>
        <div style={{ maxWidth: '500px' }}>
          <FileTokenGroup
            items={items}
            onDismiss={({ detail }) => {
              setItems(items.filter((_, index) => index !== detail.fileIndex));
            }}
            showFileSize={true}
            i18nStrings={{
              removeFileAriaLabel: index => `Remove file ${index + 1}`,
              formatFileSize: size => `${(size / 1024).toFixed(2)} KB`,
            }}
          />
        </div>
      </ScreenshotArea>
    </Container>
  );
}

function SegmentedControlExample() {
  const [selectedId, setSelectedId] = useState('option1');

  return (
    <Container header={<Header variant="h2">SegmentedControl - Segment (Disabled Reason)</Header>}>
      <ScreenshotArea>
        <SegmentedControl
          selectedId={selectedId}
          onChange={({ detail }) => setSelectedId(detail.selectedId)}
          options={[
            { id: 'option1', text: 'Option 1' },
            { id: 'option2', text: 'Option 2' },
            {
              id: 'option3',
              text: 'Option 3',
              disabled: true,
              disabledReason: 'This option is currently unavailable',
            },
            {
              id: 'option4',
              text: 'Option 4',
              disabled: true,
              disabledReason: 'Insufficient permissions to access this option',
            },
            { id: 'option5', text: 'Option 5' },
          ]}
        />
      </ScreenshotArea>
    </Container>
  );
}

function BreadcrumbGroupExample() {
  return (
    <Container header={<Header variant="h2">BreadcrumbGroup - Item (Truncated)</Header>}>
      <ScreenshotArea>
        <div style={{ maxWidth: '400px' }}>
          <BreadcrumbGroup
            items={[
              { text: 'Home', href: '#' },
              { text: 'Services', href: '#' },
              { text: 'Very long service name that will be truncated', href: '#' },
              { text: 'Another extremely long breadcrumb item name', href: '#' },
              { text: 'Current page', href: '#' },
            ]}
          />
        </div>
      </ScreenshotArea>
    </Container>
  );
}

function SliderExample() {
  const [value, setValue] = useState(50);

  return (
    <Container header={<Header variant="h2">Slider (Value Tooltip)</Header>}>
      <ScreenshotArea>
        <SpaceBetween size="l">
          <Slider
            value={value}
            onChange={({ detail }) => setValue(detail.value)}
            min={0}
            max={100}
            step={5}
            referenceValues={[25, 50, 75]}
            valueFormatter={value => `${value}%`}
            i18nStrings={{
              valueTextRange: (previousValue, value, nextValue) =>
                `Value: ${value}% (between ${previousValue} and ${nextValue})`,
            }}
          />
          <Slider
            value={value}
            onChange={({ detail }) => setValue(detail.value)}
            min={0}
            max={1000}
            step={50}
            valueFormatter={value => `$${value.toFixed(2)}`}
          />
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function CalendarExample() {
  const [value, setValue] = useState('2024-01-15');

  return (
    <Container header={<Header variant="h2">Calendar - Grid (Date Disabled Reason)</Header>}>
      <ScreenshotArea>
        <Calendar
          value={value}
          onChange={({ detail }) => setValue(detail.value)}
          isDateEnabled={date => {
            const day = date.getDate();
            // Disable weekends and specific dates
            return day !== 10 && day !== 20 && date.getDay() !== 0 && date.getDay() !== 6;
          }}
          dateDisabledReason={date => {
            const day = date.getDate();
            if (date.getDay() === 0 || date.getDay() === 6) {
              return 'Weekends are not available';
            }
            if (day === 10) {
              return 'Public holiday - Office closed';
            }
            if (day === 20) {
              return 'Maintenance scheduled';
            }
            return '';
          }}
        />
      </ScreenshotArea>
    </Container>
  );
}

function DateRangePickerExample() {
  const [value, setValue] = useState<DateRangePickerProps.Value | null>(null);

  return (
    <Container header={<Header variant="h2">DateRangePicker - GridCell (Date Disabled Reason)</Header>}>
      <ScreenshotArea>
        <DateRangePicker
          value={value}
          onChange={({ detail }) => setValue(detail.value)}
          relativeOptions={[]}
          isValidRange={() => ({ valid: true })}
          i18nStrings={{
            todayAriaLabel: 'Today',
            nextMonthAriaLabel: 'Next month',
            previousMonthAriaLabel: 'Previous month',
            customRelativeRangeDurationLabel: 'Custom',
            customRelativeRangeDurationPlaceholder: 'Enter amount',
            customRelativeRangeUnitLabel: 'Unit',
            formatRelativeRange: () => '',
            formatUnit: () => '',
            dateTimeConstraintText: '',
            applyButtonLabel: 'Apply',
            cancelButtonLabel: 'Cancel',
            clearButtonLabel: 'Clear',
            relativeModeTitle: 'Relative range',
            absoluteModeTitle: 'Absolute range',
            relativeRangeSelectionHeading: 'Choose a range',
            startDateLabel: 'Start date',
            endDateLabel: 'End date',
            startTimeLabel: 'Start time',
            endTimeLabel: 'End time',
            renderSelectedAbsoluteRangeAriaLive: () => '',
          }}
          placeholder="Filter by date range"
          isDateEnabled={date => {
            const day = date.getDate();
            return day !== 5 && day !== 15 && date.getDay() !== 0 && date.getDay() !== 6;
          }}
          dateDisabledReason={date => {
            const day = date.getDate();
            if (date.getDay() === 0 || date.getDay() === 6) {
              return 'Weekends are not selectable';
            }
            if (day === 5) {
              return 'Team meeting day - unavailable';
            }
            if (day === 15) {
              return 'System maintenance window';
            }
            return '';
          }}
        />
      </ScreenshotArea>
    </Container>
  );
}

function TabsExample() {
  const [activeTabId, setActiveTabId] = useState('first');

  return (
    <Container header={<Header variant="h2">Tabs - TabHeaderBar (Disabled Reason)</Header>}>
      <ScreenshotArea>
        <Tabs
          activeTabId={activeTabId}
          onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
          tabs={[
            {
              id: 'first',
              label: 'First tab',
              content: 'First tab content',
            },
            {
              id: 'second',
              label: 'Second tab',
              content: 'Second tab content',
            },
            {
              id: 'third',
              label: 'Third tab',
              content: 'Third tab content',
              disabled: true,
              disabledReason: 'This tab is currently unavailable',
            },
            {
              id: 'fourth',
              label: 'Fourth tab',
              content: 'Fourth tab content',
              disabled: true,
              disabledReason: 'Premium feature - upgrade to access',
            },
            {
              id: 'fifth',
              label: 'Fifth tab',
              content: 'Fifth tab content',
            },
          ]}
        />
      </ScreenshotArea>
    </Container>
  );
}

function AppLayoutTriggerButtonExample() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);

  return (
    <Container header={<Header variant="h2">AppLayout - TriggerButton (Toolbar)</Header>}>
      <ScreenshotArea>
        <Box color="text-status-info" fontSize="body-s">
          <strong>Note:</strong> Trigger buttons with tooltips are visible in visual refresh mode with the toolbar.
          Hover over navigation/tools icons in the toolbar to see label tooltips.
        </Box>
        <div style={{ height: '600px', border: '1px solid #ccc' }}>
          <AppLayout
            headerSelector="#header"
            toolsOpen={toolsOpen}
            onToolsChange={({ detail }) => setToolsOpen(detail.open)}
            navigationOpen={navigationOpen}
            onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
            tools={
              <Box padding="l">
                <Header variant="h2">Tools Panel</Header>
                <Box>Tools content goes here</Box>
              </Box>
            }
            navigation={
              <Box padding="l">
                <Header variant="h2">Navigation Panel</Header>
                <Box>Navigation content goes here</Box>
              </Box>
            }
            content={
              <Box padding="l">
                <SpaceBetween size="m">
                  <Header variant="h1">Main Content</Header>
                  <Box>
                    The toolbar trigger buttons (navigation, tools) use tooltips to show their labels when you hover
                    over them.
                  </Box>
                  <Box>These tooltips help users understand what each icon button does.</Box>
                </SpaceBetween>
              </Box>
            }
            ariaLabels={{
              navigation: 'Navigation panel',
              navigationClose: 'Close navigation',
              navigationToggle: 'Open navigation',
              tools: 'Help panel',
              toolsClose: 'Close help',
              toolsToggle: 'Open help',
            }}
          />
        </div>
      </ScreenshotArea>
    </Container>
  );
}

/**
 * TEMPLATE FOR ADDING NEW EXAMPLES
 *
 * function ComponentNameExample() {
 *   return (
 *     <Container header={<Header variant="h2">Component Name</Header>}>
 *       <ScreenshotArea>
 *         // Add component implementation here
 *       </ScreenshotArea>
 *     </Container>
 *   );
 * }
 */
