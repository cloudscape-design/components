// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import Portal, { PortalProps } from '../../../../../lib/components/internal/components/portal';

function renderPortal(props: PortalProps) {
  const { rerender, unmount } = render(<Portal {...props} />);
  return { unmount, rerender: (props: PortalProps) => rerender(<Portal {...props} />) };
}

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  expect(warnOnce).not.toHaveBeenCalled();
  jest.clearAllMocks();
});

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

    test('ignores getContainer property', () => {
      const getContainer = jest.fn();
      const removeContainer = jest.fn();
      renderPortal({ children: <p>Hello!</p>, container, getContainer, removeContainer });
      expect(container).toContainHTML('<p>Hello!</p>');
      expect(getContainer).not.toHaveBeenCalled();
      expect(removeContainer).not.toHaveBeenCalled();
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

  describe('when getContainer/removeContainer property is provided', () => {
    test('falls back to default if only getContainer is provided', () => {
      const getContainer = jest.fn();
      renderPortal({ children: <p>Hello!</p>, getContainer });
      expect(getContainer).not.toHaveBeenCalled();
      expect(warnOnce).toHaveBeenCalledWith('portal', '`removeContainer` is required when `getContainer` is provided');
      jest.mocked(warnOnce).mockReset();
    });

    test('falls back to default if only removeContainer is provided', () => {
      const removeContainer = jest.fn();
      renderPortal({ children: <p>Hello!</p>, removeContainer });
      expect(removeContainer).not.toHaveBeenCalled();
      expect(warnOnce).toHaveBeenCalledWith('portal', '`getContainer` is required when `removeContainer` is provided');
      jest.mocked(warnOnce).mockReset();
    });

    test('renders and cleans up async container', async () => {
      const container = document.createElement('div');
      const getContainer = jest.fn(async () => {
        await Promise.resolve();
        document.body.appendChild(container);
        return container;
      });
      const removeContainer = jest.fn(element => document.body.removeChild(element));
      const { unmount } = renderPortal({
        children: <p data-testid="portal-content">Hello!</p>,
        getContainer,
        removeContainer,
      });
      expect(screen.queryByTestId('portal-content')).toBeFalsy();
      expect(container).not.toBeInTheDocument();
      expect(getContainer).toHaveBeenCalled();

      // wait a tick to resolve pending promises
      await act(() => Promise.resolve());
      expect(container).toBeInTheDocument();
      expect(container).toContainElement(screen.queryByTestId('portal-content'));

      unmount();
      expect(removeContainer).toHaveBeenCalledWith(container);
      expect(screen.queryByTestId('portal-content')).toBeFalsy();
      expect(container).not.toBeInTheDocument();
    });

    describe('console logging', () => {
      beforeEach(() => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
      });

      test('prints a warning if getContainer rejects a promise', async () => {
        const getContainer = jest.fn(() => Promise.reject('Error for testing'));
        const removeContainer = jest.fn(() => {});
        renderPortal({
          children: <p data-testid="portal-content">Hello!</p>,
          getContainer,
          removeContainer,
        });
        expect(screen.queryByTestId('portal-content')).toBeFalsy();
        expect(getContainer).toHaveBeenCalled();
        expect(console.warn).not.toHaveBeenCalled();

        await Promise.resolve();
        expect(screen.queryByTestId('portal-content')).toBeFalsy();
        expect(removeContainer).not.toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalledWith('[AwsUi] [portal]: failed to load portal root', 'Error for testing');
      });
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
