// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';

export interface CarouselProps extends BaseComponentProps {
  variant?: CarouselProps.Variant;

  items: ReadonlyArray<CarouselProps.Item>;

  height?: number;
  /**
   * size
   * default to a predefined sizes of the carousel. User can also control the carousel height by using a number
   * that represents pixels.
   */
  size?: 'small' | 'medium' | 'large' | number;
  // Only applicable with multiple variant
  visibleItemNumber?: number;

  ariaLabel: string;
  ariaLabelNext: string;
  ariaLabelPrevious: string;
}

export namespace CarouselProps {
  export type Variant = 'single' | 'multiple';

  export interface Item {
    content: React.ReactNode;
    backgroundStyle?: string | ((mode: 'light' | 'dark') => string);
  }
}
