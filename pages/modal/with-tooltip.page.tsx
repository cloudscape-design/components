// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button, FormField, Modal, Slider } from '~components';

import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  const [visible, setVisible] = useState(false);

  return (
    <article>
      <h1>Simple modal with tooltip-based component (slider)</h1>
      <Button onClick={() => setVisible(true)}>Show modal</Button>
      <ScreenshotArea>
        <Modal header="Slider" visible={visible} onDismiss={() => setVisible(false)} closeAriaLabel="Close modal">
          <FormField label="Slider">
            <Slider onChange={() => {}} value={50} max={100} min={0} />
          </FormField>
        </Modal>
      </ScreenshotArea>
    </article>
  );
}
