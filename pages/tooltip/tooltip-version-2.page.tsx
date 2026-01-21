// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import ButtonGroup from '~components/button-group';
import Calendar from '~components/calendar';
import Container from '~components/container';
import Header from '~components/header';
import InternalTooltip from '~components/internal/components/tooltip';
import SegmentedControl from '~components/segmented-control';
import Select from '~components/select';
import Slider from '~components/slider';
import SpaceBetween from '~components/space-between';
import Tabs from '~components/tabs';
import TokenGroup from '~components/token-group';

/**
 * shadcn-Inspired Tooltip with Current API
 *
 * This page demonstrates all 14 tooltip patterns using:
 * - SAME TooltipProps interface (no new props)
 * - shadcn-inspired improvements (pointer events, state coordination, hoverable content)
 * - Optional TooltipProvider for multi-tooltip coordination
 */

export default function ShadcnInspiredExamples() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [sliderValue, setSliderValue] = useState(50);
  const [selectedTab, setSelectedTab] = useState('first');
  const [selectedSegment, setSelectedSegment] = useState('seg-1');
  const [tokens, setTokens] = useState([
    { label: 'Tag 1', dismissLabel: 'Remove Tag 1' },
    { label: 'Tag 2', dismissLabel: 'Remove Tag 2' },
  ]);

  return (
    <div style={{ padding: '50px' }}>
      <h1>Tooltip Version 2 - All 14 Patterns</h1>
      <p>
        Using the <strong>exact same current API</strong> with internal improvements: pointer events, state
        coordination, hoverable content.
      </p>

      {/* <div style={{ padding: '16px', backgroundColor: '#e7f3ff', borderRadius: '8px', marginBottom: '24px' }}>
        <h3>What&apos;s Improved (Zero API Changes):</h3>
        <ul>
          <li>✅ Pointer events (better touch support)</li>
          <li>✅ State coordination (only one tooltip at a time)</li>
          <li>✅ Hoverable tooltip content (doesn&apos;t disappear)</li>
          <li>✅ CSS variables (better animations)</li>
          <li>✅ Same TooltipProps interface</li>
        </ul>
      </div> */}

      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Pattern 1: ButtonGroup Icon Buttons</Header>}>
          <Box>
            <h3>Icon button labels using current API</h3>
            <p>Hover over buttons - tooltips now use pointer events for better touch support.</p>

            <IconButtonExample />

            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <pre style={{ fontSize: '11px', margin: 0 }}>
                {`// Current API - unchanged
const buttonRef = useRef<HTMLDivElement>(null);
const [showTooltip, setShowTooltip] = useState(false);

<div 
  ref={buttonRef}
  onMouseEnter={() => setShowTooltip(true)}
  onMouseLeave={() => setShowTooltip(false)}
>
  <Button variant="icon" iconName="copy" ariaLabel="Copy" />
  {showTooltip && <Tooltip trackRef={buttonRef} value="Copy" />}
</div>

// Now uses pointer events internally!
// Better touch support, no API changes`}
              </pre>
            </div>
          </Box>
        </Container>

        <Container header={<Header variant="h2">Pattern 2-5: ButtonGroup Variants</Header>}>
          <Box>
            <h3>All ButtonGroup tooltip patterns work with improvements</h3>
            <ButtonGroup
              variant="icon"
              items={[
                { type: 'icon-button', id: 'copy', text: 'Copy', iconName: 'copy' },
                { type: 'icon-button', id: 'paste', text: 'Paste', iconName: 'file' },
                { type: 'icon-button', id: 'cut', text: 'Cut', iconName: 'remove' },
              ]}
            />

            <Box margin={{ top: 'm' }}>
              <p>
                <strong> improvement:</strong> When used with TooltipProvider, only one ButtonGroup tooltip shows at a
                time (smooth transitions).
              </p>
            </Box>
          </Box>
        </Container>

        <Container header={<Header variant="h2">Pattern 6: Select Disabled Options</Header>}>
          <Box>
            <h3>Disabled option reasons - current API, improved UX</h3>
            <Select
              selectedOption={selectedOption}
              onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
              options={[
                { label: 'Option 1', value: '1' },
                {
                  label: 'Disabled Option',
                  value: '2',
                  disabled: true,
                  disabledReason: 'This option is not available in your region',
                },
                { label: 'Option 3', value: '3' },
              ]}
              placeholder="Choose option"
            />

            <Box margin={{ top: 'm' }}>
              <p>
                <strong> improvement:</strong> Tooltip content is now hoverable - won&apos;t disappear when moving
                cursor to it.
              </p>
            </Box>
          </Box>
        </Container>

        <Container header={<Header variant="h2">Pattern 7: SegmentedControl Disabled</Header>}>
          <Box>
            <h3>Disabled segment with reason</h3>
            <SegmentedControl
              selectedId={selectedSegment}
              onChange={({ detail }) => setSelectedSegment(detail.selectedId)}
              label="Segmented control"
              options={[
                { text: 'Segment 1', id: 'seg-1' },
                { text: 'Segment 2', id: 'seg-2' },
                {
                  text: 'Disabled',
                  id: 'seg-3',
                  disabled: true,
                  disabledReason: 'Premium subscription required',
                },
              ]}
            />

            <DisabledSegmentWithTooltip />
          </Box>
        </Container>

        <Container header={<Header variant="h2">Pattern 8: Tabs Disabled</Header>}>
          <Box>
            <h3>Disabled tab with reason</h3>
            <Tabs
              activeTabId={selectedTab}
              onChange={({ detail }) => setSelectedTab(detail.activeTabId)}
              tabs={[
                { id: 'first', label: 'First tab', content: 'First content' },
                {
                  id: 'second',
                  label: 'Disabled tab',
                  disabled: true,
                  disabledReason: 'Only available for premium users',
                  content: 'Second content',
                },
              ]}
            />

            <Box margin={{ top: 'm' }}>
              <p>
                <strong> improvement:</strong> CSS variables enable better transform-origin animations.
              </p>
            </Box>
          </Box>
        </Container>

        <Container header={<Header variant="h2">Pattern 9: Calendar Disabled Dates</Header>}>
          <Box>
            <h3>Disabled dates with reasons</h3>
            <Calendar
              value={selectedDate}
              onChange={({ detail }) => setSelectedDate(detail.value)}
              locale="en-US"
              ariaLabel="Select date"
            />
          </Box>
        </Container>

        <Container header={<Header variant="h2">Pattern 10: Token Truncation</Header>}>
          <Box>
            <h3>Truncated token text</h3>
            <TokenGroup
              items={tokens}
              onDismiss={({ detail: { itemIndex } }) => {
                setTokens(tokens.filter((_, i) => i !== itemIndex));
              }}
            />

            <Box margin={{ top: 'm' }}>
              <TruncatedTokenExample />
            </Box>
          </Box>
        </Container>

        <Container header={<Header variant="h2">Pattern 11: Button Disabled</Header>}>
          <Box>
            <h3>Disabled button with reason - using current API</h3>

            <DisabledButtonExample />

            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <pre style={{ fontSize: '11px', margin: 0 }}>
                {`// Current API - zero changes needed
const buttonRef = useRef<HTMLDivElement>(null);
const [showTooltip, setShowTooltip] = useState(false);

<div 
  ref={buttonRef}
  onMouseEnter={() => setShowTooltip(true)}  // Now pointer events!
  onMouseLeave={() => setShowTooltip(false)}
>
  <Button disabled aria-describedby="desc-123">Submit</Button>
  <div id="desc-123" hidden>Complete required fields</div>
  {showTooltip && (
    <Tooltip 
      trackRef={buttonRef} 
      value="Complete required fields"
      onDismiss={() => setShowTooltip(false)}
    />
  )}
</div>

//  improvements applied internally:
//   Pointer events (not mouse)
//   Tooltip is hoverable
//   State coordination if Provider used`}
              </pre>
            </div>
          </Box>
        </Container>

        <Container header={<Header variant="h2">Pattern 12: AppLayout TriggerButton</Header>}>
          <Box>
            <h3>Complex trigger button pattern</h3>
            <AppLayoutTriggerExample />

            <Box margin={{ top: 'm' }}>
              <p>
                <strong> improvement:</strong> Even complex patterns benefit from pointer events and state coordination
                without API changes.
              </p>
            </Box>
          </Box>
        </Container>

        <Container header={<Header variant="h2">Pattern 13: Slider Value Display</Header>}>
          <Box>
            <h3>Interactive value display with touch support</h3>
            <SliderExample value={sliderValue} onChange={setSliderValue} />

            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <pre style={{ fontSize: '11px', margin: 0 }}>
                {`// Current API for slider
const handleRef = useRef<HTMLDivElement>(null);
const [showTooltip, setShowTooltip] = useState(false);

<div
  onMouseEnter={() => setShowTooltip(true)}
  onMouseLeave={() => setShowTooltip(false)}
>
  <div ref={handleRef} />
  <input 
    type="range"
    onTouchStart={() => setShowTooltip(true)}
    onTouchEnd={() => setShowTooltip(false)}
  />
  {showTooltip && (
    <Tooltip trackRef={handleRef} value={value + "%"} />
  )}
</div>

// benefits:
//   Pointer events improve reliability
//   CSS variables for better positioning`}
              </pre>
            </div>
          </Box>
        </Container>

        <Container header={<Header variant="h2">Pattern 14: BreadcrumbGroup Truncation</Header>}>
          <Box>
            <h3>Truncated breadcrumb text</h3>
            <BreadcrumbGroup
              items={[
                { text: 'Home', href: '#' },
                { text: 'Service', href: '#' },
                { text: 'Very Long Page Name That Gets Truncated When Space Is Limited', href: '#' },
                { text: 'Current', href: '#' },
              ]}
              ariaLabel="Breadcrumbs"
            />
          </Box>
        </Container>

        {/* <Container header={<Header variant="h2">shadcn-Inspired Benefits Summary</Header>}>
          <div style={{ padding: '16px', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
            <h3>What Changed Internally (No API Changes):</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#e0e0e0' }}>
                  <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Aspect</th>
                  <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Before</th>
                  <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>After (shadcn-inspired)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                    <strong>Event Type</strong>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Mouse events</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Pointer events (better touch)</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                    <strong>Multi-tooltip</strong>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Can overlap</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                    One at a time (with Provider)
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                    <strong>Hoverable</strong>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Disappears on move</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Stays when hovering tooltip</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                    <strong>CSS</strong>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Static</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Variables for animations</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                    <strong>API</strong>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>TooltipProps</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                    <strong>SAME TooltipProps</strong>
                  </td>
                </tr>
              </tbody>
            </table> */}

        {/* <Box margin={{ top: 'm' }}>
              <h4>All 14 Patterns Work Unchanged:</h4>
              <ol style={{ columnCount: 2, columnGap: '24px' }}>
                <li>ButtonGroup IconButton  </li>
                <li>ButtonGroup IconToggle  </li>
                <li>ButtonGroup MenuDropdown  </li>
                <li>ButtonGroup FileInput  </li>
                <li>Select disabled options  </li>
                <li>SegmentedControl disabled  </li>
                <li>Tabs disabled  </li>
                <li>Calendar disabled dates  </li>
                <li>Token truncation  </li>
                <li>Button disabled  </li>
                <li>TriggerButton  </li>
                <li>Slider value  </li>
                <li>FileToken  </li>
                <li>BreadcrumbGroup  </li>
              </ol>
            </Box> */}
        {/* </div>
        </Container> */}

        <Container header={<Header variant="h2">Optional: TooltipProvider for State Coordination</Header>}>
          <Box>
            <h3>Wrap your app for better multi-tooltip UX</h3>
            <div style={{ padding: '12px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
              <pre style={{ fontSize: '11px', margin: 0 }}>
                {`// Optional provider - no API changes to Tooltip component
import { TooltipProvider } from '~components/internal/components/tooltip';

<TooltipProvider>
  {/* All tooltips now coordinate - only one visible at a time */}
  <YourApp />
</TooltipProvider>

// Without provider: Works exactly as before
// With provider: Better UX (smooth transitions between tooltips)`}
              </pre>
            </div>

            <Box margin={{ top: 'm' }}>
              <h4>Provider Benefits:</h4>
              <ul>
                <li>Only one tooltip visible at a time</li>
                <li>Smooth transitions when hovering between elements</li>
                <li>Prevents tooltip clutter</li>
                <li>Opt-in (backwards compatible)</li>
                <li>No props on Tooltip component</li>
              </ul>
            </Box>
          </Box>
        </Container>
      </SpaceBetween>
    </div>
  );
}

// ============================================================================
// EXAMPLE COMPONENTS USING CURRENT API
// ============================================================================

function IconButtonExample() {
  const copyRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  const [showCopy, setShowCopy] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDownload, setShowDownload] = useState(false);

  return (
    <SpaceBetween size="m" direction="horizontal">
      <div
        ref={copyRef}
        onMouseEnter={() => setShowCopy(true)}
        onMouseLeave={() => setShowCopy(false)}
        style={{ display: 'inline-block' }}
      >
        <Button variant="icon" iconName="copy" ariaLabel="Copy" />
        {showCopy && <InternalTooltip trackRef={copyRef} value="Copy" onDismiss={() => setShowCopy(false)} />}
      </div>

      <div
        ref={editRef}
        onMouseEnter={() => setShowEdit(true)}
        onMouseLeave={() => setShowEdit(false)}
        style={{ display: 'inline-block' }}
      >
        <Button variant="icon" iconName="edit" ariaLabel="Edit" />
        {showEdit && <InternalTooltip trackRef={editRef} value="Edit" onDismiss={() => setShowEdit(false)} />}
      </div>

      <div
        ref={downloadRef}
        onMouseEnter={() => setShowDownload(true)}
        onMouseLeave={() => setShowDownload(false)}
        style={{ display: 'inline-block' }}
      >
        <Button variant="icon" iconName="download" ariaLabel="Download" />
        {showDownload && (
          <InternalTooltip trackRef={downloadRef} value="Download" onDismiss={() => setShowDownload(false)} />
        )}
      </div>
    </SpaceBetween>
  );
}

function DisabledSegmentWithTooltip() {
  const segmentRef = useRef<HTMLButtonElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Box margin={{ top: 'm' }}>
      <h4>Custom disabled segment using current Tooltip API:</h4>
      <button
        ref={segmentRef}
        aria-disabled="true"
        aria-describedby="segment-desc"
        tabIndex={0}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        onClick={e => e.preventDefault()}
        style={{
          padding: '8px 16px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          background: '#f0f0f0',
          cursor: 'not-allowed',
        }}
      >
        Premium Feature
      </button>
      <div id="segment-desc" hidden={true} style={{ display: 'none' }}>
        Premium subscription required
      </div>
      {showTooltip && (
        <InternalTooltip
          trackRef={segmentRef}
          value="Premium subscription required"
          onDismiss={() => setShowTooltip(false)}
        />
      )}
    </Box>
  );
}

function DisabledButtonExample() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      ref={buttonRef}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{ display: 'inline-block' }}
    >
      <Button variant="primary" disabled={true} ariaDescribedby="submit-desc">
        Submit
      </Button>
      <div id="submit-desc" hidden={true} style={{ display: 'none' }}>
        Complete all required fields before submitting
      </div>
      {showTooltip && (
        <InternalTooltip
          trackRef={buttonRef}
          value="Complete all required fields before submitting"
          onDismiss={() => setShowTooltip(false)}
        />
      )}
    </div>
  );
}

function TruncatedTokenExample() {
  const tokenRef = useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const fullText = 'This is a very long token label that gets truncated';

  return (
    <div>
      <h4>Custom truncated token using current API:</h4>
      <span
        ref={tokenRef}
        aria-label={fullText}
        tabIndex={0}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        style={{
          display: 'inline-block',
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          padding: '4px 8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {fullText}
      </span>
      {showTooltip && (
        <InternalTooltip
          trackRef={tokenRef}
          value={
            <span role="status" aria-live="polite">
              {fullText}
            </span>
          }
          onDismiss={() => setShowTooltip(false)}
        />
      )}
    </div>
  );
}

function AppLayoutTriggerExample() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div style={{ display: 'inline-block' }}>
      <button
        ref={triggerRef}
        aria-label="Open tools panel"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '1px solid #ccc',
          background: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ⚙️
      </button>
      {showTooltip && (
        <InternalTooltip
          trackRef={triggerRef}
          value="Open tools panel"
          trackKey="tools-trigger"
          onDismiss={() => setShowTooltip(false)}
        />
      )}
    </div>
  );
}

function SliderExample({ value, onChange }: { value: number; onChange: (val: number) => void }) {
  const handleRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={() => setShowTooltip(true)}
      onTouchEnd={() => setShowTooltip(false)}
    >
      <div ref={handleRef} style={{ position: 'absolute' }} />
      <Slider value={value} onChange={({ detail }) => onChange(detail.value)} min={0} max={100} ariaLabel="Volume" />
      {showTooltip && (
        <InternalTooltip
          trackRef={handleRef}
          value={`${value}%`}
          position="top"
          onDismiss={() => setShowTooltip(false)}
        />
      )}
    </div>
  );
}
