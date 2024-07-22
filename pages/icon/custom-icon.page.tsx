// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Icon from '~components/icon';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';
import icon from './custom-icon.png';

const sizes = ['small', 'normal', 'big', 'large'] as const;

export default function IconScenario() {
  return (
    <ScreenshotArea>
      <h1>Custom icons</h1>
      <SpaceBetween direction="horizontal" size="s">
        {sizes.map(size => (
          <Icon key={size} url={icon} alt="custom icon" size={size} />
        ))}
      </SpaceBetween>
    </ScreenshotArea>
  );
}
