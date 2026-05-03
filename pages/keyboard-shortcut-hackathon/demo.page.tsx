// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Header, SpaceBetween, Toggle } from '~components';

import CustomAppLayout from './app-layout';
import UnifiedSettings from './unified-settings';

export default function Demo() {
  const [hideHeader, setHideHeader] = useState(false);
  return (
    <CustomAppLayout
      header={
        <SpaceBetween size="m">
          <Header
            variant="h1"
            description="Manage settings for the current user. These settings do not apply to other IAM users or accounts."
          >
            Unified settings
          </Header>

          <Toggle
            onChange={() => {
              document.body.setAttribute('data-hide-header', `${!hideHeader}`);
              setHideHeader(!hideHeader);
            }}
            checked={hideHeader}
          >
            Hide header
          </Toggle>
        </SpaceBetween>
      }
    >
      <UnifiedSettings />
    </CustomAppLayout>
  );
}
