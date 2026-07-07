// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Box from '~components/box';
import CopyToClipboard from '~components/copy-to-clipboard';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import TruncatedText from '~components/truncated-text';

const containerStyle: React.CSSProperties = {
  maxWidth: '320px',
  padding: '8px 12px',
  border: '1px solid #d5dbdb',
  borderRadius: '4px',
};

export default function TruncatedTextSimple() {
  return (
    <>
      <h1>TruncatedText examples</h1>
      <SpaceBetween size="m">
        <Box>
          <Box variant="awsui-key-label">Truncated plain text</Box>
          <div style={containerStyle}>
            <TruncatedText>arn:aws:lambda:us-east-1:123456789012:function:my-function</TruncatedText>
          </div>
        </Box>

        <Box>
          <Box variant="awsui-key-label">Non-truncated plain text</Box>
          <div style={containerStyle}>
            <TruncatedText>arn:aws:lambda</TruncatedText>
          </div>
        </Box>

        <Box>
          <Box variant="awsui-key-label">Truncated with interactive child (uses tooltipText)</Box>
          <div style={containerStyle}>
            <TruncatedText tooltipText="ResourceName-421492941223_may-be-truncated">
              <Link href="#">ResourceName-421492941223_may-be-truncated</Link>
            </TruncatedText>
          </div>
        </Box>

        <Box>
          <Box variant="awsui-key-label">Truncated text in a flex container</Box>
          <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Label:</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <TruncatedText>arn:aws:s3:::my-very-long-bucket-name-with-extra-words</TruncatedText>
            </div>
          </div>
        </Box>

        <Box>
          <Box variant="awsui-key-label">With StatusIndicator (wrapText=true, default)</Box>
          <div style={containerStyle}>
            <TruncatedText>
              <StatusIndicator type="success">
                The instance has been running for an extended period of time
              </StatusIndicator>
            </TruncatedText>
          </div>
        </Box>

        <Box>
          <Box variant="awsui-key-label">With StatusIndicator (wrapText=false)</Box>
          <div style={containerStyle}>
            <TruncatedText>
              <StatusIndicator type="success" wrapText={false}>
                The instance has been running for an extended period of time
              </StatusIndicator>
            </TruncatedText>
          </div>
        </Box>

        <Box>
          <Box variant="awsui-key-label">With CopyToClipboard (variant=inline)</Box>
          <div style={containerStyle}>
            <TruncatedText tooltipText="arn:aws:iam::123456789012:role/my-very-long-role-name">
              <CopyToClipboard
                variant="inline"
                textToCopy="arn:aws:iam::123456789012:role/my-very-long-role-name"
                copyButtonAriaLabel="Copy ARN"
                copySuccessText="ARN copied"
                copyErrorText="Failed to copy ARN"
              />
            </TruncatedText>
          </div>
        </Box>

        <Box>
          <Box variant="awsui-key-label">With CopyToClipboard, internal truncation</Box>
          <div style={containerStyle}>
            <CopyToClipboard
              variant="inline"
              textToCopy="arn:aws:iam::123456789012:role/my-very-long-role-name"
              textToDisplay={<TruncatedText>arn:aws:iam::123456789012:role/my-very-long-role-name</TruncatedText>}
              copyButtonAriaLabel="Copy ARN"
              copySuccessText="ARN copied"
              copyErrorText="Failed to copy ARN"
            />
          </div>
        </Box>
      </SpaceBetween>
    </>
  );
}
