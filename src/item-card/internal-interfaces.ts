// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { ItemCardProps } from './interfaces';

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
   * Specifies metadata for analytics in cards
   */
  metadataAttributes?: Record<string, string | undefined>;
}
