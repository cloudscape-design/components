// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';

import { Button, SpaceBetween } from '~components';
import Drawer from '~components/drawer/next';

import { SimplePage } from '../app/templates';

const accentColor = '#6237a7';

export default function () {
  const triggerRef = useRef<{ focus: () => void }>(null);
  const drawerWrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
  return (
    <SimplePage
      title="Drawer visibility: controlled"
      subtitle="This page demonstrates accessible dynamic drawer visibility in controlled mode."
      i18n={{}}
      screenshotArea={{}}
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

        <div
          ref={drawerWrapperRef}
          style={{ padding: 2, background: accentColor }}
          tabIndex={-1}
          role="region"
          aria-label="Drawer"
        >
          <Drawer
            header="Header"
            closeAction={{ ariaLabel: 'Close' }}
            open={isOpen}
            onClose={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
          >
            Content
          </Drawer>
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
