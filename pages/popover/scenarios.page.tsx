// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import { Select } from '~components';
import Box from '~components/box';
import Button from '~components/button';
import ColumnLayout from '~components/column-layout';
import Link from '~components/link';
import Popover from '~components/popover';
import SpaceBetween from '~components/space-between';
import Spinner from '~components/spinner';
import StatusIndicator from '~components/status-indicator';

import ScreenshotArea from '../utils/screenshot-area';

import styles from './scenarios.scss';

export default function () {
  const [renderWithPortal, setRenderWithPortal] = React.useState(false);
  return (
    <article>
      <h1>Popover</h1>
      <section>
        <label>
          <input
            id="renderWithPortal"
            type="checkbox"
            checked={renderWithPortal}
            onChange={e => setRenderWithPortal(e.target.checked)}
          />
          renderWithPortal
        </label>
      </section>

      <ScreenshotArea disableAnimations={true}>
        <SpaceBetween size="s">
          <section id="scenario-copy" className={styles.scenario}>
            <Popover
              position="top"
              size="small"
              content={<StatusIndicator type="success">Text content copied</StatusIndicator>}
              dismissButton={false}
              triggerType="custom"
              renderWithPortal={renderWithPortal}
            >
              <Button iconName="copy">Copy</Button>
            </Popover>
          </section>

          <section id="scenario-error" className={styles.scenario}>
            <Box color="text-status-error">
              <Popover
                size="medium"
                position="right"
                header="Memory error"
                content={<DynamicContent />}
                dismissAriaLabel="Close"
                renderWithPortal={renderWithPortal}
              >
                <StatusIndicator type="error">Error</StatusIndicator>
              </Popover>
            </Box>
          </section>

          <section id="scenario-medium-key-value" className={styles.scenario}>
            <Popover
              position="left"
              size="medium"
              fixedWidth={true}
              header="Network interface eth0"
              content={<KeyValuePair />}
              dismissAriaLabel="Close"
              renderWithPortal={renderWithPortal}
            >
              eth0
            </Popover>
          </section>

          <section id="scenario-large-key-value" className={styles.scenario}>
            <Popover
              position="bottom"
              size="large"
              fixedWidth={true}
              id="large-popover"
              header="Network interface eth0"
              content={<KeyValuePair />}
              dismissAriaLabel="Close"
              renderWithPortal={renderWithPortal}
            >
              eth0
            </Popover>
          </section>

          <section id="scenario-large-key-value-no-header" className={styles.scenario}>
            <Popover
              position="bottom"
              size="large"
              fixedWidth={true}
              content={<KeyValuePair />}
              dismissAriaLabel="Close"
            >
              eth0
            </Popover>
          </section>

          <section id="scenario-with-select" className={styles.scenario}>
            <Popover
              position="bottom"
              size="small"
              fixedWidth={true}
              content={
                <Select
                  selectedOption={null}
                  options={[
                    { value: '1', label: 'One' },
                    { value: '2', label: 'Two' },
                    { value: '3', label: 'Three' },
                  ]}
                />
              }
              dismissAriaLabel="Close"
            >
              With select
            </Popover>
          </section>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}

function ValueWithLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Box variant="awsui-key-label">{label}</Box>
      <div>{children}</div>
    </div>
  );
}

function KeyValuePair() {
  return (
    <ColumnLayout variant="text-grid" columns={2}>
      <SpaceBetween size="l">
        <ValueWithLabel label="Label for key">Value</ValueWithLabel>
        <ValueWithLabel label="Label for key">
          <StatusIndicator>Positive</StatusIndicator>
        </ValueWithLabel>
      </SpaceBetween>
      <SpaceBetween size="l">
        <ValueWithLabel label="Label for key">Value</ValueWithLabel>
        <ValueWithLabel label="Label for key">
          <Link href="#" externalIconAriaLabel="This link opens in a new tab" external={true}>
            Website
          </Link>
        </ValueWithLabel>
      </SpaceBetween>
    </ColumnLayout>
  );
}

function DynamicContent() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  });

  if (loading) {
    return (
      <span aria-label="Loading">
        <Spinner />
      </span>
    );
  }

  return (
    <>
      This instance contains insufficient memory. Stop the instance, choose a different instance type with more memory,
      and restart it.
    </>
  );
}
