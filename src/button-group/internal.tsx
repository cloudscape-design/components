// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { ButtonProps } from '../button/interfaces';
import { getBaseProps } from '../internal/base-component';
import InternalNavigableGroup from '../navigable-group/internal';
import { ButtonGroupProps, InternalButtonGroupProps } from './interfaces';
import ItemElement from './item-element.js';
import { getButtonGroupStyles } from './style';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

const InternalButtonGroup = forwardRef(
  (
    {
      items = [],
      onItemClick,
      onFilesChange,
      ariaLabel,
      dropdownExpandToViewport,
      style,
      __internalRootRef,
      ...props
    }: InternalButtonGroupProps,
    ref: React.Ref<ButtonGroupProps.Ref>
  ) => {
    const baseProps = getBaseProps(props);
    const itemsRef = useRef<Record<string, ButtonProps.Ref | null>>({});
    const [tooltip, setTooltip] = useState<null | { item: string; feedback: boolean }>(null);

    useImperativeHandle(ref, () => ({
      focus: id => {
        itemsRef.current[id]?.focus();
      },
    }));

    const stylePropertiesAndVariables = getButtonGroupStyles(style);
    return (
      <div
        {...baseProps}
        ref={__internalRootRef}
        className={clsx(styles.root, testUtilStyles['button-group'], baseProps.className)}
        role="toolbar"
        aria-label={ariaLabel}
        style={stylePropertiesAndVariables}
      >
        <InternalNavigableGroup loopFocus={true} getItemId={item => item.dataset.itemid!}>
          {items.map((itemOrGroup, index) => {
            const itemContent = (item: ButtonGroupProps.Item, position: string) => (
              <ItemElement
                key={item.id}
                item={item}
                dropdownExpandToViewport={dropdownExpandToViewport}
                tooltip={tooltip}
                setTooltip={setTooltip}
                onItemClick={onItemClick}
                onFilesChange={onFilesChange}
                ref={element => (itemsRef.current[item.id] = element)}
                position={position}
                style={style}
              />
            );

            const isGroupBefore = items[index - 1]?.type === 'group';
            const currentItem = items[index];
            const isGroupNow = currentItem?.type === 'group';
            const shouldAddDivider = isGroupBefore || (!isGroupBefore && isGroupNow && index !== 0);

            if (isGroupNow && currentItem.items.length === 0) {
              warnOnce('ButtonGroup', 'Empty group detected. Empty groups are not allowed.');
            }

            return (
              <React.Fragment key={itemOrGroup.type === 'group' ? index : itemOrGroup.id}>
                {shouldAddDivider && <div className={styles.divider} />}
                {itemOrGroup.type === 'group' ? (
                  <div key={index} role="group" aria-label={itemOrGroup.text} className={styles.group}>
                    {itemOrGroup.items.map((item, subIndex) => itemContent(item, `${index + 1},${subIndex + 1}`))}
                  </div>
                ) : (
                  itemContent(itemOrGroup, `${index + 1}`)
                )}
              </React.Fragment>
            );
          })}
        </InternalNavigableGroup>
      </div>
    );
  }
);

export default InternalButtonGroup;
