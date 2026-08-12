// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Dialog from '~components/dialog';
import FormField from '~components/form-field';
import Input from '~components/input';
import PromptInput from '~components/prompt-input';
import RadioGroup from '~components/radio-group';
import SpaceBetween from '~components/space-between';

import { DialogPage, FakeTranscript } from './common';

// UC1: The assistant asks a clarifying follow-up question mid-conversation. The
// content slot holds a radio group with a consumer-owned "Something else" option
// that reveals a free-text input — proving the choice markup lives in the
// consumer, not the component.
export default function DialogFollowUpQuestionsPage() {
  const [open, setOpen] = useState(true);
  const [choice, setChoice] = useState('increase');
  const [other, setOther] = useState('');
  const [prompt, setPrompt] = useState('');

  return (
    <DialogPage title="Dialog — UC1: follow-up questions (chat)">
      <SpaceBetween size="m">
        <FakeTranscript />

        <Dialog
          open={open}
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
          <SpaceBetween size="xs">
            <FormField label="Select the option that best matches your intent">
              <RadioGroup
                value={choice}
                onChange={({ detail }) => setChoice(detail.value)}
                items={[
                  { value: 'increase', label: 'Increase volume size' },
                  { value: 'change-type', label: 'Change volume type' },
                  { value: 'other', label: 'Something else' },
                ]}
              />
            </FormField>
            {choice === 'other' && (
              <FormField label="Tell me what you're trying to do">
                <Input
                  value={other}
                  onChange={({ detail }) => setOther(detail.value)}
                  placeholder="Describe your goal"
                />
              </FormField>
            )}
          </SpaceBetween>
        </Dialog>
        {!open && <Button onClick={() => setOpen(true)}>Re-open dialog</Button>}

        <PromptInput
          value={prompt}
          onChange={({ detail }) => setPrompt(detail.value)}
          placeholder="Ask a question"
          ariaLabel="Chat prompt"
        />
      </SpaceBetween>
    </DialogPage>
  );
}
