// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Modal from '~components/modal';

import { SimplePage } from '../app/templates';
import ScreenshotArea from '../utils/screenshot-area';

export default function PositionTopPage() {
  const [visible, setVisible] = useState(false);

  return (
    <SimplePage title="Top positioned modal">
      <Button onClick={() => setVisible(true)}>Show modal</Button>
      <ScreenshotArea>
        <Modal visible={visible} onDismiss={() => setVisible(false)} header="Top positioned modal" position="top">
          This modal is positioned at the top of the viewport.
        </Modal>
      </ScreenshotArea>
    </SimplePage>
  );
}
