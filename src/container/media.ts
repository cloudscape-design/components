// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { Breakpoint, BREAKPOINTS_DESCENDING, matchBreakpointMapping } from '../internal/breakpoints';
import { ContainerProps, MediaDefinition } from './interfaces';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';

type MediaProps = keyof ContainerProps.Media;

const MEDIA_PROPS: MediaProps[] = ['position', 'width', 'height', 'content'];

const hasDefinedBreakpoint = (obj: any) => {
  return BREAKPOINTS_DESCENDING.some(key => obj[key] !== undefined);
};

export function useMedia(media?: ContainerProps.Media) {
  const initialState = {
    content: media?.content,
    height: '',
    width: '',
    position: media?.position || 'top',
  };
  const [mediaState, setMediaState] = useState(initialState);
  const [breakpoint, breakpointRef] = useContainerBreakpoints(getBreakpointsForMedia(media));
  useEffect(() => {
    if (!media || !breakpoint) {
      return;
    }

    setMediaState(prevMediaState => {
      const newMediaState = { ...prevMediaState };

      MEDIA_PROPS.forEach(attribute => {
        if (!media[attribute]) {
          return;
        }

        let value;

        if (attribute === 'content') {
          value = hasDefinedBreakpoint(media[attribute])
            ? matchBreakpointMapping(media[attribute] as MediaDefinition.BreakpointMapping<any>, breakpoint)
            : media[attribute];
        } else {
          value = hasDefinedBreakpoint(media[attribute])
            ? matchBreakpointMapping(media[attribute] as MediaDefinition.BreakpointMapping<any>, breakpoint)
            : typeof media[attribute] === 'string' || typeof media[attribute] === 'number'
            ? media[attribute]
            : null;
        }

        newMediaState[attribute] = value;
      });

      return newMediaState;
    });
  }, [media, breakpoint]);
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
