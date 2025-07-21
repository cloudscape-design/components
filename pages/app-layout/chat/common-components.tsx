// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useState } from 'react';

import Avatar from '@cloudscape-design/chat-components/avatar';

import ButtonGroup, { ButtonGroupProps } from '~components/button-group';
import StatusIndicator from '~components/status-indicator';

import { AuthorAvatarProps } from './config';

export function ChatBubbleAvatar({ type, name, initials, loading }: AuthorAvatarProps) {
  if (type === 'gen-ai') {
    return <Avatar color="gen-ai" iconName="gen-ai" tooltipText={name} ariaLabel={name} loading={loading} />;
  }

  return <Avatar initials={initials} tooltipText={name} ariaLabel={name} />;
}

export function CodeViewActions({ contentToCopy }: { contentToCopy: string }) {
  return (
    <ButtonGroup
      ariaLabel="Code snippet actions"
      variant="icon"
      onItemClick={({ detail }) => {
        if (detail.id !== 'copy' || !navigator.clipboard) {
          return;
        }

        navigator.clipboard.writeText(contentToCopy).catch(error => console.log('Failed to copy', error.message));
      }}
      items={[
        {
          type: 'group',
          text: 'Feedback',
          items: [
            {
              type: 'icon-button',
              id: 'run-command',
              iconName: 'play',
              text: 'Run command',
            },
            {
              type: 'icon-button',
              id: 'send-cloudshell',
              iconName: 'script',
              text: 'Send to IDE',
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
    />
  );
}

export const FittedContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ position: 'relative', flexGrow: 1 }}>
      <div>{children}</div>
    </div>
  );
};

export const ScrollableContainer = forwardRef(function ScrollableContainer(
  { children }: { children: React.ReactNode },
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <div style={{ position: 'relative', blockSize: '100%' }}>
      <div style={{ overflowY: 'auto' }} ref={ref} data-testid="chat-scroll-container">
        {children}
      </div>
    </div>
  );
});

export function FeedbackActions({
  contentToCopy,
  onNotHelpfulFeedback,
}: {
  contentToCopy: string;
  onNotHelpfulFeedback: () => void;
}) {
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
              ? '"Helpful" feedback has been submitted.'
              : '"Helpful" option is unavailable after "Not helpful" feedback submitted.',
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
              ? '"Not helpful" feedback has been submitted.'
              : '"Not helpful" option is unavailable after "Helpful" feedback submitted.',
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
    <ButtonGroup
      ariaLabel="Chat actions"
      variant="icon"
      items={items}
      onItemClick={({ detail }) => {
        if (detail.id === 'copy' && navigator.clipboard) {
          return navigator.clipboard
            .writeText(contentToCopy)

            .catch(error => console.log('Failed to copy', error.message));
        }

        setFeedbackSubmitting(detail.id);

        setTimeout(() => {
          setFeedback(detail.id);
          setFeedbackSubmitting('');
          if (detail.id === 'not-helpful') {
            onNotHelpfulFeedback();
          }
        }, 2000);
      }}
    />
  );
}
