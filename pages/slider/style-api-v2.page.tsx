// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { KeyValuePairs, Slider, SliderProps } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

const styleClassNames = { root: styles.slider, track: styles.track, range: styles.range, handle: styles.handle };

export default function () {
  const [value, setValue] = useState(40);
  const slider = (props: Partial<SliderProps> & { ariaLabel: string }) => (
    <Slider
      value={value}
      onChange={({ detail }) => setValue(detail.value)}
      min={0}
      max={100}
      {...props}
      {...{ styleClassNames }}
    />
  );
  return (
    <SimplePage title="Slider - Style API v2" screenshotArea={{}}>
      <KeyValuePairs
        items={[
          {
            type: 'pair',
            label: 'With tick marks',
            value: slider({ ariaLabel: 'With tick marks', step: 20, tickMarks: true }),
          },
          { type: 'pair', label: 'Disabled', value: slider({ ariaLabel: 'Disabled', disabled: true }) },
          { type: 'pair', label: 'Read-only', value: slider({ ariaLabel: 'Read-only', readOnly: true }) },
        ]}
      />
    </SimplePage>
  );
}
