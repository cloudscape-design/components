// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import { Box, Button, Checkbox, Form, FormField, SpaceBetween, Textarea } from '~components';

import FeedbackDialog from './dialog';

import styles from './styles.scss';

export default function GenAIFeedback() {
  const [showDialog, setShowDialog] = React.useState(true);
  const [showFeedbackSubmission, setShowFeedbackSubmission] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>();
  const [feedbackOptions, setFeedbackOptions] = React.useState({
    harmful: false,
    incomplete: false,
    inaccurate: false,
    other: false,
  });
  const [feedbackText, setFeedbackText] = React.useState('');
  const checkboxRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.focus();
  }, [dialogRef]);

  const selectOption = (option: string, checked: boolean) => {
    setFeedbackOptions({ ...feedbackOptions, [option]: checked });
    setErrorMessage(null);
  };

  const submitFeedback = () => {
    // Validation
    const isFeedbackOptionSelected = Object.values(feedbackOptions).some(val => !!val);
    if (!isFeedbackOptionSelected) {
      setErrorMessage('At least one option must be selected.');
      // Move focus to the required input
      checkboxRef.current?.focus();
      return;
    }

    // Submission
    setShowDialog(false);
    setShowFeedbackSubmission(true);
  };

  const dismissDialog = () => {
    setShowDialog(false);
  };

  return (
    <Box padding="xxl">
      {showDialog && (
        <FeedbackDialog
          ref={dialogRef}
          onDismiss={dismissDialog}
          footer={
            <div className={styles['footer-buttons']}>
              <Button onClick={submitFeedback} ariaLabel="Submit form">
                Submit
              </Button>
            </div>
          }
        >
          <Form>
            <SpaceBetween direction="vertical" size="l">
              <FormField label="What did you dislike about the response?" errorText={errorMessage}>
                <SpaceBetween size="xxl" direction="horizontal">
                  <Checkbox
                    ref={checkboxRef}
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

              <FormField
                label={
                  <span>
                    Tell us more - <i>optional</i>
                  </span>
                }
                stretch={true}
              >
                <Textarea
                  rows={1}
                  onChange={({ detail }) => setFeedbackText(detail.value)}
                  value={feedbackText}
                  placeholder={'Additional feedback'}
                />
              </FormField>
            </SpaceBetween>
          </Form>
        </FeedbackDialog>
      )}

      {showFeedbackSubmission && <Box color="text-body-secondary">Thank you for the additional feedback.</Box>}
    </Box>
  );
}
