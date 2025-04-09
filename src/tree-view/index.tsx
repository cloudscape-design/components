// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TreeViewProps } from './interfaces';

import testClasses from './test-classes/styles.css.js';

export { TreeViewProps };

/**
 * @awsuiSystem core
 */
export default function TreeView({ items = [], ...rest }: TreeViewProps) {
  const { __internalRootRef } = useBaseComponent('TreeView');
  const baseProps = getBaseProps(rest);

  return (
    <div ref={__internalRootRef} {...baseProps} className={clsx(baseProps.className, testClasses.root)}>
      <p>tree view component mock</p>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
}

applyDisplayName(TreeView, 'TreeView');
