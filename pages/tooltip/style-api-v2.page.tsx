// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import { Button, Tooltip } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

export default function () {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <SimplePage title="Tooltip - Style API v2" screenshotArea={{}}>
      <br />
      <span
        ref={triggerRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <Button variant="icon" iconName="copy" ariaLabel="Copy" />
        {open && (
          <Tooltip
            content="ARN Copied"
            getTrack={() => triggerRef.current}
            onEscape={() => setOpen(false)}
            {...{ styleClassNames: { tooltip: styles['tooltip-inverted'] } }}
          />
        )}
      </span>
    </SimplePage>
  );
}
