// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component/index.js';
import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { TextContentProps } from './interfaces.js';

import styles from './styles.css.js';

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
