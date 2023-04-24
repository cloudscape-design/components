// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Button, Modal } from '~components';

export default function () {
  const [visible, setVisible] = useState(false);

  return (
    <article>
      <h1>Scroll padding modal</h1>
      <Button data-testid="modal-trigger" onClick={() => setVisible(true)}>
        Show modal
      </Button>
      <Modal
        header="Modal title"
        visible={visible}
        onDismiss={() => setVisible(false)}
        closeAriaLabel="Close modal"
        footer={
          <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="link">Cancel</Button>
            <Button variant="primary">Delete</Button>
          </span>
        }
      >
        {Array(100)
          .fill(0)
          .map((value, index) => (
            <div key={index}>
              <input />
            </div>
          ))}
      </Modal>
    </article>
  );
}
