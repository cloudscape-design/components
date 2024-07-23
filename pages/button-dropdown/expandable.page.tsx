// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import SpaceBetween from '~components/space-between';

import styles from './styles.scss';

export const items: ButtonDropdownProps['items'] = [
  {
    id: 'category1',
    text: 'category1',
    items: [...Array(2)].map((_, index) => ({
      id: 'category1Subitem' + index,
      text: 'Sub item ' + index,
    })),
  },
  {
    id: 'category2',
    text: 'category2',
    items: [...Array(50)].map((_, index) => ({
      id: 'category2Subitem' + index,
      text: 'Cat 2 Sub item ' + index,
    })),
  },
  ...[...Array(10)].map((_, index) => ({
    id: 'item' + index,
    text: 'Item ' + index,
  })),
  {
    id: 'category3',
    text: 'category3',
    items: [...Array(50)].map((_, index) => ({
      id: 'category3Subitem' + index,
      text: 'Sub item ' + index,
    })),
  },
  {
    id: 'category4',
    text: 'category4',
    items: [{ id: 'category4Subitem', text: 'Sub item 4' }],
    disabled: true,
  },
  {
    id: 'item10',
    text: 'Item 10',
  },
];

export default function ButtonDropdownScenario() {
  const [expandToViewport, setExpandToViewport] = useState(false);
  const [expandableGroups, setExpandableGroups] = useState(true);
  return (
    <div className={styles.container}>
      <article>
        <h1>Expandable dropdown scenarios</h1>
        <SpaceBetween size="m" direction="horizontal">
          <label>
            <input
              id="expandToViewport"
              type="checkbox"
              checked={expandToViewport}
              onChange={e => setExpandToViewport(!!e.target.checked)}
            />{' '}
            expandToViewport
          </label>
          <label>
            <input
              id="expandableGroups"
              type="checkbox"
              checked={expandableGroups}
              onChange={e => setExpandableGroups(!!e.target.checked)}
            />{' '}
            expandableGroups
          </label>
        </SpaceBetween>

        <div className={styles['wide-container']}>
          <div className={styles.row}>
            <ButtonDropdown
              id="topLeftDropdown"
              expandToViewport={expandToViewport}
              expandableGroups={expandableGroups}
              className="bd-top-left"
              items={items}
            >
              Dropdown items 1
            </ButtonDropdown>
            <ButtonDropdown
              id="topRightDropdown"
              expandToViewport={expandToViewport}
              expandableGroups={expandableGroups}
              className="bd-top-right"
              items={items}
            >
              Dropdown items 2
            </ButtonDropdown>
          </div>
          <div className={styles.row}>
            <ButtonDropdown
              id="bottomLeftDropdown"
              expandToViewport={expandToViewport}
              expandableGroups={expandableGroups}
              className="bd-bottom-left"
              items={items}
            >
              Dropdown items 3
            </ButtonDropdown>
            <ButtonDropdown
              id="bottomRightDropdown"
              expandToViewport={expandToViewport}
              expandableGroups={expandableGroups}
              className="bd-bottom-right"
              items={items}
            >
              Dropdown items 4
            </ButtonDropdown>
          </div>
        </div>
      </article>
    </div>
  );
}
