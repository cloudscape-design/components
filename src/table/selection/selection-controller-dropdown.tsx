// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { ButtonDropdownProps } from '../../button-dropdown/interfaces';
import InternalButtonDropdown from '../../button-dropdown/internal';
import InternalIcon from '../../icon/internal';

import styles from './styles.css.js';

export interface SelectionControllerDropdownProps {
  items: ButtonDropdownProps.Items;
  onItemClick: (detail: ButtonDropdownProps.ItemClickDetails) => void;
  ariaLabel?: string;
  disabled?: boolean;
  sticky?: boolean;
}

export default function SelectionControllerDropdown({
  items,
  onItemClick,
  ariaLabel,
  disabled = false,
  sticky = false,
}: SelectionControllerDropdownProps) {
  return (
    <InternalButtonDropdown
      items={items}
      onItemClick={({ detail }) => onItemClick(detail)}
      ariaLabel={ariaLabel}
      disabled={disabled}
      variant="inline-icon"
      expandToViewport={true}
      expandableGroups={false}
      customTriggerBuilder={({ triggerRef, testUtilsClass, ariaExpanded, onClick, disabled: triggerDisabled }) => (
        <button
          ref={triggerRef as React.Ref<HTMLButtonElement>}
          className={clsx(styles['selection-controller-trigger'], testUtilsClass)}
          aria-label={ariaLabel}
          aria-expanded={ariaExpanded}
          aria-haspopup="menu"
          disabled={triggerDisabled}
          onClick={onClick}
          tabIndex={sticky ? -1 : undefined}
          type="button"
        >
          <InternalIcon name={'ellipsis'} />
        </button>
      )}
    />
  );
}
