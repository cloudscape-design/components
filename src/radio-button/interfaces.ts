// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface RadioButtonProps extends RadioButtonProps.RadioButtonDefinition, BaseComponentProps {
  name: string;
  checked: boolean;
  onChange?: NonCancelableEventHandler<RadioButtonProps.ChangeDetail>;
  readOnly?: boolean;
  style?: RadioButtonProps.Style;
}

export namespace RadioButtonProps {
  export interface RadioButtonDefinition {
    value?: string;
    /**
     * The control's label that's displayed next to the radio button. A state change occurs when a user clicks on it.
     * @displayname label
     */
    children?: React.ReactNode;
    description?: React.ReactNode;
    disabled?: boolean;
  }

  export interface ChangeDetail {
    checked: boolean;
  }

  export interface Ref {
    /**
     * Sets input focus onto the UI control.
     */
    focus(): void;
  }

  export interface Style {
    input?: {
      fill?: {
        checked?: string;
        default?: string;
        disabled?: string;
        readOnly?: string;
      };
      stroke?: {
        default?: string;
        disabled?: string;
        readOnly?: string;
      };
      circle?: {
        fill?: {
          checked?: string;
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
    description?: {
      color?: {
        checked?: string;
        default?: string;
        disabled?: string;
        readOnly?: string;
      };
    };
  }
}
