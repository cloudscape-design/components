// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
/**
 * @awsuiSystem core
 */
import { NativeAttributes } from '../internal/utils/with-native-attributes';

export interface DividerProps extends BaseComponentProps {
  /**
   * Announces the divider component as a semantic separator to assistive technology
   * by adding semantic attributes like `role="separator"` and `aria-orientation`.
   * Only set this to `true` when the divider genuinely separates distinct, meaningful content
   * regions that assistive technology needs to be aware of.
   *
   * By default, the divider is not semantic and is therefore hidden from assistive technology.
   *
   * @defaultValue `false`
   */
  semantic?: boolean;

  /**
   * Attributes to add to the native element.
   * Some attributes will be automatically combined with internal attribute values:
   * - `className` will be appended.
   * - Event handlers will be chained, unless the default is prevented.
   *
   * We do not support using this attribute to apply custom styling.
   *
   * @awsuiSystem core
   */
  nativeAttributes?: NativeAttributes<React.HTMLAttributes<HTMLHRElement>>;
}
