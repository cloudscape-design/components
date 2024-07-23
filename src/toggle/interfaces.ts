// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseCheckboxProps } from '../checkbox/base-checkbox';
import { NonCancelableEventHandler } from '../internal/events';

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
}
