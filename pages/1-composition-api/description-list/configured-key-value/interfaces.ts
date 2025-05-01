// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export namespace KeyValueProps {
  /**
   * A single key-value pair. Does not include any config for layout.
   * Recommended to use the `KeyValueList` or `KeyValueLayout` components to auto format
   * groups of key-value definitions into columns and <dl> elements.
   */
  export interface Pair {
    /**
     * Renders a <dt> element
     */
    label?: React.ReactNode;
    /**
     * Place for info link
     */
    info?: React.ReactNode;
    /**
     * Renders a <dd> element or empty state "-" if undefined.
     */
    values?: React.ReactNode[] | React.ReactNode;
  }

  /**
   * A single defintion list column object.
   * Includes an optional title for the group.
   * Use if you do not want the component to autoassign pairs into groups.
   */
  export interface Group {
    /**
     * Optional h3 for the key value group
     */
    title?: string;
    pairs: ReadonlyArray<KeyValueProps.Pair>;
  }
  export interface Layout {
    /**
     * Specifies the number of columns in each grid row.
     * Valid values are any integer between 1 and 4. It defaults to 1.
     */
    columns?: number;

    /**
     * Specifies the groups of key/value pairs. Each group is displayed in a separate column.
     *
     * Each group contains:
     * * `title`: (string) - (Optional) Displayed within an h3 tag at the top of the column.
     * * `pairs`: (ReadonlyArray<KeyValuePairsProps.Pair>) The list of key/value pairs in the group.
     *
     * Each pair contains:
     * * `label`: (React.ReactNode) - (Optional) The key label.
     *            Do not set this property if you want to display a progress bar.
     *            Use the `label` property of the progress bar component that you provide as a `value` for the pair.
     * * `value`: (React.ReactNode) Value of the pair.
     */
    groups?: ReadonlyArray<KeyValueProps.Group>;

    /**
     * The pairs to render.
     */
    children?: React.ReactNode;
  }

  export interface List {
    /**
     * Each pair contains:
     * * `label`: (React.ReactNode) - (Optional) The key label.
     *            Do not set this property if you want to display a progress bar.
     *            Use the `label` property of the progress bar component that you provide as a `value` for the pair.
     * * `value`: (React.ReactNode) Value of the pair.
     */

    pairsList: ReadonlyArray<KeyValueProps.Pair>;
  }
}
