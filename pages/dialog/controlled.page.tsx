// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Dialog from '~components/dialog';
import FormField from '~components/form-field';
import RadioGroup from '~components/radio-group';
import SpaceBetween from '~components/space-between';

import { DialogPage, FakeTranscript } from './common';

// Controlled `open`: the component owns the visibility + focus lifecycle. On
// open it moves focus into the heading; on close it restores focus to whatever
// was focused before (the trigger button here) — no consumer focus juggling.
export default function DialogControlledPage() {
  const [open, setOpen] = useState(false);
  const [goal, setGoal] = useState('increase');

  return (
    <DialogPage title="Dialog — controlled open (focus restore)">
      <SpaceBetween size="m">
        <FakeTranscript />

        <Button onClick={() => setOpen(true)}>Ask a clarifying question</Button>

        <Dialog
          header="What's your main goal?"
          open={open}
          i18nStrings={{ dismissAriaLabel: 'Close' }}
          onDismiss={() => setOpen(false)}
          footer={
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setOpen(false)}>Skip</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Continue
              </Button>
            </SpaceBetween>
          }
        >
          <FormField label="Select the option that best matches your intent">
            <RadioGroup
              value={goal}
              onChange={({ detail }) => setGoal(detail.value)}
              items={[
                { value: 'increase', label: 'Increase volume size' },
                { value: 'change-type', label: 'Change volume type' },
                { value: 'something-else', label: 'Something else' },
              ]}
            />
          </FormField>
        </Dialog>
      </SpaceBetween>
    </DialogPage>
  );
}
