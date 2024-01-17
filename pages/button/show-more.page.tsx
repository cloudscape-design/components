// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Button from '~components/button';
import styles from './styles.scss';
import range from 'lodash/range';

const LIST_ID = 'expanded-list-id';

interface ListItem {
  index: number;
  label: string;
}

const defaultItems: ListItem[] = range(8).map(index => ({
  label: '' + index,
  index,
}));

export default function ButtonControlsScenario() {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleItems = isExpanded ? defaultItems : defaultItems.slice(0, 2);

  return (
    <article>
      <h1>Button controls another element</h1>
      <ul id={LIST_ID}>
        {visibleItems.map(({ label, index }) => (
          <li key={index} aria-setsize={defaultItems.length} aria-posinset={index + 1}>
            {label}
          </li>
        ))}
      </ul>
      <div className={styles.buttonWrapper}>
        <Button
          variant="inline-link"
          iconName={isExpanded ? 'treeview-collapse' : 'treeview-expand'}
          onClick={() => setIsExpanded(!isExpanded)}
          ariaExpanded={isExpanded}
          ariaControls={LIST_ID}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </Button>
      </div>
    </article>
  );
}
