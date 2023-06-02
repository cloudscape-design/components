// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Breakpoint, matchBreakpointMapping } from '../internal/breakpoints';
import { ContainerProps, MediaDefinition } from './interfaces';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';

type MediaProps = keyof ContainerProps.Media;

const MEDIA_PROPS: MediaProps[] = ['position', 'width', 'height', 'content'];

export function useMedia(media?: ContainerProps.Media) {
  const [breakpoint, breakpointRef] = useContainerBreakpoints(getBreakpointsForMedia(media));

  const mediaState: ContainerProps.Media = {
    content: media?.content,
    height: media?.height,
    width: media?.width,
    position: media?.position || 'top',
  };

  if (media && breakpoint) {
    MEDIA_PROPS.forEach(attribute => {
      if (!media[attribute]) {
        return;
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

      mediaState[attribute] = value ?? '';
    });
  }

  return {
    breakpointRef,
    mediaContent: mediaState?.content,
    mediaHeight: mediaState?.height,
    mediaWidth: mediaState?.width,
    mediaPosition: mediaState?.position ?? 'top',
  };
}

export function getBreakpointsForMedia(media?: ContainerProps.Media) {
  if (!media) {
    return;
  }

  const breakpointKeys = new Set<Breakpoint>();

  MEDIA_PROPS.forEach(key => {
    if (media && typeof media[key] === 'object' && media[key] !== null) {
      const breakpointMapping = media[key] as MediaDefinition.BreakpointMapping<any>;
      Object.keys(breakpointMapping).forEach(key => {
        const breakpoint = key as Breakpoint;
        if (breakpoint !== 'default' && breakpointMapping[breakpoint]) {
          breakpointKeys.add(breakpoint);
        }
      });
    }
  });
  return Array.from(breakpointKeys);
}
