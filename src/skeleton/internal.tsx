// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { SomeRequired } from '../internal/types';
import { SkeletonProps } from './interfaces';

import styles from './styles.css.js';

interface InternalSkeletonProps
  extends SomeRequired<SkeletonProps, 'variant' | 'tagOverride'>,
    InternalBaseComponentProps {}

export default function InternalSkeleton({
  variant,
  height,
  width,
  display,
  tagOverride,
  __internalRootRef,
  ...props
}: InternalSkeletonProps) {
  const baseProps = getBaseProps(props);

  const Tag = tagOverride as 'div';

  return (
    <Tag
      {...baseProps}
      className={clsx(
        baseProps.className,
        styles.root,
        variant && styles[`variant-${variant}`],
        display && styles[`display-${display}`]
      )}
      ref={__internalRootRef}
      style={width !== undefined ? { inlineSize: width } : {}}
      aria-hidden="true"
    >
      <Tag className={styles.inner} style={height !== undefined ? { blockSize: height } : {}} />
    </Tag>
  );
}
