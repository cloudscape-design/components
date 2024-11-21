// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';

export interface CarouselProps extends BaseComponentProps {
  variant?: CarouselProps.Variant;

  items: ReadonlyArray<CarouselProps.Item>;

  height?: number;

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
