// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef, forwardRef } from 'react';
import { getBaseProps } from '../internal/base-component';
import { ButtonGroupProps, InternalButtonGroupProps } from './interfaces';
import { ButtonProps } from '../button/interfaces';
import SpaceBetween from '../space-between/internal';
import ItemElement from './item-element';
import styles from './styles.css.js';
import clsx from 'clsx';
import { ButtonDropdownProps } from '../button-dropdown/interfaces';

const InternalButtonGroup = forwardRef(
  (
    {
      variant,
      items = [],
      onItemClick,
      __internalRootRef = null,
      dropdownExpandToViewport,
      ...props
    }: InternalButtonGroupProps,
    ref: React.Ref<ButtonGroupProps.Ref>
  ) => {
    if (!variant) {
      throw new Error('Invariant violation: ButtonGroup variant is not set.');
    }

    const itemsRef = useRef<Record<string, ButtonProps.Ref | null>>({});
    const baseProps = getBaseProps(props);

    useImperativeHandle(ref, () => ({
      focus: id => {
        itemsRef.current[id]?.focus();
      },
    }));

    const onSetButtonRef = (
      item: ButtonGroupProps.IconButton | ButtonGroupProps.MenuDropdown,
      element: ButtonProps.Ref | null
    ) => {
      const isItemGroup = (item: ButtonDropdownProps.ItemOrGroup): item is ButtonDropdownProps.ItemGroup => {
        return 'items' in item;
      };

      const getAllIdsItemOrGroup = (item: ButtonDropdownProps.ItemOrGroup): string[] => {
        if (isItemGroup(item)) {
          const values = item.items.flatMap(getAllIdsItemOrGroup);
          if (typeof item.id !== 'undefined') {
            values.push(item.id);
          }

          return values;
        } else {
          return [item.id];
        }
      };

      const getAllIds = (item: ButtonGroupProps.IconButton | ButtonGroupProps.MenuDropdown) => {
        if (item.type === 'icon-button') {
          return [item.id];
        } else {
          const values = getAllIdsItemOrGroup(item);
          if (typeof item.id !== 'undefined') {
            values.push(item.id);
          }

          return values;
        }
      };

      getAllIds(item).forEach(id => {
        itemsRef.current[id] = element;
      });
    };

    return (
      <div {...baseProps} className={clsx(styles.root, baseProps.className)} ref={__internalRootRef}>
        <SpaceBetween direction="horizontal" size="xxs">
          {items.map((itemOrGroup, index) => {
            if (itemOrGroup.type === 'group') {
              return (
                <div key={itemOrGroup.text} role="group" aria-label={itemOrGroup.text} className={styles.group}>
                  {itemOrGroup.items.map(item => (
                    <ItemElement
                      key={item.id}
                      item={item}
                      onItemClick={onItemClick}
                      dropdownExpandToViewport={dropdownExpandToViewport}
                      ref={element => onSetButtonRef(item, element)}
                    />
                  ))}
                </div>
              );
            }
            return (
              <React.Fragment key={itemOrGroup.id}>
                {items[index - 1].type === 'group' && <div className={styles.divider} />}
                <ItemElement
                  item={itemOrGroup}
                  onItemClick={onItemClick}
                  dropdownExpandToViewport={dropdownExpandToViewport}
                  ref={element => onSetButtonRef(itemOrGroup, element)}
                />
              </React.Fragment>
            );
          })}
        </SpaceBetween>
      </div>
    );
  }
);

export default InternalButtonGroup;
