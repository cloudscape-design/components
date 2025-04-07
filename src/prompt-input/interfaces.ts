// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { IconProps } from '../icon/interfaces';
import {
  BaseChangeDetail,
  BaseInputProps,
  InputAutoComplete,
  InputAutoCorrect,
  InputKeyEvents,
  InputSpellcheck,
} from '../input/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';
import { BaseKeyDetail, NonCancelableEventHandler } from '../internal/events';

export interface PromptInputProps
  extends BaseInputProps,
    InputKeyEvents,
    InputAutoCorrect,
    InputAutoComplete,
    InputSpellcheck,
    BaseComponentProps,
    FormFieldValidationControlProps {
  /**
   * Called whenever a user clicks the action button or presses the "Enter" key.
   * The event `detail` contains the current value of the field.
   */
  onAction?: NonCancelableEventHandler<PromptInputProps.ActionDetail>;
  /**
   * Determines what icon to display in the action button.
   */
  actionButtonIconName?: IconProps.Name;
  /**
   * Specifies the URL of a custom icon. Use this property if the icon you want isn't available.
   *
   * If you set both `actionButtonIconUrl` and `actionButtonIconSvg`, `actionButtonIconSvg` will take precedence.
   */
  actionButtonIconUrl?: string;
  /**
   * Specifies the SVG of a custom icon.
   *
   * Use this property if you want your custom icon to inherit colors dictated by variant or hover states.
   * When this property is set, the component will be decorated with `aria-hidden="true"`. Ensure that the `svg` element:
   * - has attribute `focusable="false"`.
   * - has `viewBox="0 0 16 16"`.
   *
   * If you set the `svg` element as the root node of the slot, the component will automatically
   * - set `stroke="currentColor"`, `fill="none"`, and `vertical-align="top"`.
   * - set the stroke width based on the size of the icon.
   * - set the width and height of the SVG element based on the size of the icon.
   *
   * If you don't want these styles to be automatically set, wrap the `svg` element into a `span`.
   * You can still set the stroke to `currentColor` to inherit the color of the surrounding elements.
   *
   * If you set both `actionButtonIconUrl` and `actionButtonIconSvg`, `iconSvg` will take precedence.
   *
   * *Note:* Remember to remove any additional elements (for example: `defs`) and related CSS classes from SVG files exported from design software.
   * In most cases, they aren't needed, as the `svg` element inherits styles from the icon component.
   */
  actionButtonIconSvg?: React.ReactNode;
  /**
   * Specifies alternate text for a custom icon. We recommend that you provide this for accessibility.
   * This property is ignored if you use a predefined icon or if you set your custom icon using the `iconSvg` slot.
   */
  actionButtonIconAlt?: string;
  /**
   * Adds an aria-label to the action button.
   * @i18n
   */
  actionButtonAriaLabel?: string;

  /**
   * Specifies whether to disable the action button.
   */
  disableActionButton?: boolean;

  /**
   * Specifies the minimum number of lines of text to set the height to.
   */
  minRows?: number;

  /**
   * Specifies the maximum number of lines of text the textarea will expand to.
   * Defaults to 3. Use -1 for infinite rows.
   */
  maxRows?: number;

  /**
   * Use this slot to add secondary actions to the prompt input.
   */
  secondaryActions?: React.ReactNode;

  /**
   * Use this slot to add secondary content, such as file attachments, to the prompt input.
   */
  secondaryContent?: React.ReactNode;

  /**
   * Determines whether the secondary actions area of the input has padding. If true, removes the default padding from the secondary actions area.
   */
  disableSecondaryActionsPaddings?: boolean;

  /**
   * Determines whether the secondary content area of the input has padding. If true, removes the default padding from the secondary content area.
   */
  disableSecondaryContentPaddings?: boolean;
}

export namespace PromptInputProps {
  export type KeyDetail = BaseKeyDetail;
  export type ActionDetail = BaseChangeDetail;

  export interface Ref {
    /**
     * Sets input focus on the textarea control.
     */
    focus(): void;

    /**
     * Selects all text in the textarea control.
     */
    select(): void;

    /**
     * Selects a range of text in the textarea control.
     *
     * See https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/setSelectionRange
     * for more details on this method. Be aware that using this method in React has some
     * common pitfalls: https://stackoverflow.com/questions/60129605/is-javascripts-setselectionrange-incompatible-with-react-hooks
     */
    setSelectionRange(start: number | null, end: number | null, direction?: 'forward' | 'backward' | 'none'): void;
  }
}
