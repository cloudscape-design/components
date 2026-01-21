// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Badge from '~components/badge';
import Box from '~components/box';
import Container from '~components/container';
import Header from '~components/header';
import Icon from '~components/icon';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Tooltip from '~components/tooltip';
import { SimpleTooltip } from '~components/tooltip/simple-tooltip';
import { TooltipCoordinator } from '~components/tooltip/tooltip-coordinator';
import { useTooltip } from '~components/tooltip/use-tooltip';
import { useTooltipAdvanced } from '~components/tooltip/use-tooltip-advanced';

// ====== WRAPPER COMPONENT IMPLEMENTATION ======
interface TooltipWrapperProps {
  content: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  style?: React.CSSProperties;
}

function TooltipWrapper({ content, position = 'top', size, children, style }: TooltipWrapperProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [show, setShow] = React.useState(false);

  return (
    <>
      <span ref={ref} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} style={style}>
        {children}
      </span>
      {show && <Tooltip trackRef={ref} value={content} position={position} size={size} />}
    </>
  );
}

// ====== COORDINATION DEMO COMPONENT ======
function CoordinationDemo() {
  // Without coordination
  const [noCoord1Target, noCoord1Tooltip] = useTooltipAdvanced({
    content: 'Button 1 - Independent',
    position: 'top',
    id: 'no-coord-1',
  });
  const [noCoord2Target, noCoord2Tooltip] = useTooltipAdvanced({
    content: 'Button 2 - Independent',
    position: 'top',
    id: 'no-coord-2',
  });

  // With coordination
  const [coord1Target, coord1Tooltip] = useTooltipAdvanced({
    content: 'Button 1 - Coordinated',
    position: 'top',
    id: 'coord-1',
  });
  const [coord2Target, coord2Tooltip] = useTooltipAdvanced({
    content: 'Button 2 - Coordinated',
    position: 'top',
    id: 'coord-2',
  });

  // Mixed coordination
  const [mixed1Target, mixed1Tooltip] = useTooltipAdvanced({
    content: 'Button 1 - Coordinated',
    position: 'top',
    id: 'mixed-1',
  });
  const [mixed2Target, mixed2Tooltip] = useTooltipAdvanced({
    content: 'Button 2 - Independent (disableCoordination)',
    position: 'top',
    id: 'mixed-2',
    disableCoordination: true,
  });

  return (
    <SpaceBetween size="l">
      <Box>
        <h3>Without Coordination (Default)</h3>
        <p style={{ fontSize: '14px', marginBottom: '12px' }}>
          Multiple tooltips can show at once. Try: focus Button 1 (tab), then hover Button 2.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span
            {...noCoord1Target}
            tabIndex={0}
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Button 1
          </span>
          {noCoord1Tooltip && <Tooltip {...noCoord1Tooltip} />}

          <span
            {...noCoord2Target}
            tabIndex={0}
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Button 2
          </span>
          {noCoord2Tooltip && <Tooltip {...noCoord2Tooltip} />}
        </div>
        <pre
          style={{
            backgroundColor: '#f5f5f5',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '12px',
            marginTop: '12px',
          }}
        >
          {`// No coordination - tooltips work independently
const [target1, tooltip1] = useTooltipAdvanced({...});
const [target2, tooltip2] = useTooltipAdvanced({...});

// Both can show at once!`}
        </pre>
      </Box>

      <Box>
        <h3>With Coordination</h3>
        <p style={{ fontSize: '14px', marginBottom: '12px' }}>
          Only one tooltip at a time. Try: focus Button 1, then hover Button 2. Notice only one shows!
        </p>
        <TooltipCoordinator>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span
              {...coord1Target}
              tabIndex={0}
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Button 1
            </span>
            {coord1Tooltip && <Tooltip {...coord1Tooltip} />}

            <span
              {...coord2Target}
              tabIndex={0}
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Button 2
            </span>
            {coord2Tooltip && <Tooltip {...coord2Tooltip} />}
          </div>
        </TooltipCoordinator>
        <pre
          style={{
            backgroundColor: '#f5f5f5',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '12px',
            marginTop: '12px',
          }}
        >
          {`// Wrap in TooltipCoordinator for mutual exclusion
<TooltipCoordinator>
  <button {...target1}>Button 1</button>
  {tooltip1 && <Tooltip {...tooltip1} />}
  
  <button {...target2}>Button 2</button>
  {tooltip2 && <Tooltip {...tooltip2} />}
</TooltipCoordinator>

// Only one tooltip shows at a time!`}
        </pre>
      </Box>

      <Box>
        <h3>Mixed: Coordinated + Independent</h3>
        <p style={{ fontSize: '14px', marginBottom: '12px' }}>
          Button 1 coordinates, Button 2 opts out. Try: focus Button 1, hover Button 2. Both show!
        </p>
        <TooltipCoordinator>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span
              {...mixed1Target}
              tabIndex={0}
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Button 1
            </span>
            {mixed1Tooltip && <Tooltip {...mixed1Tooltip} />}

            <span
              {...mixed2Target}
              tabIndex={0}
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Button 2
            </span>
            {mixed2Tooltip && <Tooltip {...mixed2Tooltip} />}
          </div>
        </TooltipCoordinator>
        <pre
          style={{
            backgroundColor: '#f5f5f5',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '12px',
            marginTop: '12px',
          }}
        >
          {`// Button 2 opts out of coordination
const [target2, tooltip2] = useTooltipAdvanced({
  content: 'Independent',
  disableCoordination: true  // ← Opts out
});

// Button 2's tooltip can show with Button 1's!`}
        </pre>
      </Box>
    </SpaceBetween>
  );
}

export default function TooltipHookComparison() {
  // ====== MANUAL IMPLEMENTATION (Current Pattern) ======
  const manualTopRef = React.useRef<HTMLSpanElement>(null);
  const manualRightRef = React.useRef<HTMLSpanElement>(null);
  const manualStatusRef = React.useRef<HTMLSpanElement>(null);

  const [showManualTop, setShowManualTop] = React.useState(false);
  const [showManualRight, setShowManualRight] = React.useState(false);
  const [showManualStatus, setShowManualStatus] = React.useState(false);

  // ====== HOOK IMPLEMENTATION (New Pattern) ======
  const hookTop = useTooltip('Tooltip on top', { position: 'top' });
  const hookRight = useTooltip('Tooltip on right', { position: 'right' });
  const hookStatus = useTooltip(<StatusIndicator type="success">Operation completed successfully</StatusIndicator>, {
    position: 'top',
  });
  const hookLarge = useTooltip('This is a large tooltip with more content', {
    position: 'top',
    size: 'large',
  });
  const hookIcon = useTooltip('Click for more information', { position: 'right' });
  const hookBadge = useTooltip('Feature released this week', { position: 'top' });

  // ====== ADVANCED HOOK IMPLEMENTATION (Proposed Pattern) ======
  const [advancedTopTarget, advancedTopTooltip] = useTooltipAdvanced({
    content: 'Advanced tooltip with proper focus/hover handling',
    position: 'top',
  });
  const [advancedRightTarget, advancedRightTooltip] = useTooltipAdvanced({
    content: 'Stays visible when focused or hovered',
    position: 'right',
  });
  const [advancedStatusTarget, advancedStatusTooltip] = useTooltipAdvanced({
    content: <StatusIndicator type="success">Handles both hover and focus properly</StatusIndicator>,
    position: 'top',
  });
  const [advancedIconTarget, advancedIconTooltip, advancedIconApi] = useTooltipAdvanced({
    content: 'Programmatic control via API',
    position: 'right',
  });

  return (
    <div style={{ padding: '50px' }}>
      <h1>Tooltip Implementation Comparison</h1>
      <p>Comparing the manual pattern vs. the useTooltip hook pattern.</p>

      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Pattern 1: Manual Implementation (Current)</Header>}>
          <SpaceBetween size="m">
            <Box>
              <h3>Code Required</h3>
              <pre style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                {`// Per tooltip, you need:
const topRef = React.useRef<HTMLSpanElement>(null);
const [showTop, setShowTop] = React.useState(false);

<span
  ref={topRef}
  onMouseEnter={() => setShowTop(true)}
  onMouseLeave={() => setShowTop(false)}
>
  Hover me
</span>
{showTop && <Tooltip trackRef={topRef} value="Text" />}`}
              </pre>
            </Box>

            <Box>
              <h3>Examples</h3>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <Box>
                  <span
                    ref={manualTopRef}
                    onMouseEnter={() => setShowManualTop(true)}
                    onMouseLeave={() => setShowManualTop(false)}
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
                  {showManualTop && <Tooltip trackRef={manualTopRef} value="Tooltip on top" position="top" />}
                </Box>

                <Box>
                  <span
                    ref={manualRightRef}
                    onMouseEnter={() => setShowManualRight(true)}
                    onMouseLeave={() => setShowManualRight(false)}
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
                  {showManualRight && <Tooltip trackRef={manualRightRef} value="Tooltip on right" position="right" />}
                </Box>

                <Box>
                  <span
                    ref={manualStatusRef}
                    onMouseEnter={() => setShowManualStatus(true)}
                    onMouseLeave={() => setShowManualStatus(false)}
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    With StatusIndicator
                  </span>
                  {showManualStatus && (
                    <Tooltip
                      trackRef={manualStatusRef}
                      value={<StatusIndicator type="success">Operation completed successfully</StatusIndicator>}
                      position="top"
                    />
                  )}
                </Box>
              </div>
            </Box>

            {/* <Box>
              <h3>Pros & Cons</h3>
              <SpaceBetween size="s">
                <div>
                  <strong>✅ Pros:</strong>
                  <ul>
                    <li>Full control over behavior</li>
                    <li>No magic or hidden complexity</li>
                    <li>Easy to customize event handlers</li>
                    <li>Explicit state management</li>
                  </ul>
                </div>
                <div>
                  <strong>❌ Cons:</strong>
                  <ul>
                    <li>Verbose - lots of boilerplate per tooltip</li>
                    <li>Easy to make mistakes (duplicate refs, etc.)</li>
                    <li>Repetitive code</li>
                  </ul>
                </div>
              </SpaceBetween>
            </Box> */}
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Pattern 2: useTooltip Hook (New)</Header>}>
          <SpaceBetween size="m">
            <Box>
              <h3>Code Required</h3>
              <pre style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                {`// Import the hook
import { useTooltip } from '~components/tooltip/use-tooltip';

// One line per tooltip:
const tooltip = useTooltip('Tooltip text', { position: 'top' });

// Usage:
<span {...tooltip.triggerProps}>Hover me</span>
{tooltip.tooltip && <Tooltip {...tooltip.tooltip} />}`}
              </pre>
            </Box>

            <Box>
              <h3>Examples</h3>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <Box>
                  <span
                    {...hookTop.triggerProps}
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
                  {hookTop.tooltip && <Tooltip {...hookTop.tooltip} />}
                </Box>

                <Box>
                  <span
                    {...hookRight.triggerProps}
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
                  {hookRight.tooltip && <Tooltip {...hookRight.tooltip} />}
                </Box>

                <Box>
                  <span {...hookStatus.triggerProps} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                    With StatusIndicator
                  </span>
                  {hookStatus.tooltip && <Tooltip {...hookStatus.tooltip} />}
                </Box>
              </div>
            </Box>

            <Box>
              <h3>Advanced Examples</h3>
              <SpaceBetween size="m" direction="horizontal">
                <Box>
                  <span
                    {...hookLarge.triggerProps}
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
                  {hookLarge.tooltip && <Tooltip {...hookLarge.tooltip} />}
                </Box>

                <Box>
                  <span {...hookIcon.triggerProps}>
                    <Icon name="status-info" size="medium" />
                  </span>
                  {hookIcon.tooltip && <Tooltip {...hookIcon.tooltip} />}
                </Box>

                <Box>
                  <span {...hookBadge.triggerProps}>
                    <Badge color="blue">New</Badge>
                  </span>
                  {hookBadge.tooltip && <Tooltip {...hookBadge.tooltip} />}
                </Box>
              </SpaceBetween>
            </Box>

            {/* <Box>
              <h3>Pros & Cons</h3>
              <SpaceBetween size="s">
                <div>
                  <strong>✅ Pros:</strong>
                  <ul>
                    <li>Much less boilerplate</li>
                    <li>Reusable - one hook call per tooltip</li>
                    <li>Cleaner code</li>
                    <li>Still provides manual control via show/setShow</li>
                  </ul>
                </div>
                <div>
                  <strong>❌ Cons:</strong>
                  <ul>
                    <li>Need to spread triggerProps</li>
                    <li>Slightly more opaque (hook handles state)</li>
                    <li>May not fit all edge cases (use manual pattern then)</li>
                  </ul>
                </div>
              </SpaceBetween>
            </Box> */}
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Pattern 3: Wrapper Component (Alternative)</Header>}>
          <SpaceBetween size="m">
            <Box>
              <h3>Code Required</h3>
              <pre style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                {`// Create reusable wrapper component once:
function TooltipWrapper({ content, position, children }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  
  return (
    <>
      <span ref={ref} 
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}>
        {children}
      </span>
      {show && <Tooltip trackRef={ref} value={content} position={position} />}
    </>
  );
}

// Usage - simple component wrapping:
<TooltipWrapper content="Tooltip text" position="top">
  <button>Hover me</button>
</TooltipWrapper>`}
              </pre>
            </Box>

            <Box>
              <h3>Examples</h3>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <Box>
                  <TooltipWrapper
                    content="Tooltip on top"
                    position="top"
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Top Position
                  </TooltipWrapper>
                </Box>

                <Box>
                  <TooltipWrapper
                    content="Tooltip on right"
                    position="right"
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Right Position
                  </TooltipWrapper>
                </Box>

                <Box>
                  <TooltipWrapper
                    content={<StatusIndicator type="success">Operation completed successfully</StatusIndicator>}
                    position="top"
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    With StatusIndicator
                  </TooltipWrapper>
                </Box>
              </div>
            </Box>

            <Box>
              <h3>Advanced Examples</h3>
              <SpaceBetween size="m" direction="horizontal">
                <Box>
                  <TooltipWrapper
                    content="This is a large tooltip with more content"
                    position="top"
                    size="large"
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Large Tooltip
                  </TooltipWrapper>
                </Box>

                <Box>
                  <TooltipWrapper content="Click for more information" position="right">
                    <Icon name="status-info" size="medium" />
                  </TooltipWrapper>
                </Box>

                <Box>
                  <TooltipWrapper content="Feature released this week" position="top">
                    <Badge color="blue">New</Badge>
                  </TooltipWrapper>
                </Box>
              </SpaceBetween>
            </Box>
            {/* 
            <Box>
              <h3>Pros & Cons</h3>
              <SpaceBetween size="s">
                <div>
                  <strong>✅ Pros:</strong>
                  <ul>
                    <li>Most React-like - single component wrapping</li>
                    <li>Clean JSX - no spreading props or conditional rendering</li>
                    <li>Easiest to use - just wrap your element</li>
                    <li>Good for simple cases</li>
                  </ul>
                </div>
                <div>
                  <strong>❌ Cons:</strong>
                  <ul>
                    <li>Adds extra DOM element (wrapper span)</li>
                    <li>Less flexible for styling - style goes on wrapper, not child</li>
                    <li>Cannot use with elements that need specific props/refs</li>
                    <li>Harder to customize trigger behavior</li>
                  </ul>
                </div>
              </SpaceBetween>
            </Box> */}
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Pattern 4: useTooltipAdvanced Hook (Proposed)</Header>}>
          <SpaceBetween size="m">
            <Box>
              <h3>Code Required</h3>
              <pre style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                {`// Import the advanced hook
import { useTooltipAdvanced } from '~components/tooltip/use-tooltip-advanced';

// Array destructuring with three elements:
const [targetProps, tooltipProps, api] = useTooltipAdvanced({
  content: 'Tooltip text',
  position: 'top'
});

// Usage:
<button {...targetProps}>Hover or focus me</button>
{tooltipProps && <Tooltip {...tooltipProps} />}

// Programmatic control:
<button onClick={api.show}>Show tooltip</button>
<button onClick={api.hide}>Hide tooltip</button>`}
              </pre>
            </Box>

            <Box>
              <h3>Examples</h3>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <Box>
                  <span
                    {...advancedTopTarget}
                    tabIndex={0}
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Top Position (Try Tab)
                  </span>
                  {advancedTopTooltip && <Tooltip {...advancedTopTooltip} />}
                </Box>

                <Box>
                  <span
                    {...advancedRightTarget}
                    tabIndex={0}
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Right Position (Try Tab)
                  </span>
                  {advancedRightTooltip && <Tooltip {...advancedRightTooltip} />}
                </Box>

                <Box>
                  <span
                    {...advancedStatusTarget}
                    tabIndex={0}
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    With StatusIndicator
                  </span>
                  {advancedStatusTooltip && <Tooltip {...advancedStatusTooltip} />}
                </Box>
              </div>
            </Box>

            <Box>
              <h3>Programmatic Control</h3>
              <SpaceBetween size="m" direction="horizontal">
                <Box>
                  <SpaceBetween size="s">
                    <span {...advancedIconTarget} tabIndex={0}>
                      <Icon name="status-info" size="medium" />
                    </span>
                    {advancedIconTooltip && <Tooltip {...advancedIconTooltip} />}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => advancedIconApi.show()} style={{ padding: '4px 8px', fontSize: '12px' }}>
                        Show
                      </button>
                      <button onClick={() => advancedIconApi.hide()} style={{ padding: '4px 8px', fontSize: '12px' }}>
                        Hide
                      </button>
                      <button onClick={() => advancedIconApi.toggle()} style={{ padding: '4px 8px', fontSize: '12px' }}>
                        Toggle
                      </button>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      API visible: {advancedIconApi.isVisible ? 'true' : 'false'}
                    </div>
                  </SpaceBetween>
                </Box>
              </SpaceBetween>
            </Box>

            {/* <Box>
              <h3>Key Features</h3>
              <div style={{ fontSize: '14px' }}>
                <ul>
                  <li>
                    <strong>Proper hover/focus handling:</strong> Tooltip stays visible when element is either hovered
                    OR focused
                  </li>
                  <li>
                    <strong>Array destructuring API:</strong> [targetProps, tooltipProps, api] provides clean separation
                  </li>
                  <li>
                    <strong>All event handlers included:</strong> onMouseEnter, onMouseLeave, onFocus, onBlur
                  </li>
                  <li>
                    <strong>Programmatic control:</strong> api.show(), api.hide(), api.toggle(), api.isVisible
                  </li>
                  <li>
                    <strong>Null tooltipProps when hidden:</strong> Conditional rendering pattern {'{'}tooltipProps &&
                    ...{'}'}
                  </li>
                  <li>
                    <strong>Try tabbing:</strong> Use Tab key to focus elements and see tooltip persist while focused
                  </li>
                </ul>
              </div>
            </Box> */}
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Pattern 5: SimpleTooltip Component (Recommended)</Header>}>
          <SpaceBetween size="m">
            <Box>
              <h3>Code Required</h3>
              <pre style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                {`// Import the component
import { SimpleTooltip } from '~components/tooltip/simple-tooltip';

// Usage - minimal props, maximum accessibility:
<SimpleTooltip content="Tooltip text" position="top">
  <button>Hover me</button>
</SimpleTooltip>`}
              </pre>
            </Box>

            <Box>
              <h3>Examples</h3>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <Box>
                  <SimpleTooltip content="Tooltip on top" position="top">
                    <span
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
                  </SimpleTooltip>
                </Box>

                <Box>
                  <SimpleTooltip content="Tooltip on right" position="right">
                    <span
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
                  </SimpleTooltip>
                </Box>

                <Box>
                  <SimpleTooltip
                    content={<StatusIndicator type="success">Operation completed successfully</StatusIndicator>}
                    position="top"
                  >
                    <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>With StatusIndicator</span>
                  </SimpleTooltip>
                </Box>
              </div>
            </Box>

            <Box>
              <h3>Advanced Examples</h3>
              <SpaceBetween size="m" direction="horizontal">
                <Box>
                  <SimpleTooltip content="Click for more information" position="right">
                    <Icon name="status-info" size="medium" />
                  </SimpleTooltip>
                </Box>

                <Box>
                  <SimpleTooltip content="Feature released this week" position="top">
                    <Badge color="blue">New</Badge>
                  </SimpleTooltip>
                </Box>

                <Box>
                  <SimpleTooltip content="This button performs an action">
                    <button>Interactive Element</button>
                  </SimpleTooltip>
                </Box>
              </SpaceBetween>
            </Box>

            {/* <Box>
              <h3>Features</h3>
              <SpaceBetween size="s">
                <div>
                  <strong>✅ Built-in Accessibility:</strong>
                  <ul>
                    <li>Keyboard accessible (shows on focus, hides on blur)</li>
                    <li>Escape key dismisses tooltip</li>
                    <li>Hover and focus support</li>
                    <li>No ARIA annotations needed - handled internally</li>
                  </ul>
                </div>
                <div>
                  <strong>✅ Minimal Props:</strong>
                  <ul>
                    <li>Only 2 required props: content and children</li>
                    <li>Position optional (defaults to 'top')</li>
                    <li>No ref management needed</li>
                    <li>No state management needed</li>
                  </ul>
                </div>
                <div>
                  <strong>✅ Clean API:</strong>
                  <ul>
                    <li>1-2 lines of code per tooltip</li>
                    <li>Simple component wrapping</li>
                    <li>Works with any React element</li>
                    <li>Passes all accessibility tests</li>
                  </ul>
                </div>
              </SpaceBetween>
            </Box> */}
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Pattern 6: Tooltip Coordination</Header>}>
          <SpaceBetween size="m">
            <Box>
              <h3>Problem: Multiple Tooltips in Proximity</h3>
              <p style={{ fontSize: '14px', marginBottom: '12px' }}>
                When tooltips are close together, one element can be focused while another is hovered, causing multiple
                tooltips to show simultaneously. The <code>TooltipCoordinator</code> solves this by ensuring only one
                tooltip is visible at a time within its scope.
              </p>
            </Box>

            <CoordinationDemo />
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </div>
  );
}
