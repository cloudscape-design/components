// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import Dropdown from '~components/internal/components/dropdown';
import Button from '~components/button';

import ListContent from './list-content';

import styles from './styles.scss';

export default function DropdownScenario() {
  const [openParent1, setOpenParent1] = useState(false);
  const [openParent2, setOpenParent2] = useState(false);
  const [openParent3, setOpenParent3] = useState(false);
  const [openParent4, setOpenParent4] = useState(false);

  const [openChild1, setOpenChild1] = useState(false);
  const [openChild2, setOpenChild2] = useState(false);
  const [openChild3, setOpenChild3] = useState(false);
  const [openChild4, setOpenChild4] = useState(false);

  return (
    <article>
      <h1>Positioning of greedy dropdowns</h1>
      <ul>
        <li>Scenario 1. Available space to the bottom-right </li>
        <li>Scenario 2. Available space to the bottom-left </li>
        <li>Scenario 3. Available space to the top-right </li>
        <li>Scenario 4. Available space to the top-left</li>
      </ul>
      <div className={clsx(styles.container, styles['container-wide'])}>
        <div id="parentDropdown1" className={styles['dropdown-container']}>
          <Dropdown
            stretchWidth={false}
            trigger={
              <Button className="trigger" onClick={() => setOpenParent1(!openParent1)}>
                Scenario 1
              </Button>
            }
            open={openParent1}
            onDropdownClose={() => setOpenParent1(false)}
          >
            <ul className={styles.list}>
              <li id="childDropdown1">
                <Dropdown
                  interior={true}
                  stretchWidth={false}
                  trigger={
                    <div className="trigger" onClick={() => setOpenChild1(!openChild1)}>
                      Expandable trigger
                    </div>
                  }
                  open={openChild1}
                  onDropdownClose={() => setOpenChild1(false)}
                >
                  <ListContent n={5} withSpaces={true} repeat={8} />
                </Dropdown>
              </li>
            </ul>
          </Dropdown>
        </div>
      </div>
      <div className={clsx(styles.container, styles['container-wide'])}>
        <div id="parentDropdown2" className={styles['dropdown-container']} style={{ insetInlineStart: '270px' }}>
          <Dropdown
            stretchWidth={false}
            trigger={
              <Button className="trigger" onClick={() => setOpenParent2(!openParent2)}>
                Scenario 2
              </Button>
            }
            open={openParent2}
            onDropdownClose={() => setOpenParent2(false)}
          >
            <ul className={styles.list} style={{ overflowY: 'auto', blockSize: '100px' }}>
              <li id="childDropdown2">
                <Dropdown
                  interior={true}
                  stretchWidth={false}
                  trigger={
                    <div className="trigger" onClick={() => setOpenChild2(!openChild2)}>
                      Expandable trigger
                    </div>
                  }
                  open={openChild2}
                  onDropdownClose={() => setOpenChild2(false)}
                >
                  <ListContent n={5} withSpaces={true} repeat={8} />
                </Dropdown>
              </li>
            </ul>
          </Dropdown>
        </div>
      </div>
      <div className={clsx(styles.container, styles['container-wide'])}>
        <div id="parentDropdown3" className={styles['dropdown-container']} style={{ top: '170px' }}>
          <Dropdown
            stretchWidth={false}
            trigger={
              <Button className="trigger" onClick={() => setOpenParent3(!openParent3)}>
                Scenario 3
              </Button>
            }
            open={openParent3}
            onDropdownClose={() => setOpenParent3(false)}
          >
            <ul className={styles.list}>
              <li id="childDropdown3">
                <Dropdown
                  interior={true}
                  stretchWidth={false}
                  trigger={
                    <div className="trigger" onClick={() => setOpenChild3(!openChild3)}>
                      Expandable trigger
                    </div>
                  }
                  open={openChild3}
                  onDropdownClose={() => setOpenChild3(false)}
                >
                  <ListContent n={5} withSpaces={true} repeat={8} />
                </Dropdown>
              </li>
            </ul>
          </Dropdown>
        </div>
      </div>
      <div className={clsx(styles.container, styles['container-wide'])}>
        <div
          id="parentDropdown4"
          className={styles['dropdown-container']}
          style={{ insetInlineStart: '270px', insetBlockStart: '170px' }}
        >
          <Dropdown
            stretchWidth={false}
            trigger={
              <Button className="trigger" onClick={() => setOpenParent4(!openParent4)}>
                Scenario 4
              </Button>
            }
            open={openParent4}
            onDropdownClose={() => setOpenParent4(false)}
          >
            <ul className={styles.list}>
              <li id="childDropdown4">
                <Dropdown
                  interior={true}
                  stretchWidth={false}
                  trigger={
                    <div className="trigger" onClick={() => setOpenChild4(!openChild4)}>
                      Expandable trigger
                    </div>
                  }
                  open={openChild4}
                  onDropdownClose={() => setOpenChild4(false)}
                >
                  <ListContent n={5} withSpaces={true} repeat={8} />
                </Dropdown>
              </li>
            </ul>
          </Dropdown>
        </div>
      </div>
    </article>
  );
}
