// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';

import Button from '~components/button';
import Dropdown from '~components/internal/components/dropdown';

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
          Dropdown fires an <code>onOutsideClick</code> event a click outside of the fly-out content
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
          onOutsideClick={() => setOpen1(false)}
          content={<ListContent n={10} />}
        />
      </div>
      <div id="largeDropDown">
        <Dropdown
          trigger={
            <Button className="trigger" onClick={() => setOpen2(!open2)}>
              dropdown trigger 2
            </Button>
          }
          open={open2}
          onOutsideClick={() => setOpen2(false)}
          header={<div style={{ blockSize: '30px' }} />}
          footer={<div className="footer" style={{ blockSize: '30px' }} />}
          content={<ListContent n={100} />}
        />
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
          onOutsideClick={() => setOpen3(false)}
          content={<ListContent n={10} />}
        />
      </div>

      <div style={{ blockSize: '400px' }} />
    </article>
  );
}
