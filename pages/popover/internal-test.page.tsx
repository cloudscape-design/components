// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import range from 'lodash/range';

import InternalPopover from '~components/popover/internal';
import Select from '~components/select';

import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  return (
    <article>
      <h1>Internal popover features</h1>
      <ScreenshotArea>
        <InternalPopover
          id="popover"
          size="medium"
          position="left"
          header="Select inside the popover"
          content={
            <>
              Select dropdown can grow past the size of the popover
              <Select
                selectedOption={{}}
                onChange={() => {}}
                options={range(30).map((_: any, index: number) => ({
                  value: index + '',
                }))}
                ariaLabel="demo select"
                expandToViewport={true}
              />
            </>
          }
          dismissAriaLabel="Close"
        >
          Open popover
        </InternalPopover>
      </ScreenshotArea>
    </article>
  );
}
