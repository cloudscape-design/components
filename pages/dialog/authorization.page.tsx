// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Dialog from '~components/dialog';
import PromptInput from '~components/prompt-input';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

import { DialogPage } from './common';

const scopeOptions: SelectProps.Options = [
  { value: 'chat', label: 'Allow for this chat' },
  { value: 'once', label: 'Allow once' },
  { value: 'always', label: 'Allow always' },
];

// UC2: CLI command authorization, mirroring the user-authorized-actions pattern
// in AWS-UI-Website. The agent needs to run a command; the dialog shows it so
// the user can verify before approving. For short commands the command lives in
// the header; the footer pairs a scope Select (left) with Cancel / Allow (right).
// Dismissing is a real outcome (declining), so onDismiss records a denial.
export default function DialogAuthorizationPage() {
  const [decided, setDecided] = useState<string | null>(null);
  const [scope, setScope] = useState<SelectProps.Option>(scopeOptions[0] as SelectProps.Option);
  const [prompt, setPrompt] = useState('');

  return (
    <DialogPage title="Dialog — UC2: CLI command authorization">
      <SpaceBetween size="m">
        {decided === null ? (
          <Dialog
            header={
              <>
                Allow{' '}
                <Box variant="code" display="inline">
                  npm test
                </Box>
                ?
              </>
            }
            i18nStrings={{ dismissAriaLabel: 'Close' }}
            onDismiss={() => setDecided('denied')}
            footer={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <Select
                  selectedOption={scope}
                  onChange={({ detail }) => setScope(detail.selectedOption)}
                  options={scopeOptions}
                  ariaLabel="Authorization scope"
                />
                <SpaceBetween direction="horizontal" size="xs">
                  <Button onClick={() => setDecided('denied')}>Cancel</Button>
                  <Button variant="primary" onClick={() => setDecided('approved')}>
                    Allow
                  </Button>
                </SpaceBetween>
              </div>
            }
          >
            <Box variant="p">Runs the test suite.</Box>
          </Dialog>
        ) : (
          <Box>
            Decision recorded: {decided}. <Button onClick={() => setDecided(null)}>Reset</Button>
          </Box>
        )}

        <PromptInput
          value={prompt}
          onChange={({ detail }) => setPrompt(detail.value)}
          onAction={() => setDecided(null)}
          placeholder="Ask a question"
          actionButtonAriaLabel="Send message"
          actionButtonIconName="send"
        />
      </SpaceBetween>
    </DialogPage>
  );
}
