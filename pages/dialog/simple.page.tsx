// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Dialog from '~components/dialog';
import FormField from '~components/form-field';
import PromptInput from '~components/prompt-input';
import RadioGroup from '~components/radio-group';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';
import { DialogPage, FakeTranscript } from './common';

// Basic dialog: the minimal in-flow, non-modal shape. The fake transcript above
// and the PromptInput below exist to prove reflow (the dialog pushes content,
// it does not overlay) and transcript -> dialog -> prompt tab order.
export default function DialogSimplePage() {
  const [open, setOpen] = useState(true);
  const [goal, setGoal] = useState('increase');
  const [prompt, setPrompt] = useState('');

  return (
    <DialogPage title="Dialog — basic (in-flow, non-modal)">
      <ScreenshotArea>
        <SpaceBetween size="m">
          <FakeTranscript />

          {open ? (
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
          ) : (
            <Button onClick={() => setOpen(true)}>Re-open dialog</Button>
          )}

          <PromptInput
            value={prompt}
            onChange={({ detail }) => setPrompt(detail.value)}
            placeholder="Ask a question"
            ariaLabel="Chat prompt"
          />
        </SpaceBetween>
      </ScreenshotArea>
    </DialogPage>
  );
}
