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
      <h1>ButtonDropdown in a scrollable container</h1>
      <div className={clsx(styles['overflow-container'], styles.scroll)} id="scrollable-container">
        <div />
        <div id="inner" className={styles['inner-container']}>
          <ButtonDropdown id="ButtonDropdown" items={buttonDropdownItems}>
            Dropdown items
          </ButtonDropdown>
        </div>
        <div />
      </div>
    </ScreenshotArea>
  );
}
