// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import createWrapper from '../../../../../lib/components/test-utils/dom';
import LiveRegion from '../../../../../lib/components/internal/components/live-region';
import { mockInnerText } from '../../../../internal/analytics/__tests__/mocks';

mockInnerText();

const renderLiveRegion = async (jsx: React.ReactElement) => {
  const { container } = render(jsx);
  const wrapper = createWrapper(container);

  await waitFor(() => expect(wrapper.find('[aria-live]')!.getElement()).not.toBeEmptyDOMElement());

  return {
    wrapper,
    container,
    visibleSource: wrapper.find(':first-child')?.getElement(),
    hiddenSource: wrapper.find('[aria-hidden=true]')?.getElement(),
    liveRegion: wrapper.find('[aria-live]')!.getElement(),
  };
};

describe('LiveRegion', () => {
  it('renders', async () => {
    const { hiddenSource, liveRegion } = await renderLiveRegion(<LiveRegion>Announcement</LiveRegion>);

    expect(hiddenSource).toHaveTextContent('Announcement');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    expect(liveRegion).toHaveTextContent('Announcement');
  });

  it('renders with a span by default', async () => {
    const { hiddenSource, liveRegion } = await renderLiveRegion(<LiveRegion>Announcement</LiveRegion>);

    expect(hiddenSource!.tagName).toBe('SPAN');
    expect(liveRegion).toHaveTextContent('Announcement');
  });

  it('wraps visible content in a span by default', async () => {
    const { visibleSource } = await renderLiveRegion(<LiveRegion visible={true}>Announcement</LiveRegion>);

    expect(visibleSource!.tagName).toBe('SPAN');
    expect(visibleSource).toHaveTextContent('Announcement');
  });

  it('can render with a div', async () => {
    const { hiddenSource } = await renderLiveRegion(<LiveRegion tagName="div">Announcement</LiveRegion>);

    expect(hiddenSource!.tagName).toBe('DIV');
    expect(hiddenSource).toHaveTextContent('Announcement');
  });

  it('can wrap visible content in a div', async () => {
    const { visibleSource } = await renderLiveRegion(
      <LiveRegion tagName="div" visible={true}>
        Announcement
      </LiveRegion>
    );

    expect(visibleSource!.tagName).toBe('DIV');
  });

  it('can render assertive live region', async () => {
    const { liveRegion } = await renderLiveRegion(<LiveRegion assertive={true}>Announcement</LiveRegion>);
    expect(liveRegion).toHaveAttribute('aria-live', 'assertive');
  });

  it('uses the `source` parameter if provided', async () => {
    const ref = { current: null };
    const { liveRegion } = await renderLiveRegion(
      <>
        <LiveRegion source={['static text', ref, undefined, 'more static text']}>Announcement</LiveRegion>
        <span ref={ref}>Element text</span>
      </>
    );
    expect(liveRegion).toHaveTextContent('static text Element text more static text');
    expect(liveRegion).not.toHaveTextContent('Announcement');
  });
});
