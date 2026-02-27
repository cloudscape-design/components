// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createRef } from 'react';
import { render, waitFor } from '@testing-library/react';

import { LiveRegionController } from '../../../lib/components/live-region/controller.js';
import InternalLiveRegion, {
  extractTextContent,
  InternalLiveRegionRef,
} from '../../../lib/components/live-region/internal.js';

import styles from '../../../lib/components/live-region/test-classes/styles.css.js';

const renderLiveRegion = async (jsx: React.ReactElement) => {
  const { container } = render(jsx);
  await waitFor(() => expect(document.querySelector('[aria-live]')).toBeTruthy());
  jest.runAllTimers();

  return {
    source: container.querySelector(`.${styles.root}`),
    politeRegion: document.querySelector('[aria-live=polite]')!,
    assertiveRegion: document.querySelector('[aria-live=assertive]')!,
  };
};

beforeEach(() => {
  jest.useFakeTimers();
});

// The announcers persist throughout the lifecycle of the application.
// We need to reset them after each test.
afterEach(() => {
  jest.clearAllTimers();
  (LiveRegionController as any)._nextAvailableSlot = 0;
});

describe('LiveRegion', () => {
  it('renders', async () => {
    const { source, politeRegion } = await renderLiveRegion(
      <InternalLiveRegion delay={0}>Announcement</InternalLiveRegion>
    );

    expect(source).toHaveTextContent('Announcement');
    expect(politeRegion).toHaveAttribute('aria-live', 'polite');
    expect(politeRegion).toHaveAttribute('aria-atomic', 'true');
    expect(politeRegion).toHaveTextContent('Announcement');
  });

  it('does nothing when no message or children are provided', async () => {
    const { source, politeRegion } = await renderLiveRegion(<InternalLiveRegion delay={0} />);

    expect(source).toHaveTextContent('');
    expect(politeRegion).toHaveTextContent('');
  });

  it('renders with a div by default', async () => {
    const { source, politeRegion } = await renderLiveRegion(
      <InternalLiveRegion delay={0}>Announcement</InternalLiveRegion>
    );

    expect(source!.tagName).toBe('DIV');
    expect(politeRegion).toHaveTextContent('Announcement');
  });

  it('wraps visible content in a div by default', async () => {
    const { source: visibleSource } = await renderLiveRegion(
      <InternalLiveRegion delay={0}>Announcement</InternalLiveRegion>
    );

    expect(visibleSource!.tagName).toBe('DIV');
    expect(visibleSource).toHaveTextContent('Announcement');
  });

  it('can render with a span', async () => {
    const { source } = await renderLiveRegion(
      <InternalLiveRegion delay={0} tagName="span" hidden={true}>
        Announcement
      </InternalLiveRegion>
    );

    expect(source!.tagName).toBe('SPAN');
    expect(source).toHaveTextContent('Announcement');
  });

  it('can wrap visible content in a div', async () => {
    const { source } = await renderLiveRegion(
      <InternalLiveRegion delay={0} tagName="div">
        Announcement
      </InternalLiveRegion>
    );

    expect(source!.tagName).toBe('DIV');
  });

  it('can render assertive live region', async () => {
    const { assertiveRegion } = await renderLiveRegion(
      <InternalLiveRegion delay={0} hidden={true} assertive={true}>
        Announcement
      </InternalLiveRegion>
    );
    expect(assertiveRegion).toHaveAttribute('aria-live', 'assertive');
    expect(assertiveRegion).toHaveTextContent('Announcement');
  });

  it('uses the `source` parameter if provided', async () => {
    const ref = { current: null };
    const { politeRegion } = await renderLiveRegion(
      <>
        <InternalLiveRegion delay={0} sources={['static text', ref, undefined, 'more static text']}>
          Announcement
        </InternalLiveRegion>
        <span ref={ref}>Element text</span>
      </>
    );
    expect(politeRegion).toHaveTextContent('static text Element text more static text');
    expect(politeRegion).not.toHaveTextContent('Announcement');
  });

  it('re-announces the message if reannounce() is called', async () => {
    const ref = createRef<InternalLiveRegionRef>();
    const { politeRegion } = await renderLiveRegion(
      <InternalLiveRegion ref={ref} delay={0} hidden={true}>
        Announcement
      </InternalLiveRegion>
    );
    expect(politeRegion).toHaveAttribute('aria-live', 'polite');
    expect(politeRegion).toHaveTextContent('Announcement');

    ref.current?.reannounce();
    await waitFor(() => expect(politeRegion).toHaveTextContent('Announcement.'));

    ref.current?.reannounce();
    expect(politeRegion).toHaveTextContent('Announcement');
  });

  it('announces second message when first is still pending', async () => {
    // 1. First announcement is made with delay
    // 2. Before delay expires, second announcement arrives
    // 3. Second announcement should replace the first

    const ref = createRef<InternalLiveRegionRef>();

    // Use delay > 0 to test the timeout behavior
    const { rerender } = render(
      <InternalLiveRegion ref={ref} delay={0.1} hidden={true}>
        First announcement
      </InternalLiveRegion>
    );

    await waitFor(() => expect(document.querySelector('[aria-live]')).toBeTruthy());

    // First announcement is queued but not yet in DOM
    const politeRegion = document.querySelector('[aria-live=polite]')!;
    expect(politeRegion).toHaveTextContent(''); // Not announced yet

    // Before first timeout fires, update with second message
    rerender(
      <InternalLiveRegion ref={ref} delay={0.1} hidden={true}>
        Second announcement
      </InternalLiveRegion>
    );

    // Fast-forward time to trigger timeout
    jest.advanceTimersByTime(100);

    // Second message should be announced (not first)
    await waitFor(() => {
      expect(politeRegion).toHaveTextContent('Second announcement');
    });

    // Verify first message was never announced
    expect(politeRegion).not.toHaveTextContent('First announcement');
  });

  it('handles rapid successive announcements correctly', async () => {
    // Scanrrio: "Refreshing" → "Refresh Complete" in quick succession

    const ref = createRef<InternalLiveRegionRef>();

    const { rerender } = render(
      <InternalLiveRegion ref={ref} delay={0.1} hidden={true}>
        Refreshing
      </InternalLiveRegion>
    );

    await waitFor(() => expect(document.querySelector('[aria-live]')).toBeTruthy());

    // Immediately update to completion message
    rerender(
      <InternalLiveRegion ref={ref} delay={0.1} hidden={true}>
        Refresh complete
      </InternalLiveRegion>
    );

    // Fast-forward to trigger timeout
    jest.advanceTimersByTime(100);

    const politeRegion = document.querySelector('[aria-live=polite]')!;

    // Should announce the latest message
    await waitFor(() => {
      expect(politeRegion).toHaveTextContent('Refresh complete');
    });
  });

  it('clears pending timeout when new announcement arrives', async () => {
    // Verifies "old" timeouts are properly cleared

    const ref = createRef<InternalLiveRegionRef>();

    const { rerender } = render(
      <InternalLiveRegion ref={ref} delay={0.2} hidden={true}>
        First
      </InternalLiveRegion>
    );

    await waitFor(() => expect(document.querySelector('[aria-live]')).toBeTruthy());

    // Wait 100ms (half of delay)
    jest.advanceTimersByTime(100);

    // Update with new message
    rerender(
      <InternalLiveRegion ref={ref} delay={0.2} hidden={true}>
        Second
      </InternalLiveRegion>
    );

    // Advance another 100ms (would trigger first timeout if not cleared)
    jest.advanceTimersByTime(100);

    const politeRegion = document.querySelector('[aria-live=polite]')!;

    // Should NOT have announced yet (new timeout needs full 200ms)
    expect(politeRegion).toHaveTextContent('');

    // Advance remaining time for second timeout
    jest.advanceTimersByTime(100);

    // Now should announce second message
    await waitFor(() => {
      expect(politeRegion).toHaveTextContent('Second');
    });
  });

  it('staggers announcements from multiple LiveRegion instances', async () => {
    render(
      <InternalLiveRegion delay={2} hidden={true}>
        First message
      </InternalLiveRegion>
    );

    render(
      <InternalLiveRegion delay={2} hidden={true}>
        Second message
      </InternalLiveRegion>
    );

    await waitFor(() => expect(document.querySelectorAll('[aria-live]').length).toBe(2));

    const regions = document.querySelectorAll('[aria-live=polite]');
    const region1 = regions[0];
    const region2 = regions[1];

    // Both should be empty initially
    expect(region1).toHaveTextContent('');
    expect(region2).toHaveTextContent('');

    // Advance to first announcement time (2000ms)
    jest.advanceTimersByTime(2000);

    // First should announce
    await waitFor(() => {
      expect(region1).toHaveTextContent('First message');
    });

    // Second should NOT announce yet (staggered by 500ms)
    expect(region2).toHaveTextContent('');

    // Advance to staggered time (500ms gap)
    jest.advanceTimersByTime(500);

    // Now second should announce
    await waitFor(() => {
      expect(region2).toHaveTextContent('Second message');
    });
  });
});

describe('text extractor', () => {
  it('extracts text from an empty element', () => {
    const el = document.createElement('div');
    expect(extractTextContent(el)).toBe('');
  });

  it('extracts text from an empty element with a comment', () => {
    const el = document.createElement('div');
    el.innerHTML = '<!-- comment -->';
    expect(extractTextContent(el)).toBe('');
  });

  it('extracts text from a single element', () => {
    const el = document.createElement('div');
    el.textContent = 'Hello';
    expect(extractTextContent(el)).toBe('Hello');
  });

  it('extracts text from nested elements', () => {
    const el = document.createElement('article');
    el.innerHTML = `
        <h1>Hello</h1>
        <p>World</p>
        <span>inline</span>
        <span>content</span>
        <span></span>
    `;
    expect(extractTextContent(el)).toBe('Hello World inline content');
  });
});
