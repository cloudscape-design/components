// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Dropdown from '~components/internal/components/dropdown';
import Modal from '~components/modal';

export function SampleDropdown({ id, children }: { id: string; children: React.ReactNode }) {
  const [isOpened, setOpened] = useState(false);
  return (
    <Dropdown
      trigger={
        <Button id={id} onClick={() => setOpened(wasOpen => !wasOpen)}>
          Show dropdown
        </Button>
      }
      open={isOpened}
      onDropdownClose={() => setOpened(false)}
    >
      {children}
    </Dropdown>
  );
}

export function SampleModal({ id, children }: { id: string; children: React.ReactNode }) {
  const [isOpened, setOpened] = useState(false);
  return (
    <>
      <Button id={id} onClick={() => setOpened(true)}>
        Show modal
      </Button>
      <Modal header="Sample modal" visible={isOpened} onDismiss={() => setOpened(false)} closeAriaLabel="Close modal">
        {children}
      </Modal>
    </>
  );
}
