// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useRef } from 'react';

import { Button, Checkbox, Header, SpaceBetween } from '~components';
import Drawer, { NextDrawerProps as DrawerProps } from '~components/drawer/next';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

// Note: in this demo the focus does not automatically move to the drawer or back to the trigger yet: this part will be implemented
// in the upcoming stages.

type PageContext = React.Context<
  AppContextType<{
    backdrop?: boolean;
  }>
>;

export default function () {
  const {
    urlParams: { backdrop = false },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const drawerRef = useRef<DrawerProps.Ref>(null);
  return (
    <SimplePage
      title="Drawer visibility: uncontrolled"
      subtitle="This page demonstrates accessible dynamic drawer visibility in uncontrolled mode."
      screenshotArea={{}}
      settings={
        <Checkbox checked={backdrop} onChange={({ detail }) => setUrlParams({ backdrop: detail.checked })}>
          Show backdrop
        </Checkbox>
      }
    >
      <SpaceBetween size="m">
        <Button onClick={() => drawerRef.current?.open()}>Open drawer</Button>
        <Drawer
          ref={drawerRef}
          position="fixed"
          placement="end"
          backdrop={backdrop}
          closeAction={{ ariaLabel: 'Close' }}
          defaultOpen={false}
          header={<Header variant="h3">Header</Header>}
        >
          <div style={{ width: 300 }}>Content</div>
        </Drawer>
      </SpaceBetween>
    </SimplePage>
  );
}
