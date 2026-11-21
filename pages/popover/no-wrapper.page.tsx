// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Icon from '~components/icon';
import Popover from '~components/popover';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';

export default function PopoverNoWrapperPage() {
  return (
    <article>
      <h1>Popover — triggerType=&quot;no-wrapper&quot;</h1>
      <p>
        The <code>no-wrapper</code> trigger type injects click/keydown/ref props directly onto the single child element
        via <code>React.cloneElement</code>, avoiding any extra wrapper in the DOM. The child element becomes the
        popover trigger itself.
      </p>

      <SpaceBetween size="l">
        {/* Scenario 1: Icon button as trigger */}
        <section id="scenario-icon-button">
          <h2>Icon button trigger</h2>
          <Box>
            <Popover
              triggerType="no-wrapper"
              header="Info"
              content="This popover is triggered by a native icon button with no extra wrapper element."
              dismissAriaLabel="Close"
            >
              <button
                type="button"
                aria-label="More information"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <Icon name="status-info" />
              </button>
            </Popover>
          </Box>
        </section>

        {/* Scenario 2: Cloudscape Button component as trigger */}
        <section id="scenario-cloudscape-button">
          <h2>Cloudscape Button trigger</h2>
          <Box>
            <Popover
              triggerType="no-wrapper"
              header="Copied!"
              content={<StatusIndicator type="success">Text content copied</StatusIndicator>}
              dismissButton={false}
            >
              <Button iconName="copy">Copy to clipboard</Button>
            </Popover>
          </Box>
        </section>

        {/* Scenario 3: Status indicator as trigger */}
        <section id="scenario-status-indicator">
          <h2>Status indicator trigger</h2>
          <Box>
            <Popover
              triggerType="no-wrapper"
              size="medium"
              position="right"
              header="Instance running"
              content="The EC2 instance i-0abc123def456 is currently running and healthy."
              dismissAriaLabel="Close"
            >
              <button
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                aria-label="Instance status — click for details"
              >
                <StatusIndicator type="success">Running</StatusIndicator>
              </button>
            </Popover>
          </Box>
        </section>

        {/* Scenario 4: renderWithPortal */}
        <section id="scenario-portal">
          <h2>With renderWithPortal</h2>
          <Box>
            <Popover
              triggerType="no-wrapper"
              header="Portal popover"
              content="This popover renders in a portal but the trigger is still injected via no-wrapper."
              renderWithPortal={true}
              dismissAriaLabel="Close"
            >
              <button
                type="button"
                aria-label="Open portal popover"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <Icon name="settings" />
              </button>
            </Popover>
          </Box>
        </section>

        {/* Scenario 5: child retains its own onClick */}
        <section id="scenario-child-onclick">
          <h2>Child retains its own onClick handler</h2>
          <Box>
            <Popover
              triggerType="no-wrapper"
              header="Both handlers fired"
              content="The child's own onClick and the popover's onClick both fire."
              dismissAriaLabel="Close"
            >
              <Button
                onClick={() => {
                  console.log('child onClick fired');
                }}
              >
                Open popover (check console)
              </Button>
            </Popover>
          </Box>
        </section>
      </SpaceBetween>
    </article>
  );
}
