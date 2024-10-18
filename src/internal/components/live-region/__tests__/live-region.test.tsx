// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import InternalLiveRegion, {
  assertive,
  polite,
} from '../../../../../lib/components/internal/components/live-region/internal';
import { mockInnerText } from '../../../../internal/analytics/__tests__/mocks';

import styles from '../../../../../lib/components/internal/components/live-region/styles.css.js';

mockInnerText();

const renderLiveRegion = async (jsx: React.ReactElement) => {
  const { container } = render(jsx);
  await waitFor(() => expect(document.querySelector('[aria-live=polite]')));

  return {
    source: container.querySelector(`.${styles.root}`),
    politeRegion: document.querySelector('[aria-live=polite]')!,
    assertiveRegion: document.querySelector('[aria-live=assertive]')!,
  };
};

// The announcers persist throughout the lifecycle of the application.
// We need to reset them after each test.
afterEach(() => {
  polite.reset();
  assertive.reset();
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
    console.log({ assertiveRegion, politeRegion });
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
