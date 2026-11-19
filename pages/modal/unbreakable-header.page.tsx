// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button, Modal } from '~components';

import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  const [visible, setVisible] = useState(false);

  return (
    <article>
      <h1>Unbreakable header modal</h1>
      <Button onClick={() => setVisible(true)}>Show modal</Button>
      <ScreenshotArea>
        <Modal
          header="Thisisgoingtobeanextremelylongtitleforamodalnotsurewhetheritmakesanysensebutwhatever"
          visible={visible}
          onDismiss={() => setVisible(false)}
          closeAriaLabel="Close modal"
        >
          Content
        </Modal>
      </ScreenshotArea>
    </article>
  );
}
