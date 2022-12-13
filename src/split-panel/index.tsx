// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { getBaseProps } from '../internal/base-component';
import { useSplitPanelContext } from '../internal/context/split-panel-context';
import useFocusVisible from '../internal/hooks/focus-visible';
import { applyDisplayName } from '../internal/utils/apply-display-name';

import { SplitPanelProps, SizeControlProps } from './interfaces';
import ResizeHandler from './icons/resize-handler';
import PreferencesModal from './preferences-modal';
import { usePointerEvents } from './utils/use-pointer-events';
import { useKeyboardEvents } from './utils/use-keyboard-events';

import styles from './styles.css.js';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { AppLayoutContext } from '../internal/context/app-layout-context';
import { getLimitedValue } from './utils/size-utils';
import { Transition } from '../internal/components/transition';
import { ButtonProps } from '../button/interfaces';
import { useEffectOnUpdate } from '../internal/hooks/use-effect-on-update';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { SplitPanelContentSide } from './side';
import { SplitPanelContentBottom } from './bottom';

export { SplitPanelProps };

const MIN_HEIGHT = 160;
const MIN_WIDTH = 280;

export default function SplitPanel({
  header,
  children,
  hidePreferencesButton = false,
  i18nStrings,
  ...restProps
}: SplitPanelProps) {
  const isRefresh = useVisualRefresh();
  const { __internalRootRef } = useBaseComponent('SplitPanel');
  const {
    size,
    getMaxWidth,
    getMaxHeight,
    position,
    topOffset,
    bottomOffset,
    rightOffset,
    contentWidthStyles,
    isOpen,
    isForcedPosition,
    splitPanelRef,
    lastInteraction,
    onPreferencesChange,
    onResize,
    onToggle,
    reportSize,
    setOpenButtonAriaLabel,
  } = useSplitPanelContext();
  const baseProps = getBaseProps(restProps);
  const focusVisible = useFocusVisible();
  const [isPreferencesOpen, setPreferencesOpen] = useState<boolean>(false);
  const [relativeSize, setRelativeSize] = useState(0);
  const [maxSize, setMaxSize] = useState(size);
  const minSize = position === 'bottom' ? MIN_HEIGHT : MIN_WIDTH;
  const cappedSize = getLimitedValue(minSize, size, maxSize);
  const appLayoutMaxWidth = isRefresh && position === 'bottom' ? contentWidthStyles : undefined;

  useEffect(() => {
    setOpenButtonAriaLabel?.(i18nStrings.openButtonAriaLabel);
  }, [setOpenButtonAriaLabel, i18nStrings.openButtonAriaLabel]);

  useEffect(() => {
    // effects are called inside out in the components tree
    // wait one frame to allow app-layout to complete its calculations
    const handle = requestAnimationFrame(() => {
      const maxSize = position === 'bottom' ? getMaxHeight() : getMaxWidth();
      setRelativeSize((size / maxSize) * 100);
      setMaxSize(maxSize);
    });
    return () => cancelAnimationFrame(handle);
  }, [size, position, getMaxHeight, getMaxWidth]);

  useEffect(() => {
    reportSize(cappedSize);
  }, [reportSize, cappedSize]);

  useEffect(() => {
    const handler = () => setMaxSize(position === 'bottom' ? getMaxHeight() : getMaxWidth());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [position, getMaxWidth, getMaxHeight]);

  const setSidePanelWidth = (width: number) => {
    const maxWidth = getMaxWidth();
    const size = getLimitedValue(MIN_WIDTH, width, maxWidth);

    if (isOpen && maxWidth >= MIN_WIDTH) {
      onResize({ size });
    }
  };

  const setBottomPanelHeight = (height: number) => {
    const maxHeight = getMaxHeight();
    const size = getLimitedValue(MIN_HEIGHT, height, maxHeight);

    if (isOpen && maxHeight >= MIN_HEIGHT) {
      onResize({ size });
    }
  };

  const splitPanelRefObject = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const sizeControlProps: SizeControlProps = {
    position,
    splitPanelRef: splitPanelRefObject,
    handleRef,
    setSidePanelWidth,
    setBottomPanelHeight,
  };
  const onSliderPointerDown = usePointerEvents(sizeControlProps);
  const onKeyDown = useKeyboardEvents(sizeControlProps);

  const toggleRef = useRef<ButtonProps.Ref>(null);
  const closeRef = useRef<ButtonProps.Ref>(null);
  const preferencesRef = useRef<ButtonProps.Ref>(null);

  useEffectOnUpdate(() => {
    switch (lastInteraction?.type) {
      case 'open':
        return handleRef.current?.focus();
      case 'close':
        return toggleRef.current?.focus();
      case 'position':
        return preferencesRef.current?.focus();
      default:
        return;
    }
  }, [lastInteraction]);

  const wrappedChildren = (
    <AppLayoutContext.Provider
      value={{
        stickyOffsetTop: topOffset,
        stickyOffsetBottom: bottomOffset,
      }}
    >
      {children}
    </AppLayoutContext.Provider>
  );

  const panelHeaderId = useUniqueId('split-panel-header');

  const wrappedHeader = (
    <div className={styles.header} style={appLayoutMaxWidth}>
      <h2 className={styles['header-text']} id={panelHeaderId}>
        {header}
      </h2>
      <div className={styles['header-actions']}>
        {!hidePreferencesButton && isOpen && (
          <>
            <InternalButton
              className={styles['preferences-button']}
              iconName="settings"
              variant="icon"
              onClick={() => setPreferencesOpen(true)}
              formAction="none"
              ariaLabel={i18nStrings.preferencesTitle}
              ref={preferencesRef}
            />
            <span className={styles.divider} />
          </>
        )}

        {isOpen ? (
          <InternalButton
            className={styles['close-button']}
            iconName={isRefresh && position === 'side' ? 'angle-right' : isRefresh ? 'angle-down' : 'close'}
            variant="icon"
            onClick={onToggle}
            formAction="none"
            ariaLabel={i18nStrings.closeButtonAriaLabel}
            ref={closeRef}
            ariaExpanded={isOpen}
          />
        ) : position === 'side' ? null : (
          <InternalButton
            className={styles['open-button']}
            iconName="angle-up"
            variant="icon"
            formAction="none"
            ariaLabel={i18nStrings.openButtonAriaLabel}
            ref={toggleRef}
            ariaExpanded={isOpen}
          />
        )}
      </div>
    </div>
  );

  const resizeHandle = (
    <div
      ref={handleRef}
      role="slider"
      tabIndex={0}
      aria-label={i18nStrings.resizeHandleAriaLabel}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={relativeSize}
      className={clsx(styles.slider, styles[`slider-${position}`])}
      onKeyDown={onKeyDown}
      onPointerDown={onSliderPointerDown}
      {...focusVisible}
    >
      <ResizeHandler className={clsx(styles['slider-icon'], styles[`slider-icon-${position}`])} />
    </div>
  );

  /*
    This effect forces the browser to recalculate the layout
    whenever the split panel might have moved.

    This is needed as a workaround for a bug in Safari, which does
    not automatically calculate the new position of the split panel
    _content_ when the split panel moves.
  */
  useLayoutEffect(() => {
    const root = __internalRootRef.current;

    if (root) {
      const property = 'transform';
      const temporaryValue = 'translateZ(0)';

      const valueBefore = root.style[property];
      root.style[property] = temporaryValue;

      // This line forces the browser to recalculate the layout
      void root.offsetHeight;

      root.style[property] = valueBefore;
    }
  }, [rightOffset, __internalRootRef]);

  const mergedRef = useMergeRefs(splitPanelRef, splitPanelRefObject, __internalRootRef);

  /**
   * The AppLayout factor moved the circular buttons out of the
   * SplitPanel and into the Tools component. This conditional
   * is still needed for the early return to prevent execution
   * of the following code.
   */
  if (isRefresh && !isOpen && position === 'side') {
    return <></>;
  }

  return (
    <Transition in={isOpen ?? false}>
      {(state, transitioningElementRef) => (
        <>
          {position === 'side' && (
            <SplitPanelContentSide
              resizeHandle={resizeHandle}
              baseProps={baseProps}
              isOpen={isOpen}
              splitPanelRef={mergedRef}
              cappedSize={cappedSize}
              onToggle={onToggle}
              i18nStrings={i18nStrings}
              toggleRef={toggleRef}
              header={wrappedHeader}
              panelHeaderId={panelHeaderId}
            >
              {wrappedChildren}
            </SplitPanelContentSide>
          )}

          {position === 'bottom' && (
            <SplitPanelContentBottom
              resizeHandle={resizeHandle}
              baseProps={baseProps}
              isOpen={isOpen}
              splitPanelRef={mergedRef}
              cappedSize={cappedSize}
              onToggle={onToggle}
              header={wrappedHeader}
              panelHeaderId={panelHeaderId}
              state={state}
              transitioningElementRef={transitioningElementRef}
              appLayoutMaxWidth={appLayoutMaxWidth}
            >
              {wrappedChildren}
            </SplitPanelContentBottom>
          )}
          {isPreferencesOpen && (
            <PreferencesModal
              visible={true}
              preferences={{ position }}
              disabledSidePosition={position === 'bottom' && isForcedPosition}
              isRefresh={isRefresh}
              i18nStrings={{
                header: i18nStrings.preferencesTitle,
                confirm: i18nStrings.preferencesConfirm,
                cancel: i18nStrings.preferencesCancel,
                positionLabel: i18nStrings.preferencesPositionLabel,
                positionDescription: i18nStrings.preferencesPositionDescription,
                positionBottom: i18nStrings.preferencesPositionBottom,
                positionSide: i18nStrings.preferencesPositionSide,
              }}
              onConfirm={preferences => {
                onPreferencesChange({ ...preferences });
                setPreferencesOpen(false);
              }}
              onDismiss={() => {
                setPreferencesOpen(false);
              }}
            />
          )}
        </>
      )}
    </Transition>
  );
}

applyDisplayName(SplitPanel, 'SplitPanel');
