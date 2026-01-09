// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import InternalIcon from '../../icon/internal';
import { ButtonDropdownProps, CategoryProps } from '../interfaces';
import ItemsList from '../items-list';

import styles from './styles.css.js';

const CategoryElement = ({
  item,
  index,
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
  renderItem,
}: CategoryProps) => {
  const groupProps: ButtonDropdownProps.ButtonDropdownGroupItem = {
    type: 'group',
    index: index ?? 0,
    option: item as ButtonDropdownProps.ItemGroup,
    disabled: !!disabled,
    highlighted: !!isHighlighted,
    expanded: true,
    expandDirection: 'vertical',
  };
  const renderResult = renderItem?.({ item: groupProps }) ?? null;

  // Hide the category title element from screen readers because it will be
  // provided as an ARIA label.
  return (
    <li
      className={clsx(styles.category, styles[`variant-${variant}`], disabled && styles.disabled)}
      role="presentation"
    >
      {item.text && (
        <p
          className={clsx(styles.header, renderResult && styles['no-content-styling'], { [styles.disabled]: disabled })}
          aria-hidden="true"
        >
          {renderResult ? (
            renderResult
          ) : (
            <span className={styles['header-content']}>
              {(item.iconName || item.iconUrl || item.iconSvg) && (
                <span className={styles['icon-wrapper']}>
                  <InternalIcon name={item.iconName} url={item.iconUrl} svg={item.iconSvg} alt={item.iconAlt} />
                </span>
              )}
              {item.text}
            </span>
          )}
        </p>
      )}
      <ul className={styles['items-list-container']} role="group" aria-label={item.text} aria-disabled={disabled}>
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
            renderItem={renderItem}
            parentProps={groupProps}
          />
        )}
      </ul>
    </li>
  );
};

export default CategoryElement;
