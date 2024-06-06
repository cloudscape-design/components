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
import { CopyToClipboard, ProgressBar } from '~components';

export default function KeyValueScenario() {
  return (
    <article>
      <h1>KeyValuePairs permutations</h1>
      <ScreenshotArea>
        <SpaceBetween size="s">
          <Box padding="s">
            <Box variant="h2">1 column</Box>
            <KeyValuePairs
              layout="columns"
              columns={[
                {
                  items: [
                    {
                      label: 'Distribution ID',
                      value: 'E1WG1ZNPRXT0D4',
                    },
                  ],
                },
              ]}
            />
          </Box>
          <Box padding="s">
            <Box variant="h2">3 columns</Box>
            <KeyValuePairs
              layout="columns"
              columns={[
                {
                  items: [
                    {
                      label: 'Distribution ID',
                      value: 'E1WG1ZNPRXT0D4',
                    },
                    {
                      label: 'ARN',
                      value: (
                        <CopyToClipboard
                          copyButtonAriaLabel="Copy ARN"
                          copyErrorText="ARN failed to copy"
                          copySuccessText="ARN copied"
                          textToCopy="arn:service23G24::111122223333:distribution/23E1WG1ZNPRXT0D4"
                          variant="inline"
                        />
                      ),
                    },
                  ],
                },
                {
                  items: [
                    {
                      label: 'Status',
                      value: <StatusIndicator>Available</StatusIndicator>,
                    },
                    {
                      label: 'SSL Certificate',
                      value: (
                        <ProgressBar
                          value={30}
                          additionalInfo="Additional information"
                          description="Progress bar label"
                        />
                      ),
                    },
                  ],
                },
                {
                  items: [
                    {
                      label: 'Price class',
                      value: 'Use only US, Canada, Europe,',
                    },
                    {
                      label: 'CNAMEs',
                      value: (
                        <Link external={true} href="#">
                          abc.service23G24.xyz
                        </Link>
                      ),
                    },
                  ],
                },
              ]}
            />
          </Box>
          <Box padding="s">
            <Box variant="h2">With info link</Box>
            <KeyValuePairs
              layout="columns"
              columns={[
                {
                  items: [
                    {
                      label: 'Distribution ID',
                      value: 'E1WG1ZNPRXT0D4',
                      info: (
                        <Link variant="info" href="#">
                          Info
                        </Link>
                      ),
                    },
                  ],
                },
              ]}
            />
          </Box>
          <Box padding="s">
            <Box variant="h2">With column title and multiple rows</Box>
            <InternalSpaceBetween size="l">
              <KeyValuePairs
                layout="columns"
                columns={[
                  {
                    title: 'Column Title',
                    items: [
                      {
                        label: 'Label for key',
                        value: 'Value',
                      },
                      {
                        label: 'Label for key',
                        value: <StatusIndicator>Value for positive status</StatusIndicator>,
                      },
                    ],
                  },
                  {
                    title: 'Column Title',
                    items: [
                      {
                        label: 'Label for key',
                        value: 'Value',
                      },
                      {
                        label: 'Label for key',
                        value: (
                          <Link external={true} href="#">
                            Value with external link
                          </Link>
                        ),
                      },
                    ],
                  },
                ]}
              />
              <KeyValuePairs
                layout="columns"
                columns={[
                  {
                    title: 'Column Title',
                    items: [
                      {
                        label: 'Label for key',
                        value: 'Value',
                      },
                      {
                        label: 'Label for key',
                        value: <StatusIndicator>Value for positive status</StatusIndicator>,
                      },
                    ],
                  },
                  {
                    title: 'Column Title',
                    items: [
                      {
                        label: 'Label for key',
                        value: 'Value',
                      },
                      {
                        label: 'Label for key',
                        value: (
                          <Link external={true} href="#">
                            Value with external link
                          </Link>
                        ),
                      },
                    ],
                  },
                ]}
              />
            </InternalSpaceBetween>
          </Box>
          <Box padding="s">
            <Box variant="h2">With auto layout</Box>
            <KeyValuePairs
              layout="auto"
              columnsNumber={4}
              pairs={[
                {
                  label: 'Label for key',
                  value: 'Value',
                },
                {
                  label: 'Label for key',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
                {
                  label: 'Label for key',
                  value: 'Value',
                },
                {
                  label: 'Label for key',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
                {
                  label: 'Label for key',
                  value: 'Value',
                },
                {
                  label: 'Label for key',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
                {
                  label: 'Label for key',
                  value: 'Value',
                },
                {
                  label: 'Label for key',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
                {
                  label: 'Label for key',
                  value: 'Value',
                },
                {
                  label: 'Label for key',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
                {
                  label: 'Label for key',
                  value: 'Value',
                },
                {
                  label: 'Label for key',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
                {
                  label: 'Label for key',
                  value: 'Value',
                },
                {
                  label: 'Label for key',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
              ]}
            />
          </Box>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
