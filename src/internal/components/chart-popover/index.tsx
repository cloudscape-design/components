// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { nodeContains } from '@cloudscape-design/component-toolkit/dom';
import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import PopoverBody from '../../../popover/body';
import PopoverContainer from '../../../popover/container';
import { PopoverProps } from '../../../popover/interfaces';
import { getBaseProps } from '../../base-component';

import popoverStyles from '../../../popover/styles.css.js';
import styles from './styles.css.js';
import testClasses from './test-classes/styles.css.js';

export interface ChartPopoverProps extends PopoverProps {
  /** Title of the popover */
  title?: React.ReactNode;

  /** References the element the container is positioned against. */
  trackRef?: React.RefObject<HTMLElement | SVGElement>;
  getTrack?: () => null | HTMLElement | SVGElement;
  /**
    Used to update the container position in case track or track position changes:
    
    const trackRef = useRef<Element>(null)
    return (<>
      <Track style={getPosition(selectedItemId)} ref={trackRef} />
      <PopoverContainer trackRef={trackRef} trackKey={selectedItemId} .../>
    </>)
  */
  trackKey?: string | number;
  minVisibleBlockSize?: number;

  /** Optional container element that prevents any clicks in there from dismissing the popover */
  container: Element | null;

  /** Event that is fired when the popover is dismissed */
  onDismiss: (outsideClick?: boolean) => void;

  /** Fired when the pointer enters the hoverable area around the popover */
  onMouseEnter?: (event: React.MouseEvent) => void;

  /** Fired when the pointer leaves the hoverable area around the popover */
  onMouseLeave?: (event: React.MouseEvent) => void;

  onBlur?: (event: React.FocusEvent) => void;

  /** Popover content */
  children?: React.ReactNode;

  /** Popover footer */
  footer?: React.ReactNode;
}

export default React.forwardRef(ChartPopover);

function ChartPopover(
  {
    position = 'right',
    size = 'medium',
    fixedWidth = false,
    dismissButton = false,
    dismissAriaLabel,

    children,
    footer,

    title,
    trackRef,
    getTrack,
    trackKey,
    onDismiss,
    container,
    minVisibleBlockSize,

    onMouseEnter,
    onMouseLeave,
    onBlur,

    ...restProps
  }: ChartPopoverProps,
  ref: React.Ref<HTMLElement>
) {
  const baseProps = getBaseProps(restProps);
  const popoverObjectRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useMergeRefs(popoverObjectRef, ref);

  const clickFrameId = useRef<number | null>(null);
  const onMouseDown = () => {
    // Indicate there was a click inside popover recently.
    clickFrameId.current = requestAnimationFrame(() => (clickFrameId.current = null));
  };

  useEffect(() => {
    if (popoverObjectRef.current) {
      const document = popoverObjectRef.current.ownerDocument;
      const onDocumentClick = (event: MouseEvent) => {
        // Dismiss popover unless there was a click inside within the last animation frame.
        // Ignore clicks inside the chart as those are handled separately.
        if (clickFrameId.current === null && !nodeContains(container, event.target as Element)) {
          onDismiss(true);
        }
      };

      document.addEventListener('mousedown', onDocumentClick);

      return () => {
        document.removeEventListener('mousedown', onDocumentClick);
      };
    }
  }, [container, onDismiss]);

  // In chart popovers, dismiss button is present when they are pinned, so both values are equivalent.
  const isPinned = dismissButton;

  return (
    <div
      {...baseProps}
      role={!dismissButton ? 'tooltip' : undefined}
      className={clsx(popoverStyles.root, styles.root, baseProps.className)}
      ref={popoverRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onBlur={onBlur}
      // The tabIndex makes it so that clicking inside popover assigns this element as blur target.
      // That is necessary in charts to ensure the blur target is within the chart and no cleanup is needed.
      tabIndex={-1}
    >
      <PopoverContainer
        size={size}
        fixedWidth={fixedWidth}
        position={position}
        trackRef={trackRef}
        getTrack={getTrack}
        trackKey={trackKey}
        minVisibleBlockSize={minVisibleBlockSize}
        arrow={position => (
          <div className={clsx(popoverStyles.arrow, popoverStyles[`arrow-position-${position}`])}>
            <div className={popoverStyles['arrow-outer']} />
            <div className={popoverStyles['arrow-inner']} />
          </div>
        )}
        keepPosition={true}
        allowVerticalOverflow={true}
        allowScrollToFit={isPinned}
        hoverArea={true}
      >
        <PopoverBody
          dismissButton={dismissButton}
          dismissAriaLabel={dismissAriaLabel}
          header={<span className={testClasses.header}>{title}</span>}
          onDismiss={onDismiss}
          overflowVisible="content"
          className={styles['popover-body']}
          variant="chart"
        >
          <div className={testClasses.body}>{children}</div>
          {footer && <div className={clsx(testClasses.footer, styles.footer)}>{footer}</div>}
        </PopoverBody>
      </PopoverContainer>
    </div>
  );
}
