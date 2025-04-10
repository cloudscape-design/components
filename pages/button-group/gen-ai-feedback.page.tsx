// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Box, Button, ButtonGroup, ButtonGroupProps, Header, SpaceBetween, StatusIndicator } from '~components';

export default function ButtonGroupPage() {
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState<string>('');

  const items: ButtonGroupProps.ItemOrGroup[] = [
    {
      type: 'group',
      text: 'Vote',
      items: [
        {
          type: 'icon-button',
          id: 'helpful',
          iconName: feedback === 'helpful' ? 'thumbs-up-filled' : 'thumbs-up',
          text: 'Helpful',
          disabled: !!feedback.length || feedbackSubmitting === 'not-helpful',
          disabledReason: feedbackSubmitting.length
            ? ''
            : feedback === 'helpful'
              ? '“Helpful” feedback has been submitted.'
              : 'Helpful option is unavailable after “not helpful” feedback submitted.',
          loading: feedbackSubmitting === 'helpful',
          popoverFeedback:
            feedback === 'helpful' ? (
              <StatusIndicator type="success">Feedback submitted</StatusIndicator>
            ) : (
              'Submitting feedback'
            ),
        },
        {
          type: 'icon-button',
          id: 'not-helpful',
          iconName: feedback === 'not-helpful' ? 'thumbs-down-filled' : 'thumbs-down',
          text: 'Not helpful',
          disabled: !!feedback.length || feedbackSubmitting === 'helpful',
          disabledReason: feedbackSubmitting.length
            ? ''
            : feedback === 'not-helpful'
              ? '“Not helpful” feedback has been submitted.'
              : '“Not helpful” option is unavailable after “helpful” feedback submitted.',
          loading: feedbackSubmitting === 'not-helpful',
          popoverFeedback:
            feedback === 'helpful' ? (
              <StatusIndicator type="success">Feedback submitted</StatusIndicator>
            ) : (
              'Submitting feedback'
            ),
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
            setFeedbackSubmitting(detail.id);

            setTimeout(() => {
              setFeedback(detail.id);
              setFeedbackSubmitting('');
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
