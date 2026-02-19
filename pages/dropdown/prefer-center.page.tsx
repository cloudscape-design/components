// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import Button from '~components/button';
import Dropdown from '~components/internal/components/dropdown';

import ListContent from './list-content';

import styles from './styles.scss';

export default function DropdownScenario() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  return (
    <article>
      <h1>Center positioning of dropdowns</h1>
      <ul>
        <li>Scenario 1. Enough space to open in center.</li>
        <li>Scenario 2. Dropdown opens to the left. Not enough space on the right.</li>
        <li>Scenario 3. Dropdown opens to the right. Not enough space on the left.</li>
      </ul>

      <div className={clsx(styles.container, styles['container-wide'])}>
        <div id="leftDropdown" className={styles['dropdown-container']}>
          <Dropdown
            minWidth="trigger"
            preferredAlignment="center"
            trigger={
              <Button className="trigger" onClick={() => setOpen1(!open1)}>
                Scenario 1
              </Button>
            }
            open={open1}
            onOutsideClick={() => setOpen1(false)}
            content={<ListContent n={10} withSpaces={true} repeat={12} />}
          />
        </div>
      </div>
      <div className={clsx(styles.container, styles['container-wide'])}>
        <div id="centerDropdown" className={styles['dropdown-container']} style={{ insetInlineStart: '100px' }}>
          <Dropdown
            minWidth="trigger"
            preferredAlignment="center"
            trigger={
              <Button className="trigger" onClick={() => setOpen2(!open2)}>
                Scenario 2
              </Button>
            }
            open={open2}
            onOutsideClick={() => setOpen2(false)}
            content={<ListContent n={10} withSpaces={true} repeat={12} />}
          />
        </div>
      </div>
      <div className={clsx(styles.container, styles['container-wide'])}>
        <div id="rightDropdown" className={styles['dropdown-container']} style={{ insetInlineStart: '250px' }}>
          <Dropdown
            minWidth="trigger"
            preferredAlignment="center"
            trigger={
              <Button className="trigger" onClick={() => setOpen3(!open3)}>
                Scenario 3
              </Button>
            }
            open={open3}
            onOutsideClick={() => setOpen3(false)}
            content={<ListContent n={10} withSpaces={true} repeat={12} />}
          />
        </div>
      </div>
    </article>
  );
}
