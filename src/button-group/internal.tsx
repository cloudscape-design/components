// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';
import { getBaseProps } from '../internal/base-component';
import { ButtonGroupProps, InternalButtonGroupProps } from './interfaces';
import { isItemGroup, splitItems } from './utils';
import { ButtonProps } from '../button/interfaces';
import SpaceBetween from '../space-between/internal';
import ItemElement from './item-element';
import MoreItems from './more-items';
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
    const { primary, secondary } = splitItems(items, limit);

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
          {primary.map((current, index) =>
            isItemGroup(current) && current.items.length > 0 ? (
              <>
                {current.items.map(item => (
                  <ItemElement
                    key={item.id}
                    item={item}
                    onItemClick={onItemClick}
                    ref={element => onSetButtonRef(current, element)}
                  />
                ))}
                {index < primary.length - 1 && <div className={styles.divider} />}
              </>
            ) : (
              <ItemElement
                key={current.id}
                item={current}
                onItemClick={onItemClick}
                ref={element => onSetButtonRef(current, element)}
              />
            )
          )}
          {secondary.length > 0 && (
            <MoreItems
              items={secondary}
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
