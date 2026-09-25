// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { act, renderHook } from '../../__tests__/render-hook';
import { useLiveTail } from '../use-live-tail';

// Built-in live tail (F2 headline feature). `follow` is controlled — the console owns the
// policy, VirtualTable owns the pin-to-newest mechanics (in a layout effect, after the
// runway grows, so the pin is tolerance-independent) and the release-on-scroll-away
// detection (fired at most once per follow session). These tests pin that contract with a
// spied scrollToEnd/isPinnedToEnd and a real element for the scroll listener.

function makeRef(): React.RefObject<HTMLElement> {
  return { current: document.createElement('div') } as React.RefObject<HTMLElement>;
}

describe('VirtualTable (F2-A1) useLiveTail', () => {
  test('pins to newest on entering follow and on every append while following', () => {
    const scrollToEnd = jest.fn();
    const ref = makeRef();
    let count = 3;
    const { rerender } = renderHook(() =>
      useLiveTail({
        follow: true,
        itemCount: count,
        scrollContainerRef: ref,
        scrollToEnd,
        isPinnedToEnd: () => true,
      })
    );
    // Pinned on entering follow.
    expect(scrollToEnd).toHaveBeenCalledTimes(1);

    // Each append (itemCount change) re-pins to newest.
    count = 4;
    act(() => rerender({}));
    expect(scrollToEnd).toHaveBeenCalledTimes(2);
  });

  test('does not pin when not following', () => {
    const scrollToEnd = jest.fn();
    const ref = makeRef();
    let count = 3;
    const { rerender } = renderHook(() =>
      useLiveTail({
        follow: false,
        itemCount: count,
        scrollContainerRef: ref,
        scrollToEnd,
        isPinnedToEnd: () => false,
      })
    );
    expect(scrollToEnd).not.toHaveBeenCalled();
    count = 4;
    act(() => rerender({}));
    expect(scrollToEnd).not.toHaveBeenCalled();
  });

  test('releases follow once when the user scrolls away from the bottom', () => {
    const onFollowChange = jest.fn();
    const ref = makeRef();
    renderHook(() =>
      useLiveTail({
        follow: true,
        itemCount: 10,
        scrollContainerRef: ref,
        scrollToEnd: () => {},
        isPinnedToEnd: () => false, // user has scrolled up
        onFollowChange,
      })
    );

    act(() => {
      ref.current!.dispatchEvent(new Event('scroll'));
    });
    expect(onFollowChange).toHaveBeenCalledTimes(1);
    expect(onFollowChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { follow: false, reason: 'scroll-away' } })
    );

    // Only once per follow session — a second scroll does not re-fire.
    act(() => {
      ref.current!.dispatchEvent(new Event('scroll'));
    });
    expect(onFollowChange).toHaveBeenCalledTimes(1);
  });

  test('does not release follow when a scroll lands pinned to the bottom (our own pin)', () => {
    const onFollowChange = jest.fn();
    const ref = makeRef();
    renderHook(() =>
      useLiveTail({
        follow: true,
        itemCount: 10,
        scrollContainerRef: ref,
        scrollToEnd: () => {},
        isPinnedToEnd: () => true, // still at the bottom edge
        onFollowChange,
      })
    );
    act(() => {
      ref.current!.dispatchEvent(new Event('scroll'));
    });
    expect(onFollowChange).not.toHaveBeenCalled();
  });
});
