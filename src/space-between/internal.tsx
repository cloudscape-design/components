// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import flattenChildren from 'react-keyed-flatten-children';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { SpaceBetweenProps } from './interfaces';

import styles from './styles.css.js';

type InternalSpaceBetweenProps = SpaceBetweenProps & InternalBaseComponentProps;

const InternalSpaceBetween = forwardRef(
  (
    { direction = 'vertical', size, children, alignItems, __internalRootRef, ...props }: InternalSpaceBetweenProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const mergedRef = useMergeRefs(ref, __internalRootRef);
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
        ref={mergedRef}
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
);

export default InternalSpaceBetween;
