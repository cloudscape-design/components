// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Alert, Box, Button, Checkbox, Modal, SpaceBetween } from '~components';

import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  const [visible, setVisible] = useState(false);
  const [hideDismissButton, setHideDismissButton] = useState(true);
  const [forceChoice, setForceChoice] = useState(false);
  const [log, setLog] = useState<Array<string>>([]);

  return (
    <article>
      <h1>Modal without a dismiss button</h1>
      <p>
        <code>hideDismissButton</code> only controls whether the header renders a close button. ESC and clicks outside
        the modal still call <code>onDismiss</code> either way. How strict the modal is stays the consumer&apos;s
        decision.
      </p>

      <SpaceBetween size="s">
        <Checkbox checked={hideDismissButton} onChange={({ detail }) => setHideDismissButton(detail.checked)}>
          hideDismissButton
        </Checkbox>
        <Checkbox checked={forceChoice} onChange={({ detail }) => setForceChoice(detail.checked)}>
          Force a choice: ignore the `keyboard` and `overlay` reasons
        </Checkbox>

        <SpaceBetween size="xs" direction="horizontal">
          <Button id="show-modal" onClick={() => setVisible(true)}>
            Show modal
          </Button>
          <Button id="clear-log" onClick={() => setLog([])}>
            Clear log
          </Button>
        </SpaceBetween>

        <Box id="dismiss-log" variant="p">
          onDismiss log: {log.length === 0 ? 'empty' : log.join(' | ')}
        </Box>
      </SpaceBetween>

      <ScreenshotArea>
        <Modal
          hideDismissButton={hideDismissButton}
          header="Assign a region"
          visible={visible}
          closeAriaLabel="Close modal"
          onDismiss={({ detail }) => {
            const ignored = forceChoice && (detail.reason === 'keyboard' || detail.reason === 'overlay');
            setLog(entries => [...entries, `${detail.reason} → ${ignored ? 'ignored' : 'closed'}`]);
            if (!ignored) {
              setVisible(false);
            }
          }}
          footer={
            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                id="keep-current"
                onClick={() => {
                  setLog(entries => [...entries, 'footer: keep → closed']);
                  setVisible(false);
                }}
              >
                Keep us-west-2
              </Button>
              <Button
                id="migrate"
                variant="primary"
                onClick={() => {
                  setLog(entries => [...entries, 'footer: migrate → closed']);
                  setVisible(false);
                }}
              >
                Migrate to us-east-1
              </Button>
            </span>
          }
        >
          <Alert type="warning">
            Your workload has to be assigned to a region before you can continue. Both options take effect immediately.
          </Alert>
        </Modal>
      </ScreenshotArea>
    </article>
  );
}
