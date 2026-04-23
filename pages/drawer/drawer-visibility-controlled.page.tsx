// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useRef, useState } from 'react';

import { Button, Checkbox, Header, SpaceBetween } from '~components';
import Drawer, { NextDrawerProps as DrawerProps } from '~components/drawer/next';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

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
  const [isOpen, setOpen] = useState(false);
  return (
    <SimplePage
      title="Drawer visibility: controlled"
      subtitle="This page demonstrates accessible dynamic drawer visibility in controlled mode."
      screenshotArea={{}}
      settings={
        <Checkbox checked={backdrop} onChange={({ detail }) => setUrlParams({ backdrop: detail.checked })}>
          Show backdrop
        </Checkbox>
      }
    >
      <SpaceBetween size="m">
        <Button
          onClick={() => {
            setOpen(true);
            // When drawer is already open when the button is pressed - move the focus inside.
            drawerRef.current?.focus();
          }}
        >
          Open drawer
        </Button>
        <Drawer
          ref={drawerRef}
          position="fixed"
          placement="end"
          backdrop={backdrop}
          closeAction={{ ariaLabel: 'Close' }}
          open={isOpen}
          onClose={() => setOpen(false)}
          header={<Header variant="h3">Header</Header>}
        >
          <div style={{ width: 300 }}>Content</div>
        </Drawer>
      </SpaceBetween>
    </SimplePage>
  );
}
