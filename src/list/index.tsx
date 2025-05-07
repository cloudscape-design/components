// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalStructuredItem from '../structured-item/internal';
import { ListProps } from './interfaces';

import styles from './styles.css.js';
import testClasses from './test-classes/styles.css.js';

export { ListProps };

/**
 * @awsuiSystem core
 */
export default function List({ items, children, ...rest }: ListProps) {
  const { __internalRootRef } = useBaseComponent('List');
  const baseProps = getBaseProps(rest);

  return (
    <ul ref={__internalRootRef} {...baseProps} className={clsx(baseProps.className, styles.root, testClasses.root)}>
      {children
        ? children
        : items?.map((item, index) => (
            <li key={index}>
              <InternalStructuredItem {...item} />
            </li>
          ))}
    </ul>
  );
}

applyDisplayName(List, 'List');
