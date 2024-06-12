// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import Dropdown from '~components/internal/components/dropdown';
import Button from '~components/button';
import { useState } from 'react';
import ListContent from './list-content';

export default function DropdownScenario() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  return (
    <article>
      <h1>Dropdown tests</h1>
      <ul>
        <li>Dropdown should open next to the trigger</li>
        <li>
          Dropdown opens up or down depending on the size of the content and available space above and below the trigger
        </li>
        <li>
          Dropdown fires an <code>onDropdownClose</code> event a click outside of the fly-out content
        </li>
      </ul>
      <div id="smallDropDown">
        <Dropdown
          trigger={
            <Button className="trigger" onClick={() => setOpen1(!open1)}>
              dropdown trigger 1
            </Button>
          }
          open={open1}
          onDropdownClose={() => setOpen1(false)}
        >
          <ListContent n={10} />
        </Dropdown>
      </div>
      <div id="largeDropDown">
        <Dropdown
          trigger={
            <Button className="trigger" onClick={() => setOpen2(!open2)}>
              dropdown trigger 2
            </Button>
          }
          open={open2}
          onDropdownClose={() => setOpen2(false)}
          header={<div style={{ blockSize: '30px' }} />}
          footer={<div className="footer" style={{ blockSize: '30px' }} />}
        >
          <ListContent n={100} />
        </Dropdown>
      </div>

      <div style={{ blockSize: '400px' }} />
      <div id="largeDropUp">
        <Dropdown
          trigger={
            <Button className="trigger" onClick={() => setOpen3(!open3)}>
              dropdown trigger 3
            </Button>
          }
          open={open3}
          onDropdownClose={() => setOpen3(false)}
        >
          <ListContent n={10} />
        </Dropdown>
      </div>

      <div style={{ blockSize: '400px' }} />
    </article>
  );
}
