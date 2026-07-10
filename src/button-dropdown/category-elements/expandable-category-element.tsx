// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { isThemeActive, Theme } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import Dropdown from '../../dropdown/internal';
import InternalIcon from '../../icon/internal';
import useHiddenDescription from '../../internal/hooks/use-hidden-description';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import {
  GeneratedAnalyticsMetadataButtonDropdownCollapse,
  GeneratedAnalyticsMetadataButtonDropdownExpand,
} from '../analytics-metadata/interfaces.js';
import { ButtonDropdownProps } from '../interfaces';
import { CategoryProps } from '../internal-interfaces';
import ItemsList from '../items-list';
import Tooltip from '../tooltip.js';
import { getMenuItemProps } from '../utils/menu-item';

import styles from './styles.css.js';

const ExpandableCategoryElement = ({
  index,
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
  renderItem,
  filteringText,
  filteringEnabled,
  menuId,
  filteringDescriptionId,
}: CategoryProps) => {
  const highlighted = isHighlighted(item);
  const expanded = isExpanded(item);
  const isKeyboardHighlighted = isKeyboardHighlight(item);
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (triggerRef.current && highlighted && !expanded && !filteringEnabled) {
      triggerRef.current.focus();
    }
  }, [expanded, highlighted, filteringEnabled]);

  const onClick: React.MouseEventHandler = event => {
    if (!disabled) {
      event.preventDefault();
      onGroupToggle(item, event);
      if (!filteringEnabled) {
        triggerRef.current?.focus();
      }
    }
  };

  const onMouseDown: React.MouseEventHandler = event => {
    // Ensure that focus remains on the filtering input at all times.
    if (filteringEnabled) {
      event.preventDefault();
    }
  };

  const onHover = () => {
    highlightItem(item);
  };

  const isVisualRefresh = useVisualRefresh();
  const isOneTheme = isThemeActive(Theme.OneTheme);

  const isDisabledWithReason = !!item.disabledReason && item.disabled;
  const { targetProps, descriptionEl } = useHiddenDescription(item.disabledReason);

  const groupProps: ButtonDropdownProps.GroupRenderItem = {
    index: index ?? 0,
    type: 'group',
    option: item as ButtonDropdownProps.ItemGroup,
    disabled: !!disabled,
    highlighted: !!highlighted,
    expanded: expanded,
    expandDirection: 'horizontal',
  };
  const renderResult = renderItem?.({ item: groupProps, filterText: filteringText }) ?? null;

  const trigger = item.text && (
    <span
      id={menuId && item.id ? `${menuId}-${item.id}` : undefined}
      className={clsx(styles.header, styles['expandable-header'], styles[`variant-${variant}`], {
        [styles.disabled]: disabled,
        [styles.highlighted]: highlighted,
        [styles['no-content-styling']]: !!renderResult,
        [styles['is-focused']]: isKeyboardHighlighted,
        [styles['visual-refresh']]: isVisualRefresh,
      })}
      // When filtering is enabled, we use aria-activedescendant on the filter input and provide
      // the `id` of the item to select it. When filtering is disabled, we are using the roving
      // tabindex technique to manage the focus state of the dropdown. The current element will
      // have tabindex=0 which means that it can be tabbed to, while all other items have
      // tabindex=-1 so we can focus them when necessary.
      tabIndex={filteringEnabled ? -1 : highlighted ? 0 : -1}
      ref={triggerRef}
      {...getMenuItemProps({ parent: true, expanded, disabled })}
      {...(isDisabledWithReason ? targetProps : {})}
      {...getAnalyticsMetadataAttribute(
        disabled
          ? {}
          : ({
              action: !expanded ? 'expand' : 'collapse',
              detail: {
                position: position || '0',
                label: { root: 'self' },
                id: item.id || '',
              },
            } as GeneratedAnalyticsMetadataButtonDropdownExpand | GeneratedAnalyticsMetadataButtonDropdownCollapse)
      )}
    >
      {renderResult ? (
        renderResult
      ) : (
        <>
          {(item.iconName || item.iconUrl || item.iconSvg) && (
            <span className={styles['icon-wrapper']}>
              <InternalIcon name={item.iconName} url={item.iconUrl} svg={item.iconSvg} alt={item.iconAlt} />
            </span>
          )}
          <span>{item.text}</span>
          <span className={clsx(styles['expand-icon'], styles['expand-icon-right'])}>
            <InternalIcon
              name={isOneTheme ? 'angle-down' : 'caret-down-filled'}
              size={isOneTheme ? 'x-small' : 'normal'}
            />
          </span>
        </>
      )}
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
        interior={true}
        hideBlockBorder={false}
        expandToViewport={expandToViewport}
        trigger={trigger}
        content={
          item.items && expanded ? (
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
                renderItem={renderItem}
                parentProps={groupProps}
                filteringText={filteringText}
                filteringEnabled={filteringEnabled}
                menuId={menuId}
                filteringDescriptionId={filteringDescriptionId}
              />
            </ul>
          ) : undefined
        }
      />
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
      onMouseDown={onMouseDown}
      onMouseEnter={onHover}
      onTouchStart={onHover}
    >
      {content}
    </li>
  );
};

export default ExpandableCategoryElement;
