// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

import { IconProps } from '../icon/interfaces';
import InternalIcon from '../icon/internal';
import { InternalIconOverrideContext } from './context';
import { IconOverrideName, IconOverrideRenderer, IconOverrideStates } from './interfaces';

export interface IconOverrideProps<K extends IconOverrideName> extends IconProps {
  /** The override to resolve. */
  overrideName: K;
  /** Current state passed to the override renderer. */
  state: IconOverrideStates[K];
  /** These properties apply to the fallback icon only (when override is not defined). */
  fallback?: IconProps;
}

/**
 * Renders an icon for a named, role-based override. If an override for `overrideName` is registered
 * on an ancestor `IconProvider`, it is invoked with `state`; otherwise (or when the renderer returns
 * `null`/`undefined`) the fallback icon is rendered.
 *
 * The custom icon renders inside the same element as the default, so it inherits the same size/box.
 * `className` styles the *default* icon (for example, the built-in expand/collapse rotation) and is
 * therefore only applied to the fallback — a custom override brings its own presentation.
 */
export function IconOverride<K extends IconOverrideName>({
  overrideName,
  state,
  fallback,
  ...other
}: IconOverrideProps<K>) {
  const renderers = useContext(InternalIconOverrideContext);
  const renderer = renderers[overrideName] as IconOverrideRenderer<K> | undefined;
  const override = renderer ? renderer(state) : null;
  return override ? <InternalIcon {...other} override={override} /> : <InternalIcon {...other} {...fallback} />;
}
