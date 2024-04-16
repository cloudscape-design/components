// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Dropdown from '~components/internal/components/dropdown';
import Button from '~components/button';

import ListContent from './list-content';

import styles from './styles.scss';

export default function DropdownScenario() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  return (
    <article>
      <h1>Positioning of greedy dropdowns</h1>
      <ul>
        <li>
          Scenario 1. Dropdown opens to the right. There is enough space to fit content on the right without wrapping
        </li>
        <li>Scenario 2. Dropdown opens to the left. Not enough space on the right. No need to wrap text.</li>
        <li>
          Scenario 3. Dropdown content is narrower than trigger. Therefore dropdown width is equal to trigger width.
        </li>
        <li>
          Scenario 4. Not enough space on both sides. However, more space available on the right. Wrapping is needed
        </li>
        <li>
          Scenario 5. Not enough space on both sides. However, more space available on the left. Wrapping is needed
        </li>
      </ul>
      <div className={styles.container}>
        <div id="topLeftDropDown" className={styles['dropdown-container']}>
          <Dropdown
            stretchWidth={false}
            trigger={
              <Button className="trigger" onClick={() => setOpen1(!open1)}>
                Scenario 1
              </Button>
            }
            open={open1}
            onDropdownClose={() => setOpen1(false)}
          >
            <ListContent n={10} withSpaces={true} repeat={12} />
          </Dropdown>
        </div>
      </div>
      <div className={styles.container}>
        <div id="topRightDropDown" className={styles['dropdown-container']} style={{ insetInlineStart: '80px' }}>
          <Dropdown
            stretchWidth={false}
            trigger={
              <Button className="trigger" onClick={() => setOpen2(!open2)}>
                Scenario 2
              </Button>
            }
            open={open2}
            onDropdownClose={() => setOpen2(false)}
          >
            <ListContent n={10} withSpaces={true} repeat={12} />
          </Dropdown>
        </div>
      </div>
      <div className={styles.container}>
        <div id="bottomLeftDropDown" className={styles['dropdown-container']} style={{ top: '170px' }}>
          <Dropdown
            stretchWidth={false}
            trigger={
              <Button className="trigger" onClick={() => setOpen3(!open3)}>
                Scenario 3
              </Button>
            }
            open={open3}
            onDropdownClose={() => setOpen3(false)}
          >
            <ListContent n={10} withSpaces={true} repeat={2} />
          </Dropdown>
        </div>
      </div>
      <div className={styles.container}>
        <div id="topMiddleDropDown" className={styles['dropdown-container']} style={{ insetInlineStart: '20px' }}>
          <Dropdown
            stretchWidth={false}
            trigger={
              <Button className="trigger" onClick={() => setOpen4(!open4)}>
                Scenario 4
              </Button>
            }
            open={open4}
            onDropdownClose={() => setOpen4(false)}
          >
            <ListContent n={10} withSpaces={true} repeat={22} />
          </Dropdown>
        </div>
      </div>
      <div className={styles.container}>
        <div
          id="bottomRightDropDown"
          className={styles['dropdown-container']}
          style={{ insetInlineStart: '80px', insetBlockStart: '170px' }}
        >
          <Dropdown
            stretchWidth={false}
            trigger={
              <Button className="trigger" onClick={() => setOpen5(!open5)}>
                Scenario 5
              </Button>
            }
            open={open5}
            onDropdownClose={() => setOpen5(false)}
          >
            <ListContent n={10} withSpaces={true} repeat={18} />
          </Dropdown>
        </div>
      </div>
    </article>
  );
}
