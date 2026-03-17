// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Dropdown from '~components/dropdown/internal';
import SpaceBetween from '~components/space-between';

import { palette } from '../app/themes/style-api';
import ScreenshotArea from '../utils/screenshot-area';
import ListContent from './list-content';

export default function DropdownStylePermutations() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  return (
    <ScreenshotArea>
      <h1>Dropdown Style Permutations</h1>
      <SpaceBetween direction="vertical" size="xl">
        <section>
          <h2>Custom background, no border</h2>
          <Dropdown
            trigger={<Button onClick={() => setOpen1(!open1)}>Open dropdown</Button>}
            open={open1}
            onOutsideClick={() => setOpen1(false)}
            content={<ListContent n={5} />}
            style={{
              dropdown: {
                background: `light-dark(${palette.blue10}, ${palette.blue90})`,
                borderWidth: '0px',
              },
            }}
          />
        </section>

        <section>
          <h2>Custom background with styled border</h2>
          <Dropdown
            trigger={<Button onClick={() => setOpen2(!open2)}>Open dropdown</Button>}
            open={open2}
            onOutsideClick={() => setOpen2(false)}
            content={<ListContent n={5} />}
            style={{
              dropdown: {
                background: `light-dark(${palette.teal10}, ${palette.teal90})`,
                borderColor: `light-dark(${palette.teal60}, ${palette.teal40})`,
                borderRadius: '12px',
                borderWidth: '2px',
              },
            }}
          />
        </section>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
