// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';

import InternalIcon from '../../icon/internal';
import ItemsList from '../items-list';
import MobileExpandableGroup from '../mobile-expandable-group/mobile-expandable-group';
import { CategoryProps } from '../interfaces';
import Tooltip from '../tooltip.js';
import useHiddenDescription from '../utils/use-hidden-description.js';
import { getMenuItemProps } from '../utils/menu-item.js';

const MobileExpandableCategoryElement = ({
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
}: CategoryProps) => {
  const highlighted = isHighlighted(item);
  const expanded = isExpanded(item);
  const isKeyboardHighlighted = isKeyboardHighlight(item);
  const triggerRef = React.useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (triggerRef.current && highlighted && !expanded) {
      triggerRef.current.focus();
    }
  }, [expanded, highlighted]);

  const onClick = (e: React.MouseEvent) => {
    if (!disabled) {
      e.preventDefault();
      onGroupToggle(item, e);
    }
  };

  const onHover = () => {
    highlightItem(item);
  };

  const isDisabledWithReason = !!item.disabledReason && item.disabled;
  const { targetProps, descriptionEl } = useHiddenDescription(item.disabledReason);
  const trigger = item.text && (
    <span
      className={clsx(styles.header, styles['expandable-header'], styles[`variant-${variant}`], {
        [styles.highlighted]: highlighted,
        [styles['rolled-down']]: expanded,
        [styles.disabled]: disabled,
        [styles['is-focused']]: isKeyboardHighlighted,
      })}
      // We are using the roving tabindex technique to manage the focus state of the dropdown.
      // The current element will always have tabindex=0 which means that it can be tabbed to,
      // while all other items have tabindex=-1 so we can focus them when necessary.
      tabIndex={highlighted ? 0 : -1}
      ref={triggerRef}
      {...getMenuItemProps({ parent: true, disabled, expanded })}
      {...(isDisabledWithReason ? targetProps : {})}
    >
      {item.text}
      <span
        className={clsx(styles['expand-icon'], {
          [styles['expand-icon-up']]: expanded,
        })}
      >
        <InternalIcon name="caret-down-filled" />
      </span>
    </span>
  );

  let content: React.ReactNode;

  if (isDisabledWithReason) {
    content = (
      <>
        {descriptionEl}
        <Tooltip content={item.disabledReason}>{trigger}</Tooltip>
      </>
    );
  } else if (disabled) {
    content = trigger;
  } else {
    content = (
      <MobileExpandableGroup open={expanded} trigger={trigger}>
        {item.items && expanded && (
          <ul role="menu" aria-label={item.text} className={clsx(styles['items-list-container'])}>
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
              hasCategoryHeader={true}
              variant={variant}
            />
          </ul>
        )}
      </MobileExpandableGroup>
    );
  }

  return (
    <li
      className={clsx(styles.category, styles[`variant-${variant}`], styles.expandable, {
        [styles.expanded]: expanded,
        [styles.disabled]: disabled,
        [styles.highlighted]: highlighted || expanded,
        [styles.expandable]: true,
      })}
      role="presentation"
      onClick={onClick}
      onMouseEnter={onHover}
      onTouchStart={onHover}
      data-testid={item.id}
    >
      {content}
    </li>
  );
};

export default MobileExpandableCategoryElement;
