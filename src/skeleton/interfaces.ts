// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../types/base-component';

export interface SkeletonProps extends BaseComponentProps {
  /**
   * Specifies the variant of the skeleton to match Box fontSize options.
   * The default value, `dynamic`, matches skeleton height to the surrounding font size.
   * * `text-body-s` - Skeleton with height matching body-s line-height.
   * * `text-body-m` - Skeleton with height matching body-m line-height.
   * * `text-heading-xs` - Skeleton with height matching heading-xs line-height.
   * * `text-heading-s` - Skeleton with height matching heading-s line-height.
   * * `text-heading-m` - Skeleton with height matching heading-m line-height.
   * * `text-heading-l` - Skeleton with height matching heading-l line-height.
   * * `text-heading-xl` - Skeleton with height matching heading-xl line-height.
   * * `text-display-l` - Skeleton with height matching display-l line-height.
   */
  variant?: SkeletonProps.Variant;

  /**
   * Specifies the CSS `display` of the skeleton.
   */
  display?: 'block' | 'inline-block' | 'inline';

  /**
   * Overrides the default HTML tag used by the component.
   */
  tagOverride?: string;

  /**
   * Specifies the height of the skeleton. Accepts any valid CSS value (for example, `"100px"`, `"3em"`).
   * By default the height is determined by the `variant`.
   */
  height?: string;

  /**
   * Specifies the width of the skeleton. Accepts any valid CSS value (for example, `"200px"`, `"100%"`).
   */
  width?: string;
}

export namespace SkeletonProps {
  export type Variant =
    | 'dynamic'
    | 'text-body-s'
    | 'text-body-m'
    | 'text-heading-xs'
    | 'text-heading-s'
    | 'text-heading-m'
    | 'text-heading-l'
    | 'text-heading-xl'
    | 'text-display-l';
}
