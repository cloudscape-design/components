// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import Portal, { PortalProps } from '../../../../../lib/components/internal/components/portal';

function renderPortal(props: PortalProps) {
  const { rerender, unmount } = render(<Portal {...props} />);
  return { unmount, rerender: (props: PortalProps) => rerender(<Portal {...props} />) };
}

describe('Portal', () => {
  describe('when container is provided', () => {
    let container: Element | undefined;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      container?.remove();
    });

    test('renders to the container', () => {
      renderPortal({ children: <p>Hello!</p>, container });
      expect(container).toContainHTML('<p>Hello!</p>');
    });

    test('cleans up react content inside container when unmounted', () => {
      const { unmount } = renderPortal({ children: <p>Hello!</p>, container });
      unmount();
      expect(container).toBeEmptyDOMElement();
    });

    test('cleans up react content inside container if an explicit container is no longer provided', () => {
      const { rerender } = renderPortal({ children: <p>Hello!</p>, container });
      rerender({ children: <p>Hello!</p> });
      expect(container).toBeEmptyDOMElement();
      expect(document.body).toHaveTextContent('Hello!');
    });
  });

  describe('when a container is not provided', () => {
    test('renders to a div under body', () => {
      renderPortal({ children: <p>Hello!</p> });
      expect(document.querySelector('body > div > p')).toHaveTextContent('Hello!');
    });

    test('removes container element when unmounted', () => {
      const { unmount } = renderPortal({ children: <p>Hello!</p> });
      // The extra <div> is a wrapper element that react-testing-library creates.
      expect(document.querySelectorAll('body > div').length).toBe(2);
      unmount();
      expect(document.querySelectorAll('body > div').length).toBe(1);
      expect(document.querySelector('body > div')).toBeEmptyDOMElement();
    });
  });
});
