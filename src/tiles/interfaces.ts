// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { Breakpoint as _Breakpoint } from '../internal/breakpoints';

export interface TilesProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * Specify a custom name for the native radio buttons. If not provided, the tiles component generates a random name.
   */
  name?: string;

  /**
   * Specifies the value of the selected tile.
   * If you want to clear the selection, use `null`.
   */
  value: string | null;

  /**
   * List of tile definitions. Each tile has the following properties:
   *
   * - `value` [string] - The value that will be associated with the tile. This is the value the tiles will get when the radio button is selected.
   * - `label` [ReactNode] - A short description for the option the tile represents.
   * - `description` [ReactNode] - (Optional) Further explanatory guidance on the tile option, shown below the `label`.
   * - `image` [ReactNode] - (Optional) Visually distinctive image for the tile option, shown below the `description`.
   * - `disabled` [boolean] - (Optional) Specifies whether the tile is disabled. Users can't select disabled tiles.
   * - `controlId` [string] - (Optional) The ID of the internal input. You can use this to relate a label element's `for` attribute to this control.
   *            We recommend that you don't set this property because it's automatically set by the tiles component.
   */
  items?: ReadonlyArray<TilesProps.TilesDefinition>;

  /**
   * Adds `aria-label` on the group. Don't set this property if you are using this form element within a form field
   * because the form field component automatically sets the correct labels to make the component accessible.
   */
  ariaLabel?: string;

  /**
   * Adds `aria-required` on the group.
   */
  ariaRequired?: boolean;

  /**
   * The number of columns for the tiles to be displayed in. Valid values are integers between 1 and 4.
   * If no value is specified, the number of columns is determined based on the number of items, with a maximum of 3.
   * It is set to 2 if 4 or 8 items are supplied in order to optimize the layout.
   */
  columns?: number;

  /**
   * Called when the user selects a different tile.
   */
  onChange?: NonCancelableEventHandler<TilesProps.ChangeDetail>;

  /**
   * Adds `aria-controls` attribute to the component.
   * If the component controls any secondary content (for example, another form field), use this to provide an ID referring to the secondary content.
   */
  ariaControls?: string;
}

export namespace TilesProps {
  export type Breakpoint = _Breakpoint;
  export interface TilesDefinition {
    value: string;
    label: React.ReactNode;
    description?: React.ReactNode;
    image?: React.ReactNode;
    disabled?: boolean;
    controlId?: string;
  }

  export interface ChangeDetail {
    value: string;
  }

  export interface Ref {
    /**
     * Sets input focus onto the UI control.
     */
    focus(): void;
  }
}
