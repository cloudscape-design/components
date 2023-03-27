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
    listProps?: React.HTMLProps<HTMLUListElement>;
  };

export default function InternalSpaceBetween({
  direction = 'vertical',
  size,
  children,
  listProps,
  __internalRootRef,
  ...props
}: InternalSpaceBetweenProps) {
  const baseProps = getBaseProps(props);

  /*
   Flattening the children allows us to "see through" React Fragments and nested arrays.
   */
  const flattenedChildren = flattenChildren(children);

  const ParentTag = listProps ? 'ul' : 'div';

  return (
    <ParentTag
      {...baseProps}
      {...(listProps as React.HTMLProps<HTMLElement>)}
      className={clsx(baseProps.className, styles.root, styles[direction], styles[`${direction}-${size}`])}
      ref={__internalRootRef}
    >
      {flattenedChildren.map(child => {
        // If this react child is a primitive value, the key will be undefined
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const key = (child as any).key;
        return (
          <div key={key} role="presentation" className={clsx(styles.child, styles[`child-${direction}-${size}`])}>
            {child}
          </div>
        );
      })}
    </ParentTag>
  );
}
