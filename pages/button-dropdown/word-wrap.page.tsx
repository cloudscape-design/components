// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import ButtonDropdown from '~components/button-dropdown';

import styles from './styles.scss';

const dropdownItems = [
  {
    id: 'categoryId1',
    text: 'category long text',
    items: [
      {
        id: 'id0',
        text: 'a very long text that may overflow horizontally as in this example that is unnecessarily longer just to exemplify a long text',
      },
      { id: 'id1', text: 'option1', disabled: true },
      { id: 'id2', text: 'option2' },
      { id: 'id3', text: 'option3', disabled: true },
    ],
  },
  {
    id: 'categoryId2',
    text: 'category long no spaces',
    disabled: false,
    items: [
      {
        id: 'id5',
        text: 'AVeryLongWordThatMayOverflowHorizontallyAsInThisExampleThatIsUnnecessarilyLongerJustToExemplifyALongWord',
      },
      { id: 'id6', text: 'option4' },
    ],
  },
  {
    id: 'categoryId3',
    text: 'disabled category',
    disabled: true,
    items: [
      { id: 'id7', text: 'option7' },
      { id: 'id8', text: 'option8' },
    ],
  },
  {
    id: 'id9',
    text: 'option9',
    disabled: true,
  },
  {
    id: 'id10',
    text: 'option10',
  },
];

export default function ButtonDropdownScenario() {
  return (
    <div className={styles.container}>
      <article>
        <h1>Text wrapping in expandable dropdowns</h1>
        <div className={styles['restricting-container']}>
          <div className={styles['positioning-container']}>
            <ButtonDropdown expandableGroups={true} items={dropdownItems}>
              Dropdown items
            </ButtonDropdown>
          </div>
        </div>
      </article>
    </div>
  );
}
