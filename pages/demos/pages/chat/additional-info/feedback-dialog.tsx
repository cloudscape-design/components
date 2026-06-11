// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useRef } from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Checkbox from '@cloudscape-design/components/checkbox';
import Form from '@cloudscape-design/components/form';
import FormField from '@cloudscape-design/components/form-field';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Textarea from '@cloudscape-design/components/textarea';

import Dialog from './dialog';

export default function FeedbackDialog({ onDismiss, onSubmit }: { onDismiss: () => void; onSubmit: () => void }) {
  const [feedbackOptions, setFeedbackOptions] = React.useState({
    harmful: false,
    incomplete: false,
    inaccurate: false,
    other: false,
  });
  const [feedbackText, setFeedbackText] = React.useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Store the element that had focus before dialog opened
    triggerRef.current = document.activeElement as HTMLElement;

    // Focus the dialog container when it opens
    dialogRef.current?.focus();

    // Cleanup: Return focus to the trigger element when dialog closes
    return () => {
      triggerRef.current?.focus();
    };
  }, [dialogRef]);

  const selectOption = (option: string, checked: boolean) =>
    setFeedbackOptions({ ...feedbackOptions, [option]: checked });

  const isFeedbackOptionSelected = Object.values(feedbackOptions).some(val => !!val);
  const isSubmittable = isFeedbackOptionSelected || feedbackText.length > 0;

  const submitFeedback = () => {
    if (!isSubmittable) {
      return;
    }

    onSubmit();
  };

  return (
    <Dialog
      ariaLabel="Feedback dialog"
      ref={dialogRef}
      onDismiss={onDismiss}
      footer={
        <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '4px' }}>
          <Button
            data-testid="feedback-submit-button"
            onClick={submitFeedback}
            ariaLabel="Submit form"
            disabled={!isSubmittable}
          >
            Submit
          </Button>

          <Button variant="link" onClick={onDismiss} ariaLabel="Close dialog" data-testid="feedback-close-button">
            Close
          </Button>
        </div>
      }
    >
      <Form
        header={
          <Box variant="h4">
            Tell us more - <i>optional</i>
          </Box>
        }
      >
        <SpaceBetween direction="vertical" size="l">
          <FormField label="What did you dislike about the response?">
            <SpaceBetween size="l" direction="horizontal">
              <Checkbox
                data-testid="feedback-checkbox-harmful"
                checked={feedbackOptions.harmful}
                onChange={({ detail }) => selectOption('harmful', detail.checked)}
              >
                Harmful
              </Checkbox>
              <Checkbox
                checked={feedbackOptions.incomplete}
                onChange={({ detail }) => selectOption('incomplete', detail.checked)}
              >
                Incomplete
              </Checkbox>
              <Checkbox
                checked={feedbackOptions.inaccurate}
                onChange={({ detail }) => selectOption('inaccurate', detail.checked)}
              >
                Inaccurate
              </Checkbox>
              <Checkbox
                checked={feedbackOptions.other}
                onChange={({ detail }) => selectOption('other', detail.checked)}
              >
                Other
              </Checkbox>
            </SpaceBetween>
          </FormField>

          <FormField label="Additional notes" stretch={true}>
            <Textarea
              rows={3}
              onChange={({ detail }) => setFeedbackText(detail.value)}
              value={feedbackText}
              placeholder={'Additional feedback'}
            />
          </FormField>
        </SpaceBetween>
      </Form>
    </Dialog>
  );
}
