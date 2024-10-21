// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import InternalLiveRegion, {
  assertive,
  polite,
} from '../../../../../lib/components/internal/components/live-region/internal';

import styles from '../../../../../lib/components/internal/components/live-region/styles.css.js';

const renderLiveRegion = async (jsx: React.ReactElement) => {
  const { container } = render(jsx);
  await waitFor(() => expect(document.querySelector('[aria-live=polite]')));
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
  polite.reset();
  assertive.reset();
});

describe.skip('LiveRegion', () => {
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
    const { source, politeRegion, assertiveRegion } = await renderLiveRegion(<InternalLiveRegion delay={0} />);

    expect(source).toHaveTextContent('');
    expect(politeRegion).toHaveTextContent('');
    expect(assertiveRegion).toHaveTextContent('');
  });

  it('joins multiple live regions into a single update', async () => {
    const { politeRegion, assertiveRegion } = await renderLiveRegion(
      <>
        <InternalLiveRegion>One</InternalLiveRegion>
        <InternalLiveRegion>Two</InternalLiveRegion>
      </>
    );

    expect(politeRegion).toHaveTextContent('One Two');
    expect(assertiveRegion).toHaveTextContent('');
  });

  it('joins multiple live regions into a single update', async () => {
    const { politeRegion, assertiveRegion } = await renderLiveRegion(
      <>
        <InternalLiveRegion>One</InternalLiveRegion>
        <InternalLiveRegion>Two</InternalLiveRegion>
      </>
    );

    expect(politeRegion).toHaveTextContent('One Two');
    expect(assertiveRegion).toHaveTextContent('');
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
    const { politeRegion, assertiveRegion } = await renderLiveRegion(
      <InternalLiveRegion delay={0} hidden={true} assertive={true}>
        Announcement
      </InternalLiveRegion>
    );
    expect(assertiveRegion).toHaveAttribute('aria-live', 'assertive');
    expect(assertiveRegion).toHaveTextContent('Announcement');
    expect(politeRegion).toBeEmptyDOMElement();
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
});
