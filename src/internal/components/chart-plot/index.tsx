// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';
import { useUniqueId } from '../../hooks/use-unique-id';

import { KeyCode } from '../../keycode';
import LiveRegion from '../live-region/index';
import ApplicationController, { ApplicationRef } from './application-controller';
import FocusOutline from './focus-outline';
import { Offset } from '../interfaces';
import { useInternalI18n } from '../../../i18n/context';

const DEFAULT_PLOT_FOCUS_OFFSET = 3;
const DEFAULT_ELEMENT_FOCUS_OFFSET = 3;

export interface ChartPlotRef {
  svg: SVGSVGElement;
  focusPlot(): void;
  focusApplication(): void;
}

export interface ChartPlotProps {
  width: number | string;
  height: number | string;
  transform?: string;
  offsetTop?: number;
  offsetBottom?: number;
  offsetLeft?: number;
  offsetRight?: number;
  focusOffset?: number;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescription?: string;
  ariaDescribedby?: string;
  ariaRoleDescription?: string;
  activeElementKey?: null | string | number | boolean;
  activeElementRef?: React.RefObject<SVGGElement>;
  activeElementFocusOffset?: Offset;
  ariaLiveRegion?: string;
  isClickable?: boolean;
  isPrecise?: boolean;
  onClick?: (event: React.MouseEvent<SVGSVGElement>) => void;
  onMouseMove?: (event: React.MouseEvent<SVGSVGElement>) => void;
  onMouseOut?: (event: React.MouseEvent<SVGSVGElement>) => void;
  onFocus?: (event: React.FocusEvent<SVGGElement>, trigger: 'mouse' | 'keyboard') => void;
  onBlur?: (event: React.FocusEvent<SVGGElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<SVGGElement>) => void;
  onTouchStart?: (event: React.TouchEvent<SVGSVGElement>) => void;
  onTouchEnd?: (event: React.TouchEvent<SVGSVGElement>) => void;
  children: React.ReactNode;
}

/**
  An extension for the SVG to be used for charts. It includes a controller element to
  handle the focus and keyboard interactions in a way that is supported by screen readers.

  The application mimics the aria-activedescendant behavior which is unsupported by Safari. The
  activeElementRef is the pointer to the secondary-focus element and activeElementKey denotes when
  the focus transition was made.

  Alternatively, ariaLiveRegion can be used to make announcements.
*/
export default forwardRef(ChartPlot);

function ChartPlot(
  {
    width,
    height,
    transform,
    offsetTop,
    offsetBottom,
    offsetLeft,
    offsetRight,
    ariaLabel,
    ariaLabelledby,
    ariaRoleDescription,
    ariaDescription,
    ariaDescribedby,
    activeElementKey,
    activeElementRef,
    ariaLiveRegion,
    isClickable,
    isPrecise,
    children,
    onClick,
    onKeyDown,
    onFocus,
    onBlur,
    focusOffset = DEFAULT_PLOT_FOCUS_OFFSET,
    activeElementFocusOffset = DEFAULT_ELEMENT_FOCUS_OFFSET,
    onTouchStart,
    ...restProps
  }: ChartPlotProps,
  ref: React.Ref<ChartPlotRef>
) {
  const i18n = useInternalI18n('[charts]');
  const svgRef = useRef<SVGSVGElement>(null);
  const applicationRef = useRef<ApplicationRef>(null);
  const plotClickedRef = useRef(false);
  const [isPlotFocused, setPlotFocused] = useState(false);
  const [isApplicationFocused, setApplicationFocused] = useState(false);

  const internalDescriptionId = useUniqueId('awsui-chart-plot__description');
  const ariaDescriptionId = [ariaDescription && internalDescriptionId, ariaDescribedby].filter(Boolean).join(' ');

  useImperativeHandle(ref, () => ({
    svg: svgRef.current!,
    focusPlot: () => svgRef.current!.focus(),
    focusApplication: () => applicationRef.current!.focus(),
  }));

  const onPlotMouseDown = () => {
    // Record the click was made for the application focus handler.
    plotClickedRef.current = true;
  };
  const onPlotFocus = (event: React.FocusEvent<SVGSVGElement>) => {
    if (event.target === svgRef.current && !plotClickedRef.current) {
      setPlotFocused(true);
    }
    // The click should focus the underling application bypassing the svg.
    else if (plotClickedRef.current) {
      applicationRef.current!.focus();
    }
  };
  const onPlotClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    onClick && onClick(event);
  };
  const onPlotBlur = (event: React.FocusEvent<SVGSVGElement>) => {
    if (event.target === svgRef.current) {
      setPlotFocused(false);
    }
  };
  // Once one of the expected keys is pressed the focus is delegated to the application controller.
  const onPlotKeyDown = (event: React.KeyboardEvent) => {
    if (isPlotFocused) {
      // Delegate the focus to the application if one of the expected keys was pressed.
      const codes = [KeyCode.space, KeyCode.enter, KeyCode.up, KeyCode.left, KeyCode.right, KeyCode.down];
      if (codes.indexOf(event.keyCode) !== -1) {
        applicationRef.current!.focus();
      }
    }
  };

  const onApplicationFocus = (event: React.FocusEvent<SVGGElement>) => {
    onFocus && onFocus(event, plotClickedRef.current ? 'mouse' : 'keyboard');
    // "Release" the click reference to not affect the next call of this handler.
    plotClickedRef.current = false;
    setApplicationFocused(true);
  };
  const onApplicationBlur = (event: React.FocusEvent<SVGGElement>) => {
    onBlur && onBlur(event);
    setApplicationFocused(false);
  };
  const onApplicationKeyDown = onKeyDown;

  const plotFocusable = !isApplicationFocused;
  const plotTabIndex = plotFocusable ? 0 : -1;
  const plotAria = !isApplicationFocused
    ? {
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
        'aria-describedby': ariaDescriptionId,
        'aria-roledescription': i18n('i18nStrings.chartAriaRoleDescription', ariaRoleDescription),
      }
    : {};

  return (
    <>
      <svg
        {...restProps}
        focusable={plotFocusable}
        tabIndex={plotTabIndex}
        role="application"
        aria-hidden="false"
        {...plotAria}
        ref={svgRef}
        style={{
          width,
          height,
          marginTop: offsetTop,
          marginBottom: offsetBottom,
          marginLeft: offsetLeft,
          marginRight: offsetRight,
        }}
        className={clsx(styles.root, {
          [styles.clickable]: isClickable,
          [styles.precise]: isPrecise,
        })}
        onMouseDown={onPlotMouseDown}
        onClick={onPlotClick}
        onFocus={onPlotFocus}
        onBlur={onPlotBlur}
        onKeyDown={onPlotKeyDown}
        onTouchStart={onTouchStart}
      >
        <FocusOutline elementRef={svgRef} elementKey={isPlotFocused} offset={focusOffset} />

        <g transform={transform}>
          <ApplicationController
            activeElementKey={activeElementKey || null}
            activeElementRef={activeElementRef}
            ref={applicationRef}
            onFocus={onApplicationFocus}
            onBlur={onApplicationBlur}
            onKeyDown={onApplicationKeyDown}
          />

          {/* Only show description when plot is focusable to avoid repetition in Safari and Firefox */}
          {ariaDescription && plotFocusable && (
            <desc aria-hidden="true" id={internalDescriptionId}>
              {ariaDescription}
            </desc>
          )}

          {children}

          <FocusOutline
            elementRef={activeElementRef}
            elementKey={isApplicationFocused && activeElementKey}
            offset={activeElementFocusOffset}
          />
        </g>
      </svg>

      <LiveRegion>{ariaLiveRegion}</LiveRegion>
    </>
  );
}
