// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import customCssProps from '../internal/generated/custom-css-properties';
import { isDevelopment } from '../internal/is-development';

const MIN_CONTENT_HEIGHT = 60;
const MIN_MODAL_WIDTH = 320;

interface UseModalDimensionsProps {
  height?: number;
  width?: number;
  hasFooter: boolean;
}

export function useModalDimensions({ height, width, hasFooter }: UseModalDimensionsProps) {
  const [footerHeight, footerRef] = useContainerQuery(rect => rect.borderBoxHeight);
  const [headerHeight, headerRef] = useContainerQuery(rect => rect.borderBoxHeight);

  const minModalHeight = (headerHeight ?? 0) + (hasFooter ? (footerHeight ?? 0) : 0) + MIN_CONTENT_HEIGHT;
  const constrainedHeight = Math.max(height ?? 0, minModalHeight);
  const constrainedWidth = Math.max(width ?? 0, MIN_MODAL_WIDTH);

  const hasCustomHeight = height !== undefined && !Number.isNaN(height);
  const hasCustomWidth = width !== undefined && !Number.isNaN(width);

  if (isDevelopment) {
    if (hasCustomHeight && constrainedHeight !== height) {
      warnOnce(
        'Modal',
        `Height (${height}px) is too small. Modal requires at least ${MIN_CONTENT_HEIGHT}px for content plus header/footer space (total: ${minModalHeight}px). Height will be adjusted to ${constrainedHeight}px.`
      );
    }
    if (hasCustomWidth && constrainedWidth !== width) {
      warnOnce(
        'Modal',
        `Width (${width}px) is below minimum (${MIN_MODAL_WIDTH}px) and will be adjusted to ${constrainedWidth}px.`
      );
    }
  }

  return {
    footerRef,
    headerRef,
    footerHeight,
    hasCustomHeight,
    hasCustomWidth,
    dialogCustomStyles: {
      ...(hasCustomWidth && { [customCssProps.modalCustomWidth]: `${constrainedWidth}px` }),
      ...(hasCustomHeight && { [customCssProps.modalCustomHeight]: `${constrainedHeight}px` }),
    },
  };
}
