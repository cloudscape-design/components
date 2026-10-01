// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import clsx from 'clsx';

import createWrapper from '../../../lib/components/test-utils/dom';
import Tooltip, { TooltipProps } from '../../../lib/components/tooltip';
import { resolveSettleDirection } from '../../popover/__tests__/settle-motion';

import { ONE_THEME } from '../../__tests__/compile-motion-scss';
import popoverStyles from '../../../lib/components/popover/styles.selectors.js';

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

describe('Tooltip entrance motion', () => {
  // The rules are compiled from popover/motion.scss and matched against the tooltip's real DOM,
  // so this fails if the tooltip ever stops rendering through the popover container.
  function renderAndResolve(arrowPosition: string, { theme = ONE_THEME, rtl = false, motionDisabled = false } = {}) {
    document.documentElement.className = clsx(theme.slice(1), motionDisabled && 'awsui-motion-disabled');
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    const { unmount } = render(<Tooltip getTrack={() => null} content="Test tooltip content" />);
    const container = createWrapper().findTooltip()!.findByClassName(popoverStyles.container)!.getElement();
    // jsdom has no layout, so the resolved placement never gets computed; pin it by hand.
    container.querySelector(`.${popoverStyles['container-arrow']}`)!.classList.add(popoverStyles[arrowPosition]);
    const direction = resolveSettleDirection(container);
    unmount();
    return direction;
  }

  afterEach(() => {
    document.documentElement.className = '';
    document.documentElement.dir = '';
  });

  it('settles down when placed below the trigger, and up when placed above it', () => {
    expect(renderAndResolve('container-arrow-position-bottom-center')).toBe('down');
    expect(renderAndResolve('container-arrow-position-top-center')).toBe('up');
  });

  it('travels horizontally for side placements, and flips the travel in RTL', () => {
    expect(renderAndResolve('container-arrow-position-right-top')).toBe('end');
    expect(renderAndResolve('container-arrow-position-left-bottom')).toBe('start');
    expect(renderAndResolve('container-arrow-position-right-top', { rtl: true })).toBe('start');
    expect(renderAndResolve('container-arrow-position-left-bottom', { rtl: true })).toBe('end');
  });

  it('does not animate when motion is disabled or the theme has not opted in', () => {
    expect(renderAndResolve('container-arrow-position-top-center', { motionDisabled: true })).toBeNull();
    expect(renderAndResolve('container-arrow-position-right-top', { theme: '.awsui-visual-refresh' })).toBeNull();
  });
});
