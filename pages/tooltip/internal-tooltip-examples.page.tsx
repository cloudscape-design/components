// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import ButtonGroup from '~components/button-group';
import Calendar from '~components/calendar';
import DateRangePicker, { DateRangePickerProps } from '~components/date-range-picker';
import FileTokenGroup, { FileTokenGroupProps } from '~components/file-token-group';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import SegmentedControl from '~components/segmented-control';
import Select, { SelectProps } from '~components/select';
import Slider from '~components/slider';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Tabs from '~components/tabs';
import Token from '~components/token';

import { SimplePage } from '../app/templates';

export default function InternalTooltipExamples() {
  return (
    <SimplePage title="Tooltip component integration" screenshotArea={{}} i18n={{}}>
      <SpaceBetween size="l">
        <FileInputItemExample />
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
      </SpaceBetween>
    </SimplePage>
  );
}

function FileInputItemExample() {
  return (
    <ButtonGroup
      variant="icon"
      ariaLabel="File actions"
      items={[
        {
          type: 'icon-button',
          id: 'copy',
          text: 'Copy',
          iconName: 'copy',
          popoverFeedback: <StatusIndicator type="success">Copied!</StatusIndicator>,
        },
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
  );
}

function ButtonExample() {
  return (
    <SpaceBetween direction="horizontal" size="xs">
      <Button variant="primary" disabled={true} disabledReason="Action cannot be performed at this time">
        Primary disabled
      </Button>
      <Button variant="normal" disabled={true} disabledReason="Insufficient permissions to perform this action">
        Normal disabled
      </Button>
      <Button
        variant="icon"
        iconName="settings"
        disabled={true}
        disabledReason="Settings are locked"
        ariaLabel="Settings"
      />
    </SpaceBetween>
  );
}

function SelectItemExample() {
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option | null>(null);

  return (
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
  );
}

function MultiselectItemExample() {
  const [selectedOptions, setSelectedOptions] = useState<MultiselectProps.Options>([]);

  return (
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
  );
}

function TokenExample() {
  return (
    <SpaceBetween direction="horizontal" size="xs">
      <div style={{ maxWidth: '200px' }}>
        <Token
          variant="inline"
          label="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod"
          dismissLabel="Remove token"
          onDismiss={() => {}}
          tooltipContent="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod"
        />
      </div>
      <div style={{ maxWidth: '180px' }}>
        <Token
          variant="inline"
          label="Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip"
          dismissLabel="Remove token"
          onDismiss={() => {}}
          tooltipContent="Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip"
        />
      </div>
    </SpaceBetween>
  );
}

function FileTokenGroupExample() {
  const [items, setItems] = useState<FileTokenGroupProps.Item[]>([
    {
      file: new File(
        ['content'],
        'lorem-ipsum-dolor-sit-amet-consectetur-adipiscing-elit-sed-do-eiusmod-tempor-incididunt.pdf',
        { type: 'application/pdf' }
      ),
    },
    {
      file: new File(
        ['content'],
        'ut-enim-ad-minim-veniam-quis-nostrud-exercitation-ullamco-laboris-nisi-ut-aliquip-ex-ea-commodo.docx',
        { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
      ),
    },
    {
      file: new File(
        ['content'],
        'duis-aute-irure-dolor-in-reprehenderit-in-voluptate-velit-esse-cillum-dolore-eu-fugiat-nulla.xlsx',
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      ),
    },
  ]);

  return (
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
  );
}

function SegmentedControlExample() {
  const [selectedId, setSelectedId] = useState('option1');

  return (
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
  );
}

function BreadcrumbGroupExample() {
  return (
    <div style={{ maxWidth: '400px' }}>
      <BreadcrumbGroup
        items={[
          { text: 'Amazon service name', href: '#' },
          { text: '...', href: '#' },
          { text: 'ABCDEF', href: '#' },
          { text: 'ABCDEFGHIJsjbdkasbdhjabsjdha', href: '#' },
        ]}
      />
    </div>
  );
}

function SliderExample() {
  const [value1, setValue1] = useState(50);
  const [value2, setValue2] = useState(500);

  return (
    <SpaceBetween size="m">
      <Slider
        value={value1}
        onChange={({ detail }) => setValue1(detail.value)}
        min={0}
        max={100}
        step={5}
        referenceValues={[25, 50, 75]}
        valueFormatter={value => `${value}%`}
        ariaLabel="Percentage slider"
      />
      <Slider
        value={value2}
        onChange={({ detail }) => setValue2(detail.value)}
        min={0}
        max={1000}
        step={50}
        valueFormatter={value => `$${value.toFixed(2)}`}
        ariaLabel="Price slider"
      />
    </SpaceBetween>
  );
}

function CalendarExample() {
  const [value, setValue] = useState('2024-01-15');

  return (
    <Calendar
      value={value}
      onChange={({ detail }) => setValue(detail.value)}
      isDateEnabled={date => {
        const day = date.getDate();
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
  );
}

function DateRangePickerExample() {
  const [value, setValue] = useState<DateRangePickerProps.Value | null>(null);

  return (
    <DateRangePicker
      value={value}
      onChange={({ detail }) => setValue(detail.value)}
      relativeOptions={[]}
      isValidRange={() => ({ valid: true })}
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
  );
}

function TabsExample() {
  const [activeTabId, setActiveTabId] = useState('first');

  return (
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
  );
}
