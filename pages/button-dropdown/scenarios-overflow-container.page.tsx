// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import clsx from 'clsx';

import ButtonDropdown from '~components/button-dropdown';

import ScreenshotArea from '../utils/screenshot-area';
import buttonDropdownItems from './utils/button-dropdown-items';

import styles from './styles.scss';

export default function ButtonDropdownScenario() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <h1>ButtonDropdown expandToViewport in overflow: !visible containers</h1>
      <div className={styles['layout-wrapper']}>
        <div className={clsx(styles['overflow-container'], styles.scroll)} id="scroll-container">
          <div>Scroll</div>
          <div className={styles['inner-container']}>
            <ButtonDropdown
              id="button-dropdown-scroll"
              expandToViewport={true}
              expandableGroups={true}
              items={buttonDropdownItems}
            >
              Dropdown items
            </ButtonDropdown>
          </div>
          <div />
        </div>
        <div className={clsx(styles['overflow-container'], styles.hidden)} id="hidden-container">
          <div>Hidden</div>
          <div className={styles['inner-container']}>
            <ButtonDropdown
              id="button-dropdown-hidden"
              expandToViewport={true}
              expandableGroups={true}
              items={buttonDropdownItems}
            >
              Dropdown items
            </ButtonDropdown>
          </div>
          <div />
        </div>
        <div className={clsx(styles['overflow-container'], styles.auto)} id="auto-container">
          <div>Auto</div>
          <div className={styles['inner-container']}>
            <ButtonDropdown
              id="button-dropdown-auto"
              expandToViewport={true}
              expandableGroups={true}
              items={buttonDropdownItems}
            >
              Dropdown items
            </ButtonDropdown>
          </div>
          <div />
        </div>
      </div>
    </ScreenshotArea>
  );
}
