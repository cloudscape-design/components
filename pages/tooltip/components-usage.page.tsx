// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Badge from '~components/badge';
import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import ButtonGroup from '~components/button-group';
import Calendar from '~components/calendar';
import Container from '~components/container';
import DateRangePicker from '~components/date-range-picker';
import Header from '~components/header';
import Icon from '~components/icon';
import Link from '~components/link';
import SegmentedControl from '~components/segmented-control';
import Select from '~components/select';
import Slider from '~components/slider';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Tabs from '~components/tabs';
import TokenGroup from '~components/token-group';
import Tooltip from '~components/tooltip';

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

  // Refs for public Tooltip examples - Basic Usage
  const basicTextRef = React.useRef<HTMLSpanElement>(null);
  const basicStatusRef = React.useRef<HTMLSpanElement>(null);

  // Refs for Positions
  const posTopRef = React.useRef<HTMLSpanElement>(null);
  const posRightRef = React.useRef<HTMLSpanElement>(null);
  const posBottomRef = React.useRef<HTMLSpanElement>(null);
  const posLeftRef = React.useRef<HTMLSpanElement>(null);

  // Refs for Sizes
  const smallTooltipRef = React.useRef<HTMLSpanElement>(null);
  const mediumTooltipRef = React.useRef<HTMLSpanElement>(null);
  const largeTooltipRef = React.useRef<HTMLSpanElement>(null);

  // Refs for Components
  const iconTooltipRef = React.useRef<HTMLSpanElement>(null);
  const linkTooltipRef = React.useRef<HTMLSpanElement>(null);
  const badgeTooltipRef = React.useRef<HTMLSpanElement>(null);

  // Ref for Dismiss
  const dismissTooltipRef = React.useRef<HTMLSpanElement>(null);

  // State for showing/hiding tooltips - Basic Usage
  const [showBasicText, setShowBasicText] = React.useState(false);
  const [showBasicStatus, setShowBasicStatus] = React.useState(false);

  // State for Positions
  const [showPosTop, setShowPosTop] = React.useState(false);
  const [showPosRight, setShowPosRight] = React.useState(false);
  const [showPosBottom, setShowPosBottom] = React.useState(false);
  const [showPosLeft, setShowPosLeft] = React.useState(false);

  // State for Sizes
  const [showSmallTooltip, setShowSmallTooltip] = React.useState(false);
  const [showMediumTooltip, setShowMediumTooltip] = React.useState(false);
  const [showLargeTooltip, setShowLargeTooltip] = React.useState(false);

  // State for Components
  const [showIconTooltip, setShowIconTooltip] = React.useState(false);
  const [showLinkTooltip, setShowLinkTooltip] = React.useState(false);
  const [showBadgeTooltip, setShowBadgeTooltip] = React.useState(false);

  // State for Dismiss
  const [showDismissTooltip, setShowDismissTooltip] = React.useState(false);

  return (
    <div style={{ padding: '50px' }}>
      <h1>Tooltip Component Examples</h1>
      <p>Examples of the public Tooltip component and how tooltips are used across different Cloudscape components.</p>

      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Public Tooltip - Basic Usage</Header>}>
          <SpaceBetween size="m">
            <Box>
              <h3>String Content</h3>
              <p>
                Hover over this{' '}
                <span
                  ref={basicTextRef}
                  onMouseEnter={() => setShowBasicText(true)}
                  onMouseLeave={() => setShowBasicText(false)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  text
                </span>{' '}
                to see a tooltip.
              </p>
              {showBasicText && <Tooltip trackRef={basicTextRef} value="This is a simple tooltip" position="top" />}
            </Box>

            <Box>
              <h3>React Node Content</h3>
              <p>
                Hover over this{' '}
                <span
                  ref={basicStatusRef}
                  onMouseEnter={() => setShowBasicStatus(true)}
                  onMouseLeave={() => setShowBasicStatus(false)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  status
                </span>{' '}
                to see a rich tooltip.
              </p>
              {showBasicStatus && (
                <Tooltip
                  trackRef={basicStatusRef}
                  value={<StatusIndicator type="success">Operation completed successfully</StatusIndicator>}
                  position="top"
                />
              )}
            </Box>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Public Tooltip - Positions</Header>}>
          <SpaceBetween size="m">
            <p>Tooltips can be positioned relative to the target element.</p>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <Box>
                <span
                  ref={posTopRef}
                  onMouseEnter={() => setShowPosTop(true)}
                  onMouseLeave={() => setShowPosTop(false)}
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Top Position
                </span>
                {showPosTop && <Tooltip trackRef={posTopRef} value="Tooltip on top" position="top" />}
              </Box>

              <Box>
                <span
                  ref={posRightRef}
                  onMouseEnter={() => setShowPosRight(true)}
                  onMouseLeave={() => setShowPosRight(false)}
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Right Position
                </span>
                {showPosRight && <Tooltip trackRef={posRightRef} value="Tooltip on right" position="right" />}
              </Box>

              <Box>
                <span
                  ref={posBottomRef}
                  onMouseEnter={() => setShowPosBottom(true)}
                  onMouseLeave={() => setShowPosBottom(false)}
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Bottom Position
                </span>
                {showPosBottom && <Tooltip trackRef={posBottomRef} value="Tooltip on bottom" position="bottom" />}
              </Box>

              <Box>
                <span
                  ref={posLeftRef}
                  onMouseEnter={() => setShowPosLeft(true)}
                  onMouseLeave={() => setShowPosLeft(false)}
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Left Position
                </span>
                {showPosLeft && <Tooltip trackRef={posLeftRef} value="Tooltip on left" position="left" />}
              </Box>
            </div>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Public Tooltip - Sizes</Header>}>
          <SpaceBetween size="m">
            <p>Tooltips support different sizes for various use cases.</p>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <Box>
                <span
                  ref={smallTooltipRef}
                  onMouseEnter={() => setShowSmallTooltip(true)}
                  onMouseLeave={() => setShowSmallTooltip(false)}
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Small Tooltip
                </span>
                {showSmallTooltip && (
                  <Tooltip trackRef={smallTooltipRef} value="This is a small tooltip" size="small" />
                )}
              </Box>

              <Box>
                <span
                  ref={mediumTooltipRef}
                  onMouseEnter={() => setShowMediumTooltip(true)}
                  onMouseLeave={() => setShowMediumTooltip(false)}
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Medium Tooltip
                </span>
                {showMediumTooltip && (
                  <Tooltip
                    trackRef={mediumTooltipRef}
                    value="This is a medium-sized tooltip with more content"
                    size="medium"
                  />
                )}
              </Box>

              <Box>
                <span
                  ref={largeTooltipRef}
                  onMouseEnter={() => setShowLargeTooltip(true)}
                  onMouseLeave={() => setShowLargeTooltip(false)}
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Large Tooltip
                </span>
                {showLargeTooltip && (
                  <Tooltip
                    trackRef={largeTooltipRef}
                    value="This is a large tooltip that can contain much more detailed information and explanations"
                    size="large"
                  />
                )}
              </Box>
            </div>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Public Tooltip - With Components</Header>}>
          <SpaceBetween size="m">
            <p>Tooltips work seamlessly with other Cloudscape components.</p>

            <Box>
              <h3>With Icon</h3>
              <span
                ref={iconTooltipRef}
                onMouseEnter={() => setShowIconTooltip(true)}
                onMouseLeave={() => setShowIconTooltip(false)}
              >
                <Icon name="status-info" size="medium" />
              </span>
              {showIconTooltip && (
                <Tooltip trackRef={iconTooltipRef} value="Click for more information" position="right" />
              )}
            </Box>

            <Box>
              <h3>With Link</h3>
              <span
                ref={linkTooltipRef}
                onMouseEnter={() => setShowLinkTooltip(true)}
                onMouseLeave={() => setShowLinkTooltip(false)}
              >
                <Link href="#">Documentation</Link>
              </span>
              {showLinkTooltip && <Tooltip trackRef={linkTooltipRef} value="Opens in a new tab" position="bottom" />}
            </Box>

            <Box>
              <h3>With Badge</h3>
              <span
                ref={badgeTooltipRef}
                onMouseEnter={() => setShowBadgeTooltip(true)}
                onMouseLeave={() => setShowBadgeTooltip(false)}
              >
                <Badge color="blue">New</Badge>
              </span>
              {showBadgeTooltip && (
                <Tooltip trackRef={badgeTooltipRef} value="Feature released this week" position="top" />
              )}
            </Box>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Public Tooltip - With Dismiss Callback</Header>}>
          <SpaceBetween size="m">
            <p>Tooltips can be dismissed by pressing the Escape key, triggering an onDismiss callback.</p>
            <Box>
              <span
                ref={dismissTooltipRef}
                onMouseEnter={() => setShowDismissTooltip(true)}
                onMouseLeave={() => setShowDismissTooltip(false)}
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Hover and press Escape
              </span>
              {showDismissTooltip && (
                <Tooltip
                  trackRef={dismissTooltipRef}
                  value="Press Escape to dismiss this tooltip"
                  position="top"
                  onDismiss={() => {
                    setShowDismissTooltip(false);
                    alert('Tooltip dismissed!');
                  }}
                />
              )}
            </Box>
          </SpaceBetween>
        </Container>

        <br />
        <hr />
        <h1>Components which are using the internal tooltip</h1>

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
