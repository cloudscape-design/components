// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import clsx from 'clsx';

import { isThemeActive, Theme } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalIcon from '../../icon/internal';
import useHiddenDescription from '../../internal/hooks/use-hidden-description';
import { GeneratedAnalyticsMetadataButtonDropdownExpand } from '../analytics-metadata/interfaces.js';
import { ButtonDropdownProps } from '../interfaces';
import { CategoryProps } from '../internal-interfaces';
import ItemsList from '../items-list';
import MobileExpandableGroup from '../mobile-expandable-group/mobile-expandable-group';
import StatusFooter from '../status-footer';
import Tooltip from '../tooltip.js';
import { getMenuItemProps } from '../utils/menu-item.js';
import { useExpandableGroupStatus } from './use-expandable-group-status';

import styles from './styles.css.js';

const MobileExpandableCategoryElement = ({
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
  variant,
  position,
  renderItem,
  filteringText,
  filteringEnabled,
  menuId,
  filteringDescriptionId,
  asyncLoadingProps,
  getExpandableItemsAsyncLoadingState,
  onGroupRecoveryClick,
}: CategoryProps) => {
  const highlighted = isHighlighted(item);
  const expanded = isExpanded(item);
  const isKeyboardHighlighted = isKeyboardHighlight(item);
  const triggerRef = React.useRef<HTMLSpanElement>(null);

  const {
    status: groupDropdownStatus,
    footerId,
    hasGroupItems,
  } = useExpandableGroupStatus({
    item,
    asyncLoadingProps,
    getExpandableItemsAsyncLoadingState,
    onGroupRecoveryClick,
    filteringEnabled,
    triggerRef,
  });

  useEffect(() => {
    if (triggerRef.current && highlighted && !expanded && !filteringEnabled) {
      triggerRef.current.focus();
    }
  }, [expanded, highlighted, filteringEnabled]);

  const onClick = (e: React.MouseEvent) => {
    if (!disabled) {
      e.preventDefault();
      onGroupToggle(item, e);
    }
  };

  const onHover = () => {
    highlightItem(item);
  };

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
    expandDirection: 'vertical',
  };
  const renderResult = renderItem?.({ item: groupProps, filterText: filteringText }) ?? null;

  const trigger = item.text && (
    <span
      id={menuId && item.id ? `${menuId}-${item.id}` : undefined}
      className={clsx(styles.header, styles['expandable-header'], styles[`variant-${variant}`], {
        [styles.highlighted]: highlighted,
        [styles['rolled-down']]: expanded,
        [styles['no-content-styling']]: !!renderResult,
        [styles.disabled]: disabled,
        [styles['is-focused']]: isKeyboardHighlighted,
      })}
      // When filtering is enabled, we use aria-activedescendant on the filter input and provide
      // the `id` of the item to select it. When filtering is disabled, we are using the roving
      // tabindex technique to manage the focus state of the dropdown. The current element will
      // have tabindex=0 which means that it can be tabbed to, while all other items have
      // tabindex=-1 so we can focus them when necessary.
      tabIndex={filteringEnabled ? -1 : highlighted ? 0 : -1}
      ref={triggerRef}
      {...getMenuItemProps({ parent: true, disabled, expanded })}
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
          <span
            className={clsx(styles['expand-icon'], {
              [styles['expand-icon-up']]: expanded,
            })}
          >
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
        {expanded && (hasGroupItems || groupDropdownStatus.content) && (
          <ul
            role="menu"
            aria-label={item.text}
            aria-describedby={groupDropdownStatus.content ? footerId : undefined}
            className={styles['items-list-container']}
          >
            {hasGroupItems ? (
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
                position={position}
                renderItem={renderItem}
                parentProps={groupProps}
                filteringText={filteringText}
                filteringEnabled={filteringEnabled}
                menuId={menuId}
                filteringDescriptionId={filteringDescriptionId}
              />
            ) : null}
            {groupDropdownStatus.content ? (
              // The group is inline in the main list, so every status (loading, error, empty,
              // finished) follows the items instead of being a sticky footer.
              <li role="presentation">
                <StatusFooter
                  content={groupDropdownStatus.content}
                  id={footerId}
                  hasItems={hasGroupItems}
                  scope="group"
                />
              </li>
            ) : null}
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
