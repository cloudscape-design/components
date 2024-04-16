// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import Dropdown from '~components/internal/components/dropdown';
import Button from '~components/button';

import ListContent from './list-content';

import styles from './styles.scss';

export default function DropdownScenario() {
  const [openParent5, setOpenParent5] = useState(false);
  const [openParent6, setOpenParent6] = useState(false);
  const [openChild5, setOpenChild5] = useState(false);
  const [openChild6, setOpenChild6] = useState(false);

  return (
    <article>
      <h1>Positioning of child dropdowns</h1>
      <ul>
        <li>Scenario 1. Not enough available space, fitting to the bottom-right</li>
        <li>Scenario 2. Not enough available space, fitting to the top-left</li>
      </ul>
      <div className={clsx(styles.container, styles['container-wide'])}>
        <div
          id="parentDropdown5"
          className={clsx(styles['dropdown-container'], styles.middle2)}
          style={{ insetInlineStart: '100px' }}
        >
          <Dropdown
            stretchWidth={false}
            trigger={
              <Button className="trigger" onClick={() => setOpenParent5(!openParent5)}>
                Scenario 5
              </Button>
            }
            open={openParent5}
            onDropdownClose={() => setOpenParent5(false)}
          >
            <ul className={styles.list}>
              <li id="childDropdown5">
                <Dropdown
                  interior={true}
                  stretchWidth={false}
                  trigger={
                    <div className="trigger" onClick={() => setOpenChild5(!openChild5)}>
                      Expandable trigger
                    </div>
                  }
                  open={openChild5}
                  onDropdownClose={() => setOpenChild5(false)}
                >
                  <ListContent n={5} withSpaces={true} repeat={18} />
                </Dropdown>
              </li>
            </ul>
          </Dropdown>
        </div>
      </div>
      <div className={clsx(styles.container, styles['container-wide'])}>
        <div
          id="parentDropdown6"
          className={styles['dropdown-container']}
          style={{ insetBlockStart: '170px', insetInlineStart: '190px' }}
        >
          <Dropdown
            stretchWidth={false}
            trigger={
              <Button className="trigger" onClick={() => setOpenParent6(!openParent6)}>
                Scenario 6
              </Button>
            }
            open={openParent6}
            onDropdownClose={() => setOpenParent6(false)}
          >
            <ul className={styles.list}>
              <li id="childDropdown6">
                <Dropdown
                  interior={true}
                  stretchWidth={false}
                  trigger={
                    <div className="trigger" onClick={() => setOpenChild6(!openChild6)}>
                      Expandable trigger
                    </div>
                  }
                  open={openChild6}
                  onDropdownClose={() => setOpenChild6(false)}
                >
                  <ListContent n={5} withSpaces={true} repeat={18} />
                </Dropdown>
              </li>
            </ul>
          </Dropdown>
        </div>
      </div>
    </article>
  );
}
