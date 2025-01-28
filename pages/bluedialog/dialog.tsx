// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import { Box, Button, Checkbox, Form, FormField, SpaceBetween, Textarea } from '~components';

import styles from './styles.scss';

export default function Bluedialog({ onSubmit, onSkip }: any) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  // Inputs (these following can be clubbed into one state object)
  const [feedbackOptions, setFeedbackOptions] = React.useState({
    harmful: false,
    incomplete: false,
    inaccurate: false,
    other: false,
  });
  const [feedbackText, setFeedbackText] = React.useState('');

  useEffect(() => {
    // Store the element that had focus before dialog opened
    triggerRef.current = document.activeElement as HTMLElement;

    // Focus the dialog container when it opens
    if (dialogRef.current) {
      dialogRef.current.focus();
    }
    // Cleanup: Return focus to the trigger element when dialog closes
    return () => {
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    };
  }, []);

  function submitData() {
    onSubmit({ feedbackOptions, feedbackText });
  }
  function skipDialog() {
    onSkip(); // can be used by the parent component to dismiss/ hide this dialog box
  }

  return (
    <div
      className={styles['blue-dialog-box']}
      role={'dialog'}
      aria-labelledby="feedback dialog"
      aria-modal="false" // Maintains natural focus flow since it's an inline dialog
      tabIndex={-1} // This allows the dialog to receive focus
    >
      <Form>
        <Box padding={'l'}>
          <div className={styles['blue-dialog-box__close']}>
            <Button iconName="close" variant="icon" onClick={skipDialog} aria-label="Close dialog" />
          </div>
          <SpaceBetween direction="vertical" size="l">
            <FormField label="What did you dislike about the response?">
              <SpaceBetween size={'xxl'} direction={'horizontal'}>
                <Checkbox
                  checked={feedbackOptions.harmful}
                  onChange={({ detail }) => setFeedbackOptions({ ...feedbackOptions, harmful: detail.checked })}
                >
                  Harmful
                </Checkbox>
                <Checkbox
                  checked={feedbackOptions.incomplete}
                  onChange={({ detail }) => setFeedbackOptions({ ...feedbackOptions, incomplete: detail.checked })}
                >
                  Incomplete
                </Checkbox>
                <Checkbox
                  checked={feedbackOptions.inaccurate}
                  onChange={({ detail }) => setFeedbackOptions({ ...feedbackOptions, inaccurate: detail.checked })}
                >
                  Inaccurate
                </Checkbox>
                <Checkbox
                  checked={feedbackOptions.other}
                  onChange={({ detail }) => setFeedbackOptions({ ...feedbackOptions, other: detail.checked })}
                >
                  Other
                </Checkbox>
              </SpaceBetween>
            </FormField>
            <FormField label="Tell us more - optional" stretch={true}>
              <Textarea
                rows={1}
                onChange={({ detail }) => setFeedbackText(detail.value)}
                value={feedbackText}
                placeholder={'Additional feedback'}
              />
            </FormField>
          </SpaceBetween>
        </Box>

        <div className={styles['blue-dialog-box__footer']}>
          <Button onClick={submitData} ariaLabel="Submit form">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}
