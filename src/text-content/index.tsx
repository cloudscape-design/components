// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { getBaseProps } from '../internal/base-component';
import styles from './styles.css.js';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { TextContentProps } from './interfaces';

export { TextContentProps };

export default function TextContent({ children, ...props }: TextContentProps) {
  const { __internalRootRef } = useBaseComponent('TextContent');
  const baseProps = getBaseProps(props);

  const className = clsx(baseProps.className, styles['text-content']);
  return (
    <div {...baseProps} className={className} ref={__internalRootRef}>
      {children}
    </div>
  );
}

applyDisplayName(TextContent, 'TextContent');
