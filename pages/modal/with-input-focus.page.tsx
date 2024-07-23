// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { Button, FormField, Input, InputProps, Modal } from '~components';

export default function () {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<InputProps.Ref>(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  return (
    <article>
      <h1>Modal with input</h1>
      <Button id="open-modal" onClick={() => setVisible(true)}>
        Show modal
      </Button>
      <Modal header="Prompt dialog" visible={visible} onDismiss={() => setVisible(false)} closeAriaLabel="Close modal">
        <FormField label="Enter your name">
          <Input ref={inputRef} id="input" value={value} onChange={event => setValue(event.detail.value)} />
        </FormField>
      </Modal>
    </article>
  );
}
