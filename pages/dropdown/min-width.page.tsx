// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';

import Dropdown from '~components/internal/components/dropdown';

import ListContent from './list-content';

export default function DropdownScenario() {
  const [open, setOpen] = useState(false);
  return (
    <article>
      <h1>Dropdown`s minWidth property test</h1>
      <ul>
        <li>
          Dropdown should have the width equal to <code>minWidth</code>, if the trigger is larger than it
        </li>
        <li>
          Dropdown should have the width equal to the trigger width, if it is is larger than the <code>minWidth</code>
        </li>
        <li>
          Use <code>minWidth=trigger</code> and <code>maxWidth=trigger</code> to match trigger width exactly.
        </li>
      </ul>
      <div id="minWidthDropdown">
        <Dropdown
          trigger={
            <div
              className="trigger"
              onClick={() => setOpen(!open)}
              style={{ border: 'solid black 1px', width: '100%' }}
            >
              dropdown trigger asdfasdf asdf asdf asdfas dfasdfasd
            </div>
          }
          open={open}
          onOutsideClick={() => setOpen(false)}
          minWidth={800}
          content={<ListContent n={10} />}
        />
      </div>
      <div style={{ blockSize: '400px' }} />
    </article>
  );
}
