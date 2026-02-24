// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button, Checkbox, FormField, Input, Modal, SpaceBetween } from '~components';

import { useAppContext } from '../app/app-context';
import { SimplePage } from '../app/templates';
import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  const { urlParams, setUrlParams } = useAppContext();
  const [visible, setVisible] = useState(false);
  const showFooter = urlParams.footer ? true : false;
  const footer = <Button variant="primary">OK</Button>;

  return (
    <SimplePage
      title="Modal with custom dimensions"
      settings={
        <SpaceBetween size="m">
          <FormField label="Width (px)">
            <Input
              value={urlParams.width ? String(urlParams.width) : ''}
              onChange={e => setUrlParams({ width: e.detail.value })}
              type="number"
            />
          </FormField>
          <FormField label="Height (px)">
            <Input
              value={urlParams.height ? String(urlParams.height) : ''}
              onChange={e => setUrlParams({ height: e.detail.value })}
              type="number"
            />
          </FormField>
          <Checkbox checked={showFooter} onChange={e => setUrlParams({ footer: e.detail.checked })}>
            Show footer
          </Checkbox>
        </SpaceBetween>
      }
    >
      <Button data-testid="modal-trigger" onClick={() => setVisible(true)}>
        Show modal
      </Button>
      <ScreenshotArea>
        <Modal
          header="Custom dimensions modal"
          visible={visible}
          onDismiss={() => setVisible(false)}
          width={urlParams.width ? Number(urlParams.width) : undefined}
          height={urlParams.height ? Number(urlParams.height) : undefined}
          footer={showFooter ? footer : undefined}
        >
          {Array(100)
            .fill(0)
            .map((value, index) => (
              <div key={index}>
                <span>Text content {index}</span>
              </div>
            ))}
          <input data-testid="final-input" />
        </Modal>
      </ScreenshotArea>
    </SimplePage>
  );
}
