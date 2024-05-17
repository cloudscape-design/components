// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import KeyValuePairs from '~components/key-value-pairs';
import ScreenshotArea from '../utils/screenshot-area';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Link from '~components/link';
import Box from '~components/box';
import InternalSpaceBetween from '~components/space-between/internal';

export default function KeyValueScenario() {
  return (
    <article>
      <ScreenshotArea>
        <SpaceBetween size="s">
          <Box padding="s">
            <Box variant="h1">1 column</Box>
            <KeyValuePairs
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
            <KeyValuePairs
              columns={[
                {
                  items: [
                    {
                      key: 'Label for key',
                      value: 'Value',
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
            <KeyValuePairs
              columns={[
                {
                  items: [
                    {
                      key: 'Label for key',
                      value: 'Value',
                      info: (
                        <Link variant="info" href="#">
                          link
                        </Link>
                      ),
                    },
                  ],
                },
              ]}
            />
          </Box>
          <Box padding="s">
            <Box variant="h1">With column title and multiple rows</Box>
            <InternalSpaceBetween size="l">
              <KeyValuePairs
                columns={[
                  {
                    title: 'Column Title',
                    items: [
                      {
                        key: 'Label for key',
                        value: 'Value',
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
                  {
                    title: 'Column Title',
                    items: [
                      {
                        key: 'Label for key',
                        value: 'Value',
                      },
                    ],
                  },
                ]}
              />
              <KeyValuePairs
                columns={[
                  {
                    title: 'Column Title',
                    items: [
                      {
                        key: 'Label for key',
                        value: 'Value',
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
                      },
                    ],
                  },
                ]}
              />
            </InternalSpaceBetween>
          </Box>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
