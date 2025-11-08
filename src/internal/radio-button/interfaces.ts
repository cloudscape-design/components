// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

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
