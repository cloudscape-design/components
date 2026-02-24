// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button, Modal } from '~components';

import { SimplePage } from '../app/templates';
import ScreenshotArea from '../utils/screenshot-area';

function getUrlParams() {
  const hashParts = window.location.hash.split('?');
  const params = new URLSearchParams(hashParts[1] || '');
  return {
    height: params.get('height') ? Number(params.get('height')) : undefined,
  };
}

export default function () {
  const [visible, setVisible] = useState(false);
  const { height } = getUrlParams();

  return (
    <SimplePage title="Modal with custom height and no footer">
      <Button data-testid="modal-trigger" onClick={() => setVisible(true)}>
        Show modal
      </Button>
      <ScreenshotArea>
        <Modal
          header="Custom height modal without footer"
          visible={visible}
          onDismiss={() => setVisible(false)}
          height={height}
        >
          {Array(100)
            .fill(0)
            .map((value, index) => (
              <div key={index}>Line {index + 1}: Content</div>
            ))}
        </Modal>
      </ScreenshotArea>
    </SimplePage>
  );
}
