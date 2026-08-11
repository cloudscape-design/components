// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Dialog from '~components/dialog';
import FormField from '~components/form-field';
import RadioGroup from '~components/radio-group';
import SpaceBetween from '~components/space-between';
import Textarea from '~components/textarea';

import { DialogPage, FakeTranscript } from './common';

// UC3: Inline feedback on an assistant response. The dialog is dismissible and
// renders in-flow directly beneath the message it refers to. Consumer owns the
// focus lifecycle after dismissal (records prior focus, restores on close) —
// the component only moves focus IN on open and never traps it.
export default function DialogInlineFeedbackPage() {
  const [open, setOpen] = useState(true);
  const [reason, setReason] = useState('inaccurate');
  const [details, setDetails] = useState('');

  return (
    <DialogPage title="Dialog — UC3: inline feedback">
      <SpaceBetween size="m">
        <FakeTranscript
          lines={[
            { from: 'user', text: 'Summarize the last deployment.' },
            { from: 'assistant', text: 'The last deployment rolled out v2.3.1 to 3 of 3 hosts with no errors.' },
          ]}
        />

        {open ? (
          <Dialog
            header="Tell us what went wrong"
            i18nStrings={{ dismissAriaLabel: 'Close feedback' }}
            onDismiss={() => setOpen(false)}
            footer={
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => setOpen(false)}>
                  Submit feedback
                </Button>
              </SpaceBetween>
            }
          >
            <SpaceBetween size="xs">
              <FormField label="What was the issue?">
                <RadioGroup
                  value={reason}
                  onChange={({ detail }) => setReason(detail.value)}
                  items={[
                    { value: 'inaccurate', label: 'Inaccurate' },
                    { value: 'incomplete', label: 'Incomplete' },
                    { value: 'irrelevant', label: 'Not relevant' },
                  ]}
                />
              </FormField>
              <FormField label="Additional details (optional)">
                <Textarea
                  value={details}
                  onChange={({ detail }) => setDetails(detail.value)}
                  placeholder="Add more context"
                />
              </FormField>
            </SpaceBetween>
          </Dialog>
        ) : (
          <Button onClick={() => setOpen(true)}>Re-open feedback</Button>
        )}
      </SpaceBetween>
    </DialogPage>
  );
}
