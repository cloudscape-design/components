// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Dialog from '~components/dialog';
import FormField from '~components/form-field';
import RadioGroup from '~components/radio-group';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

// Minimal conditional-rendering example. Opening Dialog moves focus from the
// trigger into Dialog. Closing Dialog restores focus to the trigger.
export default function DialogSimplePage() {
  const [open, setOpen] = useState(false);
  const [goal, setGoal] = useState('increase');

  return (
    <SimplePage title="Dialog: Simple" screenshotArea={{}}>
      <div style={{ maxInlineSize: 520 }}>
        <SpaceBetween size="m">
          <Button onClick={() => setOpen(true)}>Open dialog</Button>
          {open && (
            <Dialog
              header="What's your main goal?"
              i18nStrings={{ dismissAriaLabel: 'Close' }}
              onDismiss={() => setOpen(false)}
              footer={
                <Box float="right">
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button onClick={() => setOpen(false)}>Skip</Button>
                    <Button variant="primary" onClick={() => setOpen(false)}>
                      Continue
                    </Button>
                  </SpaceBetween>
                </Box>
              }
            >
              <FormField label="Select the option that best matches your intent">
                <RadioGroup
                  value={goal}
                  onChange={({ detail }) => setGoal(detail.value)}
                  items={[
                    { value: 'increase', label: 'Increase volume size' },
                    { value: 'change-type', label: 'Change volume type' },
                  ]}
                />
              </FormField>
            </Dialog>
          )}
        </SpaceBetween>
      </div>
    </SimplePage>
  );
}
