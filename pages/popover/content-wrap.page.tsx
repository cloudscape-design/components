// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { StatusIndicator } from '~components';
import Popover from '~components/popover';

import { SimplePage } from '../app/templates';

const content =
  'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Vestibulumnecfelis erat. Nulla felis tortor, elementum non massa ac, auctor facilisis risus.';

export default function () {
  return (
    <SimplePage
      title="Popover content text wrapping"
      subtitle="Text content wrapping should be the same, no matter where the popover is rendered."
      screenshotArea={{}}
    >
      <Popover size="medium" content={content} data-testid="standalone">
        Standalone popover
      </Popover>

      <StatusIndicator type="warning" iconAriaLabel="warning">
        <Popover size="medium" content={content} data-testid="inside-status-indicator">
          Popover inside status indicator
        </Popover>
      </StatusIndicator>
    </SimplePage>
  );
}
