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
          </Box>
          <Box padding="s">
            <Box variant="h2">Flat list</Box>
            <KeyValuePairs
              columns={4}
              items={[
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
          <Box padding="s">
            <Box variant="h2">Combined list</Box>
            <KeyValuePairs
              columns={4}
              items={[
                {
                  title: 'Title for the column',
                  items: [
                    {
                      label: 'Label for key (belongs to column)',
                      value: 'Value',
                    },
                    {
                      label: 'Label for key (belongs to column)',
                      value: 'Value',
                    },
                  ],
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
