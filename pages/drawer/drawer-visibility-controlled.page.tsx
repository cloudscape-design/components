// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useRef, useState } from 'react';

import { Button, Checkbox, Header, SpaceBetween } from '~components';
import Drawer from '~components/drawer/next';

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
  const triggerRef = useRef<{ focus: () => void }>(null);
  const drawerWrapperRef = useRef<HTMLDivElement>(null);
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
          ref={triggerRef}
          onClick={() => {
            setOpen(true);
            drawerWrapperRef.current?.focus();
          }}
        >
          Open drawer
        </Button>
        <Drawer
          position="fixed"
          placement="end"
          backdrop={backdrop}
          closeAction={{ ariaLabel: 'Close' }}
          open={isOpen}
          onClose={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
          header={<Header variant="h3">Header</Header>}
        >
          <div style={{ width: 300 }}>Content</div>
        </Drawer>
      </SpaceBetween>
    </SimplePage>
  );
}
