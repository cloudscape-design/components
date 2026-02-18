// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { flattenChildren } from '../internal/utils/flatten-children';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import { SpaceBetweenProps } from './interfaces';

import styles from './styles.css.js';

type InternalSpaceBetweenProps = SpaceBetweenProps & InternalBaseComponentProps;

const InternalSpaceBetween = forwardRef(
  (
    {
      direction = 'vertical',
      size,
      children,
      alignItems,
      nativeAttributes,
      __internalRootRef,
      ...props
    }: InternalSpaceBetweenProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const mergedRef = useMergeRefs(ref, __internalRootRef);
    const baseProps = getBaseProps(props);

    /*
   Flattening the children allows us to "see through" React Fragments and nested arrays.
   */
    const flattenedChildren = flattenChildren(children);

    return (
      <WithNativeAttributes
        {...baseProps}
        tag="div"
        componentName="SpaceBetween"
        nativeAttributes={nativeAttributes}
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
          // If this react child is a primitive value, the key will be undefined
          const key = child && typeof child === 'object' ? (child as Record<'key', unknown>).key : undefined;

          return (
            <div key={key ? String(key) : undefined} className={styles.child}>
              {child}
            </div>
          );
        })}
      </WithNativeAttributes>
    );
  }
);

export default InternalSpaceBetween;
