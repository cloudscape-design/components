// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render, waitFor } from '@testing-library/react';

import Tooltip, { TooltipProps } from '../../../../../lib/components/internal/components/tooltip';
import StatusIndicator from '../../../../../lib/components/status-indicator';
import createWrapper, { ElementWrapper, PopoverWrapper } from '../../../../../lib/components/test-utils/dom';

import tooltipStyles from '../../../../../lib/components/internal/components/tooltip/styles.selectors.js';
import styles from '../../../../../lib/components/popover/styles.selectors.js';

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
      trackRef={dummyRef}
      trackKey={props.trackKey}
      value={props.value ?? ''}
      contentAttributes={props.contentAttributes}
      onDismiss={props.onDismiss ?? (() => {})}
    />
  );
  return new TooltipInternalWrapper(container);
}

describe('Tooltip', () => {
  it('renders text correctly', () => {
    const wrapper = renderTooltip({ value: 'Value' });

    expect(wrapper.findContent()!.getElement()).toHaveTextContent('Value');
  });

  it('renders node correctly', () => {
    const wrapper = renderTooltip({ value: <StatusIndicator type="success">Success</StatusIndicator> });
    const statusIndicatorWrapper = createWrapper(wrapper.findContent()!.getElement()).findStatusIndicator()!;

    expect(statusIndicatorWrapper.getElement()).toHaveTextContent('Success');
  });

  it('renders arrow', () => {
    const wrapper = renderTooltip({ value: 'Value' });

    expect(wrapper.findArrow()).not.toBeNull();
  });

  it('does not render a header', () => {
    const wrapper = renderTooltip({ value: 'Value' });

    expect(wrapper.findHeader()).toBeNull();
  });

  it('contentAttributes work as expected', () => {
    const wrapper = renderTooltip({ value: 'Value', contentAttributes: { title: 'test' } });

    expect(wrapper.findTooltip()?.getElement()).toHaveAttribute('title', 'test');
  });

  it('trackKey is set correctly for strings', () => {
    const wrapper = renderTooltip({ value: 'Value' });

    expect(wrapper.findTooltip()?.getElement()).toHaveAttribute('data-testid', 'Value');
  });

  it('trackKey is set correctly for explicit value', () => {
    const trackKey = 'test-track-key';
    const wrapper = renderTooltip({ value: 'Value', trackKey });

    expect(wrapper.findTooltip()?.getElement()).toHaveAttribute('data-testid', trackKey);
  });

  it('calls onDismiss when an Escape keypress is detected anywhere', () => {
    const onDismiss = jest.fn();
    const keydownEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    jest.spyOn(keydownEvent, 'stopPropagation');

    renderTooltip({ value: 'Value', onDismiss });
    expect(onDismiss).not.toHaveBeenCalled();

    act(() => {
      // Dispatch the exect event instance so that we can spy stopPropagation on it.
      document.body.dispatchEvent(keydownEvent);
    });
    expect(keydownEvent.stopPropagation).toHaveBeenCalled();
    expect(onDismiss).toHaveBeenCalled();
  });

  it('propagates one-theme class to the portaled tooltip when one theme is active', () => {
    const themeRoot = document.createElement('div');
    themeRoot.className = 'awsui-one-theme';
    document.body.appendChild(themeRoot);
    const trackRef = React.createRef<HTMLDivElement>();

    try {
      render(
        <>
          <div ref={trackRef} />
          <Tooltip trackRef={trackRef} value="Value" onDismiss={() => {}} />
        </>
      );

      expect(createWrapper().findByClassName(tooltipStyles.root)!.getElement()).toHaveClass('awsui-one-theme');
    } finally {
      themeRoot.remove();
    }
  });

  it('propagates dark mode classes to the portaled tooltip from the tracked element', async () => {
    const trackRef = React.createRef<HTMLDivElement>();

    render(
      <div className="awsui-polaris-dark-mode">
        <div ref={trackRef} />
        <Tooltip trackRef={trackRef} value="Value" onDismiss={() => {}} />
      </div>
    );

    await waitFor(() => {
      expect(createWrapper().findByClassName(tooltipStyles.root)!.getElement()).toHaveClass(
        'awsui-polaris-dark-mode awsui-dark-mode'
      );
    });
  });

  it('does not stamp one-theme class on the portaled tooltip when one theme is inactive', () => {
    const trackRef = React.createRef<HTMLDivElement>();

    render(
      <>
        <div ref={trackRef} />
        <Tooltip trackRef={trackRef} value="Value" onDismiss={() => {}} />
      </>
    );

    expect(createWrapper().findByClassName(tooltipStyles.root)!.getElement()).not.toHaveClass('awsui-one-theme');
  });
});
