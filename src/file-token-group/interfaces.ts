// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface FileTokenGroupProps extends BaseComponentProps {
  /**
   * Show file size in the token. Use `i18nStrings.formatFileSize` to customize it.
   */
  showFileSize?: boolean;

  /**
   * Show file last modified timestamp in the token. Use `i18nStrings.formatFileLastModified` to customize it.
   */
  showFileLastModified?: boolean;

  /**
   * Show file thumbnail in the token. Only supported for images.
   */
  showFileThumbnail?: boolean;
  /**
   *  Called when the user clicks on the dismiss button. The token won't be automatically removed.
   *  Make sure that you add a listener to this event to update your application state.
   */
  onDismiss: NonCancelableEventHandler<FileTokenGroupProps.DismissDetail>;

  /**
   * Specifies the maximum number of displayed tokens. If the property isn't set, all of the tokens are displayed.
   */
  limit?: number;
  /**
   * Specifies the direction in which tokens are aligned (`horizontal | vertical`).
   */
  alignment?: FileTokenGroupProps.Alignment;

  /**
   *
   * An array of objects representing token items. Each token has the following properties:
   *
   * - `label` (string) - Title text of the token.
   * - `description` (string) - (Optional) Further information about the token that appears below the label.
   * - `disabled` [boolean] - (Optional) Determines whether the token is disabled.
   * - `loading` (boolean) - (Optional) Custom SVG icon. Equivalent to the `svg` slot of the [icon component](/components/icon/).
   * - `errorText` (string) - (Optional) Text that displays as a validation error message.
   * - `warningText` (string) - (Optional) - Text that displays as a validation warning message.
   */
  items: ReadonlyArray<FileTokenGroupProps.Item>;
  /**
   * Adds an `aria-label` to the "Show fewer" button.
   * Use to assign unique labels when there are multiple file token groups with the same `limitShowFewer` label on one page.
   */
  limitShowFewerAriaLabel?: string;
  /**
   * Adds an `aria-label` to the "Show more" button.
   * Use to assign unique labels when there are multiple file token groups with the same `limitShowMore` label on one page.
   */
  limitShowMoreAriaLabel?: string;
  /**
   * Specifies if the control is read-only, which prevents the
   * user from modifying the value. A read-only control is still focusable.
   */
  readOnly?: boolean;
  /**
   * An object containing all the localized strings required by the component:
   * * `removeFileAriaLabel` (function): A function to render the ARIA label for file token remove button.
   * * `errorIconAriaLabel` (string): The ARIA label to be shown on the error file icon.
   * * `warningIconAriaLabel` (string): The ARIA label to be shown on the warning file icon.
   * * `formatFileSize` (function): (Optional) A function that takes file size in bytes, and produces a formatted string.
   * * `formatFileLastModified` (function): (Optional) A function that takes the files last modified date, and produces a formatted string.
   */
  i18nStrings: FileTokenGroupProps.I18nStrings;
}

export namespace FileTokenGroupProps {
  export interface DismissDetail {
    fileIndex: number;
  }

  export interface I18nStrings {
    limitShowFewer?: string;
    limitShowMore?: string;

    removeFileAriaLabel: (fileIndex: number) => string;
    errorIconAriaLabel?: string;
    warningIconAriaLabel?: string;
    formatFileSize?: (sizeInBytes: number) => string;
    formatFileLastModified?: (date: Date) => string;
  }

  export type Alignment = 'horizontal' | 'vertical';

  export interface Item {
    file: File;
    disabled?: boolean;
    loading?: boolean;
    errorText?: string;
    warningText?: string;
  }
}
