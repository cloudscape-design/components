// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';
import { getBaseProps } from '../internal/base-component';
import { ButtonGroupProps, InternalButtonGroupProps } from './interfaces';
import { isItemGroup, splitItems } from './utils';
import { ButtonProps } from '../button/interfaces';
import SpaceBetween from '../space-between/internal';
import ItemElement from './item-element';
import ItemDropdown from './item-dropdown';
import styles from './styles.css.js';

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
    const { visible, collapsed } = splitItems(items, limit);

    useImperativeHandle(ref, () => ({
      focus: id => {
        itemsRef.current[id]?.focus();
      },
    }));

    const onSetButtonRef = (item: ButtonGroupProps.Item, element: ButtonProps.Ref | null) => {
      itemsRef.current[item.id] = element;
    };

    return (
      <div {...baseProps} ref={__internalRootRef}>
        <SpaceBetween direction="horizontal" size="xxs">
          {visible.map((current, index) =>
            isItemGroup(current) && current.items.length > 0 ? (
              <>
                {current.items.map(item => (
                  <ItemElement
                    key={item.id}
                    item={item}
                    onItemClick={onItemClick}
                    ref={el => onSetButtonRef(current, el)}
                  />
                ))}
                {index < visible.length - 1 && <div className={styles.divider} />}
              </>
            ) : (
              <ItemElement
                key={current.id}
                item={current}
                onItemClick={onItemClick}
                ref={el => onSetButtonRef(current, el)}
              />
            )
          )}
          {collapsed.length > 0 && (
            <ItemDropdown
              items={collapsed}
              onItemClick={onItemClick}
              dropdownExpandToViewport={dropdownExpandToViewport}
            />
          )}
        </SpaceBetween>
      </div>
    );
  }
);

export default InternalButtonGroup;
