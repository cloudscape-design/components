// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import { Button, FormField, Input, SpaceBetween, Tabs } from '~components';
import FocusLock, { FocusLockRef } from '~components/internal/components/focus-lock';

import { SimplePage } from './app/templates';

export default function FocusLockPage() {
  const ref = useRef<FocusLockRef>(null);
  const [text, setText] = useState('');

  return (
    <SimplePage title="FocusLock component">
      <Tabs
        tabs={[
          {
            id: 'with-auto-focus',
            label: 'With auto focus',
            content: (
              <FocusLock ref={ref} autoFocus={true}>
                <SpaceBetween size="m">
                  <FormField label="First input">
                    <Input value={text} onChange={event => setText(event.detail.value)} />
                  </FormField>
                  <Button onClick={() => ref.current?.focusFirst()}>Focus first</Button>
                </SpaceBetween>
              </FocusLock>
            ),
          },
          {
            id: 'without-auto-focus',
            label: 'Without auto focus',
            content: (
              <FocusLock ref={ref}>
                <SpaceBetween size="s" direction="horizontal">
                  <Button>1</Button>
                  <Button>2</Button>
                  <Button>3</Button>
                </SpaceBetween>
              </FocusLock>
            ),
          },
        ]}
      />
    </SimplePage>
  );
}
