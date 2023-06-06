// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useMedia } from '../media';
import { renderHook } from '../../__tests__/render-hook';
import { ContainerProps } from '../../../lib/components/container';
import { MediaDefinition } from '../interfaces';
import { Breakpoint } from '../../internal/breakpoints';
describe('Container with media', () => {
  describe('useMedia', () => {
    test('should return the correct media states given the media properties', () => {
      const media: ContainerProps.Media = {
        content: <div>Test</div>,
        height: '100px',
        width: '100px',
        position: 'side',
      };

      const { result } = renderHook(() => useMedia(media, 'default'));

      expect(result.current.mediaContent).toBe(media.content);
      expect(result.current.mediaHeight).toBe(media.height);
      expect(result.current.mediaWidth).toBe(media.width);
      expect(result.current.mediaPosition).toBe(media.position);
    });

    test('should return the default media states if no media properties are given', () => {
      const media: ContainerProps.Media = {
        content: <div>Test</div>,
        height: undefined,
      };

      const { result } = renderHook(() => useMedia(media, 'default'));

      expect(result.current.mediaContent).toBe(media.content);
      expect(result.current.mediaHeight).toBe(undefined);
      expect(result.current.mediaWidth).toBe(undefined);
      expect(result.current.mediaPosition).toBe('top');
    });

    test('should return the default media states if media is undefined', () => {
      const { result } = renderHook(() => useMedia(undefined, 'default'));

      expect(result.current.mediaContent).toBe(undefined);
      expect(result.current.mediaHeight).toBe(undefined);
      expect(result.current.mediaWidth).toBe(undefined);
      expect(result.current.mediaPosition).toBe('top');
    });

    test('should return the default media states if breakpoint is null', () => {
      const media: ContainerProps.Media = {
        content: <div>Test</div>,
        height: '100px',
        width: '100px',
        position: 'side',
      };
      const { result } = renderHook(() => useMedia(media, null));

      expect(result.current.mediaContent).toBe(undefined);
      expect(result.current.mediaHeight).toBe(undefined);
      expect(result.current.mediaWidth).toBe(undefined);
      expect(result.current.mediaPosition).toBe('top');
    });

    test('should handle BreakpointMapping objects correctly', () => {
      const media: ContainerProps.Media = {
        content: {
          default: <div>Test Default</div>,
          xs: <div>Test XS</div>,
        },
        height: {
          default: '100px',
        },
        width: {
          default: '100px',
          xs: '150px',
        },
        position: {
          default: 'top',
          xs: 'side',
        },
      };

      const { result, rerender } = renderHook(breakpoint => useMedia(media, breakpoint), {
        initialProps: 'default' as Breakpoint,
      });

      // Assuming the current breakpoint is 'default',
      // check that the returned media states match the 'default' properties
      expect(result.current.mediaContent).toBe((media.content as MediaDefinition.ContentBreakpointMapping).default);
      expect(result.current.mediaHeight).toBe((media.height as MediaDefinition.BreakpointMapping<string>).default);
      expect(result.current.mediaWidth).toBe((media.width as MediaDefinition.BreakpointMapping<string>).default);
      expect(result.current.mediaPosition).toBe(
        (media.position as MediaDefinition.BreakpointMapping<'top' | 'side'>).default
      );
      rerender('xs');
      expect(result.current.mediaContent).toBe((media.content as MediaDefinition.ContentBreakpointMapping).xs);
      expect(result.current.mediaHeight).toBe((media.height as MediaDefinition.BreakpointMapping<string>).default);
      expect(result.current.mediaWidth).toBe((media.width as MediaDefinition.BreakpointMapping<string>).xs);
      expect(result.current.mediaPosition).toBe(
        (media.position as MediaDefinition.BreakpointMapping<'top' | 'side'>).xs
      );
    });
  });
});
