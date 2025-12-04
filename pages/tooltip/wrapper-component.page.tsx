// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Container from '~components/container';
import Header from '~components/header';
import InternalTooltip from '~components/internal/components/tooltip';
// import { IconProps } from '~components/icon/interfaces';
import Slider from '~components/slider';
import SpaceBetween from '~components/space-between';

// ============================================================================
// TOOLTIP AS WRAPPER COMPONENT
// ============================================================================

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  variant?: 'label' | 'disabled-reason' | 'truncation' | 'feedback' | 'value-display';
  position?: 'top' | 'right' | 'bottom' | 'left';
  size?: 'small' | 'medium' | 'large';
}

function Tooltip({ content, children, variant = 'label', position, size = 'small' }: TooltipProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const descriptionId = useRef(`tooltip-desc-${Math.random().toString(36).slice(2, 11)}`).current;

  // Mobile detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Truncation detection
  useEffect(() => {
    if (variant === 'truncation' && wrapperRef.current) {
      const checkOverflow = () => {
        const wrapper = wrapperRef.current;
        if (wrapper) {
          const contentEl = wrapper.querySelector('[data-truncation-target]') as HTMLElement;
          if (contentEl) {
            const isOverflowing = contentEl.scrollWidth > contentEl.clientWidth;
            setIsTruncated(isOverflowing);
          }
        }
      };

      checkOverflow();
      const observer = new ResizeObserver(checkOverflow);
      if (wrapperRef.current) {
        observer.observe(wrapperRef.current);
      }

      return () => {
        observer.disconnect();
      };
    }
  }, [variant]);

  // Determine trigger based on mobile and variant
  const shouldHandleHover = !isMobile || variant === 'value-display';
  const shouldHandleTouch = variant === 'value-display';

  const show = useCallback(() => setShowTooltip(true), []);
  const hide = useCallback(() => setShowTooltip(false), []);

  // Should show logic
  const shouldShow = useMemo(() => {
    if (variant === 'truncation' && !isTruncated) {
      return false;
    }
    return showTooltip;
  }, [variant, isTruncated, showTooltip]);

  // Hidden description for disabled-reason variant
  const hiddenDescription = variant === 'disabled-reason' && (
    <div id={descriptionId} hidden={true} aria-hidden="true" style={{ display: 'none' }}>
      {content}
    </div>
  );

  // Tooltip value with LiveRegion if needed
  const tooltipValue = useMemo(() => {
    if (variant === 'feedback' || variant === 'truncation') {
      return (
        <span role="status" aria-live="polite" aria-atomic="true">
          {content}
        </span>
      );
    }
    return content;
  }, [variant, content]);

  // Enhanced children with ARIA props for disabled-reason
  const enhancedChild = useMemo(() => {
    if (variant === 'disabled-reason') {
      return React.cloneElement(children, {
        'aria-describedby': descriptionId,
      } as any);
    }
    if (variant === 'label') {
      return React.cloneElement(children, {
        ariaLabel: typeof content === 'string' ? content : undefined,
      } as any);
    }
    if (variant === 'truncation') {
      return React.cloneElement(children, {
        'data-truncation-target': true,
        'aria-label': typeof content === 'string' ? content : undefined,
        tabIndex: isTruncated ? 0 : undefined,
      } as any);
    }
    return children;
  }, [children, variant, content, descriptionId, isTruncated]);

  return (
    <div
      ref={wrapperRef}
      style={{ display: 'inline-block' }}
      onMouseEnter={shouldHandleHover ? show : undefined}
      onMouseLeave={shouldHandleHover ? hide : undefined}
      onFocus={show}
      onBlur={hide}
      onTouchStart={shouldHandleTouch ? show : undefined}
      onTouchEnd={shouldHandleTouch ? hide : undefined}
    >
      {enhancedChild}
      {hiddenDescription}
      {shouldShow && (
        <InternalTooltip trackRef={wrapperRef} value={tooltipValue} position={position} size={size} onDismiss={hide} />
      )}
    </div>
  );
}

// ============================================================================
// DEMO PAGE
// ============================================================================

export default function TooltipWrapperComponent() {
  const [sliderValue, setSliderValue] = useState(50);
  const [copied, setCopied] = useState(false);

  return (
    <div style={{ padding: '50px' }}>
      <h1>Tooltip as Wrapper Component</h1>
      <p>Declarative wrapper syntax</p>

      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Use Case 1: Icon Button Labels</Header>}>
          <Box>
            <h3>Simple API (variant=&quot;label&quot;)</h3>
            <p>Hover over the buttons to see tooltips. Works on desktop, adapts to mobile.</p>

            <SpaceBetween size="m" direction="horizontal">
              <Tooltip content="Copy">
                <Button variant="icon" iconName="copy" />
              </Tooltip>

              <Tooltip content="Edit">
                <Button variant="icon" iconName="edit" />
              </Tooltip>

              <Tooltip content="Download">
                <Button variant="icon" iconName="download" />
              </Tooltip>

              <Tooltip content="Settings">
                <Button variant="icon" iconName="settings" />
              </Tooltip>
            </SpaceBetween>

            <div
              style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: '#d4edda',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px',
              }}
            >
              <pre>
                {`// Just wrap it!
<Tooltip content="Copy">
  <Button variant="icon" iconName="copy" />
</Tooltip>

// That's it! 
// - Auto-manages state
// - Auto-manages ref
// - Auto-manages events  
// - Auto-sets aria-label
// - Auto-adapts to mobile`}
              </pre>
            </div>

            <Box margin={{ top: 'm' }}>
              <strong>What Happens:</strong>
              <ul>
                <li>Wraps child in a div</li>
                <li>Adds event handlers to div</li>
                <li>Sets aria-label on Button</li>
                <li>Desktop: Shows on hover + focus</li>
                <li>Mobile: Focus only (screen reader accessible)</li>
              </ul>
            </Box>
          </Box>
        </Container>

        <Container header={<Header variant="h2">Use Case 2: Disabled with Reasons</Header>}>
          <Box>
            <h3>Critical Information (variant=&quot;disabled-reason&quot;)</h3>
            <p>Hover over disabled button to see reason. Auto-manages all ARIA.</p>

            <SpaceBetween size="m" direction="horizontal">
              <Tooltip content="Complete all required fields before submitting" variant="disabled-reason">
                <Button variant="primary" disabled={true}>
                  Submit
                </Button>
              </Tooltip>

              <Tooltip content="This feature requires a subscription" variant="disabled-reason">
                <Button disabled={true}>Feature</Button>
              </Tooltip>
            </SpaceBetween>

            <div
              style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: '#d4edda',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px',
              }}
            >
              <pre>
                {`<Tooltip 
  content="Complete required fields" 
  variant="disabled-reason"
>
  <Button disabled>Submit</Button>
</Tooltip>

// Auto-generates:
// - Hidden <div id="unique"> for screen readers
// - aria-describedby="unique" on Button
// - Visual tooltip on hover/focus
// - Keeps button focusable (aria-disabled pattern)
// - WCAG compliant by default`}
              </pre>
            </div>

            <Box margin={{ top: 'm' }}>
              <strong>Accessibility:</strong>
              <ul>
                <li>aria-describedby auto-created</li>
                <li>Hidden description for screen readers</li>
                <li>Button stays focusable</li>
                <li>Mobile: Screen reader gets reason</li>
              </ul>
            </Box>
          </Box>
        </Container>

        <Container header={<Header variant="h2">Use Case 3: Action Feedback</Header>}>
          <Box>
            <h3>Dynamic Feedback (variant=&quot;feedback&quot;)</h3>
            <p>Click to see feedback message. Auto-announces to screen readers.</p>

            <Tooltip content={copied ? 'Copied!' : 'Copy to clipboard'} variant="feedback">
              <Button
                iconName="copy"
                onClick={() => {
                  navigator.clipboard.writeText('Sample content');
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </Tooltip>

            <div
              style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: '#d4edda',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px',
              }}
            >
              <pre>
                {`<Tooltip 
  content={copied ? "Copied!" : "Copy"} 
  variant="feedback"
>
  <Button onClick={handleCopy}>Copy</Button>
</Tooltip>

// Auto-wraps content in LiveRegion
// Screen readers announce "Copied!"`}
              </pre>
            </div>
          </Box>
        </Container>

        <Container header={<Header variant="h2">Use Case 4: Value Display</Header>}>
          <Box>
            <h3>Interactive Values (variant=&quot;value-display&quot;)</h3>
            <p>Drag slider to see value. Works with touch on mobile!</p>

            <Tooltip content={`${sliderValue}%`} variant="value-display">
              <Slider
                value={sliderValue}
                onChange={({ detail }) => setSliderValue(detail.value)}
                min={0}
                max={100}
                ariaLabel="Volume"
              />
            </Tooltip>

            <div
              style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: '#d4edda',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px',
              }}
            >
              <pre>
                {`<Tooltip 
  content={value + "%"} 
  variant="value-display"
>
  <Slider value={value} onChange={...} />
</Tooltip>

`}
              </pre>
            </div>

            <Box margin={{ top: 'm' }}>
              <strong>Mobile Support:</strong>
              <ul>
                <li>Touch events: Shows while dragging</li>
                <li>Desktop: Shows on hover + drag</li>
                <li>Automatic - no configuration needed</li>
              </ul>
            </Box>
          </Box>
        </Container>

        {/* <Container header={<Header variant="h2">Comparison: Component vs Hook</Header>}>
          <SpaceBetween size="l">
            <Box>
              <h3>Wrapper Component API (This Page)</h3>
              <div style={{ padding: '12px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
                <pre style={{ fontSize: '11px', margin: 0 }}>
                  {`// Simplest - just wrap
<Tooltip content="Copy">
  <Button variant="icon" iconName="copy" />
</Tooltip>

// Pros:
//   Most concise (3 lines)
//   Declarative
//   Easy to learn
//   Works for 90% of cases

// Cons:
// Uses React.cloneElement
// Less control over focus behavior
// May not work with all components`}
                </pre>
              </div>
            </Box>

            <Box>
              <h3>Hook API (Previous Page)</h3>
              <div style={{ padding: '12px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <pre style={{ fontSize: '11px', margin: 0 }}>
                  {`// Hook gives full control
const tooltip = useTooltip({ 
  content: "Copy",
  variant: "label" 
});

<div ref={tooltip.ref} {...tooltip.events}>
  <Button variant="icon" iconName="copy" />
  {tooltip.tooltip}
</div>

// Pros:
//   Full control over focus
//   Works with any component
//   No cloneElement
//   Better for complex cases

// Cons:
// More verbose (6 lines)
// Requires wrapper div`}
                </pre>
              </div>
            </Box>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">How the Wrapper Component Works</Header>}>
          <Box>
            <h3>Implementation Details</h3>
            <p>The wrapper component uses React.cloneElement to enhance the child with ARIA props:</p>

            <div
              style={{
                padding: '16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '11px',
              }}
            >
              <pre>
                {`function Tooltip({ content, children, variant }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Auto-detect mobile
  const isMobile = useMobileDetection();
  
  // Enhance child with ARIA props
  const enhancedChild = React.cloneElement(children, {
    // For 'label' variant
    ariaLabel: variant === 'label' ? content : undefined,
    
    // For 'disabled-reason' variant  
    'aria-describedby': variant === 'disabled-reason' ? descId : undefined,
  });

  return (
    <div
      ref={wrapperRef}
      style={{ display: 'inline-block' }}
      // Desktop: hover + focus
      onMouseEnter={!isMobile ? () => setShowTooltip(true) : undefined}
      onMouseLeave={!isMobile ? () => setShowTooltip(false) : undefined}
      // All devices: focus
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      // Mobile value-display: touch
      onTouchStart={variant === 'value-display' ? () => setShowTooltip(true) : undefined}
      onTouchEnd={variant === 'value-display' ? () => setShowTooltip(false) : undefined}
    >
      {enhancedChild}
      {hiddenDescription}
      {showTooltip && (
        <InternalTooltip trackRef={wrapperRef} value={content} />
      )}
    </div>
  );
}`}
              </pre>
            </div>

            <Box margin={{ top: 'm' }}>
              <h4>Key Mechanisms:</h4>
              <ul>
                <li>
                  <strong>Wrapper Div:</strong> Captures events before they reach child
                </li>
                <li>
                  <strong>React.cloneElement:</strong> Injects ARIA props into child
                </li>
                <li>
                  <strong>Auto-Mobile Detection:</strong> Uses (pointer: coarse) media query
                </li>
                <li>
                  <strong>Conditional Events:</strong> Hover suppressed on mobile, touch added for value-display
                </li>
              </ul>
            </Box>
          </Box>
        </Container> */}

        {/* <Container header={<Header variant="h2">When to Use Component vs Hook</Header>}>
          <div style={{ padding: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#e0e0e0' }}>
                  <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Scenario</th>
                  <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Use Component</th>
                  <th style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Use Hook</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Simple icon button</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>✅ Perfect fit</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Works but verbose</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Disabled with reason</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>✅ Clean syntax</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>More control</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Action feedback</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>✅ Simple</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>When manual show/hide needed</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Complex focus styling</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>May not work</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>✅ Use hook</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Multiple coordinated tooltips</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Difficult</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>✅ Use hook</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Existing event handlers on child</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>Works (wrapper intercepts)</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>✅ Better control</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Container> */}

        {/* <Container header={<Header variant="h2">Wrapper Component Limitations</Header>}>
          <SpaceBetween size="m">
            <Box>
              <h3>Limitation 1: Extra Wrapper Div</h3>
              <p>Component adds a wrapper div around your content:</p>
              <div style={{ padding: '12px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <pre style={{ fontSize: '11px' }}>
                  {`<Tooltip content="Copy">
  <Button />
</Tooltip>

// Renders as:
<div style={{ display: 'inline-block' }}>
  <Button />
  {tooltip}
</div>

// May affect layout in flex/grid contexts`}
                </pre>
              </div>
            </Box>

            <Box>
              <h3>Limitation 2: React.cloneElement</h3>
              <p>Uses cloneElement to inject ARIA props - may not work with all components:</p>
              <div style={{ padding: '12px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <pre style={{ fontSize: '11px' }}>
                  {`// Works with most components
<Tooltip content="Edit">
  <Button />   
</Tooltip>

// May not work if component doesn't forward props
<Tooltip content="Edit">
  <CustomComponent /> Depends on implementation
</Tooltip>

// Solution: Use hook for custom components`}
                </pre>
              </div>
            </Box>

            <Box>
              <h3>Limitation 3: Focus Control</h3>
              <p>Can&apos;t access child&apos;s internal focus state:</p>
              <div style={{ padding: '12px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <pre style={{ fontSize: '11px' }}>
                  {`// Wrapper detects focus on wrapper div
// Can't see if Button has custom focus styling

// If you need to sync focus state:
// - Use hook API instead
// - Gives you full control over focus behavior`}
                </pre>
              </div>
            </Box>
          </SpaceBetween>
        </Container> */}

        {/* <Container header={<Header variant="h2">Best Practices</Header>}>
          <SpaceBetween size="m">
            <Box>
              <h3>DO: Use for Simple Cases</h3>
              <ul>
                <li>Icon button labels</li>
                <li>Disabled reasons on standard components</li>
                <li>Action feedback messages</li>
                <li>Value display (sliders, pickers)</li>
              </ul>
            </Box>

            <Box>
              <h3>Consider Hook For:</h3>
              <ul>
                <li>Complex focus requirements</li>
                <li>Custom components with special needs</li>
                <li>Multiple coordinated tooltips</li>
                <li>Fine-grained event control</li>
                <li>Layout-sensitive contexts (flex/grid)</li>
              </ul>
            </Box>

            <Box>
              <h3>💡 Pro Tips:</h3>
              <ul>
                <li>Start with wrapper - simplest for most cases</li>
                <li>Switch to hook if you hit limitations</li>
                <li>Both APIs use same underlying logic</li>
                <li>Can mix and match in same application</li>
              </ul>
            </Box>
          </SpaceBetween>
        </Container> */}

        {/* <Container header={<Header variant="h2">Summary</Header>}>
          <div style={{ padding: '16px', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
            <h3>Wrapper Component Benefits:</h3>
            <SpaceBetween size="s">
              <div>✅ <strong>Simplest API</strong> - Just wrap your component</div>
              <div>✅ <strong>Declarative</strong> - Reads naturally in JSX</div>
              <div>✅ <strong>Zero boilerplate</strong> - No state, no refs, no events</div>
              <div>✅ <strong>Auto-everything</strong> - Mobile, ARIA, events handled</div>
              <div>✅ <strong>90% use cases</strong> - Perfect for common scenarios</div>
            </SpaceBetween>

            <Box margin={{ top: 'm' }}>
              <h4>Trade-off:</h4>
              <p>
                Adds wrapper div + uses cloneElement. For 90% of cases this is fine. For complex focus needs or custom
                components, use the hook API instead.
              </p>
            </Box>
          </div>
        </Container> */}
      </SpaceBetween>
    </div>
  );
}
