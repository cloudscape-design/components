// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CategoryProps } from '../interfaces';
import React from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import ItemsList from '../items-list';

const CategoryElement = ({
  item,
  onItemActivate,
  onGroupToggle,
  targetItem,
  isHighlighted,
  isKeyboardHighlight,
  isExpanded,
  isLast,
  highlightItem,
  disabled,
  variant,
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
      <ul className={clsx(styles['items-list-container'])} role="group" aria-label={item.text}>
        {item.items && (
          <ItemsList
            items={item.items}
            onItemActivate={onItemActivate}
            onGroupToggle={onGroupToggle}
            targetItem={targetItem}
            isHighlighted={isHighlighted}
            isKeyboardHighlight={isKeyboardHighlight}
            isExpanded={isExpanded}
            isLast={isLast}
            highlightItem={highlightItem}
            categoryDisabled={disabled}
            hasCategoryHeader={!!item.text}
            variant={variant}
          />
        )}
      </ul>
    </li>
  );
};

export default CategoryElement;
