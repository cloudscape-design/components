// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { matchBreakpointMapping } from '../internal/breakpoints';
import { ContainerProps } from './interfaces';
import { BREAKPOINTS_DESCENDING } from '../internal/breakpoints';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';

export function useMedia(media?: ContainerProps.Media) {
  const [breakpoint, breakpointRef] = useContainerBreakpoints(BREAKPOINTS_DESCENDING.filter(bp => bp !== 'default'));
  const {
    content = undefined,
    height = undefined,
    width = undefined,
    position = 'top',
  } = media && breakpoint
    ? Object.keys(media).reduce((mediaState, key) => {
        const attribute = key as keyof ContainerProps.Media;

        if (!media[attribute]) {
          return mediaState;
        }

        let value;

        if (attribute === 'content') {
          // If the `content` property has a defined breakpoint, we match the current breakpoint value,
          // otherwise we use the content value (ReactNode) directly.

          const contentValue = media[attribute];

          // If it's an object and contains a 'default' key, it's a BreakpointMapping.
          if (typeof contentValue === 'object' && contentValue !== null && 'default' in contentValue) {
            value = matchBreakpointMapping(contentValue, breakpoint);
          } else {
            // Otherwise, it's a ReactNode.
            value = contentValue;
          }
        } else {
          // For other properties ("height", "width", "position"), if the attribute property has a defined breakpoint,
          // we match the current breakpoint value. Otherwise, if the attribute value is a string or number, we use it directly.

          const attributeValue = media[attribute];
          // If it's an object, it's a BreakpointMapping
          if (typeof attributeValue === 'object' && attributeValue !== null) {
            value = matchBreakpointMapping(attributeValue, breakpoint);
          } else {
            // Otherwise, it's a string or number, use it directly
            value = attributeValue;
          }
        }
        return { ...mediaState, [attribute]: value ?? '' };
      }, {} as ContainerProps.Media)
    : {};

  return {
    breakpointRef,
    mediaContent: content,
    mediaHeight: height,
    mediaWidth: width,
    mediaPosition: position || 'top',
  };
}
