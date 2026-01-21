// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { FocusEventHandler } from 'react';

import { BaseComponentProps } from '../base-component';

export interface InternalCardProps extends BaseComponentProps {
  /**
   * Specifies an action for the card.
   * It is recommended to use a button with inline-icon variant.
   */
  action?: React.ReactNode;

  /**
   * Specifies whether the card is in active state.
   */
  active?: boolean;

  /**
   * Optional URL for an image which will be displayed cropped as a background of the card.
   * When this property is used, a dark gradient is overlayed and the text above defaults to bright colors.
   * Make sure that any content you place on the card has sufficient contrast with the overlayed image behind.
   */
  imageUrl?: string;

  /**
   * Primary content displayed in the card.
   */
  children?: React.ReactNode;

  /**
   * Heading text.
   */
  header?: React.ReactNode;

  /**
   * Icon which will be displayed at the top of the card,
   * inline at the start of the content.
   */
  icon?: React.ReactNode;

  /**
   * Called when the user clicks on the card.
   */
  onClick?: React.MouseEventHandler<HTMLElement>;

  onFocus?: FocusEventHandler<HTMLElement>;

  role?: string;

  TagName?: 'li' | 'div';

  metadataAttributes: Record<string, string | undefined>;

  innerMetadataAttributes: Record<string, string | undefined>;
}
