// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { Breakpoint, matchBreakpointMapping } from '../internal/breakpoints';
import { ContainerProps, MediaDefinition } from './interfaces';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';

type MediaProps = keyof ContainerProps.Media;

const MEDIA_PROPS: MediaProps[] = ['orientation', 'width', 'height', 'content'];

export function useMedia(media?: ContainerProps.Media) {
  const initialState = {
    content: media?.content,
    height: media?.height,
    width: media?.width,
    orientation: media?.orientation || 'horizontal',
  };
  const [mediaState, setMediaState] = useState(initialState);
  const [breakpoint, breakpointRef] = useContainerBreakpoints(getBreakpointsForMedia(media));

  useEffect(() => {
    if (!media || !breakpoint) {
      return;
    }

    const newMediaState = { ...mediaState };

    MEDIA_PROPS.forEach(attribute => {
      if (!media[attribute]) {
        return;
      }

      const value = matchBreakpointMapping(media[attribute] as MediaDefinition.BreakpointMapping<any>, breakpoint);

      // If no value is returned, it means there is no responsive attribute for this (or all) breakpoint(s).
      newMediaState[attribute] = value || media[attribute];
    });

    setMediaState(newMediaState);
  }, [media, mediaState, breakpoint]);

  return {
    breakpointRef,
    mediaContent: mediaState?.content,
    mediaHeight: mediaState?.height,
    mediaWidth: mediaState?.width,
    mediaOrientation: mediaState?.orientation,
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
