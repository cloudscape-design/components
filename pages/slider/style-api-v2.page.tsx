// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { KeyValuePairs, Slider } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

const themed = { track: styles.track, range: styles.range, handle: styles.handle };
const disabled = {
  track: styles.track,
  range: clsx(styles.range, styles['range-muted']),
  handle: clsx(styles.handle, styles['handle-muted']),
};
const readOnly = {
  track: styles.track,
  range: styles.range,
  handle: clsx(styles.handle, styles['handle-readonly']),
};

export default function () {
  const [value, setValue] = useState(40);
  const shared = {
    value,
    onChange: ({ detail }: { detail: { value: number } }) => setValue(detail.value),
    min: 0,
    max: 100,
  };
  return (
    <SimplePage title="Slider - Style API v2" screenshotArea={{}}>
      <KeyValuePairs
        items={[
          {
            type: 'pair',
            label: 'With tick marks',
            value: (
              <Slider
                {...shared}
                ariaLabel="With tick marks"
                step={20}
                tickMarks={true}
                {...{ styleClassNames: themed }}
              />
            ),
          },
          {
            type: 'pair',
            label: 'Disabled',
            value: <Slider {...shared} ariaLabel="Disabled" disabled={true} {...{ styleClassNames: disabled }} />,
          },
          {
            type: 'pair',
            label: 'Read-only',
            value: <Slider {...shared} ariaLabel="Readonly" readOnly={true} {...{ styleClassNames: readOnly }} />,
          },
        ]}
      />
    </SimplePage>
  );
}
