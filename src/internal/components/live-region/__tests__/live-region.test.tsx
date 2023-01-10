// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../../../lib/components/test-utils/dom';
import LiveRegion from '../../../../../lib/components/internal/components/live-region';

const renderLiveRegion = (jsx: React.ReactElement) => {
  const { container } = render(jsx);
  return { wrapper: createWrapper(container), container };
};

describe('LiveRegion', () => {
  it('renders', () => {
    const { wrapper } = renderLiveRegion(<LiveRegion>Announcement</LiveRegion>);
    const source = wrapper.find('[aria-hidden=true]')?.getElement();
    const liveRegion = wrapper.find('[aria-live]')?.getElement();

    expect(source).toHaveTextContent('Announcement');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
  });

  it('renders with a span by default', () => {
    const { wrapper } = renderLiveRegion(<LiveRegion>Announcement</LiveRegion>);
    const source = wrapper.find('[aria-hidden=true]')?.getElement();

    expect(source?.tagName).toBe('SPAN');
  });

  it('wraps visible content in a span by default', () => {
    const { wrapper } = renderLiveRegion(<LiveRegion visible={true}>Announcement</LiveRegion>);
    const visibleSource = wrapper.find(':first-child')?.getElement();

    expect(visibleSource?.tagName).toBe('SPAN');
  });

  it('can render with a div', () => {
    const { wrapper } = renderLiveRegion(<LiveRegion tagName="div">Announcement</LiveRegion>);
    const source = wrapper.find('[aria-hidden=true]')?.getElement();

    expect(source?.tagName).toBe('DIV');
  });

  it('can wrap visible content in a div', () => {
    const { wrapper } = renderLiveRegion(
      <LiveRegion tagName="div" visible={true}>
        Announcement
      </LiveRegion>
    );
    const visibleSource = wrapper.find(':first-child')?.getElement();

    expect(visibleSource?.tagName).toBe('DIV');
  });

  it('can render assertive live region', () => {
    const { wrapper } = renderLiveRegion(<LiveRegion assertive={true}>Announcement</LiveRegion>);
    expect(wrapper.find('[aria-live="assertive"]')?.getElement()).toBeInTheDocument();
  });
});
