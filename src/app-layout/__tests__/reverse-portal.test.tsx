// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { createHtmlPortalNode, InPortal, OutPortal } from '../visual-refresh-toolbar/reverse-portal';

describe('Reverse portal', () => {
  const TestContent = ({ onClick = () => {} }) => (
    <div data-testid="test-content" onClick={onClick}>
      Test Content
    </div>
  );

  it('should render content in InPortal and display it in OutPortal', () => {
    const portalNode = createHtmlPortalNode();

    render(
      <>
        <InPortal node={portalNode}>
          <TestContent />
        </InPortal>
        <OutPortal node={portalNode} />
      </>
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should not have multiple OutPortal instances with same node', () => {
    const portalNode = createHtmlPortalNode();

    render(
      <>
        <InPortal node={portalNode}>
          <TestContent />
        </InPortal>
        <div data-testid="first-portal">
          <OutPortal node={portalNode} />
        </div>
        <div data-testid="second-portal">
          <OutPortal node={portalNode} />
        </div>
      </>
    );

    const instances = screen.getAllByText('Test Content');
    expect(instances).toHaveLength(1);
  });

  it('should work with useMemo hook', () => {
    const PortalComponent = () => {
      const portalNode = React.useMemo(() => createHtmlPortalNode(), []);

      return (
        <>
          <InPortal node={portalNode}>
            <TestContent />
          </InPortal>
          <OutPortal node={portalNode} />
        </>
      );
    };

    render(<PortalComponent />);
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should handle conditional rendering of OutPortal', () => {
    const portalNode = createHtmlPortalNode();

    const PortalWrapper = ({ showFirst = true }) => (
      <>
        <InPortal node={portalNode}>
          <TestContent />
        </InPortal>
        {showFirst ? (
          <div data-testid="first-container">
            <OutPortal node={portalNode} />
          </div>
        ) : (
          <div data-testid="second-container">
            <OutPortal node={portalNode} />
          </div>
        )}
      </>
    );

    const { rerender } = render(<PortalWrapper showFirst={true} />);
    expect(screen.getByTestId('first-container')).toBeInTheDocument();

    rerender(<PortalWrapper showFirst={false} />);
    expect(screen.getByTestId('second-container')).toBeInTheDocument();
  });

  it('should handle click events correctly', () => {
    const handleClick = jest.fn();
    const portalNode = createHtmlPortalNode();

    render(
      <div onClick={handleClick}>
        <InPortal node={portalNode}>
          <TestContent />
        </InPortal>
        <OutPortal node={portalNode} />
      </div>
    );

    const element = screen.getByTestId('test-content');
    fireEvent.click(element);
    expect(handleClick).toHaveBeenCalled();
  });

  it('should handle keyboard events', () => {
    const handleKeyDown = jest.fn();
    const portalNode = createHtmlPortalNode();

    render(
      <div onKeyDown={handleKeyDown}>
        <InPortal node={portalNode}>
          <input data-testid="test-input" />
        </InPortal>
        <OutPortal node={portalNode} />
      </div>
    );

    const input = screen.getByTestId('test-input');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(handleKeyDown).toHaveBeenCalled();
  });

  it('should update portal content when props change', () => {
    const portalNode = createHtmlPortalNode();

    const PortalContent = ({ text }: { text: string }) => <div data-testid="dynamic-content">{text}</div>;

    const { rerender } = render(
      <>
        <InPortal node={portalNode}>
          <PortalContent text="Initial" />
        </InPortal>
        <OutPortal node={portalNode} />
      </>
    );

    expect(screen.getByText('Initial')).toBeInTheDocument();

    rerender(
      <>
        <InPortal node={portalNode}>
          <PortalContent text="Updated" />
        </InPortal>
        <OutPortal node={portalNode} />
      </>
    );

    expect(screen.getByText('Updated')).toBeInTheDocument();
  });

  it('should handle missing portal node gracefully', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<OutPortal node={undefined as any} />);
    }).not.toThrow();

    consoleError.mockRestore();
  });

  it('should handle rapid state updates', () => {
    const portalNode = createHtmlPortalNode();

    const RapidUpdateComponent = () => {
      const [count, setCount] = React.useState(0);

      const handleClick = () => {
        setCount(c => c + 1);
        setCount(c => c + 1);
        setCount(c => c + 1);
      };

      return (
        <>
          <InPortal node={portalNode}>
            <button onClick={handleClick} data-testid="update-button">
              Count: {count}
            </button>
          </InPortal>
          <OutPortal node={portalNode} />
        </>
      );
    };

    render(<RapidUpdateComponent />);
    const button = screen.getByTestId('update-button');

    act(() => {
      fireEvent.click(button);
    });

    expect(button.textContent).toBe('Count: 3');
  });

  it('should clean up properly on unmount', () => {
    const portalNode = createHtmlPortalNode();
    const { unmount } = render(
      <>
        <InPortal node={portalNode}>
          <TestContent />
        </InPortal>
        <OutPortal node={portalNode} />
      </>
    );

    unmount();
    expect(document.body.innerHTML).not.toContain('test-content');
  });

  it('should handle unmounting and remounting without errors', () => {
    const portalNode = createHtmlPortalNode();

    const { unmount, rerender } = render(
      <>
        <InPortal node={portalNode}>
          <TestContent />
        </InPortal>
        <OutPortal node={portalNode} />
      </>
    );

    unmount();

    expect(() => {
      rerender(
        <>
          <InPortal node={portalNode}>
            <TestContent />
          </InPortal>
          <OutPortal node={portalNode} />
        </>
      );
    }).not.toThrow();
  });
});
