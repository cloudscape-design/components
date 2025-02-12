// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

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

    test('allows conditional change of getContainer/removeContainer', async () => {
      function MovablePortal({ getContainer, removeContainer }: Pick<PortalProps, 'getContainer' | 'removeContainer'>) {
        const [visible, setVisible] = useState(false);
        return (
          <>
            <button data-testid="toggle-portal" onClick={() => setVisible(!visible)}>
              Toggle
            </button>
            <Portal
              getContainer={visible ? getContainer : undefined}
              removeContainer={visible ? removeContainer : undefined}
            >
              <div data-testid="portal-content">portal content</div>
            </Portal>
          </>
        );
      }

      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      const externalDocument = iframe.contentDocument!;

      const getContainer = jest.fn(() => {
        const container = externalDocument.createElement('div');
        container.setAttribute('data-testid', 'dynamic-container');
        externalDocument.body.appendChild(container);
        return Promise.resolve(container);
      });

      const removeContainer = jest.fn(() => {
        const allContainers = externalDocument.querySelectorAll('[data-testid="dynamic-container"]');
        expect(allContainers).toHaveLength(1);
        allContainers[0].remove();
      });

      render(<MovablePortal getContainer={getContainer} removeContainer={removeContainer} />);
      expect(screen.getByTestId('portal-content')).toBeInTheDocument();
      expect(getContainer).not.toHaveBeenCalled();
      expect(removeContainer).not.toHaveBeenCalled();

      fireEvent.click(screen.getByTestId('toggle-portal'));
      // wait a tick to resolve pending promises
      await act(() => Promise.resolve());
      expect(screen.queryByTestId('portal-content')).toBeFalsy();
      expect(externalDocument.querySelector('[data-testid="portal-content"]')).toBeTruthy();
      expect(externalDocument.querySelectorAll('[data-testid="dynamic-container"]')).toHaveLength(1);
      expect(getContainer).toHaveBeenCalledTimes(1);
      expect(removeContainer).toHaveBeenCalledTimes(0);

      fireEvent.click(screen.getByTestId('toggle-portal'));
      // wait a tick to resolve pending promises
      await act(() => Promise.resolve());
      expect(screen.getByTestId('portal-content')).toBeInTheDocument();
      expect(externalDocument.querySelector('[data-testid="portal-content"]')).toBeFalsy();
      expect(externalDocument.querySelectorAll('[data-testid="dynamic-container"]')).toHaveLength(0);
      expect(getContainer).toHaveBeenCalledTimes(1);
      expect(removeContainer).toHaveBeenCalledTimes(1);
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
    test('renders content under body', () => {
      renderPortal({ children: <p>Hello!</p> });
      expect(document.querySelector('body > p')).toHaveTextContent('Hello!');
    });

    test('removes container element when unmounted', () => {
      const { unmount } = renderPortal({ children: <p>Hello!</p> });
      expect(document.querySelectorAll('body > p').length).toBe(1);
      unmount();
      expect(document.querySelectorAll('body > p').length).toBe(0);
    });
  });
});
