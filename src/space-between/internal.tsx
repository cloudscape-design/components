// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { getBaseProps } from '../internal/base-component';
import styles from './styles.css.js';
import flattenChildren from 'react-keyed-flatten-children';
import { SpaceBetweenProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

type InternalSpaceBetweenProps = SpaceBetweenProps & InternalBaseComponentProps;

export default function InternalSpaceBetween({
  direction = 'vertical',
  size,
  children,
  alignItems,
  __internalRootRef,
  ...props
}: InternalSpaceBetweenProps) {
  const baseProps = getBaseProps(props);

  /*
   Flattening the children allows us to "see through" React Fragments and nested arrays.
   */
  const flattenedChildren = flattenChildren(children);

  return (
    <div
      {...baseProps}
      className={clsx(
        baseProps.className,
        styles.root,
        styles[direction],
        styles[`${direction}-${size}`],
        alignItems && styles[`align-${alignItems}`]
      )}
      ref={__internalRootRef}
    >
      {flattenedChildren.map(child => {
        const key = typeof child === 'object' ? child.key : undefined;

        return (
          <div key={key} className={styles.child}>
            {child}
          </div>
        );
      })}
    </div>
  );
}
