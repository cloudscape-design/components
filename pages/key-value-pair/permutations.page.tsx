// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import KeyValuePair from '~components/key-value-pair';
import ScreenshotArea from '../utils/screenshot-area';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Link from '~components/link';
import Box from '~components/box';

export default function KeyValueScenario() {
  return (
    <article>
      <ScreenshotArea>
        <SpaceBetween size="s">
          <Box padding="s">
            <Box variant="h1">1 column</Box>
            <KeyValuePair
              columns={[
                {
                  items: [
                    {
                      key: 'Label for key',
                      value: 'Value',
                    },
                  ],
                },
              ]}
            />
          </Box>
          <Box padding="s">
            <Box variant="h1">2 columns</Box>
            <KeyValuePair
              columns={[
                {
                  title: 'Column Title',
                  items: [
                    {
                      key: 'Label for key',
                      value: 'Value',
                      info: <Link href="#">link</Link>,
                    },
                    {
                      key: 'Label for key',
                      value: <StatusIndicator>Value for positive status</StatusIndicator>,
                    },
                    {
                      key: 'Label for key',
                      value: <StatusIndicator type="error">Value for negative status</StatusIndicator>,
                    },
                  ],
                },
                {
                  title: 'Column Title',
                  items: [
                    {
                      key: 'Label for key',
                      value: (
                        <Link external={true} href="#">
                          Value with external link
                        </Link>
                      ),
                    },
                    {
                      key: 'Label for key',
                      value: 'Value',
                    },
                    {
                      key: 'Label for key',
                      value: 'Value',
                    },
                  ],
                },
              ]}
            />
          </Box>
          <Box padding="s">
            <Box variant="h1">With info link</Box>
            <KeyValuePair
              columns={[
                {
                  items: [
                    {
                      key: 'Label for key',
                      value: 'Value',
                      info: <Link href="#">link</Link>,
                    },
                  ],
                },
              ]}
            />
          </Box>
          <Box padding="s">
            <Box variant="h1">With column title and multiple rows</Box>
            <KeyValuePair
              columns={[
                {
                  title: 'Column Title',
                  items: [
                    {
                      key: 'Label for key',
                      value: 'Value',
                      info: <Link href="#">link</Link>,
                    },
                    {
                      key: 'Label for key',
                      value: <StatusIndicator>Value for positive status</StatusIndicator>,
                    },
                    {
                      key: 'Label for key',
                      value: <StatusIndicator type="error">Value for negative status</StatusIndicator>,
                    },
                  ],
                },
                {
                  title: 'Column Title',
                  items: [
                    {
                      key: 'Label for key',
                      value: (
                        <Link external={true} href="#">
                          Value with external link
                        </Link>
                      ),
                    },
                    {
                      key: 'Label for key',
                      value: 'Value',
                    },
                    {
                      key: 'Label for key',
                      value: 'Value',
                    },
                    {
                      key: 'Label for key',
                      value: 'Value',
                    },
                    {
                      key: 'Label for key',
                      value: 'Value',
                    },
                  ],
                },
                {
                  title: 'Column Title',
                  items: [
                    {
                      key: 'Label for key',
                      value: 'Value',
                      info: <Link href="#">link</Link>,
                    },
                  ],
                },
              ]}
            />
          </Box>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
