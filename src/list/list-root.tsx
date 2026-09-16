// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { ListProps } from './interfaces';

import styles from './styles.css.js';
import testClasses from './test-classes/styles.css.js';

export type ListRootProps = InternalBaseComponentProps &
  Pick<ListProps, 'tagOverride' | 'ariaLabel' | 'ariaLabelledby' | 'ariaDescribedby'> & {
    children: React.ReactNode;
  };

// Both the plain and the sortable branch render their root through this component, so switching
// `sortable` replaces the items without remounting the root element.
export default function ListRoot({
  tagOverride: Tag = 'ul',
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  __internalRootRef,
  children,
  ...rest
}: ListRootProps) {
  const baseProps = getBaseProps(rest);

  return (
    <Tag
      ref={__internalRootRef}
      {...baseProps}
      className={clsx(baseProps.className, styles.root, testClasses.root)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
    >
      {children}
    </Tag>
  );
}
