// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import Button from '~components/button';
import Dropdown from '~components/internal/components/dropdown';

import ListContent from './list-content';

import styles from './styles.scss';

export default function DropdownScenario() {
  const [openParent1, setOpenParent1] = useState(false);
  const [openParent2, setOpenParent2] = useState(false);
  const [openParent3, setOpenParent3] = useState(false);

  return (
    <article>
      <h1>Dropdown content - stretching</h1>
      <ul>
        <li>Scenario 1. Not enough available space, vertically fit the content and overflow to the bottom.</li>
        <li>Scenario 2. Not enough available space, vertically wrap the content and do not overflow.</li>
        <li>Scenario 3. Not enough available space, vertically and horizontally fit the content and overflow.</li>
      </ul>
      <div
        className={clsx(styles.container, styles['container-wide'], styles['container-overflow-visible'])}
        id={'container-1'}
      >
        <div
          id="dropdown1"
          className={clsx(styles['dropdown-container'], styles.middle2)}
          style={{ insetInlineStart: '100px', blockSize: '800px' }}
        >
          <Dropdown
            minWidth="trigger"
            stretchHeight={true}
            trigger={
              <Button className="trigger" onClick={() => setOpenParent1(!openParent1)}>
                Scenario 1
              </Button>
            }
            open={openParent1}
            onOutsideClick={() => setOpenParent1(false)}
            content={<ListContent n={15} withSpaces={true} repeat={20} />}
          />
        </div>
      </div>
      <div
        className={clsx(styles.container, styles['container-wide'], styles['container-overflow-y-visible'])}
        id={'container-2'}
      >
        <div id="dropdown2" className={styles['dropdown-container']} style={{ insetInlineStart: '100px' }}>
          <Dropdown
            minWidth="trigger"
            stretchHeight={false}
            trigger={
              <Button className="trigger" onClick={() => setOpenParent2(!openParent2)}>
                Scenario 2
              </Button>
            }
            open={openParent2}
            onOutsideClick={() => setOpenParent2(false)}
            content={<ListContent n={15} withSpaces={true} repeat={20} />}
          />
        </div>
      </div>
      <div
        className={clsx(styles.container, styles['container-wide'], styles['container-overflow-visible'])}
        id={'container-3'}
      >
        <div id="dropdown3" className={styles['dropdown-container']} style={{ insetInlineStart: '100px' }}>
          <Dropdown
            minWidth="trigger"
            maxWidth="trigger"
            stretchHeight={true}
            trigger={
              <Button className="trigger" onClick={() => setOpenParent3(!openParent3)}>
                Scenario 3
              </Button>
            }
            open={openParent3}
            onOutsideClick={() => setOpenParent3(false)}
            content={
              <div style={{ inlineSize: '400px' }}>
                <ListContent n={15} withSpaces={true} repeat={20} />
              </div>
            }
          />
        </div>
      </div>
    </article>
  );
}
