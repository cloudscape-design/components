// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Container from '../../../lib/components/container';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/container/styles.css.js';

function renderContainer(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return { wrapper: createWrapper(container).findContainer()!, container };
}

// Regression: Container's fit-height wrapper must be keyboard-reachable when it
// actually scrolls AND has no focusable descendant (axe scrollable-region-focusable),
// but must not insert an extra tab stop otherwise (breaks downstream tab order in
// consumers such as board-components widget items).
describe('Accessibility: scrollable-region-focusable (fitHeight)', () => {
  test('fitHeight=false renders no tabIndex on the content wrapper', () => {
    const { wrapper } = renderContainer(<Container header="Header">content</Container>);
    const contentDiv = wrapper.findByClassName(styles.content)!.getElement();
    expect(contentDiv).not.toHaveAttribute('tabindex');
    expect(contentDiv).not.toHaveAttribute('role');
    expect(contentDiv).not.toHaveAttribute('aria-labelledby');
  });

  test('fitHeight=true but not actually scrolling: no tabIndex (JSDOM reports zero scroll dimensions)', () => {
    const { wrapper } = renderContainer(<Container fitHeight={true}>content</Container>);
    const contentDiv = wrapper.findByClassName(styles['content-fit-height'])!.getElement();
    expect(contentDiv).not.toHaveAttribute('tabindex');
    expect(contentDiv).not.toHaveAttribute('role');
    expect(contentDiv).not.toHaveAttribute('aria-labelledby');
  });

  test('fitHeight=true with a focusable descendant: still no tabIndex', () => {
    const { wrapper } = renderContainer(
      <Container fitHeight={true}>
        <button>action</button>
      </Container>
    );
    const contentDiv = wrapper.findByClassName(styles['content-fit-height'])!.getElement();
    expect(contentDiv).not.toHaveAttribute('tabindex');
    expect(contentDiv).not.toHaveAttribute('role');
    expect(contentDiv).not.toHaveAttribute('aria-labelledby');
  });

  test('fitHeight=true with mocked scroll overflow and no focusable descendant: tabIndex=0', () => {
    // Simulate real browser behavior where scrollHeight > clientHeight on the fit-height wrapper.
    // We patch these properties on any element that receives the .content-fit-height class after
    // render, then force a resize to re-run the useLayoutEffect via ResizeObserver.
    const origScroll = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight');
    const origClient = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, get: () => 300 });
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, get: () => 100 });
    try {
      const { wrapper } = renderContainer(<Container fitHeight={true}>static content</Container>);
      const contentDiv = wrapper.findByClassName(styles['content-fit-height'])!.getElement();
      expect(contentDiv).toHaveAttribute('tabindex', '0');
      expect(contentDiv).not.toHaveAttribute('role');
      expect(contentDiv).not.toHaveAttribute('aria-labelledby');
    } finally {
      if (origScroll) Object.defineProperty(HTMLElement.prototype, 'scrollHeight', origScroll);
      if (origClient) Object.defineProperty(HTMLElement.prototype, 'clientHeight', origClient);
    }
  });
});
