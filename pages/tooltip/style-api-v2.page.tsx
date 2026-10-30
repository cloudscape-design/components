// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import { Button, Tooltip } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

export default function () {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <SimplePage title="Tooltip - Style API v2" screenshotArea={{}}>
      <br />
      <div
        ref={triggerRef}
        style={{ display: 'inline-block' }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Button
          variant="icon"
          iconName="copy"
          ariaLabel="Copy"
          nativeButtonAttributes={{
            'aria-describedby': 'copy-description',
            onFocus: () => setShowTooltip(true),
            onBlur: () => setShowTooltip(false),
          }}
        />
        <span id="copy-description" hidden={true}>
          ARN Copied
        </span>
        {showTooltip && (
          <Tooltip
            content="ARN Copied"
            getTrack={() => triggerRef.current}
            onEscape={() => setShowTooltip(false)}
            {...{ styleClassNames: { container: styles['tooltip-info'], arrow: styles['tooltip-info-arrow'] } }}
          />
        )}
      </div>
    </SimplePage>
  );
}
