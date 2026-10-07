// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { BaseComponentProps } from '../../../types/base-component';
import { getBaseProps } from '../../base-component';
import {
  GroupedControlContext,
  GroupedControlDirection,
  GroupedControlPosition,
} from '../../context/control-group-context';
import { flattenChildren } from '../../utils/flatten-children';

import styles from './styles.css.js';

export interface InternalControlGroupProps extends BaseComponentProps {
  children?: React.ReactNode;
  direction?: GroupedControlDirection;
}

export default function InternalControlGroup({
  children,
  direction = 'horizontal',
  ...props
}: InternalControlGroupProps) {
  const baseProps = getBaseProps(props);

  const flattenedChildren = flattenChildren(children, 'ControlGroup');
  const controlCount = flattenedChildren.length;

  return (
    <div {...baseProps} role="group" className={clsx(baseProps.className, styles.root, styles[`root-${direction}`])}>
      {flattenedChildren.map((child, index) => {
        const key = child && typeof child === 'object' ? (child as Record<'key', unknown>).key : undefined;
        const position: GroupedControlPosition =
          controlCount === 1 ? 'only' : index === 0 ? 'first' : index === controlCount - 1 ? 'last' : 'middle';
        return (
          <div
            key={key ? String(key) : index}
            className={clsx(styles.control, styles[`control-${position}-${direction}`])}
          >
            <GroupedControlContext.Provider value={{ position, direction }}>{child}</GroupedControlContext.Provider>
          </div>
        );
      })}
    </div>
  );
}
