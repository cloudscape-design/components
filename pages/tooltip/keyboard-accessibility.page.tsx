// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Container from '~components/container';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import Tooltip from '~components/tooltip';

export default function TooltipKeyboardAccessibility() {
  return (
    <article>
      <h1>Tooltip Keyboard Accessibility Demo</h1>
      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Keyboard Controls</Header>}>
          <SpaceBetween size="m">
            <div>
              <strong>Tab Key:</strong> Toggle tooltip open/close without delay
            </div>
            <div>
              <strong>Space Key:</strong> Close tooltip without delay (if open)
            </div>
            <div>
              <strong>Enter Key:</strong> Close tooltip without delay (if open)
            </div>
            <div>
              <strong>Escape Key:</strong> Close tooltip without delay (if open)
            </div>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Test with Button (hover-focus trigger)</Header>}>
          <SpaceBetween size="m" direction="horizontal">
            <Tooltip content="Try pressing Tab to toggle, or Space/Enter/Escape to close" trigger="hover-focus">
              <Button>Hover or Focus Me</Button>
            </Tooltip>
            <Tooltip content="This tooltip also supports keyboard controls" trigger="hover-focus">
              <Button variant="primary">Another Button</Button>
            </Tooltip>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Test with Link (focus trigger)</Header>}>
          <SpaceBetween size="m" direction="horizontal">
            <Tooltip content="Focus on me and press Tab to toggle" trigger="focus">
              <Link href="#" variant="primary">
                Focusable Link
              </Link>
            </Tooltip>
            <Tooltip content="Use keyboard to control this tooltip" trigger="focus">
              <Link href="#" variant="secondary">
                Another Link
              </Link>
            </Tooltip>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Test with Hover Only (no keyboard)</Header>}>
          <p>
            <Tooltip content="This only opens on hover, keyboard controls won't work" trigger="hover">
              <Link href="#">Hover-only Link</Link>
            </Tooltip>
          </p>
          <p>Note: Keyboard controls are only active when trigger includes &quot;focus&quot; (focus or hover-focus)</p>
        </Container>

        <Container header={<Header variant="h2">Instructions</Header>}>
          <ol>
            <li>
              <strong>Tab Navigation:</strong> Use Tab key to focus on the buttons/links above
            </li>
            <li>
              <strong>Toggle with Tab:</strong> When focused, press Tab to open/close the tooltip immediately
            </li>
            <li>
              <strong>Close with Space/Enter/Escape:</strong> When tooltip is open, press Space, Enter, or Escape to
              close it immediately
            </li>
            <li>
              <strong>Normal Focus Behavior:</strong> The tooltip still opens automatically when you focus using Tab
              navigation
            </li>
          </ol>
        </Container>

        <Container header={<Header variant="h2">Accessibility Benefits</Header>}>
          <ul>
            <li>
              <strong>Tab Key Toggle:</strong> Provides quick access to tooltip information without waiting for delays
            </li>
            <li>
              <strong>Immediate Dismissal:</strong> Space, Enter, and Escape keys close tooltips instantly, improving
              keyboard navigation efficiency
            </li>
            <li>
              <strong>No Page Scroll:</strong> Space key is prevented from scrolling the page when closing tooltips
            </li>
            <li>
              <strong>Escape Key:</strong> Standard pattern for dismissing overlay content, familiar to keyboard users
            </li>
            <li>
              <strong>Focus-Only Safe:</strong> Keyboard controls only work with focus-enabled triggers, preventing
              unexpected behavior
            </li>
          </ul>
        </Container>
      </SpaceBetween>
    </article>
  );
}
