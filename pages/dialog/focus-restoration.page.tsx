// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import { ButtonProps } from '~components/button/interfaces';
import Dialog from '~components/dialog';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
const programmatic = params.get('mode') === 'programmatic';

export default function DialogFocusRestorationPage() {
  const [open, setOpen] = useState(programmatic);
  const [showTrigger, setShowTrigger] = useState(!programmatic);
  const focusTargetRef = useRef<ButtonProps.Ref>(null);

  const dismissDialog = () => {
    setOpen(false);
    window.setTimeout(() => focusTargetRef.current?.focus(), 0);
  };

  return (
    <SimplePage title="Dialog: Focus restoration" screenshotArea={{}} i18n={{}}>
      <SpaceBetween size="m">
        <Box variant="p">
          This page demonstrates consumer-managed focus when Dialog opens programmatically or its trigger is removed.
        </Box>
        <SpaceBetween direction="horizontal" size="s">
          {showTrigger && (
            <Button
              data-testid="dialog-trigger"
              onClick={() => {
                setShowTrigger(false);
                setOpen(true);
              }}
            >
              Open dialog and remove trigger
            </Button>
          )}
          <Button ref={focusTargetRef} data-testid="focus-target">
            Focus target
          </Button>
        </SpaceBetween>
        {open && (
          <Dialog header="Choose an option" onDismiss={dismissDialog}>
            When this Dialog closes, the consumer moves focus to the fallback target because no trigger is available.
          </Dialog>
        )}
      </SpaceBetween>
    </SimplePage>
  );
}
