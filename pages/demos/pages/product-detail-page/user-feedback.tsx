// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Icon from '@cloudscape-design/components/icon';
import SpaceBetween from '@cloudscape-design/components/space-between';

type Sentiment = 'yes' | 'no';

function UserFeedback() {
  const [loadingSentiment, setLoadingSentiment] = useState<Sentiment | null>(null);
  const [successfulSentiment, setSuccessfulSentiment] = useState<Sentiment | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const submitSentiment = (sentiment: Sentiment) => {
    setLoadingSentiment(sentiment);
    setSuccessfulSentiment(null);

    setTimeout(() => {
      flushSync(() => {
        setSuccessfulSentiment(sentiment);
        setLoadingSentiment(null);
      });
      successRef.current?.focus();
    }, 500);
  };

  return (
    <SpaceBetween size="s" data-testid="user-feedback">
      <Box variant="h2">Was this page helpful?</Box>
      {!successfulSentiment && (
        <SpaceBetween direction="horizontal" size="xs">
          <Button
            iconName="thumbs-up"
            loadingText="Submitting feedback"
            onClick={() => submitSentiment('yes')}
            loading={loadingSentiment === 'yes'}
            disabled={loadingSentiment === 'no'}
            data-testid="user-feedback-yes"
          >
            Yes
          </Button>
          <Button
            iconName="thumbs-down"
            loadingText="Submitting feedback"
            onClick={() => submitSentiment('no')}
            loading={loadingSentiment === 'no'}
            disabled={loadingSentiment === 'yes'}
            data-testid="user-feedback-no"
          >
            No
          </Button>
        </SpaceBetween>
      )}

      {successfulSentiment && (
        <div ref={successRef} tabIndex={-1} data-testid="user-feedback-result">
          <Box variant="span" color="text-body-secondary">
            {successfulSentiment === 'yes' ? (
              <span>
                <Icon name="thumbs-up-filled" /> Helpful.{' '}
              </span>
            ) : (
              <span>
                <Icon name="thumbs-down-filled" /> Not helpful.{' '}
              </span>
            )}
            Thanks, your feedback has been recorded.
          </Box>
        </div>
      )}
    </SpaceBetween>
  );
}

export { UserFeedback };
