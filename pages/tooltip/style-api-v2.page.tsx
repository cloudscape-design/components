// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { Button, Tooltip } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

export default function () {
  const triggerRef = useRef<HTMLSpanElement>(null);
  return (
    <SimplePage title="Tooltip - Style API v2" screenshotArea={{}}>
      <br />
      <span ref={triggerRef}>
        <Button variant="icon" iconName="copy" />
        <Tooltip
          content="ARN Copied"
          getTrack={() => triggerRef.current}
          {...{ styleClassNames: { tooltip: styles['tooltip-inverted'] } }}
        />
      </span>
    </SimplePage>
  );
}
