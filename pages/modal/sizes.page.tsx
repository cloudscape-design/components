// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Modal from '~components/modal';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';
import ScreenshotArea from '../utils/screenshot-area';

export default function SizesPage() {
  const [size, setSize] = useState<'small' | 'medium' | 'large' | 'x-large' | 'xx-large' | 'max'>('medium');
  const [visible, setVisible] = useState(false);

  const sizes = ['small', 'medium', 'large', 'x-large', 'xx-large', 'max'] as const;

  return (
    <SimplePage title="Modal sizes">
      <SpaceBetween size="s">
        {sizes.map(size => (
          <Button
            key={size}
            onClick={() => {
              setSize(size);
              setVisible(true);
            }}
          >
            {size}
          </Button>
        ))}
      </SpaceBetween>
      <ScreenshotArea>
        <Modal visible={visible} onDismiss={() => setVisible(false)} header={`${size} modal`} size={size}>
          This is a {size} modal.
        </Modal>
      </ScreenshotArea>
    </SimplePage>
  );
}
