// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import ButtonDropdown from '~components/button-dropdown';

import ScreenshotArea from '../utils/screenshot-area';

export default function ButtonDropdownPage() {
  return (
    <ScreenshotArea
      disableAnimations={true}
      style={{
        // extra space to include dropdown in the screenshot area
        paddingBlockEnd: 100,
      }}
    >
      <ButtonDropdown
        items={[
          {
            text: 'Launch instance from template',
            id: 'launch-instance-from-template',
          },
        ]}
        mainAction={{ text: 'Launch instance' }}
        variant="primary"
      />
    </ScreenshotArea>
  );
}
