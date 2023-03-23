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
    list?: boolean;
  };

export default function InternalSpaceBetween({
  direction = 'vertical',
  size,
  children,
  list,
  __internalRootRef,
  ...props
}: InternalSpaceBetweenProps) {
  const baseProps = getBaseProps(props);

  /*
   Flattening the children allows us to "see through" React Fragments and nested arrays.
   */
  const flattenedChildren = flattenChildren(children);

  const ParentTag = list ? 'ul' : 'div';
  const ChildTag = list ? 'li' : 'div';

  return (
    <ParentTag
      {...baseProps}
      className={clsx(baseProps.className, styles.root, styles[direction], styles[`${direction}-${size}`])}
      ref={__internalRootRef}
    >
      {flattenedChildren.map(child => {
        // If this react child is a primitive value, the key will be undefined
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const key = (child as any).key;

        return (
          <ChildTag key={key} className={clsx(styles.child, styles[`child-${direction}-${size}`])}>
            {child}
          </ChildTag>
        );
      })}
    </ParentTag>
  );
}
