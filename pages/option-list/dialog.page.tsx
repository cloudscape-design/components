// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Dialog from '~components/dialog';
import OptionList, { OptionListProps } from '~components/option-list';

import { SimplePage } from '../app/templates';

const options: OptionListProps.Options = [
  { value: 'increase', label: 'Increase volume size' },
  { value: 'change-type', label: 'Change volume type' },
  { value: 'snapshot', label: 'Create a snapshot', disabled: true, disabledReason: 'No volume selected' },
];

function GoalQuestion({ onSubmit, onDismiss }: { onSubmit: (value: string) => void; onDismiss: () => void }) {
  const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<OptionListProps.Option>>([]);

  return (
    <Dialog
      header={<span id="goal-question">What&apos;s your main goal?</span>}
      onDismiss={onDismiss}
      i18nStrings={{ dismissAriaLabel: 'Close' }}
      footer={
        <Box float="right">
          <Button
            variant="primary"
            disabled={selectedOptions.length === 0}
            onClick={() => onSubmit(selectedOptions[0].value!)}
          >
            Continue
          </Button>
        </Box>
      }
    >
      <OptionList
        data-testid="goal-question-list"
        ariaLabelledby="goal-question"
        selectionType="single"
        options={options}
        selectedOptions={selectedOptions}
        onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
      />
    </Dialog>
  );
}

export default function OptionListDialogPage() {
  const [open, setOpen] = useState(true);
  const [result, setResult] = useState<string | null>(null);

  return (
    <SimplePage title="Option list: follow-up question in a Dialog" screenshotArea={{}}>
      <div style={{ maxInlineSize: 480 }}>
        {open ? (
          <GoalQuestion
            onSubmit={value => {
              setResult(`Submitted: ${value}`);
              setOpen(false);
            }}
            onDismiss={() => {
              setResult('Dismissed');
              setOpen(false);
            }}
          />
        ) : (
          <Button onClick={() => setOpen(true)}>Ask again</Button>
        )}
      </div>
      <Box variant="small" data-testid="goal-question-result">
        {result ?? 'Not submitted'}
      </Box>
    </SimplePage>
  );
}
