// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import Popover from '~components/popover';

export default function () {
  return (
    <article>
      <h1>Popover header variant</h1>
      <ScreenshotArea>
        <Popover
          data-testid="popover-without-title"
          size="medium"
          position="bottom"
          content={
            <>
              Enabling continuous backup failed, because of the following error: Dummy Point
              dummyarn:backup:my-region-1:123456123456:recovery-point:continuous:nthcba123456ac4321bd0af/db/system-cl0ud5cape,
              is in state FAILED, and can not be updated.
            </>
          }
          dismissAriaLabel="Close"
          fixedWidth={true}
        >
          Open popover without header and fixed width
        </Popover>
      </ScreenshotArea>
    </article>
  );
}
