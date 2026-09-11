// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';

export interface ComparisonTableProps extends BaseComponentProps {
  /**
   * The attributes to compare across entities. Each attribute is rendered as a **row**.
   *
   * The order of this array is the order the rows appear in. Use the `render` function on an
   * attribute to customize how the value for each entity is displayed.
   */
  attributes: ReadonlyArray<ComparisonTableProps.Attribute>;

  /**
   * The entities being compared. Each entity is rendered as a **column** next to the sticky
   * attribute column.
   *
   * Every entity exposes its per-attribute values through the `data` map, keyed by attribute `id`.
   */
  entities: ReadonlyArray<ComparisonTableProps.Entity>;

  /**
   * Header text rendered above the sticky attribute (first) column.
   * Defaults to an empty string.
   */
  attributeColumnHeader?: string;

  /**
   * Whether the attribute (first) column is pinned to the inline-start edge while the entity
   * columns scroll horizontally. Defaults to `true`.
   */
  stickyAttributeColumn?: boolean;

  /**
   * When `true`, attribute rows whose values are not identical across all entities are visually
   * emphasized so differences stand out.
   *
   * Equality is determined with `Object.is` against the raw `entity.data[attribute.id]` values.
   * Rows with a custom `render` are still compared using their raw `data` values, so keep the
   * `data` values comparable (primitives) when relying on this feature.
   */
  highlightDifferences?: boolean;

  /**
   * Provides an accessible name for the underlying table, announced by assistive technology.
   */
  ariaLabel?: string;

  /**
   * The visual variant of the comparison table.
   *
   * - `"container"` (default) — renders inside a bordered container.
   * - `"embedded"` — removes the outer container border for embedding in another surface.
   * - `"borderless"` — removes borders entirely.
   * - `"stacked"` — for use in a vertically stacked set of containers.
   */
  variant?: ComparisonTableProps.Variant;
}

export namespace ComparisonTableProps {
  export type Variant = 'container' | 'embedded' | 'borderless' | 'stacked';

  export interface Attribute {
    /**
     * Unique identifier for the attribute. Used to look up each entity's value via
     * `entity.data[id]` and as the React key for the row.
     */
    id: string;

    /**
     * The label rendered in the sticky attribute column for this row.
     */
    label: React.ReactNode;

    /**
     * Optional custom renderer for an entity's value for this attribute. Receives the raw value
     * (`entity.data[id]`) and the full entity. When omitted, the raw value is rendered as-is.
     */
    render?: (value: React.ReactNode, entity: ComparisonTableProps.Entity) => React.ReactNode;
  }

  export interface Entity {
    /**
     * Unique identifier for the entity. Used as the column id and React key.
     */
    id: string;

    /**
     * The column header for this entity (for example, the resource name).
     */
    title: React.ReactNode;

    /**
     * The entity's values, keyed by attribute `id`. Missing keys render as a placeholder.
     */
    data: Record<string, React.ReactNode>;
  }
}
