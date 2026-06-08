// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
/**
 * @awsuiSystem core
 */
import { NativeAttributes } from '../internal/utils/with-native-attributes';

export interface ItemCardProps extends BaseComponentProps {
  /**
   * Heading element of the item card. Use this to add a title or header text.
   */
  header?: React.ReactNode;

  /**
   * A description or subtitle displayed below the header.
   */
  description?: React.ReactNode;

  /**
   * Footer content displayed at the bottom of the item card.
   */
  footer?: React.ReactNode;

  /**
   * Actions to display in the item card header area, typically buttons or links.
   */
  actions?: React.ReactNode;

  /**
   * Main content of the item card.
   */
  children?: React.ReactNode;

  /**
   * Icon content displayed next to the header.
   */
  icon?: React.ReactNode;

  /**
   * Removes the default padding from the header area.
   * @default false
   */
  disableHeaderPaddings?: boolean;

  /**
   * Removes the default padding from the content area.
   * @default false
   */
  disableContentPaddings?: boolean;

  /**
   * Removes the default padding from the footer area.
   * @default false
   */
  disableFooterPaddings?: boolean;

  /**
   * Specifies the visual variant of the item card, which controls the border radius and padding.
   *
   * - `default` - Uses container-level border radius and padding (larger).
   * - `embedded` - Uses compact border radius and padding (smaller).
   *
   * @default 'default'
   */
  variant?: ItemCardProps.Variant;

  /**
   * An object containing CSS properties to customize the item card's visual appearance.
   * Refer to the [style](/components/item-card/?tabId=style) tab for more details.
   * @awsuiSystem core
   */
  style?: ItemCardProps.Style;

  /**
   * Attributes to add to the native root element.
   * Some attributes will be automatically combined with internal attribute values:
   * - `className` will be appended.
   * - Event handlers will be chained, unless the default is prevented.
   *
   * We do not support using this attribute to apply custom styling.
   *
   * @awsuiSystem core
   */
  nativeAttributes?: NativeAttributes<React.HTMLAttributes<HTMLDivElement>>;
}

export namespace ItemCardProps {
  export type Variant = 'embedded' | 'default';

  export interface Style {
    root?: {
      background?: string;
      borderColor?: string;
      borderRadius?: string;
      borderWidth?: string;
      boxShadow?: string;
    };
    content?: {
      paddingBlock?: string;
      paddingInline?: string;
    };
    header?: {
      paddingBlock?: string;
      paddingInline?: string;
    };
    footer?: {
      root?: {
        paddingBlock?: string;
        paddingInline?: string;
      };
      divider?: {
        borderColor?: string;
        borderWidth?: string;
      };
    };
  }
}

export interface InternalItemCardProps extends ItemCardProps, InternalBaseComponentProps {
  /**
   * Called when the user clicks on the item card.
   */
  onClick?: React.MouseEventHandler<HTMLElement>;

  /**
   * Specifies whether the item card is in highlighted state.
   */
  highlighted?: boolean;

  /**
   * Makes the item card stretch to fill the full height of its container.
   */
  fullHeight?: boolean;

  /**
   * Specifies metadata for analytics in cards
   */
  metadataAttributes?: Record<string, string | undefined>;
}
