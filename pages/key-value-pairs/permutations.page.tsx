// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import KeyValuePairs from '~components/key-value-pairs';
import ScreenshotArea from '../utils/screenshot-area';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Link from '~components/link';
import Box from '~components/box';
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
              columns={1}
              items={[
                {
                  label: 'Distribution ID',
                  value: 'E1WG1ZNPRXT0D4',
                },
              ]}
            />
          </Box>
          <Box padding="s">
            <Box variant="h2">3 columns</Box>
            <KeyValuePairs
              columns={3}
              items={[
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
                {
                  label: 'Status',
                  value: <StatusIndicator>Available</StatusIndicator>,
                },
                {
                  label: 'SSL Certificate',
                  value: (
                    <ProgressBar value={30} additionalInfo="Additional information" description="Progress bar label" />
                  ),
                },
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
              ]}
            />
          </Box>
          <Box padding="s">
            <Box variant="h2">With info link</Box>
            <KeyValuePairs
              columns={1}
              items={[
                {
                  label: 'Distribution ID',
                  value: 'E1WG1ZNPRXT0D4',
                  info: (
                    <Link variant="info" href="#">
                      Info
                    </Link>
                  ),
                },
              ]}
            />
          </Box>
          <Box padding="s">
            <Box variant="h2">With column title and multiple rows</Box>
            <KeyValuePairs
              columns={2}
              items={[
                {
                  title: 'Column Title 1',
                  items: [
                    {
                      label: 'Label for key 1.1',
                      value: 'Value 1',
                    },
                    {
                      label: 'Label for key 1.2',
                      value: <StatusIndicator>Value for positive status</StatusIndicator>,
                    },
                  ],
                },
                {
                  title: 'Column Title 2',
                  items: [
                    {
                      label: 'Label for key 2.1',
                      value: 'Value',
                    },
                    {
                      label: 'Label for key 2.2',
                      value: (
                        <Link external={true} href="#">
                          Value with external link
                        </Link>
                      ),
                    },
                  ],
                },
                {
                  title: 'Column Title 3',
                  items: [
                    {
                      label: 'Label for key 3.1',
                      value: 'Value',
                    },
                    {
                      label: 'Label for key 3.2',
                      value: <StatusIndicator>Value for positive status</StatusIndicator>,
                    },
                  ],
                },
                {
                  title: 'Column Title 4',
                  items: [
                    {
                      label: 'Label for key 4.1',
                      value: 'Value',
                    },
                    {
                      label: 'Label for key 4.2',
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
          </Box>
          <Box padding="s">
            <Box variant="h2">Flat list</Box>
            <KeyValuePairs
              columns={4}
              items={[
                {
                  label: 'Label for key 1',
                  value: 'Value',
                },
                {
                  label: 'Label for key 2',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
                {
                  label: 'Label for key 3',
                  value: 'Value',
                },
                {
                  label: 'Label for key 4',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
                {
                  label: 'Label for key 5',
                  value: 'Value',
                },
                {
                  label: 'Label for key 6',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
                {
                  label: 'Label for key 7',
                  value: 'Value',
                },
                {
                  label: 'Label for key 8',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
                {
                  label: 'Label for key 9',
                  value: 'Value',
                },
                {
                  label: 'Label for key 10',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
                {
                  label: 'Label for key 11',
                  value: 'Value',
                },
                {
                  label: 'Label for key 12',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
                {
                  label: 'Label for key 13',
                  value: 'Value',
                },
                {
                  label: 'Label for key 14',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
              ]}
            />
          </Box>
          <Box padding="s">
            <Box variant="h2">Combined list</Box>
            <KeyValuePairs
              columns={4}
              items={[
                {
                  label: 'Label for key 1',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
                {
                  title: 'Title for the column 2',
                  items: [
                    {
                      label: 'Label for key (belongs to column) 2.1',
                      value: 'Value',
                    },
                    {
                      label: 'Label for key (belongs to column) 2.2',
                      value: 'Value',
                    },
                  ],
                },
                {
                  label: 'Label for key 3',
                  value: 'Value',
                },
                {
                  label: 'Label for key 4',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
                {
                  label: 'Label for key 5',
                  value: 'Value',
                },
                {
                  label: 'Label for key 6',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
                {
                  title: 'Title for the column 7',
                  items: [
                    {
                      label: 'Label for key (belongs to column) 7.1',
                      value: 'Value',
                    },
                    {
                      label: 'Label for key (belongs to column) 7.2',
                      value: 'Value',
                    },
                  ],
                },
                {
                  label: 'Label for key 8',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
                {
                  label: 'Label for key 9',
                  value: 'Value',
                },
                {
                  label: 'Label for key 10',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
                {
                  label: 'Label for key 11',
                  value: 'Value',
                },
                {
                  label: 'Label for key 12',
                  value: (
                    <Link external={true} href="#">
                      Value with external link
                    </Link>
                  ),
                },
                {
                  label: 'Label for key 13',
                  value: 'Value',
                },
                {
                  label: 'Label for key 14',
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
