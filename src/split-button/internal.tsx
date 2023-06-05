// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { ButtonSegment, ButtonDropdownSegment } from './segment';
import { SplitButtonProps } from './interfaces';
import styles from './styles.css.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { warnOnce } from '../internal/logging';
import { getBaseProps } from '../internal/base-component';
import clsx from 'clsx';
import { ButtonProps } from '../button/interfaces';

interface InternalSplitButtonProps extends SplitButtonProps, InternalBaseComponentProps {}

const InternalSplitButton = forwardRef(
  (
    {
      items,
      variant = 'normal',
      expandToViewport,
      expandableGroups,
      __internalRootRef,
      ...props
    }: InternalSplitButtonProps,
    ref: React.Ref<SplitButtonProps.Ref>
  ) => {
    if (items.slice(0, -1).find(it => it.type === 'button-dropdown')) {
      warnOnce('SplitButton', 'Only the last item can be of type "button-dropdown".');

      // Removing all button-dropdown items that are not in the last position.
      items = items.filter((it, index) => it.type !== 'button-dropdown' || index === items.length - 1);
    }

    if (items.length < 2) {
      warnOnce('SplitButton', 'The component must have at least two items.');
    }

    const triggerRefs = useRef<{ [id: string]: null | ButtonProps.Ref }>({});

    useImperativeHandle(ref, () => ({
      focus(id: string) {
        triggerRefs.current[id]?.focus();
      },
    }));

    const baseProps = getBaseProps(props);

    return (
      <div ref={__internalRootRef} {...baseProps} className={clsx(baseProps.className, styles.root)}>
        {items.map(item => {
          switch (item.type) {
            case 'button':
              return (
                <ButtonSegment
                  ref={node => {
                    triggerRefs.current[item.id] = node;
                  }}
                  key={item.id}
                  variant={variant}
                  {...item}
                />
              );
            case 'button-dropdown':
              return (
                <ButtonDropdownSegment
                  ref={node => {
                    triggerRefs.current[item.id] = node;
                  }}
                  key={item.id}
                  variant={variant}
                  expandToViewport={expandToViewport}
                  expandableGroups={expandableGroups}
                  {...item}
                />
              );
            default:
              throw new Error('Invariant violation: unsupported item type');
          }
        })}
      </div>
    );
  }
);

export default InternalSplitButton;
