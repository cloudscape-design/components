// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Dialog from '~components/dialog';
import FormField from '~components/form-field';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

import { DialogPage, FakeTranscript } from './common';

const options: SelectProps.Options = [
  { value: 'read', label: 'Read-only access' },
  { value: 'write', label: 'Read and write access' },
  { value: 'admin', label: 'Administrator access' },
];

// UC2: The agent needs authorization before taking an action. The content slot
// hosts a Select (not radios), proving the choice markup is consumer-owned. The
// close button is always present (dismissing = declining here); a truly
// required, no-dismiss variant is a future modality-axis opt-in, not v1.
export default function DialogAuthorizationPage() {
  const [decided, setDecided] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectProps.Option | null>(options[0] as SelectProps.Option);

  return (
    <DialogPage title="Dialog — UC2: authorization / consent">
      <SpaceBetween size="m">
        <FakeTranscript
          lines={[
            { from: 'user', text: 'Grant the deployment agent access to my account.' },
            { from: 'assistant', text: 'Before I proceed, please confirm the access level to grant.' },
          ]}
        />

        {decided === null ? (
          <Dialog
            header="Authorize account access"
            i18nStrings={{ dismissAriaLabel: 'Close' }}
            onDismiss={() => setDecided('denied')}
            footer={
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={() => setDecided('denied')}>Deny</Button>
                <Button variant="primary" onClick={() => setDecided('approved')}>
                  Approve
                </Button>
              </SpaceBetween>
            }
          >
            <FormField label="Access level to grant">
              <Select
                selectedOption={selected}
                onChange={({ detail }) => setSelected(detail.selectedOption)}
                options={options}
              />
            </FormField>
          </Dialog>
        ) : (
          <Box>
            Decision recorded: {decided}. <Button onClick={() => setDecided(null)}>Reset</Button>
          </Box>
        )}
      </SpaceBetween>
    </DialogPage>
  );
}
