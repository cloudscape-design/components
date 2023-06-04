// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Breakpoint, matchBreakpointMapping } from '../internal/breakpoints';
import { ContainerProps, MediaDefinition } from './interfaces';

export function useMedia(media: ContainerProps.Media | undefined, breakpoint: Breakpoint | null) {
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
    mediaContent: content,
    mediaHeight: height,
    mediaWidth: width,
    mediaPosition: position || 'top',
  };
}

export function getBreakpointsForMedia(media?: ContainerProps.Media) {
  if (!media) {
    return [];
  }

  const breakpointKeys = new Set<Breakpoint>();

  // Iterate through the media object and add all the breakpoints to the set.
  Object.keys(media).forEach(key => {
    // We cast the key as 'keyof ContainerProps.Media',
    // because we know that the key can only be one of the `ContainerProps.Media`
    const attribute = key as keyof ContainerProps.Media;
    const attributeValue = media[attribute];

    const isBreakpointMapping =
      typeof attributeValue === 'object' &&
      attributeValue !== null &&
      ('default' in attributeValue || key !== 'content');

    if (isBreakpointMapping) {
      // We can safely cast attributeValue here because the isBreakpointMapping
      // check ensures that attributeValue is a BreakpointMapping.
      const attributeBreakpointMapping = attributeValue as MediaDefinition.BreakpointMapping<any>;

      Object.keys(attributeBreakpointMapping).forEach(bp => {
        // The keys of attributeBreakpointMapping are of type Breakpoint,
        // so we can safely cast the bp variable to the Breakpoint type.
        const breakpoint = bp as Breakpoint;
        if (breakpoint !== 'default' && attributeBreakpointMapping[breakpoint]) {
          breakpointKeys.add(breakpoint);
        }
      });
    }
  });
  return Array.from(breakpointKeys);
}
