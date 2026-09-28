// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { BaseComponentProps } from '../../../types/base-component';
import { getBaseProps } from '../../base-component';
import { ControlGroupContext, ControlGroupPosition } from '../../context/control-group-context';
import { flattenChildren } from '../../utils/flatten-children';

import styles from './styles.css.js';

export interface InternalControlGroupProps extends BaseComponentProps {
  children?: React.ReactNode;
}

export default function InternalControlGroup({ children, ...props }: InternalControlGroupProps) {
  const baseProps = getBaseProps(props);

  const flattenedChildren = flattenChildren(children, 'ControlGroup');
  const controlCount = flattenedChildren.length;

  return (
    <div {...baseProps} role="group" className={clsx(baseProps.className, styles.root)}>
      {flattenedChildren.map((child, index) => {
        const key = child && typeof child === 'object' ? (child as Record<'key', unknown>).key : undefined;
        const position: ControlGroupPosition =
          controlCount === 1 ? 'only' : index === 0 ? 'first' : index === controlCount - 1 ? 'last' : 'middle';
        return (
          <div key={key ? String(key) : index} className={clsx(styles.control, styles[`control-${position}`])}>
            <ControlGroupContext.Provider value={{ position }}>{child}</ControlGroupContext.Provider>
          </div>
        );
      })}
    </div>
  );
}
