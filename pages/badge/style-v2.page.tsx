// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Badge, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function StyleV2BadgePage() {
  return (
    <SimplePage title="Badge with Style API v2" screenshotArea={{}}>
      <SpaceBetween size="m" direction="horizontal">
        <Badge color="blue" classNames={{ root: styles['badge-pill'] }}>
          Pill shape
        </Badge>
        <Badge color="red" classNames={{ root: styles['badge-square'] }}>
          Error
        </Badge>
        <Badge color="blue" classNames={{ root: styles['badge-outline'] }}>
          Outline
        </Badge>
      </SpaceBetween>
    </SimplePage>
  );
}
