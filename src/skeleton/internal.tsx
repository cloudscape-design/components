// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import { SkeletonProps } from './interfaces';
import { getSkeletonStyles } from './style';

import styles from './styles.css.js';

interface InternalSkeletonProps extends SkeletonProps, InternalBaseComponentProps {}

export default function InternalSkeleton({
  variant,
  height,
  width,
  display,
  style,
  nativeAttributes,
  __internalRootRef,
  ...props
}: InternalSkeletonProps) {
  const baseProps = getBaseProps(props);

  const inlineStyle: React.CSSProperties = {
    ...getSkeletonStyles(style),
    ...(height !== undefined && { blockSize: height }),
    ...(width !== undefined && { inlineSize: width }),
  };

  return (
    <WithNativeAttributes
      {...baseProps}
      tag="div"
      componentName="Skeleton"
      nativeAttributes={nativeAttributes}
      className={clsx(baseProps.className, styles.root, variant && styles[`variant-${variant}`], display && styles[`display-${display}`])}
      ref={__internalRootRef}
      style={inlineStyle}
      aria-hidden="true"
    />
  );
}
