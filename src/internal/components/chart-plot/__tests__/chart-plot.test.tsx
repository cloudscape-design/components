// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { ElementWrapper } from '../../../../../lib/components/test-utils/dom';
import ChartPlot, { ChartPlotRef } from '../../../../../lib/components/internal/components/chart-plot';
import styles from '../../../../../lib/components/internal/components/chart-plot/styles.css.js';
import liveRegionStyles from '../../../../../lib/components/internal/components/live-region/styles.css.js';

import createBBoxMock from './bbox-mock';
import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';
import { act } from 'react-dom/test-utils';

function renderPlot(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const elementWrapper = new ElementWrapper(container);
  const plotWrapper = elementWrapper.findByClassName(styles.root)!;
  const applicationWrapper = plotWrapper.findByClassName(styles.application)!;
  const liveRegionWrapper = elementWrapper.findByClassName(liveRegionStyles.root)!;
  return { rerender, plotWrapper, applicationWrapper, liveRegionWrapper };
}

describe('initial state', () => {
  test('plot is focusable and application is not focusable', () => {
    const { plotWrapper, applicationWrapper } = renderPlot(
      <ChartPlot width={0} height={0}>
        <text>Test</text>
      </ChartPlot>
    );
    const plot = plotWrapper.getElement();
    const application = applicationWrapper.getElement();

    expect(plot.getAttribute('focusable')).toBe('true');
    expect(plot.tabIndex).toBe(0);
    expect(application.tabIndex).toBe(-1);
  });

  test('focus outlines are hidden', () => {
    const { plotWrapper } = renderPlot(
      <ChartPlot width={0} height={0}>
        <text>Test</text>
      </ChartPlot>
    );
    const focusOutlineWrappers = plotWrapper.findAllByClassName(styles['focus-outline']);

    for (const wrapper of focusOutlineWrappers) {
      expect(wrapper.getElement().style.visibility).toBe('hidden');
    }
  });

  test('dimension and style attributes are assigned to plot', () => {
    const { plotWrapper } = renderPlot(
      <ChartPlot
        isClickable={true}
        isPrecise={true}
        width={200}
        height={100}
        offsetTop={1}
        offsetRight={2}
        offsetBottom={3}
        offsetLeft={4}
      >
        <text>Test</text>
      </ChartPlot>
    );
    const plot = plotWrapper.getElement();

    expect(plot.style.width).toContain('200');
    expect(plot.style.height).toContain('100');
    expect(plot.style.margin).toContain('1px 2px 3px 4px');
    expect(plot.textContent).toContain('Test');
    expect(plot.classList.contains(styles.clickable)).toBe(true);
    expect(plot.classList.contains(styles.precise)).toBe(true);
  });

  test('native aria-attributes are assigned to plot', () => {
    const { plotWrapper } = renderPlot(
      <ChartPlot
        width={0}
        height={0}
        ariaLabel="label"
        ariaLabelledby="labelId"
        ariaDescribedby="descriptionId"
        ariaRoleDescription="role"
      >
        <text>Test</text>
      </ChartPlot>
    );
    const plot = plotWrapper.getElement();

    expect(plot.getAttribute('role')).toBe('application');
    expect(plot.getAttribute('aria-hidden')).toBe('false');
    expect(plot.getAttribute('aria-label')).toBe('label');
    expect(plot.getAttribute('aria-labelledby')).toBe('labelId');
    expect(plot.getAttribute('aria-describedby')).toBe('descriptionId');
    expect(plot.getAttribute('aria-roledescription')).toBe('role');
  });

  test('custom aria-attributes are assigned to plot', () => {
    const { plotWrapper, liveRegionWrapper } = renderPlot(
      <ChartPlot width={0} height={0} ariaDescription="description" ariaLiveRegion="live">
        <text>Test</text>
      </ChartPlot>
    );
    const plot = plotWrapper.getElement();
    const desc = plotWrapper.find('desc')!.getElement();
    const liveRegion = liveRegionWrapper.getElement();

    expect(plot.getAttribute('aria-describedby')).toBe(desc.id);
    expect(desc.textContent).toBe('description');
    expect(liveRegion.textContent).toBe('live');
  });

  test('custom aria-description and aria-describedby can be both assigned', () => {
    const { plotWrapper } = renderPlot(
      <ChartPlot width={0} height={0} ariaDescription="description" ariaDescribedby="customId">
        <text>Test</text>
      </ChartPlot>
    );
    const plot = plotWrapper.getElement();
    const desc = plotWrapper.find('desc')!.getElement();

    expect(plot.getAttribute('aria-describedby')).toContain(desc.id);
    expect(plot.getAttribute('aria-describedby')).toContain('customId');
    expect(desc.textContent).toBe('description');
  });
});

describe('focused plot', () => {
  const bboxMock = createBBoxMock();

  beforeEach(() => {
    bboxMock.setup();
  });

  afterEach(() => {
    bboxMock.restore();
  });

  test('plot is focusable and application is not focusable', () => {
    const { plotWrapper, applicationWrapper } = renderPlot(
      <ChartPlot width={0} height={0}>
        <text>Test</text>
      </ChartPlot>
    );
    const plot = plotWrapper.getElement();
    const application = applicationWrapper.getElement();

    plot.focus();

    expect(plot.getAttribute('focusable')).toBe('true');
    expect(plot.tabIndex).toBe(0);
    expect(application.tabIndex).toBe(-1);
  });

  test('plot focus outline is shown', () => {
    bboxMock.value = { x: 15, y: 20, width: 200, height: 100 } as any;

    const { plotWrapper } = renderPlot(
      <ChartPlot width={200} height={100} focusOffset={5}>
        <text>Test</text>
      </ChartPlot>
    );
    const plot = plotWrapper.getElement();
    const plotFocusOutline = plotWrapper.findAllByClassName(styles['focus-outline'])[0].getElement();

    act(() => plotWrapper.keydown(KeyCode.enter));
    act(() => plot.focus());

    expect(plotFocusOutline.style.visibility).toBe('visible');
    expect(plotFocusOutline.getAttribute('x')).toBe('10');
    expect(plotFocusOutline.getAttribute('y')).toBe('15');
    expect(plotFocusOutline.getAttribute('width')).toBe('210');
    expect(plotFocusOutline.getAttribute('height')).toBe('110');
  });

  test('application focus outline is hidden', () => {
    const { plotWrapper } = renderPlot(
      <ChartPlot width={0} height={0}>
        <text>Test</text>
      </ChartPlot>
    );
    const applicationFocusOutline = plotWrapper.findAllByClassName(styles['focus-outline'])[1].getElement();

    expect(applicationFocusOutline.style.visibility).toBe('hidden');
  });
});

describe('focused application', () => {
  const bboxMock = createBBoxMock();

  beforeEach(() => {
    bboxMock.setup();
  });

  afterEach(() => {
    bboxMock.restore();
  });

  test('plot is not focusable and application is focusable', () => {
    const { plotWrapper, applicationWrapper } = renderPlot(
      <ChartPlot width={0} height={0}>
        <text>Test</text>
      </ChartPlot>
    );
    const plot = plotWrapper.getElement();
    const application = applicationWrapper.getElement();

    plot.focus();
    plotWrapper.keydown(KeyCode.right);

    expect(plot.getAttribute('focusable')).toBe('false');
    expect(plot.tabIndex).toBe(-1);
    expect(application.getAttribute('focusable')).toBe('true');
    expect(application.tabIndex).toBe(0);
  });

  test('plot focus outline is hidden', () => {
    bboxMock.value = { x: 15, y: 20, width: 200, height: 100 } as any;

    const { plotWrapper } = renderPlot(
      <ChartPlot width={200} height={100} focusOffset={5}>
        <text>Test</text>
      </ChartPlot>
    );
    const plot = plotWrapper.getElement();
    const plotFocusOutline = plotWrapper.findAllByClassName(styles['focus-outline'])[0].getElement();

    act(() => plot.focus());
    act(() => plotWrapper.keydown(KeyCode.right));

    expect(plotFocusOutline.style.visibility).toBe('hidden');
  });

  test('application focus outline is shown', () => {
    bboxMock.value = { x: 10, y: 12, width: 6, height: 8 } as any;

    const activeElementRef = React.createRef<SVGGElement>();
    const { plotWrapper } = renderPlot(
      <ChartPlot
        width={0}
        height={0}
        activeElementKey="key"
        activeElementRef={activeElementRef}
        activeElementFocusOffset={3}
      >
        <text>Test</text>
        <g ref={activeElementRef}>Target</g>
      </ChartPlot>
    );
    const plot = plotWrapper.getElement();
    const applicationFocusOutline = plotWrapper.findAllByClassName(styles['focus-outline'])[1].getElement();

    act(() => plot.focus());
    act(() => plotWrapper.keydown(KeyCode.right));

    expect(applicationFocusOutline.style.visibility).toBe('visible');
    expect(applicationFocusOutline.getAttribute('x')).toBe('7');
    expect(applicationFocusOutline.getAttribute('y')).toBe('9');
    expect(applicationFocusOutline.getAttribute('width')).toBe('12');
    expect(applicationFocusOutline.getAttribute('height')).toBe('14');
  });
});

describe('event handlers', () => {
  let eventLog: string[] = [];

  const onClick = () => eventLog.push('click');
  const onMouseMove = () => eventLog.push('mousemove');
  const onMouseOut = () => eventLog.push('mouseout');
  const onFocus = (_: any, trigger: 'mouse' | 'keyboard') => eventLog.push(`focus:${trigger}`);
  const onBlur = () => eventLog.push('blur');
  const onKeyDown = (e: React.KeyboardEvent<any>) => eventLog.push(`keydown:${e.key}`);

  beforeEach(() => {
    eventLog = [];
  });

  test('plot events', () => {
    const { plotWrapper } = renderPlot(
      <ChartPlot
        width={0}
        height={0}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseOut={onMouseOut}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      >
        <text>Test</text>
      </ChartPlot>
    );

    plotWrapper.fireEvent(new MouseEvent('mousemove', { bubbles: true }));
    plotWrapper.fireEvent(new MouseEvent('mouseout', { bubbles: true }));
    plotWrapper.fireEvent(new MouseEvent('click', { bubbles: true }));
    // Triggering a mousedown event first is necessary for the plot to focus the application.
    plotWrapper.fireEvent(new MouseEvent('mousedown', { bubbles: true }));
    plotWrapper.fireEvent(new MouseEvent('focus', { bubbles: true }));

    expect(eventLog).toEqual(['mousemove', 'mouseout', 'click', 'focus:mouse']);
  });

  test('application events', () => {
    const { plotWrapper, applicationWrapper } = renderPlot(
      <ChartPlot
        width={0}
        height={0}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseOut={onMouseOut}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      >
        <text>Test</text>
      </ChartPlot>
    );

    plotWrapper.fireEvent(new MouseEvent('focus', { bubbles: true }));
    plotWrapper.keydown(KeyCode.enter);

    applicationWrapper.keydown(KeyCode.left);
    applicationWrapper.blur();

    expect(eventLog).toEqual(['focus:keyboard', 'keydown:ArrowLeft', 'blur']);
  });
});

describe('imperative handle', () => {
  test('imperative handle svg corresponds the right node', () => {
    const ref = React.createRef<ChartPlotRef>();
    const { plotWrapper } = renderPlot(
      <ChartPlot width={0} height={0} ref={ref} activeElementKey="key" activeElementFocusOffset={3}>
        <text>Test</text>
      </ChartPlot>
    );
    const plot = plotWrapper.getElement();

    expect(ref.current!.svg).toBe(plot);
  });

  test('imperative handle allows to focus plot', () => {
    const ref = React.createRef<ChartPlotRef>();
    const { plotWrapper } = renderPlot(
      <ChartPlot ref={ref} width={0} height={0} activeElementKey="key" activeElementFocusOffset={3}>
        <text>Test</text>
      </ChartPlot>
    );
    const plot = plotWrapper.getElement();

    ref.current!.focusPlot();

    expect(plot).toBe(document.activeElement);
  });

  test('imperative handle allows to focus application', () => {
    const ref = React.createRef<ChartPlotRef>();
    const { applicationWrapper } = renderPlot(
      <ChartPlot ref={ref} width={0} height={0} activeElementKey="key" activeElementFocusOffset={3}>
        <text>Test</text>
      </ChartPlot>
    );
    const application = applicationWrapper.getElement();

    ref.current!.focusApplication();

    expect(application).toBe(document.activeElement);
  });
});

describe('application focus delegation', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test('aria attributes are copied from the active element target', () => {
    const activeElementRef = React.createRef<SVGGElement>();
    const { plotWrapper, applicationWrapper } = renderPlot(
      <ChartPlot width={0} height={0} activeElementKey="1:3" activeElementRef={activeElementRef}>
        <text>Test</text>
        <g
          ref={activeElementRef}
          role="button"
          aria-roledescription="active element"
          aria-label="point 1:3"
          aria-describedby="descriptionId"
          aria-haspopup={true}
          aria-expanded={false}
          aria-hidden={true}
        >
          Target
        </g>
      </ChartPlot>
    );
    const plot = plotWrapper.getElement();
    const application = applicationWrapper.getElement();

    plot.focus();
    plotWrapper.keydown(KeyCode.right);

    expect(application.getAttribute('role')).toBe('button');
    expect(application.getAttribute('aria-roledescription')).toBe('active element');
    expect(application.getAttribute('aria-label')).toBe('point 1:3');
    expect(application.getAttribute('aria-describedby')).toBe('descriptionId');
    expect(application.getAttribute('aria-haspopup')).toBe('true');
    expect(application.getAttribute('aria-expanded')).toBe('false');
    expect(application.getAttribute('aria-hidden')).toBe('false');
  });

  test('application element copies new attributes once key changes', () => {
    jest.useFakeTimers();

    const activeElementRef = React.createRef<SVGGElement>();
    const { plotWrapper, applicationWrapper, rerender } = renderPlot(
      <ChartPlot width={0} height={0} activeElementKey="1:3" activeElementRef={activeElementRef}>
        <text>Test</text>
        <g ref={activeElementRef} aria-label="point 1:3">
          Target
        </g>
      </ChartPlot>
    );
    const plot = plotWrapper.getElement();
    const application = applicationWrapper.getElement();

    plot.focus();
    plotWrapper.keydown(KeyCode.right);

    rerender(
      <ChartPlot width={0} height={0} activeElementKey="1:4" activeElementRef={activeElementRef}>
        <text>Test</text>
        <g ref={activeElementRef} aria-label="point 1:4">
          Target
        </g>
      </ChartPlot>
    );
    jest.runAllTimers();

    expect(application.getAttribute('aria-label')).toBe('point 1:4');
  });

  test('application element triggers an internal focus event to notify screen readers', () => {
    jest.useFakeTimers();

    let externalFocusCounter = 0;
    const externalOnFocus = () => {
      externalFocusCounter++;
    };
    let internalFocusCounter = 0;
    const internalOnFocus = () => {
      internalFocusCounter++;
    };
    const { plotWrapper, applicationWrapper, rerender } = renderPlot(
      <ChartPlot width={0} height={0} activeElementKey="1:3" onFocus={externalOnFocus}>
        <text>Test</text>
      </ChartPlot>
    );
    const plot = plotWrapper.getElement();
    const application = applicationWrapper.getElement();
    application.addEventListener('focus', internalOnFocus);

    plot.focus();
    plotWrapper.keydown(KeyCode.right);

    expect(externalFocusCounter).toBe(1);
    expect(internalFocusCounter).toBe(1);

    rerender(
      <ChartPlot width={0} height={0} activeElementKey="1:4" onFocus={externalOnFocus}>
        <text>Test</text>
      </ChartPlot>
    );
    jest.runAllTimers();

    expect(externalFocusCounter).toBe(1);
    expect(internalFocusCounter).toBe(2);
  });
});
