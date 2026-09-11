// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef, useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import { ButtonProps } from '~components/button/interfaces';
import Dialog from '~components/dialog';
import FormField from '~components/form-field';
import RadioGroup from '~components/radio-group';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

export type PageContext = React.Context<
  AppContextType<{
    dialogOpen?: boolean;
    removeTrigger?: boolean;
  }>
>;

export default function DialogSimplePage() {
  const {
    urlParams: { dialogOpen = false, removeTrigger = false },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const [goal, setGoal] = useState('increase');
  const focusTargetRef = useRef<ButtonProps.Ref>(null);
  const wasOpenRef = useRef(dialogOpen);

  useEffect(() => {
    if (wasOpenRef.current && !dialogOpen && removeTrigger) {
      focusTargetRef.current?.focus();
    }
    wasOpenRef.current = dialogOpen;
  }, [dialogOpen, removeTrigger]);

  const dismissDialog = () => setUrlParams({ dialogOpen: false });

  return (
    <SimplePage
      title="Dialog: Simple"
      settings={
        <SpaceBetween direction="horizontal" size="s">
          <Toggle checked={dialogOpen} onChange={({ detail }) => setUrlParams({ dialogOpen: detail.checked })}>
            Open dialog
          </Toggle>
          <Toggle checked={removeTrigger} onChange={({ detail }) => setUrlParams({ removeTrigger: detail.checked })}>
            Remove trigger while open
          </Toggle>
        </SpaceBetween>
      }
      screenshotArea={{}}
      i18n={{}}
    >
      <div style={{ maxInlineSize: 520 }}>
        <SpaceBetween size="m">
          <SpaceBetween direction="horizontal" size="s">
            {(!removeTrigger || !dialogOpen) && (
              <Button data-testid="dialog-trigger" onClick={() => setUrlParams({ dialogOpen: true })}>
                Open dialog
              </Button>
            )}
            {removeTrigger && (
              <Button ref={focusTargetRef} data-testid="focus-target">
                Focus target
              </Button>
            )}
          </SpaceBetween>
          {dialogOpen && (
            <Dialog
              header="What's your main goal?"
              onDismiss={dismissDialog}
              footer={
                <Box float="right">
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button onClick={dismissDialog}>Skip</Button>
                    <Button variant="primary" onClick={dismissDialog}>
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
