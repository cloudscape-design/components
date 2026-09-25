// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { CopyToClipboard, KeyValuePairs } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

export default function () {
  const brand = {
    styleClassNames: { copyButton: styles['copy-brand'], textToDisplay: styles['text-brand'] },
  };
  return (
    <SimplePage title="Copy to clipboard - Style API v2" screenshotArea={{}}>
      <KeyValuePairs
        items={[
          {
            type: 'pair',
            label: 'Button variant',
            value: (
              <CopyToClipboard
                variant="button"
                copyButtonText="Copy ARN"
                copyErrorText="Failed to copy"
                copySuccessText="Copied"
                textToCopy="arn:aws:iam::123456789012:role/example"
                {...brand}
              />
            ),
          },
          {
            type: 'pair',
            label: 'Icon variant',
            value: (
              <CopyToClipboard
                variant="icon"
                copyButtonAriaLabel="Copy ARN"
                copyErrorText="Failed to copy"
                copySuccessText="Copied"
                textToCopy="arn:aws:iam::123456789012:role/example"
                {...brand}
              />
            ),
          },
          {
            type: 'pair',
            label: 'Inline variant',
            value: (
              <CopyToClipboard
                variant="inline"
                copyButtonAriaLabel="Copy ARN"
                copyErrorText="Failed to copy"
                copySuccessText="Copied"
                textToCopy="arn:aws:iam::123456789012:role/example"
                {...brand}
              />
            ),
          },
        ]}
      />
    </SimplePage>
  );
}
