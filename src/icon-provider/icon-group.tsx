// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

import { IconProps } from '../icon/interfaces';
import InternalIcon from '../icon/internal';
import { InternalIconGroupContext } from './context';
import { IconGroupName, IconGroupRenderer, IconGroupStates } from './interfaces';

export interface IconGroupProps<K extends IconGroupName> extends IconProps {
  /** The group to resolve. */
  groupName: K;
  /** Current state passed to the group renderer. */
  state: IconGroupStates[K];
  /** These properties apply to the fallback icon only (when group is not defined). */
  fallback?: IconProps;
}

/**
 * Renders an icon for a group. If a group is registered on an ancestor `IconProvider`,
 * it is invoked with `state`; otherwise (or when the renderer returns `null`/`undefined`) the
 * fallback icon is rendered.
 *
 * The custom icon renders inside the same element as the default, so it inherits the same size/box.
 * `className` styles the *default* icon (for example, the built-in expand/collapse rotation) and is
 * therefore only applied to the fallback — a custom group brings its own presentation.
 */
export function IconGroup<K extends IconGroupName>({ groupName, state, fallback, ...other }: IconGroupProps<K>) {
  const renderers = useContext(InternalIconGroupContext);
  const renderer = renderers[groupName] as IconGroupRenderer<K> | undefined;
  const group = renderer ? renderer(state) : null;
  return group ? <InternalIcon {...other} override={group} /> : <InternalIcon {...other} {...fallback} />;
}
