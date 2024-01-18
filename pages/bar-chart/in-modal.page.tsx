// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ScreenshotArea from '../utils/screenshot-area';
import { Button, Modal } from '~components';
import DrilldownChart from './drilldown-chart';

export default function () {
  const [visible, setVisible] = useState(false);
  return (
    <article>
      <h1>Bar chart in a modal</h1>
      <ScreenshotArea gutters={false}>
        <Button onClick={() => setVisible(true)}>Show modal</Button>
        <Modal
          header="Scrolling test"
          visible={visible}
          onDismiss={() => setVisible(false)}
          closeAriaLabel="Close modal"
        >
          <div style={{ height: 400, border: '1px solid pink' }}>Tall element to shift the chart down.</div>
          <DrilldownChart horizontalBars={false} useLinks={null} expandableSubItems={false} />
        </Modal>
      </ScreenshotArea>
    </article>
  );
}
