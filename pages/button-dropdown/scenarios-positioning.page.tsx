// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import ButtonDropdown from '~components/button-dropdown';

import ScreenshotArea from '../utils/screenshot-area';
import buttonDropdownItems from './utils/button-dropdown-items';

import styles from './styles.scss';

export default function ButtonDropdownScenario() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <div className={styles.container}>
        <article>
          <h1>Expandable dropdown scenarios</h1>
          <div className={styles['wide-container']}>
            <div className={styles.row}>
              <ButtonDropdown className="bd-top-left" items={buttonDropdownItems}>
                Dropdown items
              </ButtonDropdown>
              <ButtonDropdown className="bd-top-right" items={buttonDropdownItems}>
                Dropdown items
              </ButtonDropdown>
            </div>
            <div className={styles.row}>
              <ButtonDropdown className="bd-bottom-left" items={buttonDropdownItems}>
                Dropdown items
              </ButtonDropdown>
              <ButtonDropdown className="bd-bottom-right" items={buttonDropdownItems}>
                Dropdown items
              </ButtonDropdown>
            </div>
          </div>
        </article>
      </div>
    </ScreenshotArea>
  );
}
