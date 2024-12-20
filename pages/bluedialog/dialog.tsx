// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import { Button, Checkbox, Form, FormField, SpaceBetween, Textarea } from '~components';

import styles from './styles.scss';

export default function Bluedialog({ onSubmit }: any) {
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

  return (
    <div
      className={styles['blue-dialog-box']}
      role={'dialog'}
      aria-labelledby="dialog-title"
      aria-modal="false" // Maintains natural focus flow since it's an inline dialog
      tabIndex={-1} // This allows the dialog to receive focus
    >
      <Form>
        <div className={styles['blue-dialog-box__content']}>
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
            <FormField label="Tell us more - optional">
              <Textarea
                onChange={({ detail }) => setFeedbackText(detail.value)}
                value={feedbackText}
                placeholder={'Additional feedback'}
              />
            </FormField>
          </SpaceBetween>
        </div>
        <div className={styles['blue-dialog-box__footer']}>
          <Button onClick={submitData} ariaLabel="Submit form">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}
