// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { Button, SpaceBetween } from '~components';
import Drawer, { NextDrawerProps as DrawerProps } from '~components/drawer/next';

import { SimplePage } from '../app/templates';

const accentColor = '#6237a7';

// Note: in this demo the focus does not automatically move to the drawer or back to the trigger yet: this part will be implemented
// in the upcoming stages.

export default function () {
  const drawerRef = useRef<DrawerProps.Ref>(null);
  return (
    <SimplePage
      title="Drawer visibility: uncontrolled"
      subtitle="This page demonstrates accessible dynamic drawer visibility in uncontrolled mode."
      i18n={{}}
      screenshotArea={{}}
    >
      <SpaceBetween size="m">
        <Button onClick={() => drawerRef.current?.open()}>Open drawer</Button>

        <div style={{ padding: 2, background: accentColor }} tabIndex={-1} role="region" aria-label="Drawer">
          <Drawer ref={drawerRef} header="Header" closeAction={{ ariaLabel: 'Close' }} defaultOpen={false}>
            Content
          </Drawer>
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
