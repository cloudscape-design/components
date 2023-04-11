// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface CollectionPreferencesProps<CustomPreferenceType = any> extends BaseComponentProps {
  /**
   * Specifies the title of the preferences modal dialog. It is also used as an `aria-label` for the trigger button.
   */
  title: string;
  /**
   * Label of the confirm button in the modal footer.
   */
  confirmLabel: string;
  /**
   * Label of the cancel button in the modal footer.
   */
  cancelLabel: string;
  /**
   * Determines whether the preferences trigger button is disabled.
   */
  disabled?: boolean;
  /**
   * Configures the built-in "page size selection" preference.
   *
   * If you set it, the component displays this preference in the modal.
   *
   * It contains the following:
   * - `title` (string) - Specifies the text displayed at the top of the preference.
   * - `options` - Specifies an array of options for page size selection. Each entry contains:
   *   - `value` (number) - The value for the radio button (that is, the number of items per page).
   *   - `label` (string) - A label for the radio button (for example, "10 resources").
   *
   * You must set the current value in the `preferences.pageSize` property.
   */
  pageSizePreference?: CollectionPreferencesProps.PageSizePreference;
  /**
   * Configures the built-in "wrap lines" preference.
   *
   * If you set it, the component displays this preference in the modal.
   *
   * It contains the following:
   * - `label` (string) - Specifies the label for the option checkbox.
   * - `description` (string) - Specifies the text displayed below the checkbox label.
   *
   * You must set the current value in the `preferences.wrapLines` property.
   */
  wrapLinesPreference?: CollectionPreferencesProps.WrapLinesPreference;
  /**
   * Configures the built-in "striped rows" preference.
   *
   * If you set it, the component displays this preference in the modal.
   *
   * It contains the following:
   * - `label` (string) - Specifies the label for the option checkbox.
   * - `description` (string) - Specifies the text displayed below the checkbox label.
   *
   * You must set the current value in the `preferences.stripedRows` property.
   */
  stripedRowsPreference?: CollectionPreferencesProps.StripedRowsPreference;
  /**
   * Configures the content density preference (Comfortable / Compact).
   *
   * If you set it, the component displays this preference in the modal.
   *
   * It contains the following:
   * - `label` (string) - Specifies the label for the option checkbox.
   * - `description` (string) - Specifies the text displayed below the checkbox label.
   *
   * You must set the current value in the `preferences.contentDensity` property.
   */
  contentDensityPreference?: CollectionPreferencesProps.ContentDensityPreference;

  /**
   * Configures the sticky columns preference.
   *
   * You can set it for both left and right columns.
   *
   * It contains the following:
   * - `label` (string) - Specifies the label for each radio group.
   * - `description` (string) - Specifies the text displayed below each radio group label.
   *
   * You must set the current value in the `preferences.stickyColumns` property.
   */
  stickyColumnsPreference?: CollectionPreferencesProps.StickyColumnsPreference;
  /**
   * Configures the built-in "visible content selection" preference (for example, visible columns in a table).
   *
   * If you set it, the component displays this preference in the modal.
   *
   * It contains the following:
   * - `title` (string) - Specifies the text displayed at the top of the preference.
   * - `options` - Specifies an array of groups of options for visible content selection.
   *
   * Each group of options contains the following:
   * - `label` (string) - The text to display as a title for the options group.
   * - `options` - Specifies an aray of options in the group. Each option contains the following:
   *   - `id` (string) - Corresponds to a column `id` for tables or to a section `id` for cards.
   *   - `label` (string) - Specifies a short description of the content.
   *   - `editable` (boolean) - (Optional) Determines whether the user is able to toggle its visibility. This is `true` by default.
   *
   * You must set the current list of visible content `id`s in the `preferences.visibleContent` property.
   */
  visibleContentPreference?: CollectionPreferencesProps.VisibleContentPreference;
  /**
   * Specifies the current preference values. This includes both built-in and custom preferences.
   *
   * It contains the following:
   * - `pageSize` (number) - (Optional)
   * - `wrapLines` (boolean) - (Optional)
   * - `visibleContent` (ReadonlyArray<string>) - Specifies the list of visible content `id`s. The order of the `id`s does not influence the display.
   * - `custom` (CustomPreferenceType) - Specifies the value for your custom preference.
   */
  preferences?: CollectionPreferencesProps.Preferences<CustomPreferenceType>;
  /**
   * Configures custom preferences. The function receives two parameters:
   *
   * - `customValue` (CustomPreferenceType) - Current value for your custom preference. It is initialized using the value you provide in `preferences.custom`.
   * - `setCustomValue` - A function that is called to notify a state update.
   *
   * It should return the content of your custom preference, for example:
   * ```
   * (customValue, setCustomValue) => (
   *   <Checkbox checked={customValue} onChange={({ detail }) => setCustomValue(detail.checked)} />
   * )
   * ```
   *
   * When the user confirms the changes, the new value is passed in the `detail.custom` property of the `onConfirm` listener.
   * When the user cancels the changes, the `customValue` is reset to the one present in `preferences.custom` property.
   *
   * **Display**
   * - If any of the built-in preferences (`pageSizePreference`, `wrapLinesPreference`, or `visibleContentPreference`) are displayed,
   * the custom content is displayed at the bottom of the left column within the modal.
   * - If no built-in preference is displayed, the custom content occupies the whole modal.
   */
  customPreference?: (
    customValue: CustomPreferenceType,
    setCustomValue: React.Dispatch<CustomPreferenceType>
  ) => React.ReactNode;
  /**
   * Called when the user cancels a preference change using the cancel button in the modal footer or by dismissing the modal.
   */
  onCancel?: NonCancelableEventHandler;
  /**
   * Called when the user confirms a preference change using the confirm button in the modal footer.
   *
   * The event `detail` contains the following:
   * - `pageSize` (number) - (Optional) The selected page size value. Available only if you specify the `pageSizePreference` property.
   * - `wrapLines` (boolean) - (Optional) The current line wrapping preference value. Available only if you specify the `wrapLinesPreference` property.
   * - `visibleContent` (ReadonlyArray<string>) - (Optional) The list of selected content `id`s. Available only if you specify the `visibleContentPreference` property.
   * - `custom` (CustomPreferenceType) - (Optional) The selected value for your custom preference.
   *
   * The values for all configured preferences are present even if the user didn't change their values.
   */
  onConfirm?: NonCancelableEventHandler<CollectionPreferencesProps.Preferences<CustomPreferenceType>>;
}

export namespace CollectionPreferencesProps {
  export interface Preferences<CustomPreferenceType = any> {
    pageSize?: number;
    wrapLines?: boolean;
    stripedRows?: boolean;
    contentDensity?: 'comfortable' | 'compact';
    stickyColumns?: StickyColumns;
    visibleContent?: ReadonlyArray<string>;
    custom?: CustomPreferenceType;
  }

  export interface VisibleContentPreference {
    title: string;
    options: ReadonlyArray<CollectionPreferencesProps.VisibleContentOptionsGroup>;
  }

  export interface VisibleContentOptionsGroup {
    label: string;
    options: ReadonlyArray<CollectionPreferencesProps.VisibleContentOption>;
  }

  export interface VisibleContentOption {
    id: string;
    label: string;
    editable?: boolean;
  }

  export interface PageSizePreference {
    title: string;
    options: ReadonlyArray<PageSizeOption>;
  }

  export interface PageSizeOption {
    value: number;
    label: string;
  }

  export interface WrapLinesPreference {
    label: string;
    description: string;
  }

  export interface StripedRowsPreference {
    label: string;
    description: string;
  }

  export interface ContentDensityPreference {
    label: string;
    description: string;
  }
  interface StickyColumns {
    first?: number;
    last?: number;
  }

  interface StickyColumnPreference {
    title: string;
    description: string;
    options: ReadonlyArray<{
      label: string;
      value: number;
    }>;
  }
  export interface StickyColumnsPreference {
    firstColumns?: StickyColumnPreference;
    lastColumns?: StickyColumnPreference;
  }
}
