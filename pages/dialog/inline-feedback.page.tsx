// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import ButtonGroup, { ButtonGroupProps } from '~components/button-group';
import Checkbox from '~components/checkbox';
import Dialog from '~components/dialog';
import FormField from '~components/form-field';
import PromptInput from '~components/prompt-input';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Textarea from '~components/textarea';

import { DialogPage } from './common';

const content =
  'Amazon S3 provides a simple web service interface that you can use to store and retrieve any amount of data, at ' +
  'any time, from anywhere. Using this service, you can easily build applications that make use of cloud native ' +
  'storage. Since Amazon S3 is highly scalable and you only pay for what you use, you can start small and grow your ' +
  'application as you wish, with no compromise on performance or reliability.';

// UC3: inline feedback on an assistant response, mirroring the gen-ai-feedback
// wrapper in AWS-UI-Website but built on our Dialog. The feedback dialog renders
// in-flow beneath the message it refers to. Dismissing (close or Esc) is a real
// outcome: it hides the dialog and returns focus to the "Not helpful" vote button
// (the control that opened it), demonstrating the consumer owning focus after
// onDismiss. Submitting records the feedback, appends a confirmation, then closes.
export default function DialogInlineFeedbackPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(true);
  const [options, setOptions] = useState({ harmful: false, incomplete: false, inaccurate: false, other: false });
  const [notes, setNotes] = useState('');
  const [prompt, setPrompt] = useState('');
  const buttonGroupRef = useRef<ButtonGroupProps.Ref>(null);

  const toggle = (key: keyof typeof options, checked: boolean) => setOptions(prev => ({ ...prev, [key]: checked }));

  const dismissFeedbackDialog = () => {
    setShowFeedbackDialog(false);
    buttonGroupRef.current?.focus('not-helpful');
  };

  return (
    <DialogPage title="Dialog — UC3: inline feedback">
      <SpaceBetween size="xs">
        <SpaceBetween size="xs">
          <Box variant="p" color="text-body-secondary">
            {content}
          </Box>

          <ButtonGroup
            ref={buttonGroupRef}
            ariaLabel="Chat actions"
            variant="icon"
            items={[
              {
                type: 'group',
                text: 'Vote',
                items: [
                  {
                    type: 'icon-button',
                    id: 'helpful',
                    iconName: 'thumbs-up',
                    text: 'Helpful',
                    disabled: true,
                    disabledReason: '"Helpful" option is unavailable after "Not helpful" feedback submitted.',
                  },
                  {
                    type: 'icon-button',
                    id: 'not-helpful',
                    iconName: 'thumbs-down-filled',
                    text: 'Not helpful',
                    disabled: true,
                    disabledReason: '"Not helpful" feedback has been submitted.',
                  },
                ],
              },
              {
                type: 'icon-button',
                id: 'copy',
                iconName: 'copy',
                text: 'Copy',
                popoverFeedback: <StatusIndicator type="success">Message copied</StatusIndicator>,
              },
            ]}
            onItemClick={({ detail }) => {
              if (detail.id === 'copy' && navigator.clipboard) {
                navigator.clipboard.writeText(content).catch(() => undefined);
              }
            }}
          />

          {isSubmitted && (
            <Box variant="p" color="text-body-secondary">
              Your feedback has been submitted. Thank you for your additional feedback.
            </Box>
          )}
        </SpaceBetween>

        {showFeedbackDialog && (
          <Dialog
            header="Tell us more"
            i18nStrings={{ dismissAriaLabel: 'Close feedback' }}
            onDismiss={dismissFeedbackDialog}
            footer={
              <Box float="right">
                <SpaceBetween direction="horizontal" size="xs">
                  <Button variant="link" onClick={dismissFeedbackDialog}>
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setIsSubmitted(true);
                      dismissFeedbackDialog();
                    }}
                  >
                    Submit
                  </Button>
                </SpaceBetween>
              </Box>
            }
          >
            <SpaceBetween size="l">
              <FormField label="What did you dislike about the response?">
                <SpaceBetween size="l" direction="horizontal">
                  <Checkbox checked={options.harmful} onChange={({ detail }) => toggle('harmful', detail.checked)}>
                    Harmful
                  </Checkbox>
                  <Checkbox
                    checked={options.incomplete}
                    onChange={({ detail }) => toggle('incomplete', detail.checked)}
                  >
                    Incomplete
                  </Checkbox>
                  <Checkbox
                    checked={options.inaccurate}
                    onChange={({ detail }) => toggle('inaccurate', detail.checked)}
                  >
                    Inaccurate
                  </Checkbox>
                  <Checkbox checked={options.other} onChange={({ detail }) => toggle('other', detail.checked)}>
                    Other
                  </Checkbox>
                </SpaceBetween>
              </FormField>

              <FormField label="Additional notes" stretch={true}>
                <Textarea
                  rows={3}
                  value={notes}
                  onChange={({ detail }) => setNotes(detail.value)}
                  placeholder="Additional feedback"
                />
              </FormField>
            </SpaceBetween>
          </Dialog>
        )}

        <PromptInput
          value={prompt}
          onChange={({ detail }) => setPrompt(detail.value)}
          onAction={() => setShowFeedbackDialog(true)}
          placeholder="Ask a question"
          actionButtonAriaLabel="Send message"
          actionButtonIconName="send"
        />
      </SpaceBetween>
    </DialogPage>
  );
}
