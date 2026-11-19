// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { KeyValuePairs, ToggleButton } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

export default function () {
  const [pressed, setPressed] = useState(false);
  const [iconPressed, setIconPressed] = useState(true);
  return (
    <SimplePage title="ToggleButton - Style API v2" screenshotArea={{}}>
      <KeyValuePairs
        items={[
          {
            type: 'pair',
            label: 'Normal',
            value: (
              <ToggleButton
                iconName="star"
                pressedIconName="star-filled"
                pressed={pressed}
                onChange={({ detail }) => setPressed(detail.pressed)}
                {...{ styleClassNames: { root: clsx(styles.toggle, pressed && styles['toggle-pressed']) } }}
              >
                Favorite
              </ToggleButton>
            ),
          },
          {
            type: 'pair',
            label: 'Icon',
            value: (
              <ToggleButton
                variant="icon"
                iconName="star"
                pressedIconName="star-filled"
                ariaLabel="Favorite"
                pressed={iconPressed}
                onChange={({ detail }) => setIconPressed(detail.pressed)}
                {...{
                  styleClassNames: { root: clsx(styles['toggle-icon'], iconPressed && styles['toggle-icon-pressed']) },
                }}
              />
            ),
          },
        ]}
      />
    </SimplePage>
  );
}
