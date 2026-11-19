// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { CopyToClipboard, Link, TruncatedText, TruncatedTextProps } from '~components';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const containerStyle: React.CSSProperties = {
  maxWidth: '320px',
  padding: '8px 12px',
  border: '1px solid #d5dbdb',
  borderRadius: '4px',
};

const longArn = 'arn:aws:iam::123456789012:role/my-very-long-role-name-that-should-truncate';
const longSentence = 'The instance has been running for an extended period of time and may be slow.';

const permutations = createPermutations<
  TruncatedTextProps & { Wrapper: (props: { children: React.ReactNode }) => JSX.Element | null }
>([
  {
    Wrapper: [React.Fragment],
    children: [
      'Short text',
      longArn,
      longSentence,
      <Link key="link" href="#">
        {longArn}
      </Link>,
      <CopyToClipboard
        key="copy-inline"
        variant="inline"
        textToCopy={longArn}
        copyButtonAriaLabel="Copy ARN"
        copySuccessText="ARN copied"
        copyErrorText="Failed to copy ARN"
      />,
    ],
  },
  {
    Wrapper: [
      ({ children }) => (
        <CopyToClipboard
          key="copy-inline"
          variant="inline"
          textToCopy={longArn}
          textToDisplay={children}
          wrapText={false}
          copyButtonAriaLabel="Copy ARN"
          copySuccessText="ARN copied"
          copyErrorText="Failed to copy ARN"
        />
      ),
    ],
    children: [
      'Short text',
      longArn,
      longSentence,
      <Link key="link" href="#">
        {longArn}
      </Link>,
    ],
  },
]);

export default function TruncatedTextPermutations() {
  return (
    <>
      <h1>TruncatedText permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={({ Wrapper, ...permutation }) => (
            <div style={containerStyle}>
              <Wrapper>
                <TruncatedText {...permutation} />
              </Wrapper>
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
