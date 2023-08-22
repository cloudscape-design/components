// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';

import { MenuDropdownProps, ButtonTriggerProps } from './interfaces';
import { getBaseProps } from '../../base-component';
import { applyDisplayName } from '../../utils/apply-display-name';
import InternalButtonDropdown from '../../../button-dropdown/internal';
import InternalIcon from '../../../icon/internal';
import buttonDropdownStyles from '../../../button-dropdown/styles.css.js';
import styles from './styles.css.js';
import { CustomTriggerProps } from '../../../button-dropdown/interfaces';

export { MenuDropdownProps };

export const ButtonTrigger = React.forwardRef(
  (
    {
      testUtilsClass,
      iconName,
      iconUrl,
      iconAlt,
      iconSvg,
      badge,
      ariaLabel,
      offsetRight,
      disabled,
      expanded,
      children,
      onClick,
    }: ButtonTriggerProps,
    ref: React.Ref<any>
  ) => {
    const hasIcon = iconName || iconUrl || iconSvg;

    return (
      <button
        ref={ref}
        type="button"
        className={clsx(styles.button, styles[`offset-right-${offsetRight}`], testUtilsClass, {
          [styles.expanded]: expanded,
        })}
        aria-label={ariaLabel}
        aria-expanded={!!expanded}
        aria-haspopup={true}
        disabled={disabled}
        onClick={event => {
          event.preventDefault();
          onClick && onClick();
        }}
      >
        {hasIcon && (
          <InternalIcon
            className={styles.icon}
            name={iconName}
            url={iconUrl}
            alt={iconAlt}
            svg={iconSvg}
            badge={badge}
          />
        )}
        {children && <span className={styles.text}>{children}</span>}
        {children && (
          <InternalIcon
            name="caret-down-filled"
            className={expanded ? buttonDropdownStyles['rotate-up'] : buttonDropdownStyles['rotate-down']}
          />
        )}
      </button>
    );
  }
);

const MenuDropdown = ({
  iconName,
  iconUrl,
  iconAlt,
  iconSvg,
  badge,
  offsetRight,
  children,
  ...props
}: MenuDropdownProps) => {
  const baseProps = getBaseProps(props);

  const dropdownTrigger = ({
    triggerRef,
    ariaLabel,
    isOpen,
    testUtilsClass,
    disabled,
    onClick,
  }: CustomTriggerProps) => {
    return (
      <ButtonTrigger
        testUtilsClass={testUtilsClass}
        ref={triggerRef}
        disabled={disabled}
        expanded={isOpen}
        iconName={iconName}
        iconUrl={iconUrl}
        iconAlt={iconAlt}
        iconSvg={iconSvg}
        badge={badge}
        ariaLabel={ariaLabel}
        offsetRight={offsetRight}
        onClick={onClick}
      >
        {children}
      </ButtonTrigger>
    );
  };

  return (
    <InternalButtonDropdown
      {...baseProps}
      {...props}
      variant="navigation"
      customTriggerBuilder={dropdownTrigger}
      preferCenter={true}
    />
  );
};

applyDisplayName(MenuDropdown, 'MenuDropdown');
export default MenuDropdown;
