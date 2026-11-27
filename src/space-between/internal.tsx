// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { flattenChildren, getFlattenedChildKey } from '../internal/utils/flatten-children';
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
    const flattenedChildren = flattenChildren(children, 'SpaceBetween');

    const propagateAlignment = alignItems && direction === 'horizontal';

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
        {flattenedChildren.map((child, index) => {
          return (
            <div
              key={getFlattenedChildKey(child, index)}
              className={clsx(styles.child, propagateAlignment && styles['child-aligned'])}
            >
              {child}
            </div>
          );
        })}
      </WithNativeAttributes>
    );
  }
);

export default InternalSpaceBetween;
