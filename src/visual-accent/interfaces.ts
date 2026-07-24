// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';

export interface VisualAccentProps extends BaseComponentProps {
  /**
   * The accent color variant.
   */
  color: VisualAccentProps.Color;

  /**
   * Text content to display. When provided, renders a text accent element.
   * Mutually exclusive with `iconName`.
   */
  content?: string;

  /**
   * Font size for text content.
   * @defaultValue 'body-m'
   */
  fontSize?: VisualAccentProps.FontSize;

  /**
   * Font weight for text content.
   * @defaultValue 'normal'
   */
  fontWeight?: VisualAccentProps.FontWeight;

  /**
   * Icon name to display. When provided, renders an icon accent element.
   * Mutually exclusive with `content`.
   */
  iconName?: IconProps.Name;

  /**
   * Size of the icon.
   * @defaultValue 'normal'
   */
  iconSize?: IconProps.Size;

  /**
   * Shape of the accent container.
   * @defaultValue 'sharp'
   */
  shape?: VisualAccentProps.Shape;
}

export namespace VisualAccentProps {
  export type Color = 'red' | 'yellow' | 'indigo' | 'green' | 'orange' | 'purple' | 'mint' | 'lime' | 'grey';
  export type FontSize = 'body-s' | 'body-m' | 'heading-xs' | 'heading-s' | 'heading-m';
  export type FontWeight = 'normal' | 'bold' | 'heavy';
  export type Shape = 'sharp' | 'circle';
}
