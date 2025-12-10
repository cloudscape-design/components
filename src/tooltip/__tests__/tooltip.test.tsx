// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import createWrapper, { ElementWrapper, PopoverWrapper } from '../../../lib/components/test-utils/dom';
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

const dummyRef = { current: null };
function renderTooltip(props: Partial<TooltipProps>) {
  const { container } = render(
    <Tooltip
      anchorRef={dummyRef}
      trackingKey={props.trackingKey}
      content={props.content ?? ''}
      onEscape={props.onEscape ?? (() => {})}
    />
  );
  return new TooltipInternalWrapper(container);
}

describe('Tooltip', () => {
  it('renders text correctly', () => {
    const wrapper = renderTooltip({ content: 'Value' });

    expect(wrapper.findContent()!.getElement()).toHaveTextContent('Value');
  });

  it('renders text content correctly', () => {
    const wrapper = renderTooltip({ content: 'Success message' });

    expect(wrapper.findContent()!.getElement()).toHaveTextContent('Success message');
  });

  it('renders arrow', () => {
    const wrapper = renderTooltip({ content: 'Value' });

    expect(wrapper.findArrow()).not.toBeNull();
  });

  it('does not render a header', () => {
    const wrapper = renderTooltip({ content: 'Value' });

    expect(wrapper.findHeader()).toBeNull();
  });

  it('trackingKey is set correctly for strings', () => {
    const wrapper = renderTooltip({ content: 'Value' });

    expect(wrapper.findTooltip()?.getElement()).toHaveAttribute('data-testid', 'Value');
  });

  it('trackingKey is set correctly for explicit value', () => {
    const trackingKey = 'test-id';
    const wrapper = renderTooltip({ content: 'Value', trackingKey });

    expect(wrapper.findTooltip()?.getElement()).toHaveAttribute('data-testid', trackingKey);
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
});
