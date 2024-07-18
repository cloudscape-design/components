// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import Dropdown from '~components/internal/components/dropdown';

import ScreenshotArea from '../utils/screenshot-area';
import styles from './fixed-container.scss';
import ListContent from './list-content';

export default function () {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add(styles.bodyScrollOverride);
    return () => {
      document.documentElement.classList.remove(styles.bodyScrollOverride);
    };
  }, []);

  return (
    <>
      <h1>Select inside fixed container</h1>
      <ScreenshotArea>
        <div className={styles.fixedHeader} id="fixedDropdown">
          Fixed header
          <Dropdown
            trigger={
              <button className="trigger" onClick={() => setOpen(wasOpen => !wasOpen)}>
                Open dropdown
              </button>
            }
            open={open}
            onDropdownClose={() => setOpen(false)}
          >
            <ListContent n={5} />
          </Dropdown>
        </div>
        <div className={styles.placeholder}>An extra element to enable page scroll</div>
      </ScreenshotArea>
    </>
  );
}
