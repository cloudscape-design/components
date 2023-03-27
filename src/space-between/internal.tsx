// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { getBaseProps } from '../internal/base-component';
import styles from './styles.css.js';
import flattenChildren from 'react-keyed-flatten-children';
import { SpaceBetweenProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

type InternalSpaceBetweenProps = SpaceBetweenProps &
  InternalBaseComponentProps & {
    variant?: 'div' | 'ul';
  };

export default function InternalSpaceBetween({
  direction = 'vertical',
  size,
  children,
  variant: Variant = 'div',
  __internalRootRef,
  ...props
}: InternalSpaceBetweenProps) {
  const baseProps = getBaseProps(props);

  /*
   Flattening the children allows us to "see through" React Fragments and nested arrays.
   */
  const flattenedChildren = flattenChildren(children);

  return (
    <Variant
      {...baseProps}
      className={clsx(baseProps.className, styles.root, styles[direction], styles[`${direction}-${size}`])}
      ref={__internalRootRef}
    >
      {flattenedChildren.map(child => {
        const key = typeof child === 'object' ? child.key : undefined;

        // When using "ul" variant we avoid extra element wrappers to keep list semantics.
        if (Variant === 'ul' && typeof child === 'object') {
          const className = clsx(child.props.className, styles.child, styles[`child-${direction}-${size}`]);
          return React.cloneElement(child, { className });
        }

        return (
          <div key={key} className={clsx(styles.child, styles[`child-${direction}-${size}`])}>
            {child}
          </div>
        );
      })}
    </Variant>
  );
}
