// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalIcon from '../../icon/internal';
import Dropdown from '../../internal/components/dropdown';
import useHiddenDescription from '../../internal/hooks/use-hidden-description';
import { GeneratedAnalyticsMetadataButtonDropdownExpand } from '../analytics-metadata/interfaces.js';
import { CategoryProps } from '../interfaces';
import ItemsList from '../items-list';
import Tooltip from '../tooltip.js';
import { getMenuItemProps } from '../utils/menu-item';

import styles from './styles.css.js';

const ExpandableCategoryElement = ({
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
  expandToViewport,
  variant,
  position,
}: CategoryProps) => {
  const highlighted = isHighlighted(item);
  const expanded = isExpanded(item);
  const isKeyboardHighlighted = isKeyboardHighlight(item);
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (triggerRef.current && highlighted && !expanded) {
      triggerRef.current.focus();
    }
  }, [expanded, highlighted]);

  const onClick: React.MouseEventHandler = event => {
    if (!disabled) {
      event.preventDefault();
      onGroupToggle(item, event);
      triggerRef.current?.focus();
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
        [styles.disabled]: disabled,
        [styles.highlighted]: highlighted,
        [styles['is-focused']]: isKeyboardHighlighted,
      })}
      // We are using the roving tabindex technique to manage the focus state of the dropdown.
      // The current element will always have tabindex=0 which means that it can be tabbed to,
      // while all other items have tabindex=-1 so we can focus them when necessary.
      tabIndex={highlighted ? 0 : -1}
      ref={triggerRef}
      {...getMenuItemProps({ parent: true, expanded, disabled })}
      {...(isDisabledWithReason ? targetProps : {})}
      {...getAnalyticsMetadataAttribute(
        disabled
          ? {}
          : ({
              action: 'expand',
              detail: {
                position: position || '0',
                label: { root: 'self' },
                id: item.id || '',
                expanded: `${!expanded}`,
              },
            } as GeneratedAnalyticsMetadataButtonDropdownExpand)
      )}
    >
      {item.text}
      <span className={clsx(styles['expand-icon'], styles['expand-icon-right'])}>
        <InternalIcon name="caret-down-filled" />
      </span>
    </span>
  );

  let content: React.ReactNode;
  // If the category element is disabled, we do not render a dropdown.
  // Screenreaders are confused by additional sections
  if (isDisabledWithReason) {
    content = (
      <Tooltip content={item.disabledReason}>
        {trigger}
        {descriptionEl}
      </Tooltip>
    );
  } else if (disabled) {
    content = trigger;
  } else {
    content = (
      <Dropdown
        open={expanded}
        stretchWidth={false}
        interior={true}
        expandToViewport={expandToViewport}
        trigger={trigger}
      >
        {item.items && expanded && (
          <ul
            role="menu"
            aria-label={item.text}
            className={clsx(styles['items-list-container'], styles['in-dropdown'])}
          >
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
              variant={variant}
              position={position}
            />
          </ul>
        )}
      </Dropdown>
    );
  }

  return (
    <li
      className={clsx(styles.category, styles[`variant-${variant}`], styles.expandable, {
        [styles.expanded]: expanded,
        [styles.disabled]: disabled,
        [styles.highlighted]: highlighted,
      })}
      role="presentation"
      data-testid={item.id}
      ref={ref}
      onClick={onClick}
      onMouseEnter={onHover}
      onTouchStart={onHover}
    >
      {content}
    </li>
  );
};

export default ExpandableCategoryElement;
