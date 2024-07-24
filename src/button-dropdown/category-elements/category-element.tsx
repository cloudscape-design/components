// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { CategoryProps } from '../interfaces';
import ItemsList from '../items-list';

import styles from './styles.css.js';

const CategoryElement = ({
  item,
  onItemActivate,
  onGroupToggle,
  targetItem,
  isHighlighted,
  isKeyboardHighlight,
  isExpanded,
  lastInDropdown,
  highlightItem,
  disabled,
  variant,
  position,
}: CategoryProps) => {
  // Hide the category title element from screen readers because it will be
  // provided as an ARIA label.
  return (
    <li
      className={clsx(styles.category, styles[`variant-${variant}`], disabled && styles.disabled)}
      role="presentation"
      aria-disabled={disabled ? 'true' : undefined}
    >
      {item.text && (
        <p className={clsx(styles.header, { [styles.disabled]: disabled })} aria-hidden="true">
          {item.text}
        </p>
      )}
      <ul className={styles['items-list-container']} role="group" aria-label={item.text}>
        {item.items && (
          <ItemsList
            items={item.items}
            onItemActivate={onItemActivate}
            onGroupToggle={onGroupToggle}
            targetItem={targetItem}
            isHighlighted={isHighlighted}
            isKeyboardHighlight={isKeyboardHighlight}
            isExpanded={isExpanded}
            lastInDropdown={lastInDropdown}
            highlightItem={highlightItem}
            categoryDisabled={disabled}
            hasCategoryHeader={!!item.text}
            variant={variant}
            position={position}
          />
        )}
      </ul>
    </li>
  );
};

export default CategoryElement;
