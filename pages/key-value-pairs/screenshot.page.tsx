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
        <h2>Simple key-value-pairs</h2>
        <KeyValuePairs
          columns={1}
          items={[
            {
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
              ],
            },
          ]}
        />
      </ScreenshotArea>
    </article>
  );
}
