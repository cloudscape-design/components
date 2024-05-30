// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useImperativeHandle, useRef } from 'react';
import { getBaseProps } from '../internal/base-component';
import { ButtonGroupProps, InternalButtonGroupProps } from './interfaces';
import SpaceBetween from '../space-between/internal';
import ButtonDropdown from '../button-dropdown/internal';
import {
  InternalItem as ButtonDropdownInternalItem,
  InternalItemOrGroup as ButtonDropdownInternalItemOrGroup,
  ButtonDropdownProps,
} from '../button-dropdown/interfaces';
import { fireCancelableEvent } from '../internal/events';
import { ButtonProps } from '@cloudscape-design/components';
import ItemElement from './item-element';

const InternalButtonGroup = React.forwardRef(
  (
    { items = [], limit = 5, onItemClick, __internalRootRef = null, ...props }: InternalButtonGroupProps,
    ref: React.Ref<ButtonGroupProps.Ref>
  ) => {
    const itemsRef = useRef<Record<string, ButtonProps.Ref | null>>({});
    const baseProps = getBaseProps(props);
    const { visibleItems, collapsedItems } = splitItems(items, limit);

    useImperativeHandle(ref, () => ({
      focus: id => {
        itemsRef.current[id]?.focus();
      },
    }));

    const onSetButtonRef = (item: ButtonGroupProps.Item, element: ButtonProps.Ref | null) => {
      if (item.type !== 'button') {
        return;
      }

      itemsRef.current[item.id] = element;
    };

    const onClickHandler = (event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => {
      if (onItemClick) {
        fireCancelableEvent(onItemClick, { id: event.detail.id }, event);
      }
    };

    return (
      <div {...baseProps} ref={__internalRootRef}>
        <SpaceBetween direction="horizontal" size="xxs">
          {visibleItems.map((item, index) => (
            <ItemElement key={index} item={item} onItemClick={onItemClick} ref={el => onSetButtonRef(item, el)} />
          ))}
          {collapsedItems.length > 0 && (
            <ButtonDropdown
              variant="icon"
              mainAction={{ iconName: 'ellipsis', text: 'More' }}
              items={itemsToDropdownItems(collapsedItems)}
              onItemClick={(event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => onClickHandler(event)}
            />
          )}
        </SpaceBetween>
      </div>
    );
  }
);

function splitItems(items: readonly ButtonGroupProps.Item[], truncateThreshold: number) {
  truncateThreshold = Math.max(truncateThreshold, 0);
  const visibleItems: ButtonGroupProps.Item[] = [];
  const collapsedItems: ButtonGroupProps.Item[] = [];

  let itemIndex = 0;
  for (const item of items) {
    if (itemIndex < truncateThreshold) {
      visibleItems.push(item);
    } else {
      collapsedItems.push(item);
    }

    if (item.type !== 'divider') {
      itemIndex++;
    }
  }

  return { visibleItems, collapsedItems };
}

function itemsToDropdownItems(items: readonly ButtonGroupProps.Item[]) {
  const internalItems: ButtonDropdownInternalItemOrGroup[] = [];

  for (const item of items) {
    if (item.type === 'button') {
      const dropdownItem: ButtonDropdownInternalItem = {
        id: item.id,
        text: item.text,
        lang: item.lang,
        disabled: item.disabled,
        description: item.description,
        iconAlt: item.iconAlt,
        iconName: item.iconName,
        iconUrl: item.iconUrl,
        iconSvg: item.iconSvg,
      };

      internalItems.push(dropdownItem);
    }
  }

  return internalItems;
}

export default InternalButtonGroup;
