// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import { useResize } from '../app-layout/visual-refresh-toolbar/drawer/use-resize';
import { getBaseProps } from '../internal/base-component';
import PanelResizeHandle from '../internal/components/panel-resize-handle';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useControllable } from '../internal/hooks/use-controllable';
import { SomeRequired } from '../internal/types';
import useContainerWidth from '../internal/utils/use-container-width';
import { PanelLayoutProps } from './interfaces';

import styles from './styles.css.js';
import testStyles from './test-classes/styles.css.js';

const DEFAULT_PANEL_SIZE = 200;

type InternalPanelLayoutProps = SomeRequired<PanelLayoutProps, 'panelPosition' | 'resizable' | 'display'> &
  InternalBaseComponentProps;

const InternalPanelLayout = React.forwardRef<PanelLayoutProps.Ref, InternalPanelLayoutProps>(
  (
    {
      panelPosition,
      panelContent,
      mainContent,
      defaultPanelSize,
      panelSize: controlledPanelSize,
      resizable,
      onPanelResize,
      onLayoutChange,
      minPanelSize,
      maxPanelSize,
      i18nStrings,
      display,
      panelFocusable,
      mainFocusable,
      __internalRootRef,
      ...props
    },
    ref
  ) => {
    const baseProps = getBaseProps(props);

    const resizeHandleRef = React.useRef<HTMLDivElement>(null);
    const panelRef = React.useRef<HTMLDivElement>(null);
    const [containerWidth, rootRef] = useContainerWidth();

    React.useImperativeHandle(
      ref,
      () => ({
        focusResizeHandle() {
          resizeHandleRef.current?.focus();
        },
      }),
      []
    );

    const [panelSize = DEFAULT_PANEL_SIZE, setPanelSize] = useControllable(
      controlledPanelSize,
      onPanelResize,
      defaultPanelSize ?? minPanelSize,
      {
        componentName: 'PanelLayout',
        controlledProp: 'panelSize',
        changeHandler: 'onPanelResize',
      }
    );

    const actualMaxSize = Math.min(maxPanelSize ?? containerWidth, containerWidth);
    const actualMinSize = minPanelSize ?? 0;
    const actualPanelSize = Math.max(Math.min(panelSize, actualMaxSize), actualMinSize);

    const notifiedContainerWidth = React.useRef(containerWidth);
    const notifiedPanelSize = React.useRef(actualPanelSize);
    if (notifiedContainerWidth.current !== containerWidth || notifiedPanelSize.current !== actualPanelSize) {
      notifiedContainerWidth.current = containerWidth;
      notifiedPanelSize.current = actualPanelSize;
      fireNonCancelableEvent(onLayoutChange, { totalSize: containerWidth, panelSize: actualPanelSize });
    }

    const resizeHandlePosition = panelPosition === 'side-end' ? 'side' : panelPosition;
    const resizeProps = useResize({
      currentWidth: actualPanelSize,
      minWidth: actualMinSize,
      maxWidth: actualMaxSize,
      panelRef: panelRef,
      handleRef: resizeHandleRef,
      position: resizeHandlePosition,
      onResize: size => {
        setPanelSize(size);
        fireNonCancelableEvent(onPanelResize, { totalSize: containerWidth, panelSize: size });
      },
    });

    const mergedRef = useMergeRefs(rootRef, __internalRootRef, ref);

    const wrappedPanelContent = (
      <div
        className={clsx(styles['panel-content'], display !== 'main-only' && testStyles.panel)}
        tabIndex={panelFocusable && 0}
        role={panelFocusable && 'region'}
        aria-label={panelFocusable?.ariaLabel}
        aria-labelledby={panelFocusable?.ariaLabelledby}
      >
        {panelContent}
      </div>
    );
    const wrappedMainContent = (
      <div
        className={clsx(styles.content, display !== 'panel-only' && testStyles.content)}
        tabIndex={mainFocusable && 0}
        role={mainFocusable && 'region'}
        aria-label={mainFocusable?.ariaLabel}
        aria-labelledby={mainFocusable?.ariaLabelledby}
      >
        {mainContent}
      </div>
    );
    const handle = (
      <div className={styles.handle}>
        <PanelResizeHandle
          ref={resizeHandleRef}
          className={testStyles['resize-handle']}
          position={resizeHandlePosition}
          ariaLabel={i18nStrings?.resizeHandleAriaLabel}
          tooltipText={i18nStrings?.resizeHandleTooltipText}
          ariaValuenow={resizeProps.relativeSize}
          onKeyDown={resizeProps.onKeyDown}
          onDirectionClick={resizeProps.onDirectionClick}
          onPointerDown={resizeProps.onPointerDown}
        />
      </div>
    );

    return (
      <div
        {...baseProps}
        ref={mergedRef}
        className={clsx(baseProps.className, styles.root, testStyles.root, styles[`display-${display}`])}
      >
        {panelPosition === 'side-end' && wrappedMainContent}
        <div
          className={clsx(styles.panel)}
          ref={panelRef}
          style={display === 'all' ? { inlineSize: `${actualPanelSize}px` } : undefined}
        >
          {panelPosition === 'side-start' && wrappedPanelContent}
          {resizable && display === 'all' && handle}
          {panelPosition === 'side-end' && wrappedPanelContent}
        </div>
        {panelPosition === 'side-start' && wrappedMainContent}
      </div>
    );
  }
);

export default InternalPanelLayout;
