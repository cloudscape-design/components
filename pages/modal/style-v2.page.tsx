// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, Button, Modal, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function ModalStyleV2Page() {
  const [visible, setVisible] = useState(true);
  return (
    <SimplePage title="Modal with Style API v2" screenshotArea={{}}>
      <SpaceBetween size="l">
        <Button variant="primary" onClick={() => setVisible(true)}>
          Open styled modal
        </Button>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          header="Confirm action"
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <div className={styles['styled-button-secondary']}>
                  <Button variant="link" onClick={() => setVisible(false)}>
                    Cancel
                  </Button>
                </div>
                <div className={styles['styled-button-primary']}>
                  <Button variant="primary" onClick={() => setVisible(false)}>
                    Confirm
                  </Button>
                </div>
              </SpaceBetween>
            </Box>
          }
          className={styles['styled-modal']}
        >
          <SpaceBetween size="s">
            <Box>Are you sure you want to proceed with this action? This will update the resource configuration.</Box>
            <Box variant="small" color="text-body-secondary">
              This action cannot be undone.
            </Box>
          </SpaceBetween>
        </Modal>
      </SpaceBetween>
    </SimplePage>
  );
}
