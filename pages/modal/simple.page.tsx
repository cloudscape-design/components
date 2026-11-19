// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button, Modal } from '~components';

import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  const [visible, setVisible] = useState(false);

  return (
    <article>
      <h1>Simple modal</h1>
      <Button onClick={() => setVisible(true)}>Show modal</Button>
      <ScreenshotArea>
        <Modal
          header="Delete instance"
          visible={visible}
          onDismiss={() => setVisible(false)}
          closeAriaLabel="Close modal"
          footer={
            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="link">Cancel</Button>
              <Button variant="primary">Delete</Button>
            </span>
          }
        >
          This will permanently delete your instance, and may affect the performance of other resources.
        </Modal>
      </ScreenshotArea>
    </article>
  );
}
