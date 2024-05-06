// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import LiveRegion, { polite, assertive } from '../../../../../lib/components/internal/components/live-region';
import { mockInnerText } from '../../../../internal/analytics/__tests__/mocks';
import styles from '../../../../../lib/components/internal/components/live-region/styles.css.js';

mockInnerText();

const renderLiveRegion = async (jsx: React.ReactElement) => {
  const { container } = render(jsx);
  await waitFor(() => expect(document.querySelector('[aria-live=polite]')));

  return {
    visibleSource: container.querySelector(`.${styles.root}`),
    hiddenSource: container.querySelector('[hidden]'),
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
    const { hiddenSource, politeRegion } = await renderLiveRegion(<LiveRegion delay={0}>Announcement</LiveRegion>);

    expect(hiddenSource).toHaveTextContent('Announcement');
    expect(politeRegion).toHaveAttribute('aria-live', 'polite');
    expect(politeRegion).toHaveAttribute('aria-atomic', 'true');
    expect(politeRegion).toHaveTextContent('Announcement');
  });

  it('renders with a span by default', async () => {
    const { hiddenSource, politeRegion } = await renderLiveRegion(<LiveRegion delay={0}>Announcement</LiveRegion>);

    expect(hiddenSource!.tagName).toBe('SPAN');
    expect(politeRegion).toHaveTextContent('Announcement');
  });

  it('wraps visible content in a span by default', async () => {
    const { visibleSource } = await renderLiveRegion(
      <LiveRegion delay={0} visible={true}>
        Announcement
      </LiveRegion>
    );

    expect(visibleSource!.tagName).toBe('SPAN');
    expect(visibleSource).toHaveTextContent('Announcement');
  });

  it('can render with a div', async () => {
    const { hiddenSource } = await renderLiveRegion(
      <LiveRegion delay={0} tagName="div">
        Announcement
      </LiveRegion>
    );

    expect(hiddenSource!.tagName).toBe('DIV');
    expect(hiddenSource).toHaveTextContent('Announcement');
  });

  it('can wrap visible content in a div', async () => {
    const { visibleSource } = await renderLiveRegion(
      <LiveRegion delay={0} tagName="div" visible={true}>
        Announcement
      </LiveRegion>
    );

    expect(visibleSource!.tagName).toBe('DIV');
  });

  it('can render assertive live region', async () => {
    const { politeRegion, assertiveRegion } = await renderLiveRegion(
      <LiveRegion delay={0} assertive={true}>
        Announcement
      </LiveRegion>
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
        <LiveRegion delay={0} source={['static text', ref, undefined, 'more static text']}>
          Announcement
        </LiveRegion>
        <span ref={ref}>Element text</span>
      </>
    );
    expect(politeRegion).toHaveTextContent('static text Element text more static text');
    expect(politeRegion).not.toHaveTextContent('Announcement');
  });
});
