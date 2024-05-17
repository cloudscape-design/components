// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import KeyValuePairs from '~components/key-value-pairs';
import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  return (
    <article>
      <h1>KeyValuePairs for screenshot</h1>
      <ScreenshotArea>
        <KeyValuePairs
          columns={[
            {
              title: 'Title',
              items: [
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
      </ScreenshotArea>
    </article>
  );
}
