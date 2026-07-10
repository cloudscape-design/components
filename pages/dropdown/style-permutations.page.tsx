// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Dropdown from '~components/dropdown';
import SpaceBetween from '~components/space-between';

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
            minWidth={400}
            content={<ListContent n={5} />}
            style={{
              dropdown: {
                background: 'light-dark(#edf4ff, #001a66)',
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
            minWidth={400}
            content={<ListContent n={5} />}
            style={{
              dropdown: {
                background: 'light-dark(#edfbff, #005566)',
                borderColor: 'light-dark(#408080, #66ccdd)',
                borderRadius: '0px',
                borderWidth: '2px',
              },
            }}
          />
        </section>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
