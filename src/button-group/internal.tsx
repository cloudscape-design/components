// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';
import { getBaseProps } from '../internal/base-component';
import { ButtonGroupProps, InternalButtonGroupProps } from './interfaces';
import SpaceBetween from '../space-between/internal';
import { ButtonProps } from '@cloudscape-design/components';
import ItemElement from './item-element';
import ItemsDropdown from './items-dropdown';

const InternalButtonGroup = React.forwardRef(
  (
    {
      items = [],
      limit = 5,
      onItemClick,
      __internalRootRef = null,
      dropdownExpandToViewport,
      ...props
    }: InternalButtonGroupProps,
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

    return (
      <div {...baseProps} ref={__internalRootRef}>
        <SpaceBetween direction="horizontal" size="xxs">
          {visibleItems.map((item, index) => (
            <ItemElement key={index} item={item} onItemClick={onItemClick} ref={el => onSetButtonRef(item, el)} />
          ))}
          {collapsedItems.length > 0 && (
            <ItemsDropdown
              items={collapsedItems}
              onItemClick={onItemClick}
              dropdownExpandToViewport={dropdownExpandToViewport}
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

export default InternalButtonGroup;
