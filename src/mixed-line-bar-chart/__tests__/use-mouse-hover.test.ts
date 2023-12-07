// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { renderHook, act } from '../../__tests__/render-hook';

import { ChartDataTypes } from '../../../lib/components/mixed-line-bar-chart/interfaces';
import { useMouseHover, UseMouseHoverProps } from '../../../lib/components/mixed-line-bar-chart/hooks/use-mouse-hover';

const SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

const series = { type: 'threshold', title: 'Threshold', y: 5 };

const datum = { x: 0, y: 0 } as any;

const commonProps = {
  plotRef: { current: { svg: SVGElement, focusApplication: jest.fn(), focusPlot: jest.fn() } },
  popoverRef: { current: null },
  scaledSeries: [{ color: 'blue', x: 100, y: 100, datum, series }],
  barGroups: [],
  highlightSeries: jest.fn(),
  highlightPoint: jest.fn(),
  highlightGroup: jest.fn(),
  clearHighlightedSeries: jest.fn(),
  isGroupNavigation: false,
  isHandlersDisabled: false,
  setPlotFocused: jest.fn(),
  highlightX: jest.fn(),
  isPopoverPinned: false,
};

const renderMouseHoverHook = <T extends ChartDataTypes>(props?: Partial<UseMouseHoverProps<T>>) => {
  const { result } = renderHook(useMouseHover, {
    initialProps: { ...(commonProps as UseMouseHoverProps<T>), ...props },
  });

  return {
    hook: result,
  };
};

describe('Mouse hover hook', () => {
  beforeEach(() => jest.clearAllMocks());

  test('returns correct properties', () => {
    const { hook } = renderMouseHoverHook();
    expect('onSVGMouseMove' in hook.current).toBeTruthy();
    expect('onSVGMouseOut' in hook.current).toBeTruthy();
    expect('onPopoverLeave' in hook.current).toBeTruthy();
  });

  test('calls highlightX', () => {
    const customProps = {
      highlightX: jest.fn(),
    };
    const { hook } = renderMouseHoverHook(customProps);
    const event = {
      target: SVGElement,
      clientX: 110,
      clientY: 110,
    } as any;

    act(() => hook.current.onSVGMouseMove(event));
    expect(customProps.highlightX).toHaveBeenCalledWith({ scaledX: 100, label: 0 });
  });

  test('clears verticalMarkerLeft', () => {
    const customProps = {
      highlightX: jest.fn(),
    };
    const { hook } = renderMouseHoverHook(customProps);
    const event = {
      relatedTarget: null,
    } as any;
    act(() => hook.current.onSVGMouseOut(event));
    expect(customProps.highlightX).toHaveBeenCalledWith(null);
  });

  test('does not clear highlighted X on mouseOut if moving within SVG', () => {
    const SvgElementDummy = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    SvgElementDummy.appendChild(lineElement);

    const customProps = {
      highlightX: jest.fn(),
      plotRef: { current: { svg: SvgElementDummy, focusApplication: jest.fn(), focusPlot: jest.fn() } },
    };
    const { hook } = renderMouseHoverHook(customProps);

    // set marker first
    const mouseMoveEvent = {
      target: SvgElementDummy,
      clientX: 110,
      clientY: 110,
    } as any;

    act(() => hook.current.onSVGMouseMove(mouseMoveEvent));

    expect(customProps.highlightX).toHaveBeenCalledWith({ scaledX: 100, label: 0 });
    expect(customProps.highlightX).toHaveBeenCalledTimes(1);

    const mouseOutEvent = {
      relatedTarget: lineElement,
    } as any;

    act(() => hook.current.onSVGMouseOut(mouseOutEvent));
    expect(customProps.highlightX).toHaveBeenCalledTimes(1);
  });

  test('does not clear highlighted X on mouseOut if moving within popover', () => {
    const SvgElementDummy = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    SvgElementDummy.appendChild(lineElement);
    const popoverWrapper = document.createElement('div');
    const popoverDiv = document.createElement('div');
    popoverWrapper.appendChild(popoverDiv);

    const customProps = {
      highlightX: jest.fn(),
      popoverRef: { current: popoverWrapper },
      plotRef: { current: { svg: SvgElementDummy, focusApplication: jest.fn(), focusPlot: jest.fn() } },
    };
    const { hook } = renderMouseHoverHook(customProps);

    // set marker first
    const mouseMoveEvent = {
      target: SvgElementDummy,
      clientX: 110,
      clientY: 110,
    } as any;

    act(() => hook.current.onSVGMouseMove(mouseMoveEvent));

    expect(customProps.highlightX).toHaveBeenCalledWith({ scaledX: 100, label: 0 });
    expect(customProps.highlightX).toHaveBeenCalledTimes(1);

    const mouseOutEvent = {
      relatedTarget: popoverWrapper,
      clientX: 10,
      clientY: 10,
    } as any;

    act(() => hook.current.onSVGMouseOut(mouseOutEvent));
    expect(customProps.highlightX).toHaveBeenCalledTimes(1);
  });

  test('clears highlightX when onPopoverLeave is called', () => {
    const customProps = {
      highlightX: jest.fn(),
      clearHighlightedSeries: jest.fn(),
    };
    const { hook } = renderMouseHoverHook(customProps);
    const event = {
      relatedTarget: null,
    } as any;
    act(() => hook.current.onPopoverLeave(event));
    expect(customProps.highlightX).toHaveBeenCalledWith(null);
    expect(customProps.clearHighlightedSeries).toHaveBeenCalledTimes(1);
  });

  test('does not clear highlightX when onPopoverLeave is called if isPopoverPinned is true', () => {
    const customProps = {
      highlightX: jest.fn(),
      clearHighlightedSeries: jest.fn(),
      isPopoverPinned: true,
    };
    const { hook } = renderMouseHoverHook(customProps);
    const event = {
      relatedTarget: null,
    } as any;
    act(() => hook.current.onPopoverLeave(event));
    expect(customProps.highlightX).not.toHaveBeenCalled();
    expect(customProps.clearHighlightedSeries).not.toHaveBeenCalled();
  });

  test('highlights point when moving close', () => {
    const { hook } = renderMouseHoverHook();
    const event = {
      target: SVGElement,
      clientX: 103,
      clientY: 102,
    } as any;

    act(() => hook.current.onSVGMouseMove(event));
    expect(commonProps.highlightPoint).toHaveBeenCalledTimes(1);
    expect(commonProps.highlightPoint).toHaveBeenCalledWith(
      expect.objectContaining({ x: 100, y: 100, color: 'blue', datum })
    );
  });

  test('highlights group when moving close', () => {
    const props = {
      plotRef: commonProps.plotRef,
      scaledSeries: [],
      barGroups: [
        {
          x: 'Potatoes',
          hasData: true,
          isValid: true,
          position: {
            x: 0,
            y: 0,
            width: 100,
            height: 200,
          },
        },
        {
          x: 'Apples',
          hasData: true,
          isValid: true,
          position: {
            x: 120,
            y: 0,
            width: 100,
            height: 200,
          },
        },
      ],
      highlightSeries: jest.fn(),
      highlightPoint: jest.fn(),
      highlightGroup: jest.fn(),
      clearHighlightedSeries: jest.fn(),
      isGroupNavigation: true,
      isHandlersDisabled: false,
    };
    const { hook } = renderMouseHoverHook(props);

    [
      { target: SVGElement, clientX: 0, clientY: 0 },
      { target: SVGElement, clientX: 100, clientY: 200 },
      { target: SVGElement, clientX: 170, clientY: 100 },
    ].forEach((event: any) => {
      act(() => hook.current.onSVGMouseMove(event));
    });

    expect(props.highlightGroup).toHaveBeenCalledTimes(3);
    expect(props.highlightGroup).toHaveBeenCalledWith(0);
    expect(props.highlightGroup).toHaveBeenCalledWith(0);
    expect(props.highlightGroup).toHaveBeenCalledWith(1);
  });

  test('calls highlightX when moving far from any point', () => {
    const { hook } = renderMouseHoverHook();
    const event = {
      target: SVGElement,
      clientX: 110,
      clientY: 110,
    } as any;

    act(() => hook.current.onSVGMouseMove(event));
    expect(commonProps.highlightX).toHaveBeenCalledTimes(1);
    expect(commonProps.highlightX).toHaveBeenCalledWith({ scaledX: 100, label: 0 });
  });

  test('clears highlighted group when moving far from any point', () => {
    const props = {
      plotRef: commonProps.plotRef,
      scaledSeries: [],
      barGroups: [
        {
          x: 'Potatoes',
          hasData: true,
          isValid: true,
          position: {
            x: 0,
            y: 0,
            width: 100,
            height: 200,
          },
        },
        {
          x: 'Apples',
          hasData: true,
          isValid: true,
          position: {
            x: 120,
            y: 0,
            width: 100,
            height: 200,
          },
        },
      ],
      highlightSeries: jest.fn(),
      highlightPoint: jest.fn(),
      highlightGroup: jest.fn(),
      clearHighlightedSeries: jest.fn(),
      isGroupNavigation: true,
      isHandlersDisabled: false,
    };
    const { hook } = renderMouseHoverHook(props);

    [
      { target: SVGElement, clientX: -1, clientY: 100 },
      { target: SVGElement, clientX: 101, clientY: 100 },
      { target: SVGElement, clientX: 50, clientY: -1 },
      { target: SVGElement, clientX: 50, clientY: 201 },
      { target: SVGElement, clientX: 110, clientY: 100 },
    ].forEach((event: any) => {
      act(() => hook.current.onSVGMouseMove(event));
    });

    expect(props.clearHighlightedSeries).toHaveBeenCalledTimes(5);
  });
});
