// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

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
  inlineLabelText?: string;
}

export default function InternalControlGroup({
  children,
  direction = 'horizontal',
  inlineLabelText,
  ...props
}: InternalControlGroupProps) {
  const baseProps = getBaseProps(props);
  const labelId = useUniqueId('control-group-label');

  const flattenedChildren = flattenChildren(children, 'ControlGroup');
  const controlCount = flattenedChildren.length;

  // A grouped Multiselect always renders its tokens inline in the trigger, which
  // sits higher than normal trigger text. The group's single inline label must
  // drop the shared mixin's bottom padding and nudge up to clear that token row;
  // otherwise it overlaps the tokens. Only Multiselect does this inside a group,
  // so detecting its presence (by displayName, to stay decoupled from its module)
  // is enough. Plain-trigger groups keep the base offset.
  const hasInlineTokenControl = flattenedChildren.some(
    child =>
      React.isValidElement(child) &&
      typeof child.type !== 'string' &&
      (child.type as { displayName?: string }).displayName === 'Multiselect'
  );

  const controls = (
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

  if (inlineLabelText) {
    return (
      <div {...baseProps} className={clsx(baseProps.className, styles['inline-label-wrapper'])}>
        <label
          id={labelId}
          className={clsx(styles['inline-label'], hasInlineTokenControl && styles['inline-label-inline-tokens'])}
        >
          {inlineLabelText}
        </label>
        <div className={styles['inline-label-trigger-wrapper']}>
          <div role="group" aria-labelledby={labelId} className={styles.root}>
            {controls}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div {...baseProps} role="group" className={clsx(baseProps.className, styles.root)}>
      {controls}
    </div>
  );
}
