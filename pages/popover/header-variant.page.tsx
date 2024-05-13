// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import Popover, { PopoverProps } from '~components/popover';
import { Button, Link, SpaceBetween } from '~components';

export default function () {
  const popoverRef = useRef<PopoverProps.Ref>(null);

  return (
    <article>
      <h1>Popover header variant</h1>
      <ScreenshotArea>
        <Popover
          data-testid="popover-without-title"
          size="medium"
          position="bottom"
          ref={popoverRef}
          content={
            <SpaceBetween size="m">
              <Button
                onClick={() => {
                  popoverRef.current?.dismissPopover();
                  popoverRef.current?.focusTrigger();
                }}
              >
                Close Popover and focus trigger
              </Button>

              <Link
                href="#/light/popover/header-variant"
                onFollow={() => {
                  popoverRef.current?.dismissPopover();
                }}
              >
                navigate, close popover and dont focus trigger
              </Link>

              <Link href="#/light/popover/header-variant">navigate and dont close popover</Link>
            </SpaceBetween>
          }
          dismissAriaLabel="Close"
          fixedWidth={true}
        >
          Open popover
        </Popover>
      </ScreenshotArea>
    </article>
  );
}
