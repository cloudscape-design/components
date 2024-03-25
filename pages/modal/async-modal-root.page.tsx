// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Modal, Button, ModalProps } from '~components';

const getModalRoot: ModalProps['getModalRoot'] = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const element = document.createElement('div');
  element.setAttribute('id', 'async-modal-root');
  document.body.appendChild(element);
  return element;
};

const removeModalRoot: ModalProps['removeModalRoot'] = root => {
  document.body.removeChild(root);
};

export default function () {
  const [visible, setVisible] = useState(false);

  return (
    <article>
      <h1>Modal with async root</h1>
      <Button data-testid="modal-trigger" onClick={() => setVisible(true)}>
        Show modal
      </Button>
      {visible && (
        <Modal
          header="Modal"
          visible={true}
          getModalRoot={getModalRoot}
          removeModalRoot={removeModalRoot}
          onDismiss={() => setVisible(false)}
          closeAriaLabel="Close modal"
        >
          This modal was rendered in lazy-loaded container
        </Modal>
      )}
    </article>
  );
}
