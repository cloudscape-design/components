// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { KeyValuePairs, Slider } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

const styleClassNames = { root: styles.slider, handle: styles.handle };

export default function () {
  const [value, setValue] = useState(40);
  return (
    <SimplePage title="Slider - Style API v2" screenshotArea={{}}>
      <KeyValuePairs
        items={[
          {
            type: 'pair',
            label: 'With tick marks',
            value: (
              <Slider
                value={value}
                onChange={({ detail }) => setValue(detail.value)}
                min={0}
                max={100}
                step={20}
                tickMarks={true}
                ariaLabel="With tick marks"
                {...{ styleClassNames }}
              />
            ),
          },
          {
            type: 'pair',
            label: 'Disabled',
            value: (
              <Slider
                value={value}
                onChange={({ detail }) => setValue(detail.value)}
                min={0}
                max={100}
                disabled={true}
                ariaLabel="Disabled"
                {...{ styleClassNames }}
              />
            ),
          },
          {
            type: 'pair',
            label: 'Read-only',
            value: (
              <Slider
                value={value}
                onChange={({ detail }) => setValue(detail.value)}
                min={0}
                max={100}
                readOnly={true}
                ariaLabel="Read-only"
                {...{ styleClassNames }}
              />
            ),
          },
        ]}
      />
    </SimplePage>
  );
}
