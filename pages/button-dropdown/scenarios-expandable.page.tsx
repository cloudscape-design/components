// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import styles from './styles.scss';
import ButtonDropdown from '~components/button-dropdown';
import ScreenshotArea from '../utils/screenshot-area';
import buttonDropdownItems, { largeGroupItems, nestedExpandableGroupItems } from './utils/button-dropdown-items';

export default function ButtonDropdownScenario() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <div className={styles.container}>
        <article>
          <h1>Expandable dropdown scenarios</h1>
          <div className={styles['wide-container']}>
            <div className={styles.row}>
              <ButtonDropdown expandableGroups={true} className="bd-top-left" items={buttonDropdownItems}>
                Dropdown items
              </ButtonDropdown>
              <ButtonDropdown expandableGroups={true} className="bd-top-right" items={buttonDropdownItems}>
                Dropdown items
              </ButtonDropdown>
            </div>
            <div className={styles.row}>
              <ButtonDropdown expandableGroups={true} className="bd-bottom-left" items={nestedExpandableGroupItems}>
                Dropdown items
              </ButtonDropdown>
              <ButtonDropdown expandableGroups={true} className="bd-bottom-right" items={largeGroupItems}>
                Dropdown items
              </ButtonDropdown>
            </div>
          </div>
        </article>
      </div>
    </ScreenshotArea>
  );
}
