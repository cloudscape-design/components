// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import createWrapper, { ElementWrapper, PopoverWrapper } from '../../../lib/components/test-utils/dom';
import TooltipWrapper from '../../../lib/components/test-utils/dom/tooltip';
import Tooltip, { TooltipProps } from '../../../lib/components/tooltip';

import styles from '../../../lib/components/popover/styles.selectors.js';
import tooltipStyles from '../../../lib/components/tooltip/styles.selectors.js';

class TooltipInternalWrapper extends PopoverWrapper {
  findTooltip(): ElementWrapper | null {
    return createWrapper().findByClassName(tooltipStyles.root);
  }
  findContent(): ElementWrapper | null {
    return createWrapper().findByClassName(styles.content);
  }
  findArrow(): ElementWrapper | null {
    return createWrapper().findByClassName(styles.arrow);
  }
  findHeader(): ElementWrapper | null {
    return createWrapper().findByClassName(styles.header);
  }
}

function renderTooltip(props: Partial<TooltipProps> & { position?: TooltipProps.Position }) {
  const { container } = render(
    <Tooltip
      getTrack={props.getTrack ?? (() => null)}
      trackKey={props.trackKey}
      content={props.content ?? ''}
      onEscape={props.onEscape}
      position={props.position}
    />
  );
  return new TooltipInternalWrapper(container);
}

describe('Tooltip', () => {
  it('renders text content correctly', () => {
    const wrapper = renderTooltip({ content: 'Success message' });

    expect(wrapper.findContent()!.getElement()).toHaveTextContent('Success message');
  });

  it('renders React element content correctly', () => {
    const wrapper = renderTooltip({
      content: (
        <div>
          <strong>Bold text</strong> and normal text
        </div>
      ),
    });

    const contentElement = wrapper.findContent()!.getElement();
    expect(contentElement).toHaveTextContent('Bold text and normal text');
    expect(contentElement.querySelector('strong')).toHaveTextContent('Bold text');
  });

  it('has tooltip role attribute', () => {
    const wrapper = renderTooltip({ content: 'Value' });

    expect(wrapper.findTooltip()?.getElement()).toHaveAttribute('role', 'tooltip');
  });

  it('uses content as trackKey when not explicitly provided', () => {
    const wrapper = renderTooltip({ content: 'Value' });

    expect(wrapper.findTooltip()?.getElement()).toHaveAttribute('data-testid', 'Value');
  });

  it('trackKey is set correctly for explicit value', () => {
    const trackKey = 'test-id';
    const wrapper = renderTooltip({ content: 'Value', trackKey });

    expect(wrapper.findTooltip()?.getElement()).toHaveAttribute('data-testid', trackKey);
  });

  it('explicit trackKey takes precedence over content', () => {
    const wrapper = renderTooltip({ content: 'Auto value', trackKey: 'explicit-key' });

    expect(wrapper.findTooltip()?.getElement()).toHaveAttribute('data-testid', 'explicit-key');
  });

  it('renders ReactNode content without explicit trackKey', () => {
    // Should not crash when trackKey is not provided for complex content
    expect(() => {
      renderTooltip({
        content: <div>Complex content without trackKey</div>,
      });
    }).not.toThrow();

    const tooltip = createWrapper().findByClassName(tooltipStyles.root);
    expect(tooltip).not.toBeNull();
    expect(tooltip!.getElement()).toHaveTextContent('Complex content without trackKey');
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

    act(() => {
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    });
    expect(onEscape).not.toHaveBeenCalled();

    act(() => {
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    });
    expect(onEscape).not.toHaveBeenCalled();
  });

  it('works without onEscape callback', () => {
    const wrapper = renderTooltip({ content: 'Value' });

    expect(() => {
      act(() => {
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      });
    }).not.toThrow();

    expect(wrapper.findTooltip()).not.toBeNull();
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
    expect(wrapper.findTooltip()).not.toBeNull();
  });

  it('handles getTrack returning SVG element', () => {
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(svgElement);

    const getTrack = jest.fn(() => svgElement);
    const wrapper = renderTooltip({ content: 'SVG Tooltip', getTrack });

    expect(getTrack).toHaveBeenCalled();
    expect(wrapper.findTooltip()).not.toBeNull();
  });

  it('updates tracked element when getTrack changes', () => {
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');
    document.body.appendChild(element1);
    document.body.appendChild(element2);

    const { rerender } = render(<Tooltip content="Test" getTrack={() => element1} trackKey="test-1" />);

    expect(element1).toBeInTheDocument();

    rerender(<Tooltip content="Test" getTrack={() => element2} trackKey="test-2" />);

    expect(element2).toBeInTheDocument();
  });

  it('cleans up event listeners on unmount', () => {
    const onEscape = jest.fn();
    const { unmount } = render(<Tooltip content="Value" getTrack={() => null} onEscape={onEscape} />);

    unmount();

    act(() => {
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    // After unmount, the event listener should be removed, so onEscape should not be called
    expect(onEscape).not.toHaveBeenCalled();
  });

  it('renders inside a Portal', () => {
    const { container } = render(
      <div data-testid="parent">
        <Tooltip content="Portaled content" getTrack={() => null} trackKey="portal-test" />
      </div>
    );

    const parent = container.querySelector('[data-testid="parent"]');
    const tooltip = createWrapper().findByClassName(tooltipStyles.root);

    // Tooltip should not be a child of the parent div due to Portal
    expect(parent).not.toContainElement(tooltip?.getElement() ?? null);
    // But tooltip should exist in the document
    expect(tooltip).not.toBeNull();
  });

  describe('TooltipWrapper test utils', () => {
    it('findContent() returns the tooltip content element', () => {
      render(<Tooltip content="Test content" getTrack={() => null} trackKey="test-utils-content" />);

      const tooltipWrapper = TooltipWrapper.findByTrackKey('test-utils-content');
      expect(tooltipWrapper).not.toBeNull();

      const content = tooltipWrapper!.findContent();
      expect(content).not.toBeNull();
      expect(content!.getElement()).toHaveTextContent('Test content');
    });

    it('findByTrackKey() finds tooltip by trackKey attribute', () => {
      render(<Tooltip content="Findable tooltip" getTrack={() => null} trackKey="unique-track-key" />);

      const tooltipWrapper = TooltipWrapper.findByTrackKey('unique-track-key');
      expect(tooltipWrapper).not.toBeNull();
      expect(tooltipWrapper!.getElement()).toHaveAttribute('data-testid', 'unique-track-key');
    });

    it('findByTrackKey() returns null when tooltip not found', () => {
      render(<Tooltip content="Some tooltip" getTrack={() => null} trackKey="existing-tooltip" />);

      const tooltipWrapper = TooltipWrapper.findByTrackKey('non-existent-key');
      expect(tooltipWrapper).toBeNull();
    });

    it('findByTrackKey() can distinguish between multiple tooltips', () => {
      render(
        <>
          <Tooltip content="First tooltip" getTrack={() => null} trackKey="tooltip-1" />
          <Tooltip content="Second tooltip" getTrack={() => null} trackKey="tooltip-2" />
        </>
      );

      const tooltip1 = TooltipWrapper.findByTrackKey('tooltip-1');
      const tooltip2 = TooltipWrapper.findByTrackKey('tooltip-2');

      expect(tooltip1).not.toBeNull();
      expect(tooltip2).not.toBeNull();
      expect(tooltip1!.findContent()!.getElement()).toHaveTextContent('First tooltip');
      expect(tooltip2!.findContent()!.getElement()).toHaveTextContent('Second tooltip');
    });

    it('findContent() works with complex content', () => {
      render(
        <Tooltip
          content={
            <div>
              <strong>Bold</strong> text
            </div>
          }
          getTrack={() => null}
          trackKey="complex-wrapper"
        />
      );

      const tooltipWrapper = TooltipWrapper.findByTrackKey('complex-wrapper');
      const content = tooltipWrapper!.findContent();

      expect(content).not.toBeNull();
      expect(content!.getElement().querySelector('strong')).toHaveTextContent('Bold');
    });
  });
});
