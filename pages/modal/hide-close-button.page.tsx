// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button, Modal, SpaceBetween } from '~components';

import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  const [visible, setVisible] = useState(false);

  return (
    <article>
      <h1>Modal without close button (AWSUI-60884)</h1>
      <Button onClick={() => setVisible(true)}>Show forced-decision modal</Button>
      <ScreenshotArea>
        <Modal
          header="Confirm deletion"
          visible={visible}
          hideCloseButton={true}
          footer={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setVisible(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setVisible(false)}>
                Delete
              </Button>
            </SpaceBetween>
          }
        >
          This action is permanent and cannot be undone. Please confirm that you want to delete this resource.
        </Modal>
      </ScreenshotArea>
    </article>
  );
}
