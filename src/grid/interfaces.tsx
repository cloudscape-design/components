// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { Breakpoint as _Breakpoint } from '../internal/breakpoints';

export interface GridProps extends BaseComponentProps {
  /**
   * An array of element definitions that specifies how the columns must be
   * arranged. Each element definition can have the following properties:
   *
   * - `colspan` (number | GridProps.BreakpointMapping) - The number (1-12) of grid elements for this column to span.
   * - `offset` (number | GridProps.BreakpointMapping) - The number (0-11) of grid elements by which to offset the column.
   * - `pull` (number | GridProps.BreakpointMapping) - The number (0-12) of grid elements by which to pull the column to the left.
   * - `push` (number | GridProps.BreakpointMapping) - The number (0-12) of grid elements by which to push the column to the right.
   *
   * The value for the each property can be a number (which applies for all
   * breakpoints) or an object where the key is one of the supported breakpoints
   * (`xxs`, `xs`, `s`, `m`, `l`, `xl`) or `default`. The value of this key is a number of columns,
   * applied for that breakpoint and those above it. You must provide a `default` value for `colspan`.
   *
   * We recommend that you don't use the `pull` and `push` properties of the element definition
   * for accessibility reasons.
   */
  gridDefinition?: ReadonlyArray<GridProps.ElementDefinition>;

  /**
   * Determines whether horizontal and vertical gutters are hidden.
   */
  disableGutters?: boolean;

  /**
   * The elements to align in the grid.
   *
   * You can provide any elements here. The number of elements
   * should match the number of objects defined in the `gridDefinition`
   * property.
   */
  children?: React.ReactNode;
}

export namespace GridProps {
  export type Breakpoint = _Breakpoint;

  export type BreakpointMapping = Partial<Record<_Breakpoint, number>>;

  export interface ElementDefinition {
    /**
     * The number of grid elements for the column to span.
     */
    colspan?: number | GridProps.BreakpointMapping;

    /**
     * The number of grid elements to offset the column by.
     */
    offset?: number | GridProps.BreakpointMapping;

    /**
     * The number of grid elements to pull the column to the left by.
     */
    pull?: number | GridProps.BreakpointMapping;

    /**
     * The number of grid elements to push the column to the right by.
     */
    push?: number | GridProps.BreakpointMapping;
  }
}
