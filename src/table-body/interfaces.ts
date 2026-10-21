// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';

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
  export interface PositionStyle {
    position?: React.CSSProperties['position'];
    height?: React.CSSProperties['height'];
  }
}
