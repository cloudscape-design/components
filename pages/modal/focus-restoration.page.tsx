// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Modal, Button } from '~components';

function Destructible() {
  const [visible, setVisible] = useState(false);
  return (
    <article>
      <Button id="destructible" onClick={() => setVisible(true)}>
        Show destructible modal
      </Button>
      {visible && (
        <Modal visible={true} onDismiss={() => setVisible(false)} closeAriaLabel="Close modal">
          Demo content #1
        </Modal>
      )}
    </article>
  );
}

function Controlled() {
  const [visible, setVisible] = useState(false);
  return (
    <article>
      <Button id="controlled" onClick={() => setVisible(true)}>
        Show controlled modal
      </Button>
      <Modal visible={visible} onDismiss={() => setVisible(false)} closeAriaLabel="Close modal">
        Demo content #2
      </Modal>
    </article>
  );
}

export default function () {
  return (
    <>
      <h1>Destructible modals</h1>
      <Destructible />
      <Controlled />
    </>
  );
}
