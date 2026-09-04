// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Dialog from '~components/dialog';
import FormField from '~components/form-field';
import PromptInput from '~components/prompt-input';
import RadioGroup from '~components/radio-group';
import SpaceBetween from '~components/space-between';

import { DialogPage } from './common';

// Conditional rendering controls visibility. Dialog moves focus in when it mounts
// and restores focus to the previously focused element when it unmounts.
export default function DialogControlledPage() {
  const [open, setOpen] = useState(false);
  const [goal, setGoal] = useState('increase');
  const [prompt, setPrompt] = useState('');

  return (
    <DialogPage title="Dialog: conditional rendering and focus restoration">
      <SpaceBetween size="m">
        {open && (
          <Dialog
            header="What's your main goal?"
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
        )}

        <PromptInput
          value={prompt}
          onChange={({ detail }) => setPrompt(detail.value)}
          onAction={() => setOpen(true)}
          placeholder="Ask a question"
          actionButtonAriaLabel="Send message"
          actionButtonIconName="send"
        />
      </SpaceBetween>
    </DialogPage>
  );
}
