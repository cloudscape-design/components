// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';

/** Renders the table body that contains the rows. Its children are `TableRow` components. */
export interface TableBodyProps extends BaseComponentProps {
  /**
   * Applies inline styles to the body element. Use this to enable row positioning, for example for
   * virtualization or draggable rows. It is not supported to use this for general styling purposes.
   */
  positionStyle?: TableBodyProps.PositionStyle;
  /** The body rows. */
  children?: React.ReactNode;
}

export namespace TableBodyProps {
  /** Inline styles supported on the body element, for row positioning (for example, virtualization). */
  export interface PositionStyle {
    position?: React.CSSProperties['position'];
    height?: React.CSSProperties['height'];
  }
}
