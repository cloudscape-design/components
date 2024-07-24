// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Button, Modal } from '~components';

import ScreenshotArea from '../utils/screenshot-area';

import styles from './styles.scss';

export default function ButtonsScenario() {
  return (
    <article>
      <ScreenshotArea>
        <h1 className={styles.styledWrapper}>Button with disabled reason within a modal</h1>
        <Modal
          header="Delete instance"
          visible={true}
          onDismiss={() => {}}
          closeAriaLabel="Close modal"
          footer={
            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="link">Cancel</Button>
              <Button variant="primary" disabled={true} disabledReason="reason" data-testid="button">
                Delete
              </Button>
            </span>
          }
        >
          This will permanently delete your instance, and may affect the performance of other resources.
        </Modal>
      </ScreenshotArea>
    </article>
  );
}
