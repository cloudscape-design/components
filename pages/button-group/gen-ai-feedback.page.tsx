// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Box, Button, ButtonGroup, ButtonGroupProps, Header, SpaceBetween, StatusIndicator } from '~components';

export default function ButtonGroupPage() {
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState<string>('');
  const [popoverFeedback, setPopoverFeedback] = useState<React.ReactNode>('Feedback sending');

  const items: ButtonGroupProps.ItemOrGroup[] = [
    {
      type: 'group',
      text: 'Vote',
      items: [
        {
          type: 'icon-button',
          id: 'helpful',
          iconName: feedback === 'helpful' ? 'thumbs-up-filled' : 'thumbs-up',
          text: feedback === 'helpful' ? 'Helpful. Feedback submitted.' : 'Helpful',
          disabled: feedback === 'not-helpful' || feedbackSubmitting === 'helpful',
          disabledReason: feedbackSubmitting.length ? '' : 'Helpful. Unavailable after feedback is submitted.',
          loading: feedbackSubmitting === 'helpful',
          popoverFeedback: popoverFeedback,
        },
        {
          type: 'icon-button',
          id: 'not-helpful',
          iconName: 'thumbs-down',
          text: feedback === 'not-helpful' ? 'Helpful. Feedback submitted.' : 'Not helpful',
          disabled: feedback === 'helpful' || feedbackSubmitting === 'not-helpful',
          disabledReason: feedbackSubmitting.length ? '' : 'Not helpful. Unavailable after feedback is submitted.',
          loading: feedbackSubmitting === 'not-helpful',
          popoverFeedback: popoverFeedback,
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
  ];

  return (
    <Box margin={'m'}>
      <Header variant="h1">Gen-AI feedback</Header>
      <br />

      <SpaceBetween size="l">
        <ButtonGroup
          ariaLabel="Chat actions"
          variant="icon"
          items={items}
          onItemClick={({ detail }) => {
            if (feedback.length) {
              setPopoverFeedback(
                `${feedback === 'helpful' ? 'Helpful' : 'Not helpful'}. Feedback submitted. Vote cannot be taken back.`
              );
              return;
            }
            setFeedbackSubmitting(detail.id);

            setTimeout(() => {
              setFeedback(detail.id);
              setFeedbackSubmitting('');
              setPopoverFeedback(<StatusIndicator type="success">Feedback sent</StatusIndicator>);
            }, 2000);
          }}
        />

        <Button
          onClick={() => {
            setFeedback('');
            setFeedbackSubmitting('');
          }}
        >
          Reset
        </Button>
      </SpaceBetween>
    </Box>
  );
}
