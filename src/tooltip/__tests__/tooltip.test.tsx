// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import Tooltip, { TooltipProps } from '../../../lib/components/tooltip';

function renderTooltip(props: Partial<TooltipProps> & { position?: TooltipProps.Position }) {
  render(
    <Tooltip
      getTrack={props.getTrack ?? (() => null)}
      content={props.content ?? ''}
      onEscape={props.onEscape}
      position={props.position}
    />
  );
  return createWrapper().findTooltip()!;
}

describe('Tooltip', () => {
  it.each([
    { name: 'text string', content: 'Success message', expected: 'Success message' },
    {
      name: 'React element with nested tags',
      content: (
        <div>
          <strong>Bold text</strong> and normal text
        </div>
      ),
      expected: 'Bold text and normal text',
    },
    { name: 'simple React element', content: <div>Complex content</div>, expected: 'Complex content' },
  ])('renders $name content correctly', ({ content, expected }) => {
    const wrapper = renderTooltip({ content });
    expect(wrapper).not.toBeNull();
    expect(wrapper.getElement()).toHaveTextContent(expected);
  });

  it('has tooltip role attribute', () => {
    const wrapper = renderTooltip({ content: 'Value' });

    expect(wrapper.getElement()).toHaveAttribute('role', 'tooltip');
  });

  it('calls onEscape when an Escape keypress is detected anywhere', () => {
    const onEscape = jest.fn();
    const keydownEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    jest.spyOn(keydownEvent, 'stopPropagation');

    renderTooltip({ content: 'Value', onEscape });
    expect(onEscape).not.toHaveBeenCalled();

    act(() => {
      // Dispatch the exect event instance so that we can spy stopPropagation on it.
      document.body.dispatchEvent(keydownEvent);
    });
    expect(keydownEvent.stopPropagation).toHaveBeenCalled();
    expect(onEscape).toHaveBeenCalled();
  });

  it('does not call onEscape when other keys are pressed', () => {
    const onEscape = jest.fn();

    renderTooltip({ content: 'Value', onEscape });

    fireEvent.keyDown(document.body, { key: 'Enter' });
    expect(onEscape).not.toHaveBeenCalled();

    fireEvent.keyDown(document.body, { key: 'Tab' });
    expect(onEscape).not.toHaveBeenCalled();
  });

  it('works without onEscape callback', () => {
    const wrapper = renderTooltip({ content: 'Value' });

    fireEvent.keyDown(document.body, { key: 'Escape' });

    // Verify the component is still rendered after Escape keypress
    expect(wrapper.getElement()).toBeInTheDocument();
  });

  it('tracks element returned by getTrack', () => {
    const element = document.createElement('div');
    element.textContent = 'Tracked element';
    document.body.appendChild(element);

    const getTrack = jest.fn(() => element);
    renderTooltip({ content: 'Tooltip', getTrack });

    expect(getTrack).toHaveBeenCalled();
  });

  it('handles getTrack returning null', () => {
    const getTrack = jest.fn(() => null);
    const wrapper = renderTooltip({ content: 'Tooltip', getTrack });

    expect(getTrack).toHaveBeenCalled();
    expect(wrapper).not.toBeNull();
  });

  it('handles getTrack returning SVG element', () => {
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(svgElement);

    const getTrack = jest.fn(() => svgElement);
    const wrapper = renderTooltip({ content: 'SVG Tooltip', getTrack });

    expect(getTrack).toHaveBeenCalled();
    expect(wrapper).not.toBeNull();
  });

  it('updates tracked element when getTrack changes', () => {
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');
    document.body.appendChild(element1);
    document.body.appendChild(element2);

    const { rerender } = render(<Tooltip content="Test" getTrack={() => element1} />);

    expect(element1).toBeInTheDocument();

    rerender(<Tooltip content="Test" getTrack={() => element2} />);

    expect(element2).toBeInTheDocument();
  });

  it('cleans up event listeners on unmount', () => {
    const onEscape = jest.fn();
    const { unmount } = render(<Tooltip content="Value" getTrack={() => null} onEscape={onEscape} />);

    unmount();

    fireEvent.keyDown(document.body, { key: 'Escape' });

    // After unmount, the event listener should be removed, so onEscape should not be called
    expect(onEscape).not.toHaveBeenCalled();
  });

  it('renders inside a Portal', () => {
    const { container } = render(
      <div data-testid="parent">
        <Tooltip content="Portaled content" getTrack={() => null} />
      </div>
    );

    const parent = container.querySelector('[data-testid="parent"]');
    const tooltip = createWrapper().findTooltip();

    // Tooltip should not be a child of the parent div due to Portal
    expect(parent).not.toContainElement(tooltip?.getElement() ?? null);
    // But tooltip should exist in the document
    expect(tooltip).not.toBeNull();
  });

  it('findContent returns the tooltip content element', () => {
    const wrapper = renderTooltip({ content: 'Test tooltip content' });

    const content = wrapper.findContent();

    expect(content).not.toBeNull();
    expect(content!.getElement()).toHaveTextContent('Test tooltip content');
  });
});
