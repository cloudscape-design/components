// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';
import createWrapper, { SplitPanelWrapper } from '../../../lib/components/test-utils/dom';
import { SplitPanelProvider, SplitPanelProviderProps } from '../../../lib/components/app-layout/split-panel';
import SplitPanel, { SplitPanelProps } from '../../../lib/components/split-panel';

const defaultSplitPanelProps: SplitPanelProps = {
  header: '',
  children: null,
};

// layout calculation is delayed by one frame to wait for app-layout to finish its rendering
function nextFrame() {
  return act(async () => {
    await new Promise(resolve => requestAnimationFrame(resolve));
  });
}

async function renderComponent(jsx: React.ReactElement) {
  render(jsx);
  await nextFrame();
  const wrapper = createWrapper().findSplitPanel()!;
  return { wrapper };
}

describe.each(['bottom', 'side'] as const)('position=%s', position => {
  const minSize = position === 'bottom' ? 160 : 280;
  const defaultProviderProps: SplitPanelProviderProps = {
    position,
    isOpen: true,
    bottomOffset: 0,
    getMaxHeight: () => 500,
    getMaxWidth: () => 500,
    isForcedPosition: false,
    onPreferencesChange: () => {},
    onResize: () => {},
    onToggle: () => {},
    refs: {
      slider: { current: null },
      toggle: { current: null },
      preferences: { current: null },
    },
    reportHeaderHeight: () => {},
    reportSize: () => {},
    setSplitPanelToggle: () => {},
    size: 0,
    topOffset: 0,
  };

  function resizePanelBy(wrapper: SplitPanelWrapper, offset: number) {
    wrapper.findSlider()!.fireEvent(new MouseEvent('pointerdown', { bubbles: true }));
    wrapper.findSlider()!.fireEvent(
      new MouseEvent('pointermove', {
        bubbles: true,
        // negate offset values, because it is subtracted in the layout calculation logic
        clientX: -offset,
        clientY: -offset,
      })
    );
    wrapper.findSlider()!.fireEvent(new MouseEvent('pointerup', { bubbles: true }));
  }

  test('renders specified size', async () => {
    const reportSize = jest.fn();
    await renderComponent(
      <SplitPanelProvider {...defaultProviderProps} size={300} reportSize={reportSize}>
        <SplitPanel {...defaultSplitPanelProps} />
      </SplitPanelProvider>
    );

    expect(reportSize).toHaveBeenCalledTimes(1);
    expect(reportSize).toHaveBeenLastCalledWith(300);
  });

  test('size cannot be less than minSize', async () => {
    const reportSize = jest.fn();
    await renderComponent(
      <SplitPanelProvider {...defaultProviderProps} size={100} reportSize={reportSize}>
        <SplitPanel {...defaultSplitPanelProps} />
      </SplitPanelProvider>
    );

    expect(reportSize).toHaveBeenCalledTimes(1);
    expect(reportSize).toHaveBeenLastCalledWith(minSize);
  });

  test('size cannot be more than maxSize', async () => {
    const reportSize = jest.fn();
    await renderComponent(
      <SplitPanelProvider {...defaultProviderProps} size={800} reportSize={reportSize}>
        <SplitPanel {...defaultSplitPanelProps} />
      </SplitPanelProvider>
    );

    expect(reportSize).toHaveBeenCalledTimes(2);
    expect(reportSize).toHaveBeenLastCalledWith(500);
  });

  test('when minSize > maxSize, prefer minSize', async () => {
    const reportSize = jest.fn();
    await renderComponent(
      <SplitPanelProvider
        {...defaultProviderProps}
        reportSize={reportSize}
        getMaxHeight={() => 150}
        getMaxWidth={() => 150}
      >
        <SplitPanel {...defaultSplitPanelProps} />
      </SplitPanelProvider>
    );

    expect(reportSize).toHaveBeenCalledTimes(1);
    expect(reportSize).toHaveBeenCalledWith(minSize);
  });

  test('onResize handler reports updated size', async () => {
    const onResize = jest.fn();
    const { wrapper } = await renderComponent(
      <SplitPanelProvider {...defaultProviderProps} onResize={onResize}>
        <SplitPanel {...defaultSplitPanelProps} />
      </SplitPanelProvider>
    );
    resizePanelBy(wrapper, 300);
    expect(onResize).toHaveBeenCalledWith(300);
  });

  test('onResize handler size adjusted to min size', async () => {
    const onResize = jest.fn();
    const { wrapper } = await renderComponent(
      <SplitPanelProvider {...defaultProviderProps} onResize={onResize}>
        <SplitPanel {...defaultSplitPanelProps} />
      </SplitPanelProvider>
    );
    resizePanelBy(wrapper, minSize - 10);
    expect(onResize).toHaveBeenCalledWith(minSize);
  });

  test('onResize handler size adjusted to max size', async () => {
    const onResize = jest.fn();
    const { wrapper } = await renderComponent(
      <SplitPanelProvider {...defaultProviderProps} onResize={onResize}>
        <SplitPanel {...defaultSplitPanelProps} />
      </SplitPanelProvider>
    );
    resizePanelBy(wrapper, 800);
    expect(onResize).toHaveBeenCalledWith(500);
  });

  test('onResize handler not called when resize is invalid', async () => {
    const onResize = jest.fn();
    const { wrapper } = await renderComponent(
      <SplitPanelProvider
        {...defaultProviderProps}
        onResize={onResize}
        getMaxHeight={() => 100}
        getMaxWidth={() => 100}
      >
        <SplitPanel {...defaultSplitPanelProps} />
      </SplitPanelProvider>
    );
    resizePanelBy(wrapper, 100);
    expect(onResize).not.toHaveBeenCalled();
  });
});
