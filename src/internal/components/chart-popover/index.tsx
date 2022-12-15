// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../../base-component';

import { PopoverProps } from '../../../popover/interfaces';
import PopoverContainer from '../../../popover/container';
import PopoverBody from '../../../popover/body';
import popoverStyles from '../../../popover/styles.css.js';
import { nodeContains } from '../../utils/dom';
import { useMergeRefs } from '../../hooks/use-merge-refs';

import styles from './styles.css.js';

export interface ChartPopoverProps extends PopoverProps {
  /** Title of the popover */
  title?: React.ReactNode;

  /** References the element the container is positioned against. */
  trackRef: React.RefObject<Element>;
  /**
    Used to update the container position in case track or track position changes:
    
    const trackRef = useRef<Element>(null)
    return (<>
      <Track style={getPosition(selectedItemId)} ref={trackRef} />
      <PopoverContainer trackRef={trackRef} trackKey={selectedItemId} .../>
    </>)
  */
  trackKey?: string | number;

  /** Optional container element that prevents any clicks in there from dismissing the popover */
  container: Element | null;

  /** Event that is fired when the popover is dismissed */
  onDismiss: (outsideClick?: boolean) => void;

  /** Fired when the pointer enters the hoverable area around the popover */
  onMouseEnter?: (event: React.MouseEvent) => void;

  /** Fired when the pointer leaves the hoverable area around the popover */
  onMouseLeave?: (event: React.MouseEvent) => void;

  /** Popover content */
  children?: React.ReactNode;
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

    title,
    trackRef,
    trackKey,
    onDismiss,
    container,

    onMouseEnter,
    onMouseLeave,

    ...restProps
  }: ChartPopoverProps,
  ref: React.Ref<HTMLElement>
) {
  const baseProps = getBaseProps(restProps);
  const popoverObjectRef = useRef<HTMLDivElement | null>(null);

  const popoverRef = useMergeRefs(popoverObjectRef, ref);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (
        event.target &&
        !nodeContains(popoverObjectRef.current, event.target as Element) && // click not in popover
        !nodeContains(container, event.target as Element) // click not in segment
      ) {
        onDismiss(true);
      }
    };

    document.addEventListener('mousedown', onDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('mousedown', onDocumentClick, { capture: true });
    };
  }, [container, onDismiss]);

  return (
    <div
      {...baseProps}
      className={clsx(popoverStyles.root, styles.root, baseProps.className, { [styles.dismissable]: dismissButton })}
      ref={popoverRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <PopoverContainer
        size={size}
        fixedWidth={fixedWidth}
        position={position}
        trackRef={trackRef}
        trackKey={trackKey}
        arrow={position => (
          <div className={clsx(popoverStyles.arrow, popoverStyles[`arrow-position-${position}`])}>
            <div className={popoverStyles['arrow-outer']} />
            <div className={popoverStyles['arrow-inner']} />
          </div>
        )}
      >
        <div className={styles['hover-area']}>
          <PopoverBody
            dismissButton={dismissButton}
            dismissAriaLabel={dismissAriaLabel}
            header={title}
            onDismiss={onDismiss}
            className={styles['popover-body']}
          >
            {children}
          </PopoverBody>
        </div>
      </PopoverContainer>
    </div>
  );
}
