// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Modal from '@cloudscape-design/components/modal';
import SpaceBetween from '@cloudscape-design/components/space-between';

export default function UnsavedChangesModal({
  isVisible,
  onDismiss,
  onLeave,
}: {
  isVisible: boolean;
  onDismiss: () => void;
  onLeave: () => void;
}) {
  return (
    <Modal
      visible={isVisible}
      header="Close side panel"
      closeAriaLabel="Close modal"
      onDismiss={onDismiss}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onDismiss} data-testid="unsaved-changes-modal-cancel">
              Cancel
            </Button>
            <Button variant="primary" onClick={onLeave} data-testid="unsaved-changes-modal-submit">
              Close
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <Alert type="warning" statusIconAriaLabel="Warning">
        Closing the side panel will result in the changes that you made there not being saved. Do you want to proceed?
      </Alert>
    </Modal>
  );
}
