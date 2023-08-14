// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';

export interface BoxProps extends BaseComponentProps {
  /**
   * Defines the style of element to display.
   *
   * - If you set it to `'div'`, `'span'`, `'h1'`, `'h2'`, `'h3'`, `'h4'`, `'h5'`, `'p'`, `'strong'`, `'small'`, `'code'`, `'pre'`, or `'samp'`, the variant is also used as the HTML tag name.
   * - If you set it to `awsui-key-label`, the component will display as a `div`.
   * - If you set it to `awsui-value-large`, the component will display as a `span`.
   *
   * Override the HTML tag by using property `tagOverride`.
   */
  variant?: BoxProps.Variant;
  /**
   * Overrides the default HTML tag provided by the variant.
   */
  tagOverride?: string;
  /**
   * Overrides the display of the element. You can set it to the following values:
   *
   * - `block` - Specifies block display.
   * - `inline` - Specifies inline display.
   * - `inline-block` - Specifies inline-block display.
   * - `none` - Hides the box.
   *
   * Note: If you don't set it, the display depends on the variant.
   */
  display?: BoxProps.Display;
  /**
   * Adds margins to the element. It can be the following:
   *
   * - A single string with a size. This applies the same margin to all sides (that is, top, right, bottom, left).
   * - An object specifying the size of the margin per side. The object has the following format:
   * ```
   * {
   *   top: "size of top margin",
   *   right: "size of right margin",
   *   bottom: "size of bottom margin",
   *   left: "size of left margin",
   *   horizontal: "size of left and right margin",
   *   vertical: "size of top and bottom margin",
   * }
   * ```
   *
   * The size can be `n`, `xxxs`, `xxs`, `xs`, `s`, `m`, `l`, `xl`, `xxl`, `xxxl`, where `n` stands for none.
   * Sizes are automatically scaled down in compact mode.
   *
   *  For example, `margin="s"` adds a small margin to all sides.
   * `margin={{ right: "l", bottom: "s" }}` adds a small margin to the bottom and a large margin to the right.
   */
  margin?: BoxProps.SpacingSize | BoxProps.Spacing;
  /**
   * Adds padding to the element. It can be the following:
   *
   * - A single string with a size. This applies the same padding to all sides (that is, top, right, bottom, left).
   * - An object specifying the size of padding per side. The object has the following format:
   * ```
   * {
   *   top: "size of top padding",
   *   right: "size of right padding",
   *   bottom: "size of bottom padding",
   *   left: "size of left padding",
   *   horizontal: "size of left and right padding",
   *   vertical: "size of top and bottom padding",
   * }
   * ```
   *
   * The size can be `n`, `xxxs`, `xxs`, `xs`, `s`, `m`, `l`, `xl`, `xxl`, `xxxl`, where `n` stands for none.
   * Sizes are automatically scaled down in compact mode.
   *
   *  For example, `padding="s"` adds small padding to all sides.
   * `padding={{ right: "l", bottom: "s" }}` adds small padding to the bottom and large padding to the right.
   */
  padding?: BoxProps.SpacingSize | BoxProps.Spacing;
  /**
   * Defines the text alignment within the element. You can set it to `left`, `center`, or `right`.
   */
  textAlign?: BoxProps.TextAlign;
  /**
   * Defines the floating behavior. You can set it to `left` or `right`.
   */
  float?: BoxProps.Float;
  /**
   * Overrides the font size and line height. If not set, the font size and line height depend on the variant.
   */
  fontSize?: BoxProps.FontSize;
  /**
   * Overrides the font weight. If not set, the value depends on the variant.
   * @visualrefresh 'heavy'
   */
  fontWeight?: BoxProps.FontWeight;
  /**
   * Overrides the text color. You can set it to the following values:
   *
   * - `inherit` - Inherits the color from the parent element. For example, use this to style content
   *      in Flashbars and to style the `empty` and `noMatch` slots of the Table and Cards components.
   * - `text-label` - Specifies the text color for non-form labels. For example, use it for the key in key/value pairs.
   * - `text-body-secondary` - Specifies the color for secondary text.
   * - `text-status-error` - Specifies the color for error text and icons.
   * - `text-status-success` - Specifies the color for success text and icons.
   * - `text-status-info` - Specifies the color for info text and icon.
   * - `text-status-inactive` - Specifies the color for inactive and loading text and icons.
   * - `text-status-warning` - Specifies the color for warning text and icons.
   *
   * Note: If you don't set it, the text color depends on the variant.
   */
  color?: BoxProps.Color;
  /**
   * Content of the box.
   * @displayname content
   */
  children?: React.ReactNode;
}

export namespace BoxProps {
  export type Variant =
    | 'div'
    | 'span'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'p'
    | 'strong'
    | 'small'
    | 'code'
    | 'pre'
    | 'samp'
    | 'awsui-key-label'
    | 'awsui-value-large';

  export type Display = 'block' | 'inline' | 'inline-block' | 'none';
  export type TextAlign = 'left' | 'center' | 'right';
  export type Float = 'left' | 'right';
  export type FontSize =
    | 'body-s'
    | 'body-m'
    | 'heading-xs'
    | 'heading-s'
    | 'heading-m'
    | 'heading-l'
    | 'heading-xl'
    | 'display-l';
  export type FontWeight = 'light' | 'normal' | 'bold' | 'heavy';
  export type Color =
    | 'inherit'
    | 'text-label'
    | 'text-body-secondary'
    | 'text-status-error'
    | 'text-status-success'
    | 'text-status-info'
    | 'text-status-inactive'
    | 'text-status-warning';
  export type SpacingSize = 'n' | 'xxxs' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl';
  export interface Spacing {
    top?: BoxProps.SpacingSize;
    right?: BoxProps.SpacingSize;
    bottom?: BoxProps.SpacingSize;
    left?: BoxProps.SpacingSize;
    horizontal?: BoxProps.SpacingSize;
    vertical?: BoxProps.SpacingSize;
  }
}
