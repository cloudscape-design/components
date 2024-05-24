// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { ItemProps } from '../interfaces';
import { isCheckboxItem, isLinkItem } from '../utils/utils';
import styles from './styles.css.js';
import Tooltip from '../tooltip';

import { ButtonDropdownProps } from '../interfaces';
import { getItemTarget } from '../utils/utils';
import useHiddenDescription from '../utils/use-hidden-description';
import InternalIcon, { InternalIconProps } from '../../icon/internal';
import { useDropdownContext } from '../../internal/components/dropdown/context';
import { getMenuItemProps, getMenuItemCheckboxProps } from '../utils/menu-item';

const ItemElement = ({
  item,
  disabled,
  onItemActivate,
  highlighted,
  highlightItem,
  showDivider,
  hasCategoryHeader,
  isKeyboardHighlighted = false,
  variant = 'normal',
}: ItemProps) => {
  const isLink = isLinkItem(item);
  const onClick = (event: React.MouseEvent) => {
    // Stop propagation to parent node and handle event exclusively in here. This ensures
    // that no group will interfere with the default behavior of links
    event.stopPropagation();
    if (!isLink) {
      event.preventDefault();
    }
    if (!disabled) {
      onItemActivate(item, event);
    }
  };

  const onHover = () => {
    highlightItem(item);
  };

  return (
    <li
      className={clsx(styles['item-element'], styles[`variant-${variant}`], {
        [styles.highlighted]: highlighted,
        [styles.disabled]: disabled,
        [styles['has-category-header']]: hasCategoryHeader,
        [styles['show-divider']]: showDivider,
        [styles['is-focused']]: isKeyboardHighlighted,
      })}
      role="presentation"
      data-testid={item.id}
      data-description={item.description}
      onClick={onClick}
      onMouseEnter={onHover}
      onTouchStart={onHover}
    >
      <MenuItem item={item} disabled={disabled} highlighted={highlighted} />
    </li>
  );
};

export type InternalItemProps = ButtonDropdownProps.Item & {
  badge?: boolean;
};

export type InternalCheckboxItemProps = ButtonDropdownProps.CheckboxItem & {
  badge?: boolean;
};

interface MenuItemProps {
  item: InternalItemProps | InternalCheckboxItemProps;
  disabled: boolean;
  highlighted: boolean;
}

function MenuItem({ item, disabled, highlighted }: MenuItemProps) {
  const menuItemRef = useRef<(HTMLSpanElement & HTMLAnchorElement) | null>(null);
  const isCheckbox = isCheckboxItem(item);

  useEffect(() => {
    if (highlighted && menuItemRef.current) {
      menuItemRef.current.focus();
    }
  }, [highlighted]);

  const isDisabledWithReason = disabled && item.disabledReason;
  const { targetProps, descriptionEl } = useHiddenDescription(item.disabledReason);
  const menuItemProps: React.HTMLAttributes<HTMLSpanElement & HTMLAnchorElement> = {
    className: styles['menu-item'],
    lang: item.lang,
    ref: menuItemRef,
    // We are using the roving tabindex technique to manage the focus state of the dropdown.
    // The current element will always have tabindex=0 which means that it can be tabbed to,
    // while all other items have tabindex=-1 so we can focus them when necessary.
    tabIndex: highlighted ? 0 : -1,
    ...(isCheckbox ? getMenuItemCheckboxProps({ disabled, checked: item.checked }) : getMenuItemProps({ disabled })),
    ...(isDisabledWithReason ? targetProps : {}),
  };

  const menuItem = isLinkItem(item) ? (
    <a
      {...menuItemProps}
      href={!disabled ? item.href : undefined}
      target={getItemTarget(item)}
      rel={item.external ? 'noopener noreferrer' : undefined}
    >
      <MenuItemContent item={item} disabled={disabled} />
    </a>
  ) : (
    <span {...menuItemProps}>
      <MenuItemContent item={item} disabled={disabled} />
    </span>
  );

  const { position } = useDropdownContext();
  const tooltipPosition = position === 'bottom-left' || position === 'top-left' ? 'left' : 'right';
  return isDisabledWithReason ? (
    <Tooltip content={item.disabledReason} position={tooltipPosition}>
      {menuItem}
      {descriptionEl}
    </Tooltip>
  ) : (
    menuItem
  );
}

const MenuItemContent = ({
  item,
  disabled,
}: {
  item: InternalItemProps | InternalCheckboxItemProps;
  disabled: boolean;
}) => {
  const hasIcon = !!(item.iconName || item.iconUrl || item.iconSvg);
  const hasExternal = isLinkItem(item) && item.external;
  const isCheckbox = isCheckboxItem(item);
  return (
    <>
      {isCheckbox && <MenuItemCheckmark checked={item.checked} disabled={disabled} />}
      {hasIcon && (
        <MenuItemIcon
          name={item.iconName}
          url={item.iconUrl}
          svg={item.iconSvg}
          alt={item.iconAlt}
          badge={item.badge}
        />
      )}
      {item.text}
      {hasExternal && <ExternalIcon disabled={disabled} ariaLabel={item.externalIconAriaLabel} />}
    </>
  );
};

const MenuItemIcon = (props: InternalIconProps) => (
  <span className={styles.icon}>
    <InternalIcon {...props} />
  </span>
);

// Toggle has aria-hidden set because it's just used as a graphical element,
// a11y attributes for the checkmark are communicated through the role and aria-checked state
// of the menu element item.
const MenuItemCheckmark = ({ disabled, checked }: { disabled: boolean; checked: boolean }) => {
  const checkmark = <InternalIcon variant={disabled ? 'disabled' : 'normal'} name="check" />;
  return (
    <span
      className={clsx(styles.icon, styles.checkmark, { [styles.disabled]: disabled })}
      aria-hidden="true"
      style={{ visibility: checked ? 'visible' : 'hidden' }}
    >
      {checkmark}
    </span>
  );
};

const ExternalIcon = ({ disabled, ariaLabel }: { disabled: boolean; ariaLabel?: string }) => {
  const icon = <InternalIcon variant={disabled ? 'disabled' : 'normal'} name="external" />;
  return (
    <span className={styles['external-icon']} role={ariaLabel ? 'img' : undefined} aria-label={ariaLabel}>
      {icon}
    </span>
  );
};

export default ItemElement;
