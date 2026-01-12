// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, isValidElement } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import flattenChildren from '../internal/vendor/react-keyed-flatten-children';
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
          const key = isValidElement(child) ? child.key : undefined;

          return (
            <div key={key} className={styles.child}>
              {child}
            </div>
          );
        })}
      </WithNativeAttributes>
    );
  }
);

export default InternalSpaceBetween;
