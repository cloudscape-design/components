// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from '../collection-preferences/interfaces';
import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';
import { DndAreaI18nStrings } from '../types/sortable-area';

export interface ContentDisplayPreferenceProps extends BaseComponentProps, DndAreaI18nStrings {
  /**
   * Specifies the text displayed at the top of the preference.
   * @i18n
   */
  title?: string;
  /**
   * Specifies the description displayed below the title.
   * @i18n
   */
  description?: string;
  /**
   * Specifies an array of options for reordering and visible content selection.
   *
   * Each option contains the following:
   * - `id` (string) - Corresponds to a table column `id`.
   * - `label` (string) - Specifies a short description of the content.
   * - `alwaysVisible` (boolean) - (Optional) Determines whether the visibility is always on and therefore cannot be toggled. This is set to `false` by default.
   */
  options: ReadonlyArray<ContentDisplayPreferenceProps.Option>;
  /**
   * Specifies an array of column group definitions for multi-level content display. Each group contains:
   * - `id` (string) - A unique identifier for the group.
   * - `label` (string) - The text displayed as the group label.
   */
  groups?: ReadonlyArray<ContentDisplayPreferenceProps.OptionGroup>;
  /**
   * The current, ordered list of content items and their visibility. The order of the elements influences the display.
   *
   * Each content display item is one of the following:
   * - `ContentDisplayColumn` - Represents a single column.
   *   - `type` ('column') - (Optional) Identifies the entry as a column. Defaults to `'column'` when omitted.
   *   - `id` (string) - The column identifier.
   *   - `visible` (boolean) - Whether the column is visible.
   * - `ContentDisplayGroup` - Represents a column group.
   *   - `type` ('group') - Identifies the entry as a group.
   *   - `id` (string) - The group identifier.
   *   - `visible` (boolean) - Whether the group is visible.
   *   - `children` (ReadonlyArray<ContentDisplayItem>) - The columns or nested groups within this group.
   *
   * When not provided, all options are shown as visible in their original order.
   */
  value?: ReadonlyArray<ContentDisplayPreferenceProps.ContentDisplayItem>;
  /**
   * Adds a columns filter to the control.
   */
  enableColumnFiltering?: boolean;
  /**
   * An object containing all the localized strings required by the component.
   * @i18n
   */
  i18nStrings?: ContentDisplayPreferenceProps.I18nStrings;
  /**
   * Adds a label for a group item to be announced by screen readers during drag and drop operations.
   */
  liveAnnouncementDndGroupLabel?: (label: string, count: number) => string;
  /**
   * Called whenever the user reorders items or toggles their visibility.
   *
   * Unlike `CollectionPreferences`, the standalone component emits changes immediately, allowing you to
   * react to selection before the user confirms (for example, to enforce a maximum number of visible columns).
   *
   * The event `detail` contains the following:
   * - `value` (ReadonlyArray<ContentDisplayItem>) - The updated ordered list of items and their visibility.
   */
  onChange?: NonCancelableEventHandler<ContentDisplayPreferenceProps.ChangeDetail>;
}

export namespace ContentDisplayPreferenceProps {
  export type Option = CollectionPreferencesProps.ContentDisplayOption;
  export type OptionGroup = CollectionPreferencesProps.ContentDisplayOptionGroup;
  export type ContentDisplayItem = CollectionPreferencesProps.ContentDisplayItem;
  export type ContentDisplayColumn = CollectionPreferencesProps.ContentDisplayColumn;
  export type ContentDisplayGroup = CollectionPreferencesProps.ContentDisplayGroup;
  export type I18nStrings = CollectionPreferencesProps.ContentDisplayPreferenceI18nStrings;

  export interface ChangeDetail {
    value: ReadonlyArray<ContentDisplayItem>;
  }
}
