// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Icon from '~components/icon';
import Popover from '~components/popover';
import Token from '~components/token';

import { SimplePage } from '../app/templates';

const dot = (
  <Icon
    svg={
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
        <circle cx="8" cy="8" r="4" fill="#d13212" className="no-stroke" />
      </svg>
    }
  />
);

const longLabel = 'popover trigger will be very very long and keep going until it has to truncate';

export default function InlineLongPopoverPage() {
  return (
    <SimplePage title="Inline token with long popover trigger and label tag">
      <div style={{ maxInlineSize: 300 }}>
        <Token
          variant="inline"
          icon={dot}
          label={
            <Popover triggerType="text-inline" header={longLabel} content="Popover content" wrapTriggerText={false}>
              {longLabel}
            </Popover>
          }
          ariaLabel={longLabel}
          labelTag="label tag here"
          onDismiss={() => {}}
          dismissLabel="Remove token"
        />
      </div>
    </SimplePage>
  );
}
