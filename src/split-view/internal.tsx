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
import { SplitViewProps } from './interfaces';

import styles from './styles.css.js';
import testStyles from './test-classes/styles.css.js';

const DEFAULT_PANEL_SIZE = 200;

type InternalSplitViewProps = SomeRequired<SplitViewProps, 'panelPosition' | 'resizable' | 'panelVariant' | 'display'> &
  InternalBaseComponentProps;

const InternalSplitView = React.forwardRef<SplitViewProps.Ref, InternalSplitViewProps>(
  (
    {
      panelPosition,
      panelContent,
      mainContent,
      defaultPanelSize,
      panelSize: controlledPanelSize,
      resizable,
      panelVariant,
      onPanelResize,
      minPanelSize,
      maxPanelSize,
      i18nStrings,
      display,
      __internalRootRef,
      ...props
    },
    ref
  ) => {
    const baseProps = getBaseProps(props);

    const sliderRef = React.useRef<HTMLDivElement>(null);
    const panelRef = React.useRef<HTMLDivElement>(null);
    const [containerWidth, rootRef] = useContainerWidth();

    React.useImperativeHandle(
      ref,
      () => ({
        focusResizeHandle() {
          if (resizable && display === 'all' && sliderRef.current) {
            sliderRef.current.focus();
          }
        },
      }),
      [resizable, display]
    );

    const [panelSize = DEFAULT_PANEL_SIZE, setPanelSize] = useControllable(
      controlledPanelSize,
      onPanelResize,
      defaultPanelSize ?? minPanelSize,
      {
        componentName: 'SplitView',
        controlledProp: 'panelSize',
        changeHandler: 'onPanelResize',
      }
    );

    const resizeHandlePosition = panelPosition === 'side-end' ? 'side' : panelPosition;
    const resizeProps = useResize({
      currentWidth: panelSize,
      minWidth: minPanelSize ?? 0,
      maxWidth: Math.min(maxPanelSize ?? containerWidth, containerWidth),
      panelRef: panelRef,
      handleRef: sliderRef,
      position: resizeHandlePosition,
      onResize: size => {
        setPanelSize(size);
        fireNonCancelableEvent(onPanelResize, { totalSize: containerWidth, panelSize: size });
      },
    });

    const mergedRef = useMergeRefs(rootRef, __internalRootRef, ref);

    const wrappedPanelContent = <div className={styles['panel-content']}>{panelContent}</div>;
    const wrappedMainContent = (
      <div className={clsx(styles.content, display !== 'panel-only' && testStyles.content)}>{mainContent}</div>
    );

    return (
      <div
        {...baseProps}
        ref={mergedRef}
        className={clsx(baseProps.className, styles.root, testStyles.root, styles[`display-${display}`])}
      >
        {panelPosition === 'side-end' && wrappedMainContent}
        <div
          className={clsx(
            styles.panel,
            styles[`panel-variant-${panelVariant}`],
            display !== 'main-only' && testStyles.panel
          )}
          ref={panelRef}
          style={display === 'all' ? { inlineSize: `${panelSize}px` } : undefined}
        >
          {panelPosition === 'side-start' && wrappedPanelContent}
          {resizable && display === 'all' && (
            <div className={styles.handle}>
              <PanelResizeHandle
                ref={sliderRef}
                className={testStyles.slider}
                position={resizeHandlePosition}
                ariaLabel={i18nStrings?.resizeHandleAriaLabel}
                tooltipText={i18nStrings?.resizeHandleTooltipText}
                ariaValuenow={resizeProps.relativeSize}
                onKeyDown={resizeProps.onKeyDown}
                onDirectionClick={resizeProps.onDirectionClick}
                onPointerDown={resizeProps.onPointerDown}
              />
            </div>
          )}
          {panelPosition === 'side-end' && wrappedPanelContent}
        </div>
        {panelPosition === 'side-start' && wrappedMainContent}
      </div>
    );
  }
);

export default InternalSplitView;
