// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Box, Button, Flashbar, KeyValuePairs, Link, Modal, Popover, ProgressBar, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

export default function () {
  const components = [
    { key: 'detail-v1', content: <DetailV1 /> },
    { key: 'detail-v2', content: <DetailV2 /> },
    {
      key: 'popover',
      content: (
        <Popover renderWithPortal={true} content={<DetailV1 />} header="Popover header">
          Click me
        </Popover>
      ),
    },
    { key: 'progressbar', content: <ProgressBarV1 /> },
  ];

  return (
    <SimplePage title="Flashbar visual context" screenshotArea={{}}>
      <SpaceBetween size="m">
        {components.map(({ key, content }) => (
          <Flashbar
            key={key}
            items={[
              { id: 'i', type: 'info', content: <div data-testid={`${key}-info`}>{content}</div> },
              { id: 'w', type: 'warning', content: <div data-testid={`${key}-warning`}>{content}</div> },
            ]}
          />
        ))}
      </SpaceBetween>
    </SimplePage>
  );
}

function DetailV1() {
  const [showModal, setShowModal] = useState(false);
  return (
    <SpaceBetween size="s" direction="horizontal">
      <Box variant="span">Text</Box>
      <Box variant="span" color="text-body-secondary">
        secondary text
      </Box>
      <Button onClick={() => setShowModal(true)}>show modal</Button>
      <Button variant="inline-link">inline link button</Button>
      <Link>link</Link>
      {showModal && (
        <Modal visible={true} onDismiss={() => setShowModal(false)} header="Modal">
          <DetailV2 />
        </Modal>
      )}
    </SpaceBetween>
  );
}

function DetailV2() {
  return (
    <KeyValuePairs
      items={[
        {
          label: 'Distribution ID',
          value: 'E1WG1ZNPRXT0D4',
          info: (
            <Link variant="info" href="#">
              Info
            </Link>
          ),
        },
      ]}
    />
  );
}

function ProgressBarV1() {
  return (
    <ProgressBar
      variant="flash"
      status="in-progress"
      value={50}
      label="Label"
      description="Description"
      additionalInfo="Additional info"
    />
  );
}
