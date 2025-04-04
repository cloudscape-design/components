// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import KeyValuePairs from '~components/key-value-pairs';
import Link from '~components/link';

import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  return (
    <article>
      <h1>Key-value pairs component</h1>
      <ScreenshotArea>
        <h2>Simple key-value-pairs</h2>
        <KeyValuePairs
          columns={1}
          items={[
            {
              type: 'group',
              title: 'Title',
              items: [
                {
                  label: 'Label for key',
                  value: 'Value',
                },
                {
                  label: 'Label for key',
                  value: 'Value',
                },
                {
                  label: 'Label for key',
                  value: 'Value',
                  iconName: 'status-info',
                },
                {
                  label: 'Label for key',
                  value: 'Value',
                  iconName: 'external',
                  iconAlign: 'end',
                },
                {
                  label: 'Label for key',
                  value: 'Value',
                  iconName: 'external',
                  iconAlign: 'end',
                  info: <Link>Info</Link>,
                },
              ],
            },
          ]}
        />
      </ScreenshotArea>
    </article>
  );
}
