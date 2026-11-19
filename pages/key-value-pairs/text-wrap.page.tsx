// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import CopyToClipboard from '~components/copy-to-clipboard';
import KeyValuePairs from '~components/key-value-pairs';
import Link from '~components/link';
import ProgressBar from '~components/progress-bar';
import StatusIndicator from '~components/status-indicator';

import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  return (
    <article>
      <h1>Text wrapping example</h1>
      <ScreenshotArea>
        <h2>Key-value-pairs with a long description</h2>
        <div style={{ maxWidth: '600px' }}>
          <KeyValuePairs
            columns={3}
            items={[
              {
                label: 'Distribution ID',
                value:
                  'E1WG1ZNPRXT0D4E1WG1ZNPRXT0D4E1WG1ZNPRXT0D4E1WG1ZNPRXT0D4E1WG1ZNPRXT0D4E1WG1ZNPRXT0D4E1WG1ZNPRXT0D4E1WG1ZNPRXT0D4E1WG1ZNPRXT0D4E1WG1ZNPRXT0D4E1WG1ZNPRXT0D4E1WG1ZNPRXT0D4E1WG1ZNPRXT0D4',
                info: (
                  <Link variant="info" href="#">
                    Info
                  </Link>
                ),
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
                id: 'ssl-certificate-id',
                value: (
                  <ProgressBar
                    value={30}
                    additionalInfo="Additional information"
                    description="Progress bar description"
                    ariaLabelledby="ssl-certificate-id"
                  />
                ),
              },
              {
                label: 'Price class',
                value: 'Use only US, Canada, Europe',
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
        </div>
      </ScreenshotArea>
    </article>
  );
}
