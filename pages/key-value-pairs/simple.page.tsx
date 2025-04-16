// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Icon from '~components/icon';
import KeyValuePairs from '~components/key-value-pairs';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';

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
                  label: (
                    <SpaceBetween size={'xxs'} direction={'horizontal'} alignItems={'center'}>
                      <Icon key={'icon'} name={'status-info'} />
                      <div key={'label'}>Label for key</div>
                    </SpaceBetween>
                  ),
                  value: 'Info icon at the start',
                },
                {
                  label: (
                    <SpaceBetween size={'xxs'} direction={'horizontal'} alignItems={'center'}>
                      <div key={'label'}>Label for key</div>
                      <Icon key={'icon'} name={'external'} />
                    </SpaceBetween>
                  ),
                  value: 'External icon at the end',
                },
                {
                  label: (
                    <SpaceBetween size={'xxs'} direction={'horizontal'} alignItems={'center'}>
                      <div key={'label'}>Label for key</div>
                      <Icon key={'icon'} name={'external'} />
                    </SpaceBetween>
                  ),
                  value: 'External icon at the end with info link',
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
