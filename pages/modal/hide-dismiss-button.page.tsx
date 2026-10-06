// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Alert, Box, Button, Checkbox, Modal, SpaceBetween } from '~components';

import { useAppContext } from '../app/app-context';
import { SimplePage } from '../app/templates';

type PageContext = 'hideDismissButton' | 'forceChoice' | 'withHeader';

export default function () {
  // Settings live in the URL so they can be shared as a link and selected from screenshot and
  // integration test definitions through query params.
  const { urlParams, setUrlParams } = useAppContext<PageContext>();
  const hideDismissButton = urlParams.hideDismissButton !== false;
  const withHeader = urlParams.withHeader !== false;
  const forceChoice = urlParams.forceChoice === true;

  const [visible, setVisible] = useState(false);
  const [log, setLog] = useState<Array<string>>([]);

  return (
    <SimplePage
      title="Modal without a dismiss button"
      subtitle={
        <>
          <code>hideDismissButton</code> only controls whether the header renders a close button. ESC and clicks outside
          the modal still call <code>onDismiss</code> either way. How strict the modal is stays the consumer&apos;s
          decision.
        </>
      }
      settings={
        <SpaceBetween size="s">
          <Checkbox
            checked={hideDismissButton}
            onChange={({ detail }) => setUrlParams({ hideDismissButton: detail.checked })}
          >
            hideDismissButton
          </Checkbox>
          <Checkbox checked={forceChoice} onChange={({ detail }) => setUrlParams({ forceChoice: detail.checked })}>
            Force a choice: ignore the `keyboard` and `overlay` reasons
          </Checkbox>
          <Checkbox checked={withHeader} onChange={({ detail }) => setUrlParams({ withHeader: detail.checked })}>
            Provide a header (uncheck to see focus fall back to the dialog)
          </Checkbox>
        </SpaceBetween>
      }
      screenshotArea={{}}
    >
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

      <Modal
        hideDismissButton={hideDismissButton}
        header={withHeader ? 'Assign a region' : undefined}
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
    </SimplePage>
  );
}
