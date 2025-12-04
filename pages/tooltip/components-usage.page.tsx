// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

// import Badge from '~components/badge';
import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import ButtonGroup from '~components/button-group';
import Calendar from '~components/calendar';
import Container from '~components/container';
import DateRangePicker from '~components/date-range-picker';
import Header from '~components/header';
// import Icon from '~components/icon';
// import Link from '~components/link';
import SegmentedControl from '~components/segmented-control';
import Select from '~components/select';
import Slider from '~components/slider';
import SpaceBetween from '~components/space-between';
// import StatusIndicator from '~components/status-indicator';
import Tabs from '~components/tabs';
import TokenGroup from '~components/token-group';
// import Tooltip from '~components/tooltip';

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

  // // Refs for public Tooltip examples - Basic Usage
  // const basicTextRef = React.useRef<HTMLSpanElement>(null);
  // const basicStatusRef = React.useRef<HTMLSpanElement>(null);

  // // Refs for Positions
  // const posTopRef = React.useRef<HTMLSpanElement>(null);
  // const posRightRef = React.useRef<HTMLSpanElement>(null);
  // const posBottomRef = React.useRef<HTMLSpanElement>(null);
  // const posLeftRef = React.useRef<HTMLSpanElement>(null);

  // // Refs for Sizes
  // const smallTooltipRef = React.useRef<HTMLSpanElement>(null);
  // const mediumTooltipRef = React.useRef<HTMLSpanElement>(null);
  // const largeTooltipRef = React.useRef<HTMLSpanElement>(null);

  // // Refs for Components
  // const iconTooltipRef = React.useRef<HTMLSpanElement>(null);
  // const linkTooltipRef = React.useRef<HTMLSpanElement>(null);
  // const badgeTooltipRef = React.useRef<HTMLSpanElement>(null);

  // // Ref for Dismiss
  // const dismissTooltipRef = React.useRef<HTMLSpanElement>(null);

  // // State for showing/hiding tooltips - Basic Usage
  // const [showBasicText, setShowBasicText] = React.useState(false);
  // const [showBasicStatus, setShowBasicStatus] = React.useState(false);

  // // State for Positions
  // const [showPosTop, setShowPosTop] = React.useState(false);
  // const [showPosRight, setShowPosRight] = React.useState(false);
  // const [showPosBottom, setShowPosBottom] = React.useState(false);
  // const [showPosLeft, setShowPosLeft] = React.useState(false);

  // // State for Sizes
  // const [showSmallTooltip, setShowSmallTooltip] = React.useState(false);
  // const [showMediumTooltip, setShowMediumTooltip] = React.useState(false);
  // const [showLargeTooltip, setShowLargeTooltip] = React.useState(false);

  // // State for Components
  // const [showIconTooltip, setShowIconTooltip] = React.useState(false);
  // const [showLinkTooltip, setShowLinkTooltip] = React.useState(false);
  // const [showBadgeTooltip, setShowBadgeTooltip] = React.useState(false);

  // // State for Dismiss
  // const [showDismissTooltip, setShowDismissTooltip] = React.useState(false);

  return (
    <div style={{ padding: '50px' }}>
      <h1>Tooltip Component Examples</h1>
      <p>Examples of the public Tooltip component and how tooltips are used across different Cloudscape components.</p>

      <SpaceBetween size="l">
        <h1>Components with simple tooltip</h1>

        <Container header={<Header variant="h2">BreadcrumbGroup with Truncation </Header>}>
          <SpaceBetween size="l">
            <Box>
              <h3>Live Example</h3>
              <p>
                Breadcrumb items automatically show tooltips when their text is truncated. Hover over or focus on
                truncated items to see the full text.
              </p>
              <BreadcrumbGroup
                items={[
                  { text: 'Home', href: '#' },
                  { text: 'Service', href: '#' },
                  { text: 'Very Long Page Name That Gets Truncated When Space Is Limited', href: '#' },
                  { text: 'Current Page', href: '#' },
                ]}
                ariaLabel="Breadcrumbs"
              />
            </Box>

            <Box>
              <h3>How the Tooltip Works</h3>
              <p>
                The BreadcrumbItem component conditionally renders a tooltip wrapper when text truncation is detected.
                Here&apos;s the implementation:
              </p>

              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0 }}>
                  {`// From: src/breadcrumb-group/item/index.tsx

const BreadcrumbItemWithPopover = ({ item, isLast, ... }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const textRef = useRef<HTMLElement | null>(null);

  return (
    <Item
      ref={textRef}
      isLast={isLast}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <Tooltip
          trackRef={textRef}
          value={item.text}           // Shows full untruncated text
          size="medium"
          onDismiss={() => setShowTooltip(false)}
        />
      )}
    </Item>
  );
};

// Main BreadcrumbItem component decides when to use tooltip wrapper
export function BreadcrumbItem({ item, isTruncated, isGhost, ... }) {
  const breadcrumbItem = <FunnelBreadcrumbItem text={item.text} />;

  return (
    <div>
      {/* Tooltip wrapper ONLY used when truncated and not ghost */}
      {isTruncated && !isGhost ? (
        <BreadcrumbItemWithPopover item={item} ...>
          {breadcrumbItem}
        </BreadcrumbItemWithPopover>
      ) : (
        <Item>{breadcrumbItem}</Item>
      )}
    </div>
  );
}`}
                </pre>
              </div>
            </Box>

            <Box>
              <h3>Key Implementation Details</h3>
              <ul>
                <li>
                  <strong>Conditional Wrapper:</strong> Tooltip functionality is only added when{' '}
                  <code>isTruncated && !isGhost</code> - avoiding unnecessary overhead for non-truncated items
                </li>
                <li>
                  <strong>Self-Managed State:</strong> Each breadcrumb manages its own <code>showTooltip</code> state
                  independently
                </li>
                <li>
                  <strong>Dual Interaction Support:</strong> Responds to both keyboard focus and mouse hover to
                  show/hide tooltip
                </li>
                <li>
                  <strong>Full Text Display:</strong> Tooltip always shows <code>item.text</code> (the complete,
                  untruncated text)
                </li>
                <li>
                  <strong>Medium Size:</strong> Uses <code>size=&quot;medium&quot;</code> for optimal readability of
                  breadcrumb text
                </li>
                <li>
                  <strong>Link-Based Interaction:</strong> The tooltip tracks the anchor/span element (
                  <code>textRef</code>) which can be either a link or plain text depending on whether it&apos;s the last
                  item
                </li>
                <li>
                  <strong>No Position Specified:</strong> Allows automatic positioning based on available space
                </li>
                <li>
                  <strong>Ghost Item Handling:</strong> Ghost breadcrumbs (used for animations/transitions) never show
                  tooltips even if truncated
                </li>
              </ul>
            </Box>

            <Box>
              <h3>Flow Diagram</h3>
              <div style={{ padding: '16px', backgroundColor: '#fff3cd', borderRadius: '4px', lineHeight: '1.8' }}>
                1. <strong>BreadcrumbGroup</strong> detects text truncation (CSS overflow)
                <br />
                ↓<br />
                2. <strong>isTruncated=true</strong> passed to BreadcrumbItem
                <br />
                ↓<br />
                3. <strong>BreadcrumbItemWithPopover</strong> wrapper is used instead of plain Item
                <br />
                ↓<br />
                4. <strong>User hovers or focuses:</strong> showTooltip = true
                <br />
                ↓<br />
                5. <strong>Tooltip renders:</strong> displays full item.text
                <br />
                ↓<br />
                6a. <strong>User moves away/blurs:</strong> showTooltip = false
                <br />
                6b. <strong>User presses Escape:</strong> onDismiss sets showTooltip = false
              </div>
            </Box>

            <Box>
              <h3>Why This Pattern?</h3>
              <p>The conditional wrapper approach provides several benefits:</p>
              <ul>
                <li>
                  <strong>Performance:</strong> Non-truncated breadcrumbs don&apos;t have tooltip overhead (no state, no
                  event handlers)
                </li>
                <li>
                  <strong>Clean Architecture:</strong> Tooltip logic is isolated in a separate wrapper component
                </li>
                <li>
                  <strong>Simple State:</strong> No complex conditions - just show/hide based on user interaction
                </li>
                <li>
                  <strong>Consistent UX:</strong> Users can see full text for any truncated breadcrumb via hover or
                  keyboard focus
                </li>
              </ul>
            </Box>
          </SpaceBetween>
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

        <Container header={<Header variant="h2">ButtonGroup Variants </Header>}>
          <SpaceBetween size="l">
            <Box>
              <h3>Live Example</h3>
              <p>
                ButtonGroup supports multiple item types including icon buttons, toggle buttons, and menu dropdowns.
                Hover over items to see tooltips.
              </p>
              <ButtonGroup
                variant="icon"
                items={[
                  { type: 'icon-button', id: 'copy', text: 'Copy', iconName: 'copy' },
                  { type: 'icon-button', id: 'paste', text: 'Paste', iconName: 'file' },
                  {
                    type: 'menu-dropdown',
                    id: 'more',
                    text: 'More actions',
                    items: [
                      { id: 'cut', text: 'Cut', description: 'Cut to clipboard' },
                      { id: 'delete', text: 'Delete', description: 'Remove item' },
                    ],
                  },
                ]}
              />
            </Box>

            <Box>
              <h3>Icon Button Item Tooltip Pattern (Basic)</h3>
              <p>
                The basic IconButtonItem pattern is the simplest ButtonGroup tooltip implementation, supporting optional
                feedback messages:
              </p>

              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0 }}>
                  {`// From: src/button-group/icon-button-item.tsx

interface IconButtonItemProps {
  item: InternalIconButton;
  showTooltip: boolean;           // Parent-controlled flag
  showFeedback: boolean;          // Show feedback instead of tooltip
  onTooltipDismiss: () => void;
}

const IconButtonItem = forwardRef(
  ({ item, showTooltip, showFeedback, onTooltipDismiss }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    
    // Simpler than toggle: no pressed state handling
    const canShowTooltip = Boolean(showTooltip && !item.disabled && !item.loading);
    const canShowFeedback = Boolean(showTooltip && showFeedback && item.popoverFeedback);

    return (
      <div ref={containerRef}>
        <InternalButton
          variant="icon"
          loading={item.loading}
          disabled={item.disabled}
          disabledReason={showFeedback ? undefined : item.disabledReason}
          __focusable={canShowFeedback}
          iconName={item.iconName}
          ariaLabel={item.text}
          // ... other props
        />
        
        {/* Tooltip shows feedback OR text */}
        {(canShowTooltip || canShowFeedback) && (
          <Tooltip
            trackRef={containerRef}
            trackKey={item.id}
            value={
              (showFeedback && (
                <InternalLiveRegion tagName="span">
                  {item.popoverFeedback}
                </InternalLiveRegion>
              )) || item.text
            }
            onDismiss={onTooltipDismiss}
          />
        )}
      </div>
    );
  }
);`}
                </pre>
              </div>
            </Box>

            <Box>
              <h3>Menu Dropdown Item Tooltip Pattern</h3>
              <p>
                The MenuDropdownItem uses a parent-controlled pattern with an additional condition: tooltips are hidden
                when the dropdown is open. Here&apos;s how it works:
              </p>

              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0 }}>
                  {`// From: src/button-group/menu-dropdown-item.tsx

interface MenuDropdownItemProps {
  item: ButtonGroupProps.MenuDropdown;
  showTooltip: boolean;           // Parent-controlled flag
  onTooltipDismiss: () => void;
  onItemClick?: CancelableEventHandler<...>;
}

const MenuDropdownItem = forwardRef(
  ({ item, showTooltip, onTooltipDismiss, ... }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    return (
      <ButtonDropdown
        items={item.items}
        customTriggerBuilder={({ onClick, isOpen, ... }) => (
          <div ref={containerRef}>
            {/* Tooltip with additional isOpen condition */}
            {!isOpen && showTooltip && !item.disabled && !item.loading && (
              <Tooltip
                trackRef={containerRef}
                trackKey={item.id}
                value={item.text}
                onDismiss={onTooltipDismiss}
              />
            )}
            <InternalButton
              variant="icon"
              iconName="ellipsis"
              loading={item.loading}
              disabled={item.disabled}
              disabledReason={item.disabledReason}
              onClick={onClick}
              ariaLabel={item.text}
            />
          </div>
        )}
      />
    );
  }
);`}
                </pre>
              </div>
            </Box>

            <Box>
              <h3>Key Differences from Other ButtonGroup Patterns</h3>
              <ul>
                <li>
                  <strong>Dropdown-Aware:</strong> Adds <code>!isOpen</code> condition - tooltip automatically hides
                  when dropdown menu opens
                </li>
                <li>
                  <strong>CustomTriggerBuilder:</strong> Uses ButtonDropdown&apos;s customTriggerBuilder pattern to wrap
                  the trigger button with tooltip functionality
                </li>
                <li>
                  <strong>State Suppression:</strong> Like IconToggleButton, tooltip is suppressed when{' '}
                  <code>disabled</code> or <code>loading</code>
                </li>
                <li>
                  <strong>Ellipsis Icon:</strong> Always uses &quot;ellipsis&quot; icon for menu dropdown buttons
                </li>
                <li>
                  <strong>DisabledReason Support:</strong> Disabled menu dropdowns can show <code>disabledReason</code>{' '}
                  through the button&apos;s own tooltip mechanism
                </li>
              </ul>
            </Box>

            <Box>
              <h3>Tooltip Display Conditions</h3>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#fff3cd',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                }}
              >
                <strong>ALL conditions must be true:</strong>
                <br />
                1. <code>!isOpen</code> - Dropdown is NOT open
                <br />
                2. <code>showTooltip</code> - Parent says show (user hovering)
                <br />
                3. <code>!item.disabled</code> - Item is NOT disabled
                <br />
                4. <code>!item.loading</code> - Item is NOT loading
                <br />
                <br />
                <strong>Why hide when dropdown is open?</strong>
                <br />
                Prevents tooltip from competing with the dropdown menu for user attention and screen space.
              </div>
            </Box>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">ButtonGroup with Icon Toggle </Header>}>
          <SpaceBetween size="l">
            <Box>
              <h3>Icon Toggle Button Tooltip Pattern</h3>
              <p>
                The IconToggleButtonItem extends the basic ButtonGroup pattern with support for feedback messages and
                loading states. Here&apos;s how it works:
              </p>

              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0 }}>
                  {`// From: src/button-group/icon-toggle-button-item.tsx

interface IconToggleButtonItemProps {
  item: InternalIconToggleButton;
  showTooltip: boolean;           // Parent-controlled flag
  showFeedback: boolean;          // Show feedback instead of tooltip
  onTooltipDismiss: () => void;
  onItemClick?: CancelableEventHandler<...>;
}

const IconToggleButtonItem = forwardRef(
  ({ item, showTooltip, showFeedback, onTooltipDismiss }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    
    // Select appropriate feedback content based on pressed state
    const feedbackContent = item.pressed 
      ? (item.pressedPopoverFeedback ?? item.popoverFeedback) 
      : item.popoverFeedback;
    
    // Tooltip only shows when not disabled/loading
    const canShowTooltip = showTooltip && !item.disabled && !item.loading;
    
    // Feedback replaces tooltip when available
    const canShowFeedback = showTooltip && showFeedback && feedbackContent;

    return (
      <div ref={containerRef}>
        <InternalToggleButton
          pressed={item.pressed}
          loading={item.loading}
          disabled={item.disabled}
          // Suppress disabledReason when showing popover feedback
          disabledReason={showFeedback ? undefined : item.disabledReason}
          ariaLabel={item.text}
          // ... other props
        />
        
        {/* Tooltip shows either feedback OR text */}
        {(canShowTooltip || canShowFeedback) && (
          <Tooltip
            trackRef={containerRef}
            trackKey={item.id}
            value={
              (showFeedback && (
                <InternalLiveRegion tagName="span">
                  {feedbackContent}
                </InternalLiveRegion>
              )) || item.text
            }
            onDismiss={onTooltipDismiss}
          />
        )}
      </div>
    );
  }
);`}
                </pre>
              </div>
            </Box>

            <Box>
              <h3>Key Differences from Basic ButtonGroup Pattern</h3>
              <ul>
                <li>
                  <strong>Feedback Support:</strong> Can display <code>popoverFeedback</code> or{' '}
                  <code>pressedPopoverFeedback</code> messages wrapped in LiveRegion for screen reader announcements
                </li>
                <li>
                  <strong>State-Aware Tooltip:</strong> Tooltip is suppressed when button is <code>disabled</code> or{' '}
                  <code>loading</code>
                </li>
                <li>
                  <strong>Dynamic Content:</strong> Tooltip content switches between:
                  <ul>
                    <li>Feedback message (when pressed, with LiveRegion wrapper)</li>
                    <li>Button text (normal state)</li>
                  </ul>
                </li>
                <li>
                  <strong>DisabledReason Suppression:</strong> When showing popover feedback, the{' '}
                  <code>disabledReason</code> tooltip is hidden to avoid conflicting tooltips
                </li>
                <li>
                  <strong>Toggle State Context:</strong> Feedback message adapts to whether button is pressed or
                  unpressed
                </li>
              </ul>
            </Box>

            <Box>
              <h3>Tooltip Content Priority</h3>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#fff3cd',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                }}
              >
                <strong>Priority Order:</strong>
                <br />
                1. <strong>Feedback (pressed state):</strong> pressedPopoverFeedback → popoverFeedback
                <br />
                2. <strong>Feedback (normal state):</strong> popoverFeedback
                <br />
                3. <strong>Default:</strong> item.text
                <br />
                <br />
                <strong>Suppression Rules:</strong>
                <br />• No tooltip when disabled=true OR loading=true
                <br />• disabledReason hidden when showFeedback=true
              </div>
            </Box>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">ButtonGroup with File Input </Header>}>
          <SpaceBetween size="l">
            <Box>
              <h3>Live Example</h3>
              <p>Hover over the file input button to see the Tooltip implementation.</p>
              <ButtonGroup
                variant="icon"
                items={[
                  { type: 'icon-button', id: 'save', text: 'Save', iconName: 'download' },
                  {
                    type: 'icon-file-input',
                    id: 'upload-file',
                    text: 'Upload file',
                    accept: 'image/*',
                    multiple: false,
                  },
                  {
                    type: 'icon-file-input',
                    id: 'upload-multiple',
                    text: 'Upload multiple files',
                    accept: '.pdf,.doc,.docx',
                    multiple: true,
                  },
                ]}
                onFilesChange={({ detail }) => {
                  console.log('Files changed:', detail);
                }}
              />
            </Box>

            <Box>
              <h3>How the Tooltip Works</h3>
              <p>
                The file input item component in ButtonGroup uses the Tooltip component to display hover text.
                Here&apos;s how it&apos;s implemented:
              </p>

              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0 }}>
                  {`// From: src/button-group/file-input-item.tsx

interface FileInputItemProps {
  item: ButtonGroupProps.IconFileInput;
  showTooltip: boolean;                    // Parent-controlled flag
  onTooltipDismiss: () => void;            // Dismissal callback
  onFilesChange?: CancelableEventHandler<...>;
}

const FileInputItem = forwardRef(
  ({ item, showTooltip, onTooltipDismiss, onFilesChange }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const canShowTooltip = Boolean(showTooltip);

    return (
      <div ref={containerRef}>
        <InternalFileInput
          variant="icon"
          ariaLabel={item.text}
          accept={item.accept}
          multiple={item.multiple}
          // ... other props
        />
        
        {/* Conditional tooltip rendering */}
        {canShowTooltip && (
          <Tooltip
            trackRef={containerRef}        // Positions relative to wrapper div
            trackKey={item.id}             // Unique identifier
            value={item.text}              // Tooltip content: "Upload file"
            onDismiss={onTooltipDismiss}   // Called on dismiss
          />
        )}
      </div>
    );
  }
);`}
                </pre>
              </div>
            </Box>

            <Box>
              <h3>Key Implementation Details</h3>
              <ul>
                <li>
                  <strong>Parent-Controlled Visibility:</strong> The ButtonGroup parent manages tooltip state across all
                  items, preventing multiple tooltips from showing simultaneously
                </li>
                <li>
                  <strong>Container Reference:</strong> The tooltip uses <code>trackRef={'{containerRef}'}</code> to
                  position itself relative to the file input wrapper div
                </li>
                <li>
                  <strong>Track Key:</strong> Each tooltip has a unique <code>trackKey={'{item.id}'}</code> for proper
                  identification and state management
                </li>
                <li>
                  <strong>Content:</strong> The <code>value={'{item.text}'}</code> prop provides the tooltip text (e.g.,
                  &quot;Upload file&quot;)
                </li>
                <li>
                  <strong>Dismissal:</strong> The <code>onDismiss</code> callback notifies the parent when the tooltip
                  should hide (mouse leave, Escape key)
                </li>
              </ul>
            </Box>

            <Box>
              <h3>Flow Diagram</h3>
              <div style={{ padding: '16px', backgroundColor: '#fff3cd', borderRadius: '4px', lineHeight: '1.8' }}>
                1. <strong>User hovers</strong> over file input button
                <br />
                ↓<br />
                2. <strong>Parent (ButtonGroup)</strong> sets <code>showTooltip={'{true}'}</code> for this item
                <br />
                ↓<br />
                3. <strong>FileInputItem</strong> renders Tooltip component
                <br />
                ↓<br />
                4. <strong>Tooltip</strong> positions itself using <code>trackRef</code> and displays{' '}
                <code>item.text</code>
                <br />
                ↓<br />
                5. <strong>User moves away</strong> or presses Escape
                <br />
                ↓<br />
                6. <strong>onDismiss</strong> fires, parent sets <code>showTooltip={'{false}'}</code>
              </div>
            </Box>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Select & Multiselect with Disabled Options </Header>}>
          <SpaceBetween size="l">
            <Box>
              <h3>Live Example - Select</h3>
              <p>
                Open the dropdown and hover/navigate to disabled options to see tooltips explaining why they&apos;re
                disabled.
              </p>
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
                  {
                    label: 'Disabled Option',
                    value: '3',
                    disabled: true,
                    disabledReason: 'This option is not available in your current region',
                  },
                  {
                    label: 'Another Disabled Option',
                    value: '4',
                    disabled: true,
                    disabledReason: 'You need administrator privileges to select this option',
                  },
                  { label: 'Option 5', value: '5' },
                ]}
                placeholder="Choose an option"
              />
            </Box>

            <Box>
              <h3>How the Tooltip Works (Select & Multiselect)</h3>
              <p>
                Both Select and Multiselect use the same tooltip pattern to display disabled reasons when users hover
                over or navigate to disabled options. Here&apos;s the implementation:
              </p>

              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0 }}>
                  {`// From: src/select/parts/item.tsx AND src/multiselect/parts/item.tsx
// Both components use the SAME tooltip pattern

const Item = ({ option, highlighted, selected, indeterminate, ... }, ref) => {
  const disabled = option.disabled || wrappedOption.disabled;
  
  // Extract disabledReason from either option level or wrappedOption level
  const disabledReason = disabled && (option.disabledReason || wrappedOption.disabledReason)
    ? option.disabledReason || wrappedOption.disabledReason
    : '';
  const isDisabledWithReason = !!disabledReason;
  
  const internalRef = useRef<HTMLDivElement>(null);
  
  // Hidden description for screen readers
  const { descriptionEl, descriptionId } = useHiddenDescription(disabledReason);
  
  // State management: resets when highlight changes
  const [canShowTooltip, setCanShowTooltip] = useState(true);
  useEffect(() => setCanShowTooltip(true), [highlighted]);

  return (
    <SelectableItem
      ref={useMergeRefs(ref, internalRef)}
      highlighted={highlighted}
      disabled={disabled}
      ariaDescribedby={isDisabledWithReason ? descriptionId : ''}
      // Multiselect-specific: supports checkbox states
      ariaChecked={isParent && indeterminate ? 'mixed' : Boolean(selected)}
      // ... other props
    >
      <div>
        {/* Multiselect includes checkbox */}
        {hasCheckbox && (
          <CheckboxIcon 
            checked={selected} 
            indeterminate={indeterminate} 
            disabled={disabled} 
          />
        )}
        
        {/* Option content */}
        <Option option={{ ...wrappedOption, disabled }} />
        
        {/* Tooltip for disabled options - IDENTICAL implementation */}
        {isDisabledWithReason && (
          <>
            {descriptionEl}  {/* Hidden element for accessibility */}
            {highlighted && canShowTooltip && (
              <Tooltip
                trackRef={internalRef}
                value={disabledReason}
                position="right"
                hideOnOverscroll={true}
                onDismiss={() => setCanShowTooltip(false)}
              />
            )}
          </>
        )}
      </div>
    </SelectableItem>
  );
};`}
                </pre>
              </div>
            </Box>

            <Box>
              <h3>Key Implementation Details</h3>
              <ul>
                <li>
                  <strong>Shared Pattern:</strong> Select and Multiselect use the IDENTICAL tooltip implementation -
                  only the checkbox UI differs
                </li>
                <li>
                  <strong>Self-Managed State:</strong> Each item manages its own tooltip state internally using{' '}
                  <code>canShowTooltip</code>
                </li>
                <li>
                  <strong>Highlight-Based Display:</strong> Tooltip shows when the option is <code>highlighted</code>{' '}
                  (via hover OR keyboard navigation)
                </li>
                <li>
                  <strong>Auto-Reset Behavior:</strong> The <code>useEffect</code> hook automatically resets{' '}
                  <code>canShowTooltip</code> to true whenever the highlight changes, allowing the tooltip to reappear
                  if the user navigates away and back
                </li>
                <li>
                  <strong>Scroll Handling:</strong> Uses <code>hideOnOverscroll={'{true}'}</code> to automatically hide
                  the tooltip when the dropdown scrolls - essential for scrollable option lists
                </li>
                <li>
                  <strong>Position:</strong> Always positioned to the <code>&quot;right&quot;</code> to avoid
                  interfering with the dropdown list
                </li>
                <li>
                  <strong>Accessibility:</strong> Includes a hidden description element (
                  <code>useHiddenDescription</code>) for screen readers, linked via <code>ariaDescribedby</code>
                </li>
                <li>
                  <strong>Dismissal:</strong> Users can dismiss the tooltip (e.g., with Escape key), setting{' '}
                  <code>canShowTooltip</code> to false
                </li>
                <li>
                  <strong>Multiselect Specifics:</strong> Supports indeterminate checkbox states for parent items and
                  &quot;Select All&quot; functionality, but tooltip logic remains unchanged
                </li>
              </ul>
            </Box>

            <Box>
              <h3>Flow Diagram</h3>
              <div style={{ padding: '16px', backgroundColor: '#fff3cd', borderRadius: '4px', lineHeight: '1.8' }}>
                1. <strong>User opens dropdown</strong> and hovers/navigates to a disabled option
                <br />
                ↓<br />
                2. <strong>Item receives</strong> <code>highlighted={'{true}'}</code> prop
                <br />
                ↓<br />
                3. <strong>useEffect hook</strong> resets <code>canShowTooltip</code> to true
                <br />
                ↓<br />
                4. <strong>Conditions met:</strong> isDisabledWithReason + highlighted + canShowTooltip
                <br />
                ↓<br />
                5. <strong>Tooltip renders</strong> with disabledReason text, positioned to the right
                <br />
                ↓<br />
                6a. <strong>User navigates away:</strong> highlighted becomes false, tooltip hides
                <br />
                6b. <strong>User presses Escape:</strong> onDismiss sets canShowTooltip to false
                <br />
                6c. <strong>User scrolls list:</strong> hideOnOverscroll automatically hides tooltip
                <br />
                ↓<br />
                7. <strong>User returns:</strong> useEffect resets state, tooltip can show again
              </div>
            </Box>

            <Box>
              <h3>Comparison with ButtonGroup Implementation</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Aspect</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>ButtonGroup</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Select</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>State Management</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Parent-controlled</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Self-managed</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Trigger</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Hover only</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Hover OR keyboard navigation</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Auto-reset</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Parent manages</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>useEffect on highlight change</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Scroll Behavior</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Not applicable</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>hideOnOverscroll={'{true}'}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Position</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Dynamic/auto</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Fixed to &quot;right&quot;</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Accessibility</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>aria-label only</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Hidden description + ariaDescribedby</td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">SegmentedControl with Disabled Reasons </Header>}>
          <SpaceBetween size="l">
            <Box>
              <h3>Live Example</h3>
              <p>Hover over or focus on the disabled segment to see the tooltip explaining why it&apos;s disabled.</p>
              <SegmentedControl
                selectedId={selectedSegment}
                onChange={({ detail }) => setSelectedSegment(detail.selectedId)}
                label="Segmented control with tooltips"
                options={[
                  { text: 'Segment 1', id: 'segment-1' },
                  { text: 'Segment 2', id: 'segment-2' },
                  {
                    text: 'Disabled Segment',
                    id: 'segment-3',
                    disabled: true,
                    disabledReason: 'This option requires a premium subscription',
                  },
                ]}
              />
            </Box>

            <Box>
              <h3>How the Tooltip Works</h3>
              <p>
                The SegmentedControl segment component uses the Tooltip to display disabled reasons for individual
                segments. Here&apos;s the implementation:
              </p>

              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0 }}>
                  {`// From: src/segmented-control/segment.tsx

export const Segment = React.forwardRef(
  ({ disabled, disabledReason, text, isActive, ... }, ref) => {
    const buttonRef = useRef<HTMLElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    
    // Only show tooltip if disabled AND has a reason
    const isDisabledWithReason = disabled && !!disabledReason;
    
    // Hidden description for screen readers
    const { targetProps, descriptionEl } = useHiddenDescription(disabledReason);

    return (
      <button
        ref={useMergeRefs(ref, buttonRef)}
        disabled={disabled && !disabledReason}
        aria-disabled={isDisabledWithReason ? 'true' : undefined}
        aria-pressed={isActive ? 'true' : 'false'}
        
        // Conditional event handlers - only attach when disabled with reason
        onFocus={isDisabledWithReason ? () => setShowTooltip(true) : undefined}
        onBlur={isDisabledWithReason ? () => setShowTooltip(false) : undefined}
        onMouseEnter={isDisabledWithReason ? () => setShowTooltip(true) : undefined}
        onMouseLeave={isDisabledWithReason ? () => setShowTooltip(false) : undefined}
        
        // Spread accessibility props for screen readers
        {...(isDisabledWithReason ? targetProps : {})}
      >
        <InternalIcon />
        <span>{text}</span>

        {/* Tooltip only renders when conditions are met */}
        {isDisabledWithReason && (
          <>
            {descriptionEl}  {/* Hidden for screen readers */}
            {showTooltip && (
              <Tooltip
                trackRef={buttonRef}
                value={disabledReason}
                onDismiss={() => setShowTooltip(false)}
              />
            )}
          </>
        )}
      </button>
    );
  }
);`}
                </pre>
              </div>
            </Box>

            <Box>
              <h3>Key Implementation Details</h3>
              <ul>
                <li>
                  <strong>Self-Managed State:</strong> Each segment manages its own <code>showTooltip</code> state
                  independently
                </li>
                <li>
                  <strong>Smart Button State:</strong> Uses native <code>disabled</code> attribute ONLY when
                  there&apos;s no disabledReason. With a reason, uses <code>aria-disabled</code> instead to keep button
                  focusable
                </li>
                <li>
                  <strong>Conditional Event Handlers:</strong> Event handlers (<code>onFocus</code>,{' '}
                  <code>onMouseEnter</code>, etc.) are conditionally attached - only added when{' '}
                  <code>isDisabledWithReason</code> is true
                </li>
                <li>
                  <strong>Dual Interaction Support:</strong> Responds to both keyboard focus and mouse hover to
                  show/hide tooltip
                </li>
                <li>
                  <strong>Accessibility Integration:</strong> Uses <code>useHiddenDescription</code> hook to create
                  hidden description element and <code>targetProps</code> (includes <code>aria-describedby</code>) for
                  screen readers
                </li>
                <li>
                  <strong>Simple Conditional Rendering:</strong> Tooltip renders when{' '}
                  <code>isDisabledWithReason && showTooltip</code> (no additional conditions needed)
                </li>
                <li>
                  <strong>Default Position:</strong> No position prop specified, allowing Tooltip to auto-position
                  optimally
                </li>
              </ul>
            </Box>

            <Box>
              <h3>Flow Diagram</h3>
              <div style={{ padding: '16px', backgroundColor: '#fff3cd', borderRadius: '4px', lineHeight: '1.8' }}>
                1. <strong>Segment renders</strong> with disabled=true and disabledReason=&quot;some reason&quot;
                <br />
                ↓<br />
                2. <strong>isDisabledWithReason</strong> evaluates to true
                <br />
                ↓<br />
                3. <strong>Button configuration:</strong>
                <br />
                &nbsp;&nbsp;• Native <code>disabled</code> NOT set (to allow focus)
                <br />
                &nbsp;&nbsp;• <code>aria-disabled=&quot;true&quot;</code> set for screen readers
                <br />
                &nbsp;&nbsp;• Event handlers attached for focus/hover
                <br />
                ↓<br />
                4. <strong>User hovers or focuses:</strong> showTooltip = true
                <br />
                ↓<br />
                5. <strong>Tooltip renders:</strong> displays disabledReason text
                <br />
                ↓<br />
                6a. <strong>User moves away/blurs:</strong> showTooltip = false
                <br />
                6b. <strong>User presses Escape:</strong> onDismiss sets showTooltip = false
              </div>
            </Box>

            <Box>
              <h3>Why aria-disabled Instead of disabled?</h3>
              <p>This is a critical accessibility pattern used when you want to explain WHY something is disabled:</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Attribute</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Focusable?</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Can Show Tooltip?</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>When to Use</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <code>disabled</code>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>❌ No</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>❌ No (on hover only)</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>No explanation needed</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <code>aria-disabled</code>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>✅ Yes</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>✅ Yes (hover + focus)</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Has disabledReason to show</td>
                  </tr>
                </tbody>
              </table>
            </Box>

            <Box>
              <h3>Comparison with Other Implementations</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Aspect</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Select</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>SegmentedControl</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>State Management</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Self-managed</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Self-managed</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Trigger</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Highlighted (hover/keyboard)</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Hover OR focus</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Event Handlers</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Always present</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Conditionally attached</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Auto-Reset</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>useEffect on highlight</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>None needed</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Position</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Fixed to &quot;right&quot;</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Auto-positioned</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Scroll Handling</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>hideOnOverscroll</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Not needed (fixed position)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Complexity</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Medium (dropdown context)</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Simple (button context)</td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Tabs with Disabled Reasons </Header>}>
          <SpaceBetween size="l">
            <Box>
              <h3>Live Example</h3>
              <p>Hover over or focus on the disabled tab to see the tooltip explaining why it&apos;s disabled.</p>
              <Tabs
                activeTabId={selectedTab}
                onChange={({ detail }) => setSelectedTab(detail.activeTabId)}
                tabs={[
                  { id: 'first', label: 'First tab', content: 'First tab content' },
                  { id: 'second', label: 'Second tab', content: 'Second tab content' },
                  {
                    id: 'third',
                    label: 'Disabled tab',
                    disabled: true,
                    disabledReason: 'This tab is only available for premium users',
                    content: 'Third tab content',
                  },
                ]}
              />
            </Box>

            <Box>
              <h3>How the Tooltip Works</h3>
              <p>
                The Tabs TabTrigger component uses the Tooltip similar to SegmentedControl, displaying disabled reasons
                for unavailable tabs. Here&apos;s the implementation:
              </p>

              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0 }}>
                  {`// From: src/tabs/tab-header-bar.tsx

const TabTrigger = forwardRef(({ tab, ... }, ref) => {
  const refObject = useRef<HTMLElement>(null);
  const tabLabelRef = useRef<HTMLElement>(null);
  
  const isDisabledWithReason = tab.disabled && !!tab.disabledReason;
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Hidden description for screen readers
  const { targetProps, descriptionEl } = useHiddenDescription(tab.disabledReason);
  
  const children = (
    <>
      <span ref={tabLabelRef}>{tab.label}</span>
      {isDisabledWithReason && (
        <>
          {descriptionEl}
          {showTooltip && (
            <Tooltip
              trackRef={tabLabelRef}
              value={tab.disabledReason}
              onDismiss={() => setShowTooltip(false)}
            />
          )}
        </>
      )}
    </>
  );

  // Event handlers only attached when disabled with reason
  const handlers = {
    onFocus: () => setShowTooltip(true),
    onBlur: () => setShowTooltip(false),
    onMouseEnter: () => setShowTooltip(true),
    onMouseLeave: () => setShowTooltip(false),
  };

  const commonProps = {
    ...elementProps,
    ...(isDisabledWithReason ? targetProps : {}),
    ...(isDisabledWithReason ? handlers : {}),
    ref: mergedRef,
  };

  return tab.href ? (
    <a {...commonProps} href={tab.href}>{children}</a>
  ) : (
    <button 
      {...commonProps} 
      type="button" 
      disabled={tab.disabled && !isDisabledWithReason}
    >
      {children}
    </button>
  );
});`}
                </pre>
              </div>
            </Box>

            <Box>
              <h3>Key Implementation Details</h3>
              <ul>
                <li>
                  <strong>Hybrid Element:</strong> Can render as either <code>&lt;a&gt;</code> (when href provided) or{' '}
                  <code>&lt;button&gt;</code> element
                </li>
                <li>
                  <strong>Self-Managed State:</strong> Each tab manages its own <code>showTooltip</code> state
                </li>
                <li>
                  <strong>Label-Based Tracking:</strong> Tooltip tracks the <code>tabLabelRef</code> (the label text),
                  not the whole tab trigger
                </li>
                <li>
                  <strong>Conditional Handler Spread:</strong> Spreads event <code>handlers</code> object only when{' '}
                  <code>isDisabledWithReason</code> is true
                </li>
                <li>
                  <strong>Smart Button State:</strong> Uses native <code>disabled</code> only when no disabledReason,
                  otherwise keeps focusable with <code>aria-disabled</code>
                </li>
                <li>
                  <strong>Accessibility Integration:</strong> Uses <code>useHiddenDescription</code> and spreads{' '}
                  <code>targetProps</code> for screen readers
                </li>
                <li>
                  <strong>Auto-Positioning:</strong> No position specified for optimal placement
                </li>
              </ul>
            </Box>

            <Box>
              <h3>Pattern Similarity to SegmentedControl</h3>
              <p>
                This pattern is nearly identical to SegmentedControl, with one key difference: the handlers are
                organized as an object and spread conditionally:
              </p>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                }}
              >
                <pre>
                  {`// Define handlers object
const handlers = {
  onFocus: () => setShowTooltip(true),
  onBlur: () => setShowTooltip(false),
  onMouseEnter: () => setShowTooltip(true),
  onMouseLeave: () => setShowTooltip(false),
};

// Spread conditionally
{...(isDisabledWithReason ? handlers : {})}`}
                </pre>
              </div>
              <p style={{ marginTop: '8px' }}>
                <strong>Benefit:</strong> More concise than SegmentedControl&apos;s inline ternaries for each handler,
                but achieves the same result.
              </p>
            </Box>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Calendar with Disabled Dates </Header>}>
          <SpaceBetween size="l">
            <Box>
              <h3>Live Example</h3>
              <p>
                Calendar dates with disabled reasons show tooltips when focused or hovered. Navigate to disabled dates
                to see why they&apos;re unavailable.
              </p>
              <Calendar
                value={selectedDate}
                onChange={({ detail }) => setSelectedDate(detail.value)}
                locale="en-US"
                ariaLabel="Select date"
              />
            </Box>

            <Box>
              <h3>How the Tooltip Works</h3>
              <p>
                The Calendar GridCell component uses the Tooltip to display disabled reasons for unavailable dates.
                Here&apos;s the implementation:
              </p>

              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0 }}>
                  {`// From: src/date-range-picker/calendar/grids/grid-cell.tsx

const GridCell = forwardRef((props: GridCellProps, ref) => {
  const { disabledReason, ...rest } = props;
  const isDisabledWithReason = !!disabledReason;
  
  // Hidden description for screen readers
  const { targetProps, descriptionEl } = useHiddenDescription(disabledReason);
  
  const cellRef = useRef<HTMLTableCellElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <td
      ref={useMergeRefs(ref, cellRef)}
      {...rest}
      {...(isDisabledWithReason ? targetProps : {})}
      
      // Event handlers with proper propagation
      onFocus={event => {
        if (rest.onFocus) rest.onFocus(event);
        if (isDisabledWithReason) setShowTooltip(true);
      }}
      onBlur={event => {
        if (rest.onBlur) rest.onBlur(event);
        if (isDisabledWithReason) setShowTooltip(false);
      }}
      onMouseEnter={event => {
        if (rest.onMouseEnter) rest.onMouseEnter(event);
        if (isDisabledWithReason) setShowTooltip(true);
      }}
      onMouseLeave={event => {
        if (rest.onMouseLeave) rest.onMouseLeave(event);
        if (isDisabledWithReason) setShowTooltip(false);
      }}
    >
      {props.children}
      {isDisabledWithReason && (
        <>
          {descriptionEl}
          {showTooltip && (
            <Tooltip
              trackRef={cellRef}
              value={disabledReason}
              onDismiss={() => setShowTooltip(false)}
            />
          )}
        </>
      )}
    </td>
  );
});

// Usage in Grid component
<GridCell
  tabIndex={isFocusable ? 0 : (isEnabled || isDisabledWithReason) ? -1 : undefined}
  aria-disabled={!isEnabled}
  onClick={isEnabled ? () => onSelectDate(date) : undefined}
  disabledReason={isDisabledWithReason ? disabledReason : undefined}
>
  <span>{renderDate(date)}</span>
</GridCell>`}
                </pre>
              </div>
            </Box>

            <Box>
              <h3>Key Implementation Details</h3>
              <ul>
                <li>
                  <strong>Table Cell Context:</strong> Tooltip is implemented in a <code>&lt;td&gt;</code> element
                  within a semantic calendar grid (role=&quot;grid&quot;)
                </li>
                <li>
                  <strong>Self-Managed State:</strong> Each grid cell manages its own <code>showTooltip</code> state
                  independently
                </li>
                <li>
                  <strong>Event Handler Composition:</strong> Event handlers call existing handlers from{' '}
                  <code>rest</code> props first, then conditionally execute tooltip logic for proper event propagation
                </li>
                <li>
                  <strong>Dual Interaction Support:</strong> Responds to both keyboard focus and mouse hover to
                  show/hide tooltip
                </li>
                <li>
                  <strong>Accessibility Integration:</strong> Uses <code>useHiddenDescription</code> hook to create
                  hidden description element and <code>targetProps</code> for screen readers
                </li>
                <li>
                  <strong>Smart Focusability:</strong> Disabled dates with reasons remain focusable (
                  <code>tabIndex={'{-1}'}</code> or <code>0</code>) while dates without reasons are not focusable (
                  <code>tabIndex=undefined</code>)
                </li>
                <li>
                  <strong>No Click Handler:</strong> Disabled dates (with or without reasons) have no onClick handler to
                  prevent selection
                </li>
                <li>
                  <strong>Auto-Positioning:</strong> No position specified, allowing optimal placement around the
                  calendar grid
                </li>
              </ul>
            </Box>

            <Box>
              <h3>Flow Diagram</h3>
              <div style={{ padding: '16px', backgroundColor: '#fff3cd', borderRadius: '4px', lineHeight: '1.8' }}>
                1. <strong>Grid renders</strong> date cells with isDateEnabled check
                <br />
                ↓<br />
                2. <strong>Date is disabled:</strong> dateDisabledReason() returns reason text
                <br />
                ↓<br />
                3. <strong>GridCell configuration:</strong>
                <br />
                &nbsp;&nbsp;• <code>tabIndex={'{-1 or 0}'}</code> (cell remains focusable)
                <br />
                &nbsp;&nbsp;• <code>aria-disabled=&quot;true&quot;</code> for screen readers
                <br />
                &nbsp;&nbsp;• <code>onClick=undefined</code> (no selection allowed)
                <br />
                ↓<br />
                4. <strong>User hovers or focuses:</strong> inline ternary evaluates, showTooltip = true
                <br />
                ↓<br />
                5. <strong>Tooltip renders:</strong> displays disabledReason text
                <br />
                ↓<br />
                6a. <strong>User moves away/blurs:</strong> showTooltip = false
                <br />
                6b. <strong>User presses Escape:</strong> onDismiss sets showTooltip = false
              </div>
            </Box>

            <Box>
              <h3>Event Handler Composition Pattern</h3>
              <p>
                This implementation uses event handler composition - calling any existing handlers from parent props
                before executing tooltip logic:
              </p>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                }}
              >
                <pre>
                  {`onFocus={event => {
  if (rest.onFocus) rest.onFocus(event);
  if (isDisabledWithReason) setShowTooltip(true);
}}`}
                </pre>
              </div>
              <p style={{ marginTop: '12px' }}>
                <strong>Why This Pattern?</strong>
              </p>
              <ul>
                <li>
                  <strong>Event Propagation:</strong> Ensures parent components&apos; handlers are called, maintaining
                  proper event flow
                </li>
                <li>
                  <strong>Composability:</strong> Allows GridCell to be reused with additional behavior from parents
                </li>
                <li>
                  <strong>Separation of Concerns:</strong> Parent logic executes first, then tooltip-specific logic
                </li>
              </ul>
              <p style={{ marginTop: '12px' }}>
                <strong>Comparison with Other Patterns:</strong>
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Pattern</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>When to Use</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Conditional Attachment</strong>
                      <br />
                      <code style={{ fontSize: '10px' }}>onFocus={'{isDisabled ? fn : undefined}'}</code>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>No parent handlers to call</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Event Composition</strong>
                      <br />
                      <code style={{ fontSize: '10px' }}>
                        onFocus={'{e => {'} rest.onFocus?.(e); fn(); {'}'}
                        {'}'}
                      </code>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Need to support parent handlers</td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </SpaceBetween>
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

        <Container header={<Header variant="h2">Token with Overflow Detection </Header>}>
          <SpaceBetween size="l">
            <Box>
              <h3>Live Example</h3>
              <p>
                Inline tokens automatically show tooltips when their text is truncated. Try resizing the window to see
                the tooltip appear when text overflows.
              </p>
              <TokenGroup
                items={tokens}
                onDismiss={({ detail: { itemIndex } }) => {
                  setTokens(tokens.filter((_, i) => i !== itemIndex));
                }}
              />
            </Box>

            <Box>
              <h3>How the Tooltip Works</h3>
              <p>
                The Token component uses a sophisticated overflow detection system to automatically show tooltips only
                when text is truncated. Here&apos;s the implementation:
              </p>

              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0 }}>
                  {`// From: src/token/internal.tsx

function InternalToken({ variant, tooltipContent, ... }) {
  const labelContainerRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  
  // State for tooltip visibility and overflow detection
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEllipsisActive, setIsEllipsisActive] = useState(false);
  
  const isInline = variant === 'inline';

  // Detect if label text is overflowing its container
  const isLabelOverflowing = () => {
    const labelContent = labelRef.current;
    const labelContainer = labelContainerRef.current;
    
    if (labelContent && labelContainer) {
      return labelContent.offsetWidth > labelContainer.offsetWidth;
    }
  };

  // Monitor for resize changes to detect overflow dynamically
  useResizeObserver(labelContainerRef, () => {
    if (isInline) {
      setIsEllipsisActive(isLabelOverflowing() ?? false);
    }
  });

  return (
    <div
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      tabIndex={!!tooltipContent && isInline && isEllipsisActive ? 0 : undefined}
    >
      <Option
        labelContainerRef={labelContainerRef}
        labelRef={labelRef}
        disableTitleTooltip={!!tooltipContent}
      />
      
      {/* Conditional tooltip rendering */}
      {!!tooltipContent && isInline && isEllipsisActive && showTooltip && (
        <Tooltip
          trackRef={labelContainerRef}
          value={
            <LiveRegion>
              <span>{tooltipContent}</span>
            </LiveRegion>
          }
          size="medium"
          onDismiss={() => setShowTooltip(false)}
        />
      )}
    </div>
  );
}`}
                </pre>
              </div>
            </Box>

            <Box>
              <h3>Key Implementation Details</h3>
              <ul>
                <li>
                  <strong>Smart Overflow Detection:</strong> Uses <code>useResizeObserver</code> to continuously monitor
                  if the label text exceeds its container width (<code>isEllipsisActive</code>)
                </li>
                <li>
                  <strong>Conditional Tooltip Display:</strong> Tooltip only appears when ALL conditions are met:
                  <ul>
                    <li>
                      <code>tooltipContent</code> prop is provided
                    </li>
                    <li>
                      <code>variant === &quot;inline&quot;</code>
                    </li>
                    <li>Label is overflowing (text truncated)</li>
                    <li>User is hovering or focused</li>
                  </ul>
                </li>
                <li>
                  <strong>Dual Interaction Support:</strong> Tracks both mouse (hover) and keyboard (focus) interactions
                  to show/hide tooltip
                </li>
                <li>
                  <strong>Dynamic Keyboard Access:</strong> Token becomes focusable (<code>tabIndex={'{0}'}</code>) ONLY
                  when tooltip content exists and overflow is detected
                </li>
                <li>
                  <strong>Accessibility Enhancement:</strong> Tooltip content is wrapped in <code>LiveRegion</code> to
                  announce changes to screen readers
                </li>
                <li>
                  <strong>Automatic Adaptation:</strong> Continuously recalculates overflow on window resize, container
                  changes, or content updates
                </li>
                <li>
                  <strong>Title Tooltip Suppression:</strong> Sets <code>disableTitleTooltip</code> to prevent duplicate
                  native tooltips when custom tooltip is active
                </li>
              </ul>
            </Box>

            <Box>
              <h3>Flow Diagram</h3>
              <div style={{ padding: '16px', backgroundColor: '#fff3cd', borderRadius: '4px', lineHeight: '1.8' }}>
                1. <strong>Component mounts</strong> with inline variant and tooltipContent
                <br />
                ↓<br />
                2. <strong>useResizeObserver</strong> monitors labelContainerRef for size changes
                <br />
                ↓<br />
                3. <strong>isLabelOverflowing()</strong> compares labelContent.offsetWidth vs labelContainer.offsetWidth
                <br />
                ↓<br />
                4a. <strong>No overflow:</strong> isEllipsisActive = false, tooltip never renders
                <br />
                4b. <strong>Overflow detected:</strong> isEllipsisActive = true, token becomes focusable
                <br />
                ↓<br />
                5. <strong>User hovers or focuses:</strong> showTooltip = true
                <br />
                ↓<br />
                6. <strong>All conditions met:</strong> Tooltip renders with LiveRegion wrapper
                <br />
                ↓<br />
                7a. <strong>User moves away/blurs:</strong> showTooltip = false
                <br />
                7b. <strong>User presses Escape:</strong> onDismiss sets showTooltip = false
                <br />
                ↓<br />
                8. <strong>Window resize:</strong> Loop back to step 3 to recheck overflow
              </div>
            </Box>

            <Box>
              <h3>Comparison with Other Implementations</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Aspect</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>ButtonGroup</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Select</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Token</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>State Management</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Parent-controlled</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Self-managed</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Self-managed</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Trigger Condition</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Always on hover</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Disabled + highlighted</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Text overflow detected</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Overflow Detection</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>None</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>None</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>useResizeObserver</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Keyboard Access</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Via button</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Via list navigation</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Dynamic tabIndex</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>LiveRegion</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>No</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Via useHiddenDescription</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Wraps tooltip content</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Use Case</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Icon button labels</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Disabled reasons</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Truncated text labels</td>
                  </tr>
                </tbody>
              </table>
            </Box>

            <Box>
              <h3>Why This Pattern?</h3>
              <p>
                The Token&apos;s overflow-detection approach is ideal for scenarios where space is limited but you
                don&apos;t want to always show tooltips:
              </p>
              <ul>
                <li>
                  <strong>Performance:</strong> Only shows tooltips when actually needed (text is truncated)
                </li>
                <li>
                  <strong>Responsive:</strong> Adapts automatically to window resizing and container changes
                </li>
                <li>
                  <strong>User Experience:</strong> Doesn&apos;t clutter UI with tooltips for fully visible text
                </li>
                <li>
                  <strong>Accessibility:</strong> Makes truncated tokens keyboard-accessible and announces content to
                  screen readers
                </li>
              </ul>
            </Box>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Button with Disabled Reasons </Header>}>
          <SpaceBetween size="l">
            <Box>
              <h3>Live Example</h3>
              <p>Hover over or focus on disabled buttons to see tooltips explaining why they&apos;re disabled.</p>
              <SpaceBetween size="m" direction="horizontal">
                <Button disabled={true} disabledReason="You don't have permission to perform this action">
                  Edit
                </Button>
                <Button variant="primary" disabled={true} disabledReason="Complete all required fields first">
                  Submit
                </Button>
                <Button variant="icon" iconName="settings" disabled={true} disabledReason="Settings unavailable" />
              </SpaceBetween>
            </Box>

            <Box>
              <h3>How the Tooltip Works</h3>
              <p>
                The Button component uses internal tooltips for disabled reasons, supporting both button and anchor
                elements. Here&apos;s the implementation:
              </p>

              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0 }}>
                  {`// From: src/button/internal.tsx

export const InternalButton = forwardRef(
  ({ disabled, disabledReason, variant, ... }, ref) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const buttonRef = useRef<HTMLElement>(null);
    
    // Only normal, primary, and icon variants support disabledReason
    const isDisabledWithReason = 
      (variant === 'normal' || variant === 'primary' || variant === 'icon') 
      && !!disabledReason && disabled;
    
    // Hidden description for screen readers
    const { targetProps, descriptionEl } = useHiddenDescription(disabledReason);
    
    // Prepare conditional props for disabled reason
    const disabledReasonProps = {
      onFocus: isDisabledWithReason ? () => setShowTooltip(true) : undefined,
      onBlur: isDisabledWithReason ? () => setShowTooltip(false) : undefined,
      onMouseEnter: isDisabledWithReason ? () => setShowTooltip(true) : undefined,
      onMouseLeave: isDisabledWithReason ? () => setShowTooltip(false) : undefined,
      ...(isDisabledWithReason ? targetProps : {}),
    };
    
    const disabledReasonContent = (
      <>
        {descriptionEl}
        {showTooltip && (
          <Tooltip
            trackRef={buttonRef}
            value={disabledReason}
            onDismiss={() => setShowTooltip(false)}
          />
        )}
      </>
    );

    // For anchor elements
    if (href) {
      return (
        <a
          {...buttonProps}
          {...disabledReasonProps}
          ref={buttonRef}
          aria-disabled={isNotInteractive ? true : undefined}
          tabIndex={isDisabledWithReason ? 0 : buttonProps.tabIndex}
        >
          {buttonContent}
          {isDisabledWithReason && disabledReasonContent}
        </a>
      );
    }

    // For button elements
    return (
      <button
        {...buttonProps}
        {...disabledReasonProps}
        ref={buttonRef}
        disabled={disabled && !isDisabledWithReason}
        aria-disabled={isDisabledWithReason ? true : undefined}
      >
        {buttonContent}
        {isDisabledWithReason && disabledReasonContent}
      </button>
    );
  }
);`}
                </pre>
              </div>
            </Box>

            <Box>
              <h3>Key Implementation Details</h3>
              <ul>
                <li>
                  <strong>Variant-Specific:</strong> Only <code>normal</code>, <code>primary</code>, and{' '}
                  <code>icon</code> variants support disabledReason tooltips
                </li>
                <li>
                  <strong>Hybrid Element Support:</strong> Works with both <code>&lt;button&gt;</code> and{' '}
                  <code>&lt;a&gt;</code> elements (when href provided)
                </li>
                <li>
                  <strong>Props Object Pattern:</strong> Creates <code>disabledReasonProps</code> object with all event
                  handlers and spreads it onto the element
                </li>
                <li>
                  <strong>Conditional Event Handlers:</strong> Event handlers only defined when{' '}
                  <code>isDisabledWithReason</code> is true (using ternary to undefined)
                </li>
                <li>
                  <strong>Smart Focusability:</strong> Disabled anchors with reasons get <code>tabIndex=0</code> to
                  remain keyboard accessible
                </li>
                <li>
                  <strong>Button Ref Tracking:</strong> Tooltip tracks the button/anchor element itself via{' '}
                  <code>buttonRef</code>
                </li>
                <li>
                  <strong>Content Separation:</strong> Tooltip content is separated into{' '}
                  <code>disabledReasonContent</code> for clarity
                </li>
              </ul>
            </Box>

            <Box>
              <h3>Pattern Advantages</h3>
              <ul>
                <li>
                  <strong>Reusable Props:</strong> The <code>disabledReasonProps</code> pattern makes it easy to apply
                  the same behavior to both button and anchor elements
                </li>
                <li>
                  <strong>Clean Separation:</strong> Tooltip rendering logic is isolated in{' '}
                  <code>disabledReasonContent</code>
                </li>
                <li>
                  <strong>Consistent with Tabs:</strong> Uses similar props object spread pattern for maintainability
                </li>
              </ul>
            </Box>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">AppLayout Toolbar Trigger Buttons </Header>}>
          <SpaceBetween size="l">
            <Box>
              <h3>Advanced Pattern with Suppression Logic</h3>
              <p>
                The AppLayout TriggerButton uses the most sophisticated tooltip pattern in the library, with complex
                state management to handle drawer interactions.
              </p>

              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0 }}>
                  {`// From: src/app-layout/drawer/trigger-button.tsx

const TriggerButton = ({ ariaLabel, hasTooltip, ... }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [suppressTooltip, setSupressTooltip] = useState(false);

  // Complex visibility logic
  const tooltipVisible = useMemo(() => {
    return hasTooltip && showTooltip && !suppressTooltip 
      && !!containerRef?.current && tooltipValue 
      && !(isMobile && hasOpenDrawer);
  }, [hasTooltip, showTooltip, suppressTooltip, /* ... */]);

  return (
    <div
      ref={containerRef}
      {...(hasTooltip && {
        onPointerEnter: () => { setSupressTooltip(false); setShowTooltip(true); },
        onPointerLeave: () => { setSupressTooltip(true); setShowTooltip(false); },
        onFocus: handleOnFocus,  // Complex logic for drawer interactions
        onBlur: () => { setSupressTooltip(true); setShowTooltip(false); },
      })}
    >
      <button onClick={handleClick} aria-label={ariaLabel}>
        <Icon />
      </button>
      {tooltipVisible && (
        <Tooltip
          trackRef={containerRef}
          value={tooltipValue}
          onDismiss={() => { setShowTooltip(false); setSupressTooltip(false); }}
        />
      )}
    </div>
  );
};`}
                </pre>
              </div>
            </Box>

            <Box>
              <h3>Unique Features</h3>
              <ul>
                <li>
                  <strong>Dual State Management:</strong> Uses both <code>showTooltip</code> and{' '}
                  <code>suppressTooltip</code> for fine-grained control
                </li>
                <li>
                  <strong>Pointer Events:</strong> Uses onPointerEnter/Leave instead of onMouseEnter/Leave for better
                  touch support
                </li>
                <li>
                  <strong>Context-Aware Hiding:</strong> Suppresses tooltip on mobile when drawer is open
                </li>
                <li>
                  <strong>Manual Event Listeners:</strong> Attaches custom pointerdown/keydown listeners with
                  AbortController cleanup
                </li>
                <li>
                  <strong>Complex Focus Logic:</strong> Checks relatedTarget to avoid showing tooltip when refocusing
                  from drawer close
                </li>
              </ul>
            </Box>
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

        <Container header={<Header variant="h2">Slider with Value Display </Header>}>
          <SpaceBetween size="l">
            <Box>
              <h3>Live Example</h3>
              <p>Interact with the slider to see the tooltip displaying the current value.</p>
              <Slider
                value={sliderValue}
                onChange={({ detail }) => setSliderValue(detail.value)}
                min={0}
                max={100}
                ariaLabel="Slider example"
              />
            </Box>

            <Box>
              <h3>How the Tooltip Works</h3>
              <p>
                The Slider component uses the Tooltip to display the current value during interaction
                (mouse/focus/touch). Here&apos;s the implementation:
              </p>

              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0 }}>
                  {`// From: src/slider/internal.tsx

function InternalSlider({ value, valueFormatter, ... }) {
  const handleRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Invisible positioning element */}
      <div ref={handleRef} className="tooltip-thumb" />
      
      {showTooltip && (
        <Tooltip
          value={valueFormatter ? valueFormatter(value) : value}
          trackRef={handleRef}
          onDismiss={() => setShowTooltip(false)}
        />
      )}
      
      <input
        type="range"
        value={value}
        onFocus={() => { setShowTooltip(true); setIsActive(true); }}
        onBlur={() => { setShowTooltip(false); setIsActive(false); }}
        onTouchStart={() => { setShowTooltip(true); setIsActive(true); }}
        onTouchEnd={() => { setShowTooltip(false); setIsActive(false); }}
      />
    </div>
  );
}`}
                </pre>
              </div>
            </Box>

            <Box>
              <h3>Key Implementation Details</h3>
              <ul>
                <li>
                  <strong>Multi-Interaction Support:</strong> Responds to mouse hover, keyboard focus, AND touch events
                </li>
                <li>
                  <strong>Separate Positioning Element:</strong> Uses invisible <code>tooltip-thumb</code> div for
                  tooltip tracking, not the input itself
                </li>
                <li>
                  <strong>Formatted Value Display:</strong> Shows <code>valueFormatter(value)</code> if provided, or raw
                  value
                </li>
                <li>
                  <strong>Active State Tracking:</strong> Uses <code>isActive</code> state to style the slider during
                  interaction
                </li>
                <li>
                  <strong>Simple State Management:</strong> Single <code>showTooltip</code> boolean (no suppression
                  logic needed)
                </li>
                <li>
                  <strong>Auto-Positioning:</strong> No position specified, allowing optimal placement above the slider
                </li>
              </ul>
            </Box>

            <Box>
              <h3>Why Separate Positioning Element?</h3>
              <p>
                The tooltip tracks an invisible <code>tooltip-thumb</code> div instead of the range input because:
              </p>
              <ul>
                <li>
                  <strong>Better Positioning:</strong> Allows precise control over tooltip position relative to the
                  slider thumb
                </li>
                <li>
                  <strong>Style Independence:</strong> Avoids interference with native range input styling
                </li>
                <li>
                  <strong>Dynamic Positioning:</strong> The thumb div can be positioned via CSS custom properties to
                  follow the slider value
                </li>
              </ul>
            </Box>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">FileTokenGroup with Overflow Detection </Header>}>
          <SpaceBetween size="l">
            <Box>
              <h3>Live Example</h3>
              <p>
                File tokens show tooltips when their file names are truncated. Hover over file tokens with long names to
                see the full name.
              </p>
              <p>
                <em>Note: FileTokenGroup uses Tooltip for file name overflow display.</em>
              </p>
            </Box>

            <Box>
              <h3>How the Tooltip Works</h3>
              <p>
                The InternalFileToken component uses an overflow detection pattern similar to Token, but with mouse-only
                interaction. Here&apos;s the implementation:
              </p>

              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0 }}>
                  {`// From: src/file-token-group/file-option.tsx

function InternalFileToken({ file, ... }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileNameRef = useRef<HTMLSpanElement>(null);
  const fileNameContainerRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Check if file name is truncated
  function isEllipsisActive() {
    const span = fileNameRef.current;
    const container = fileNameContainerRef.current;
    
    if (span && container) {
      return span.offsetWidth >= container.offsetWidth;
    }
    return false;
  }

  return (
    <div ref={containerRef}>
      <div className="token-box">
        <div
          onMouseOver={() => setShowTooltip(true)}
          onMouseOut={() => setShowTooltip(false)}
          ref={fileNameContainerRef}
        >
          <span ref={fileNameRef}>{file.name}</span>
        </div>
        
        {/* File size and last modified */}
        {showFileSize && <span>{formatFileSize(file.size)}</span>}
        {showFileLastModified && <span>{formatDate(file.lastModified)}</span>}
      </div>
      
      {/* Tooltip only when hovering AND truncated */}
      {showTooltip && isEllipsisActive() && (
        <Tooltip
          trackRef={containerRef}
          trackKey={file.name}
          value={<InternalBox fontWeight="normal">{file.name}</InternalBox>}
          onDismiss={() => setShowTooltip(false)}
        />
      )}
    </div>
  );
}`}
                </pre>
              </div>
            </Box>

            <Box>
              <h3>Key Implementation Details</h3>
              <ul>
                <li>
                  <strong>Mouse-Only Interaction:</strong> Uses <code>onMouseOver</code>/<code>onMouseOut</code> instead
                  of focus events - file tokens aren&apos;t keyboard focusable
                </li>
                <li>
                  <strong>Runtime Overflow Check:</strong> Calls <code>isEllipsisActive()</code> in render to check if
                  truncation exists (not using ResizeObserver)
                </li>
                <li>
                  <strong>Dual Condition Display:</strong> Tooltip renders when BOTH <code>showTooltip</code> (mouse
                  over) AND <code>isEllipsisActive()</code> (truncated) are true
                </li>
                <li>
                  <strong>Container Tracking:</strong> Tooltip tracks <code>containerRef</code> (whole token), not just
                  the file name
                </li>
                <li>
                  <strong>TrackKey Usage:</strong> Uses <code>trackKey={'{file.name}'}</code> for unique identification
                </li>
                <li>
                  <strong>Styled Content:</strong> Wraps file name in <code>InternalBox</code> with{' '}
                  <code>fontWeight=&quot;normal&quot;</code> for consistent styling
                </li>
                <li>
                  <strong>No Position Specified:</strong> Allows automatic positioning around the token
                </li>
              </ul>
            </Box>

            <Box>
              <h3>Comparison with Token Pattern</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Aspect</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Token</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>FileToken</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Overflow Detection</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>useResizeObserver (continuous)</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Runtime check (on render)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Interaction Events</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Mouse + Focus</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Mouse only (onMouseOver/Out)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Keyboard Access</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Dynamic tabIndex</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Not focusable</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Performance</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>State tracked, observer attached</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Checked on each render</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <strong>Use Case</strong>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>Inline tokens in text</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>File upload lists</td>
                  </tr>
                </tbody>
              </table>
            </Box>

            <Box>
              <h3>Why This Simpler Pattern?</h3>
              <ul>
                <li>
                  <strong>Non-Interactive Context:</strong> File tokens don&apos;t need keyboard focus, so mouse-only
                  events are sufficient
                </li>
                <li>
                  <strong>Simpler Implementation:</strong> Runtime check is simpler than ResizeObserver for this use
                  case
                </li>
                <li>
                  <strong>Adequate Performance:</strong> File token lists are typically small, so re-checking on render
                  is acceptable
                </li>
              </ul>
            </Box>
          </SpaceBetween>
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
          </div>
        </Container>
      </SpaceBetween>
    </div>
  );
}
