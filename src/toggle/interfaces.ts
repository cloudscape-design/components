// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseCheckboxProps } from '../checkbox/base-checkbox';
import { NonCancelableEventHandler } from '../internal/events';
/**
 * @awsuiSystem core
 */
import { NativeAttributes } from '../internal/utils/with-native-attributes';

export interface ToggleProps extends BaseCheckboxProps {
  /**
   * The control's label that's displayed next to the toggle. Clicking this will invoke a state change.
   * @displayname label
   */
  children?: React.ReactNode;

  /*
   * Called when the user changes their selection.
   * The event `detail` contains the current value for the `checked` property.
   */
  onChange?: NonCancelableEventHandler<ToggleProps.ChangeDetail>;

  /**
   * An object containing CSS properties to customize the toggle's visual appearance.
   * Refer to the [style](/components/toggle/?tabId=style) tab for more details.
   * @awsuiSystem core
   */
  style?: ToggleProps.Style;

  /**
   * Attributes to add to the native `input` element.
   * Some attributes will be automatically combined with internal attribute values:
   * - `className` will be appended.
   * - Event handlers will be chained, unless the default is prevented.
   *
   * We do not support using this attribute to apply custom styling.
   *
   * @awsuiSystem core
   */
  nativeInputAttributes?: NativeAttributes<React.InputHTMLAttributes<HTMLInputElement>>;
}

export namespace ToggleProps {
  export interface Ref {
    /**
     * Sets input focus onto the UI control.
     */
    focus(): void;
  }

  export interface ChangeDetail {
    checked: boolean;
  }

  export interface Style {
    input: {
      background?: {
        checked?: string;
        default?: string;
        disabled?: string;
        readOnly?: string;
      };
      handle?: {
        background?: {
          checked?: string;
          default?: string;
          disabled?: string;
          readOnly?: string;
        };
      };
      focusRing?: {
        borderColor?: string;
        borderRadius?: string;
        borderWidth?: string;
      };
    };
    label?: {
      color?: {
        checked?: string;
        default?: string;
        disabled?: string;
        readOnly?: string;
      };
    };
  }
}
