// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import { Button, Modal, Spinner } from '~components';
import { setPerformanceMetrics } from '~components/internal/analytics';

import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  const [visible, setVisible] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(true);
  const [textLoading, setTextLoading] = useState(true);

  useEffect(() => {
    (window as any).modalPerformanceMetrics = [];

    setPerformanceMetrics({
      modalPerformanceData(props) {
        (window as any).modalPerformanceMetrics.push(props);
      },
      tableInteraction() {},
      taskCompletionData() {},
    });

    return () => {
      setPerformanceMetrics({
        tableInteraction: () => {},
        taskCompletionData: () => {},
        modalPerformanceData: () => {},
      });
      delete (window as any).modalPerformanceMetrics;
    };
  }, []);
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setButtonLoading(false);
      }, 2000);
      setTimeout(() => {
        setTextLoading(false);
      }, 1000);
    } else {
      setButtonLoading(true);
      setTextLoading(true);
    }
    // Start fetching data
  }, [visible]);

  return (
    <article>
      <h1>Modal with loading component</h1>
      <Button data-testid="modal-trigger" onClick={() => setVisible(true)}>
        Show modal
      </Button>

      <ScreenshotArea>
        <Modal
          header={<div>{'Header text'}</div>}
          visible={visible}
          onDismiss={() => setVisible(false)}
          closeAriaLabel="Close modal"
          footer={
            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="link">Cancel</Button>
              <Button id="primary-button" variant="primary" loading={buttonLoading}>
                Delete
              </Button>
            </span>
          }
          disableContentPaddings={true}
        >
          <div>{textLoading ? <Spinner /> : 'Content'}</div>
        </Modal>
      </ScreenshotArea>
    </article>
  );
}
