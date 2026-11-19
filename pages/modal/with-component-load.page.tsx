// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import { Box, Button, Checkbox, Modal, SpaceBetween, Spinner } from '~components';
import { setPerformanceMetrics } from '~components/internal/analytics';

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

  const checkBoxesForLoadingStateChange = (id: string) => {
    return (
      <Box margin="m">
        <SpaceBetween size="xs">
          <Checkbox
            id={'checkbox-button' + id}
            onChange={() => setButtonLoading(!buttonLoading)}
            checked={buttonLoading}
          >
            Button Loading
          </Checkbox>
          <Checkbox id={'checkbox-text' + id} onChange={() => setTextLoading(!textLoading)} checked={textLoading}>
            Text Loading
          </Checkbox>
        </SpaceBetween>
      </Box>
    );
  };
  return (
    <Box margin="m">
      <h1>Modal with loading component</h1>
      <SpaceBetween size="s">
        {checkBoxesForLoadingStateChange('1')}
        <Button data-testid="modal-trigger" onClick={() => setVisible(true)}>
          Show modal
        </Button>
      </SpaceBetween>
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
      >
        <div>{textLoading ? <Spinner /> : 'Content'}</div>
        {checkBoxesForLoadingStateChange('2')}
      </Modal>
    </Box>
  );
}
