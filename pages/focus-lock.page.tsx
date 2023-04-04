// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import FocusLock, { FocusLockRef } from '~components/internal/components/focus-lock';
import FormField from '~components/form-field';
import Input from '~components/input';
import Button from '~components/button';
import Box from '~components/box';
import SpaceBetween from '~components/space-between';

export default function FocusLockPage() {
  const ref = useRef<FocusLockRef>(null);
  const [text, setText] = useState('');

  return (
    <Box padding="l">
      <h1>FocusLock component</h1>
      <FocusLock ref={ref} autoFocus={true}>
        <SpaceBetween size="m">
          <FormField label="First input">
            <Input value={text} onChange={event => setText(event.detail.value)} />
          </FormField>
          <Button onClick={() => ref.current?.focusFirst()}>Focus first</Button>
        </SpaceBetween>
      </FocusLock>
    </Box>
  );
}
