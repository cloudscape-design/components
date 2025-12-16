// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

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
import Tooltip from '~components/tooltip';

import ScreenshotArea from '../utils/screenshot-area';

export default function InternalTooltipExamples() {
  return (
    <>
      <Box padding="l">
        <SpaceBetween size="l">
          <Header variant="h1">Tooltip</Header>
          <DisabledActionsExample />
          <TruncatedTextExample />
          <IconOnlyButtonsExample />
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
      </Box>
    </>
  );
}

function DisabledActionsExample() {
  const deleteWrapperRef = useRef<HTMLDivElement>(null);
  const saveWrapperRef = useRef<HTMLDivElement>(null);
  const downloadWrapperRef = useRef<HTMLDivElement>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [showDownload, setShowDownload] = useState(false);

  return (
    <Container header={<Header variant="h2">Disabled Actions with Explanations</Header>}>
      <ScreenshotArea>
        <SpaceBetween direction="horizontal" size="s">
          <div
            ref={deleteWrapperRef}
            onMouseEnter={() => setShowDelete(true)}
            onMouseLeave={() => setShowDelete(false)}
            style={{ display: 'inline-block' }}
          >
            <Button disabled={true} iconName="remove">
              Delete
            </Button>
            {showDelete && (
              <Tooltip
                content="You don't have permission to delete this resource"
                getTrack={() => deleteWrapperRef.current}
                position="top"
                onEscape={() => setShowDelete(false)}
                trackKey="delete-disabled"
              />
            )}
          </div>

          <div
            ref={saveWrapperRef}
            onMouseEnter={() => setShowSave(true)}
            onMouseLeave={() => setShowSave(false)}
            style={{ display: 'inline-block' }}
          >
            <Button disabled={true} variant="primary" iconName="upload">
              Save
            </Button>
            {showSave && (
              <Tooltip
                content="No changes to save"
                getTrack={() => saveWrapperRef.current}
                position="top"
                onEscape={() => setShowSave(false)}
                trackKey="save-disabled"
              />
            )}
          </div>

          <div
            ref={downloadWrapperRef}
            onMouseEnter={() => setShowDownload(true)}
            onMouseLeave={() => setShowDownload(false)}
            style={{ display: 'inline-block' }}
          >
            <Button disabled={true} iconName="download">
              Download Report
            </Button>
            {showDownload && (
              <Tooltip
                content="Report generation in progress. Please wait..."
                getTrack={() => downloadWrapperRef.current}
                position="top"
                onEscape={() => setShowDownload(false)}
                trackKey="download-disabled"
              />
            )}
          </div>
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function TruncatedTextExample() {
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);

  return (
    <Container header={<Header variant="h2">Truncated Text with Overflow Tooltips</Header>}>
      <ScreenshotArea>
        <SpaceBetween size="s">
          <div
            ref={ref1}
            onMouseEnter={() => setShow1(true)}
            onMouseLeave={() => setShow1(false)}
            style={{ maxWidth: '200px' }}
          >
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                padding: '8px',
                background: '#f0f0f0',
                borderRadius: '4px',
              }}
            >
              my-very-long-filename-document-final-v2.pdf
            </div>
            {show1 && (
              <Tooltip
                content="my-very-long-filename-document-final-v2.pdf"
                getTrack={() => ref1.current}
                onEscape={() => setShow1(false)}
                trackKey="file1"
              />
            )}
          </div>

          <div
            ref={ref2}
            onMouseEnter={() => setShow2(true)}
            onMouseLeave={() => setShow2(false)}
            style={{ maxWidth: '200px' }}
          >
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                padding: '8px',
                background: '#f0f0f0',
                borderRadius: '4px',
              }}
            >
              arn:aws:s3:::my-bucket-name/path/to/resource
            </div>
            {show2 && (
              <Tooltip
                content="arn:aws:s3:::my-bucket-name/path/to/resource"
                getTrack={() => ref2.current}
                onEscape={() => setShow2(false)}
                trackKey="arn"
              />
            )}
          </div>

          <div
            ref={ref3}
            onMouseEnter={() => setShow3(true)}
            onMouseLeave={() => setShow3(false)}
            style={{ maxWidth: '200px' }}
          >
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                padding: '8px',
                background: '#f0f0f0',
                borderRadius: '4px',
              }}
            >
              user@example-company-domain-name.com
            </div>
            {show3 && (
              <Tooltip
                content="user@example-company-domain-name.com"
                getTrack={() => ref3.current}
                onEscape={() => setShow3(false)}
                trackKey="email"
              />
            )}
          </div>
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function IconOnlyButtonsExample() {
  const refs = {
    edit: useRef<HTMLDivElement>(null),
    copy: useRef<HTMLDivElement>(null),
    delete: useRef<HTMLDivElement>(null),
    settings: useRef<HTMLDivElement>(null),
  };
  const [show, setShow] = useState({ edit: false, copy: false, delete: false, settings: false });

  return (
    <Container header={<Header variant="h2">Icon-Only Actions</Header>}>
      <ScreenshotArea>
        <SpaceBetween direction="horizontal" size="xs">
          {[
            { key: 'edit', icon: 'edit', label: 'Edit item' },
            { key: 'copy', icon: 'copy', label: 'Copy to clipboard' },
            { key: 'delete', icon: 'remove', label: 'Delete item' },
            { key: 'settings', icon: 'settings', label: 'Open settings' },
          ].map(({ key, icon, label }) => (
            <div
              key={key}
              ref={refs[key as keyof typeof refs]}
              onMouseEnter={() => setShow({ ...show, [key]: true })}
              onMouseLeave={() => setShow({ ...show, [key]: false })}
              style={{ display: 'inline-block' }}
            >
              <Button
                variant="icon"
                iconName={icon as any}
                nativeButtonAttributes={{
                  onFocus: () => setShow({ ...show, [key]: true }),
                  onBlur: () => setShow({ ...show, [key]: false }),
                }}
              />
              {show[key as keyof typeof show] && (
                <Tooltip
                  content={label}
                  getTrack={() => refs[key as keyof typeof refs].current}
                  position="top"
                  onEscape={() => setShow({ ...show, [key]: false })}
                  trackKey={key}
                />
              )}
            </div>
          ))}
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function FileInputItemExample() {
  return (
    <Container header={<Header variant="h2">ButtonGroup - FileInputItem (Internal Tooltips)</Header>}>
      <ScreenshotArea>
        <SpaceBetween size="m">
          <Box color="text-status-info" fontSize="body-s">
            <strong>Keyboard Navigation:</strong> ButtonGroup is a composite widget. Press Tab to focus the group, then
            use Arrow keys to navigate between items within the group. This is standard ARIA behavior.
          </Box>
          <ButtonGroup
            variant="icon"
            ariaLabel="File actions"
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
        </SpaceBetween>
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
        <SpaceBetween size="m">
          <Box color="text-status-info" fontSize="body-s">
            <strong>Note:</strong> Hover or focus on long tokens. Tooltip shows full text when truncated. Requires
            variant=&quot;inline&quot; and tooltipContent prop.
          </Box>
          <SpaceBetween direction="horizontal" size="xs">
            <div style={{ maxWidth: '200px' }}>
              <Token
                variant="inline"
                label="Very long label that will be truncated and show a tooltip on hover or focus"
                dismissLabel="Remove token"
                onDismiss={() => {}}
                tooltipContent="Very long label that will be truncated and show a tooltip on hover or focus"
              />
            </div>
            <div style={{ maxWidth: '180px' }}>
              <Token
                variant="inline"
                label="Another extremely long token label that demonstrates the overflow tooltip functionality when text exceeds container width"
                dismissLabel="Remove token"
                onDismiss={() => {}}
                tooltipContent="Another extremely long token label that demonstrates the overflow tooltip functionality when text exceeds container width"
              />
            </div>
          </SpaceBetween>
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function FileTokenGroupExample() {
  const [items, setItems] = useState<FileTokenGroupProps.Item[]>([
    {
      file: new File(
        ['content'],
        'my-extremely-long-document-name-final-version-reviewed-approved-ready-for-production-deployment.pdf',
        { type: 'application/pdf' }
      ),
    },
    {
      file: new File(
        ['content'],
        'very-long-filename-that-will-definitely-be-truncated-and-show-a-tooltip-when-you-hover-over-it-with-your-mouse-or-keyboard.docx',
        { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
      ),
    },
    {
      file: new File(
        ['content'],
        'another-extremely-long-filename-that-demonstrates-tooltip-behavior-with-overflow-ellipsis-and-full-text-display-on-hover.xlsx',
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      ),
    },
  ]);

  return (
    <Container header={<Header variant="h2">FileTokenGroup - FileToken (Truncated Filename)</Header>}>
      <ScreenshotArea>
        <SpaceBetween size="m">
          <Box color="text-status-info" fontSize="body-s">
            <strong>Note:</strong> FileTokenGroup automatically shows tooltips for truncated filenames. Hover over long
            filenames to see the full name in a tooltip.
          </Box>
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
        </SpaceBetween>
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
              { text: 'Amazon service name', href: '#' },
              { text: '...', href: '#' },
              { text: 'ABCDEF', href: '#' },
              { text: 'ABCDEFGHIJsjbdkasbdhjabsjdha', href: '#' },
            ]}
          />
        </div>
      </ScreenshotArea>
    </Container>
  );
}

function SliderExample() {
  const [value1, setValue1] = useState(50);
  const [value2, setValue2] = useState(500);

  return (
    <Container header={<Header variant="h2">Slider (Value Tooltip)</Header>}>
      <ScreenshotArea>
        <SpaceBetween size="l">
          <Slider
            value={value1}
            onChange={({ detail }) => setValue1(detail.value)}
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
            value={value2}
            onChange={({ detail }) => setValue2(detail.value)}
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
