// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { ButtonDropdownProps } from '../../button-dropdown/interfaces';
import InternalButtonDropdown from '../../button-dropdown/internal';
import InternalIcon from '../../icon/internal';
import { TableProps } from '../interfaces';

import styles from './styles.css.js';

type SelectionControllerItems = ReadonlyArray<
  TableProps.SelectionControllerItem | TableProps.SelectionControllerItemGroup
>;

export interface SelectionControllerDropdownProps {
  items: SelectionControllerItems;
  onItemClick: (detail: TableProps.SelectionControllerItemClickDetail) => void;
  ariaLabel?: string;
  disabled?: boolean;
  sticky?: boolean;
}

function hasKey<T extends object>(obj: T, key: keyof any): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function isItemGroup(
  item: TableProps.SelectionControllerItem | TableProps.SelectionControllerItemGroup
): item is TableProps.SelectionControllerItemGroup {
  return hasKey(item, 'items') && Array.isArray((item as TableProps.SelectionControllerItemGroup).items);
}

function mapItem(
  item: TableProps.SelectionControllerItem
): ButtonDropdownProps.Item | ButtonDropdownProps.CheckboxItem {
  if (item.itemType === 'checkbox') {
    return {
      id: item.id,
      text: item.text,
      itemType: 'checkbox',
      checked: item.checked ?? false,
      disabled: item.disabled,
      disabledReason: item.disabledReason,
      secondaryText: item.secondaryText,
      ariaLabel: item.ariaLabel,
      iconName: item.iconName as any,
      iconSvg: item.iconSvg,
    };
  }
  return {
    id: item.id,
    text: item.text,
    disabled: item.disabled,
    disabledReason: item.disabledReason,
    secondaryText: item.secondaryText,
    ariaLabel: item.ariaLabel,
    iconName: item.iconName as any,
    iconSvg: item.iconSvg,
  };
}

function mapItems(items: SelectionControllerItems): ButtonDropdownProps.Items {
  return items.map(item => {
    if (isItemGroup(item)) {
      return {
        text: item.text,
        disabled: item.disabled,
        items: item.items.map(mapItem),
      } as ButtonDropdownProps.ItemGroup;
    }
    return mapItem(item);
  });
}

export default function SelectionControllerDropdown({
  items,
  onItemClick,
  ariaLabel,
  disabled = false,
  sticky = false,
}: SelectionControllerDropdownProps) {
  const mappedItems = mapItems(items);

  return (
    <InternalButtonDropdown
      items={mappedItems}
      onItemClick={({ detail }) => onItemClick({ id: detail.id, checked: detail.checked })}
      ariaLabel={ariaLabel}
      disabled={disabled}
      variant="inline-icon"
      expandToViewport={true}
      expandableGroups={false}
      customTriggerBuilder={({
        triggerRef,
        testUtilsClass,
        ariaExpanded,
        onClick,
        // isOpen, ... we can use it if we want to display diff/t icon based on open state latr
        disabled: triggerDisabled,
      }) => (
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
