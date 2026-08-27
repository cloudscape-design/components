// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Dialog from '~components/dialog';
import PromptInput from '~components/prompt-input';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';
import { DialogDemo } from './common';

const scopeOptions: SelectProps.Options = [
  { value: 'chat', label: 'Allow for this chat' },
  { value: 'once', label: 'Allow once' },
  { value: 'always', label: 'Allow always' },
];

// UC2: CLI command authorization, mirroring the user-authorized-actions pattern
// in AWS-UI-Website. The agent needs to run a command; the dialog shows it so
// the user can verify before approving. For short commands the command lives in
// the header; the footer pairs a scope Select (left) with Cancel / Allow (right).
// Sending a prompt opens the dialog; dismissing, cancelling, or allowing closes it.
export default function DialogAuthorizationPage() {
  const [showAuthorizationDialog, setShowAuthorizationDialog] = useState(false);
  const [scope, setScope] = useState<SelectProps.Option>(scopeOptions[0] as SelectProps.Option);
  const [prompt, setPrompt] = useState('');

  return (
    <SimplePage title="Dialog use case: Authorization">
      <DialogDemo>
        <SpaceBetween size="m">
          {showAuthorizationDialog && (
            <Dialog
              header={
                <>
                  Allow{' '}
                  <Box variant="awsui-inline-code" display="inline">
                    npm test
                  </Box>
                  ?
                </>
              }
              i18nStrings={{ dismissAriaLabel: 'Close' }}
              onDismiss={() => setShowAuthorizationDialog(false)}
              footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <Select
                    selectedOption={scope}
                    onChange={({ detail }) => setScope(detail.selectedOption)}
                    options={scopeOptions}
                    ariaLabel="Authorization scope"
                  />
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button onClick={() => setShowAuthorizationDialog(false)}>Cancel</Button>
                    <Button variant="primary" onClick={() => setShowAuthorizationDialog(false)}>
                      Allow
                    </Button>
                  </SpaceBetween>
                </div>
              }
            >
              <Box variant="p">Runs the test suite.</Box>
            </Dialog>
          )}

          <PromptInput
            value={prompt}
            onChange={({ detail }) => setPrompt(detail.value)}
            onAction={() => setShowAuthorizationDialog(true)}
            placeholder="Ask a question"
            actionButtonAriaLabel="Send message"
            actionButtonIconName="send"
          />
        </SpaceBetween>
      </DialogDemo>
    </SimplePage>
  );
}
