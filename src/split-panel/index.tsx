// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { getBaseProps, BaseComponentProps } from '../internal/base-component';
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
import { Transition, TransitionStatus } from '../internal/components/transition';
import { ButtonProps } from '../button/interfaces';
import { useEffectOnUpdate } from '../internal/hooks/use-effect-on-update';
import { useUniqueId } from '../internal/hooks/use-unique-id';

export { SplitPanelProps };

const MIN_HEIGHT = 160;
const MIN_WIDTH = 280;
interface TransitionContentProps {
  baseProps: BaseComponentProps;
  isOpen?: boolean;
  splitPanelRef?: React.Ref<any>;
  handleRef: React.RefObject<HTMLDivElement>;
  bottomOffset: number;
  cappedSize: number;
  isRefresh: boolean;
  onToggle: () => void;
  i18nStrings: SplitPanelProps.I18nStrings;
  relativeSize: number;
  onKeyDown: (event: React.KeyboardEvent<Element>) => void;
  onSliderPointerDown: () => void;
  focusVisible: { 'data-awsui-focus-visible': true } | { 'data-awsui-focus-visible'?: undefined };
  paneHeader: JSX.Element;
  panelHeaderId: string;
  wrappedChildren: JSX.Element;
}

interface TransitionContentSideProps extends TransitionContentProps {
  topOffset: number;
  toggleRef: React.RefObject<ButtonProps.Ref>;
}

const TransitionContentSide = ({
  baseProps,
  isOpen,
  splitPanelRef,
  handleRef,
  topOffset,
  bottomOffset,
  cappedSize,
  isRefresh,
  onToggle,
  i18nStrings,
  relativeSize,
  onKeyDown,
  onSliderPointerDown,
  focusVisible,
  toggleRef,
  paneHeader,
  panelHeaderId,
  wrappedChildren,
}: TransitionContentSideProps) => {
  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.drawer, styles.root, styles['position-side'], {
        [styles['drawer-closed']]: !isOpen,
      })}
      style={{
        width: isOpen ? cappedSize : undefined,
        maxWidth: isRefresh ? '100%' : undefined,
      }}
      ref={splitPanelRef}
    >
      <div
        className={clsx(styles['drawer-content-side'], {
          [styles.refresh]: isRefresh,
        })}
        style={{
          top: topOffset,
          bottom: bottomOffset,
        }}
        onClick={() => !isOpen && onToggle()}
        aria-labelledby={panelHeaderId}
        role="region"
      >
        {isOpen ? (
          <div className={styles['slider-wrapper-side']}>
            <div
              role="slider"
              tabIndex={0}
              aria-label={i18nStrings.resizeHandleAriaLabel}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={relativeSize}
              className={clsx(styles.slider, styles['slider-side'])}
              onKeyDown={onKeyDown}
              onPointerDown={onSliderPointerDown}
              ref={handleRef}
              {...focusVisible}
            >
              <ResizeHandler className={clsx(styles['slider-icon'], styles['slider-icon-side'])} />
            </div>
          </div>
        ) : (
          <InternalButton
            className={clsx(styles['open-button'], styles['open-button-side'])}
            iconName="angle-left"
            variant="icon"
            formAction="none"
            ariaLabel={i18nStrings.openButtonAriaLabel}
            ariaExpanded={isOpen}
            ref={isRefresh ? null : toggleRef}
          />
        )}
        <div className={styles['content-side']} aria-hidden={!isOpen}>
          <div className={clsx(styles['pane-header-wrapper-side'])}>{paneHeader}</div>
          <hr className={styles['header-divider']} />
          <div className={clsx(styles['pane-content-wrapper-side'])}>{wrappedChildren}</div>
        </div>
      </div>
    </div>
  );
};

interface TransitionContentBottomProps extends TransitionContentProps {
  isMobile: boolean;
  disableContentPaddings?: boolean;
  state: TransitionStatus;
  leftOffset: number;
  rightOffset: number;
  transitioningElementRef: React.Ref<any>;
  centeredMaxWidthClasses: string;
  splitPanelHeaderRef?: React.Ref<any>;
  appLayoutMaxWidth: React.CSSProperties | undefined;
}

const TransitionContentBottom = ({
  baseProps,
  isOpen,
  splitPanelRef,
  handleRef,
  bottomOffset,
  cappedSize,
  isRefresh,
  onToggle,
  i18nStrings,
  relativeSize,
  onKeyDown,
  onSliderPointerDown,
  focusVisible,
  paneHeader,
  wrappedChildren,
  isMobile,
  disableContentPaddings,
  state,
  leftOffset,
  rightOffset,
  transitioningElementRef,
  centeredMaxWidthClasses,
  splitPanelHeaderRef,
  appLayoutMaxWidth,
  panelHeaderId,
}: TransitionContentBottomProps) => {
  const transitionContentBottomRef = useMergeRefs(splitPanelRef || null, transitioningElementRef);
  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.root, styles.drawer, styles['position-bottom'], {
        [styles['drawer-closed']]: !isOpen,
        [styles['drawer-mobile']]: isMobile,
        [styles['drawer-disable-content-paddings']]: disableContentPaddings,
        [styles.animating]: isRefresh && (state === 'entering' || state === 'exiting'),
        [styles.refresh]: isRefresh,
      })}
      onClick={() => !isOpen && onToggle()}
      style={{
        bottom: bottomOffset,
        left: leftOffset,
        right: rightOffset,
        height: isOpen ? cappedSize : undefined,
      }}
      ref={transitionContentBottomRef}
    >
      {isOpen && (
        <div className={styles['slider-wrapper-bottom']}>
          <div
            role="slider"
            tabIndex={0}
            aria-label={i18nStrings.resizeHandleAriaLabel}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={relativeSize}
            className={clsx(styles.slider, styles['slider-bottom'])}
            onKeyDown={onKeyDown}
            onPointerDown={onSliderPointerDown}
            ref={handleRef}
            {...focusVisible}
          >
            <ResizeHandler className={clsx(styles['slider-icon'], styles['slider-icon-bottom'])} />
          </div>
        </div>
      )}
      <div className={styles['drawer-content-bottom']} aria-labelledby={panelHeaderId} role="region">
        <div className={clsx(styles['pane-header-wrapper-bottom'], centeredMaxWidthClasses)} ref={splitPanelHeaderRef}>
          {paneHeader}
        </div>
        <div className={clsx(styles['content-bottom'], centeredMaxWidthClasses)} aria-hidden={!isOpen}>
          <div className={clsx({ [styles['content-bottom-max-width']]: isRefresh })} style={appLayoutMaxWidth}>
            {wrappedChildren}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SplitPanel({
  header,
  children,
  hidePreferencesButton = false,
  i18nStrings,
  ...restProps
}: SplitPanelProps) {
  const { __internalRootRef } = useBaseComponent('SplitPanel');
  const {
    size,
    getMaxWidth,
    getMaxHeight,
    position,
    topOffset,
    bottomOffset,
    leftOffset,
    rightOffset,
    disableContentPaddings,
    contentWidthStyles,
    contentWrapperPaddings,
    isCopy,
    isOpen,
    isMobile,
    isRefresh,
    isForcedPosition,
    splitPanelRef,
    splitPanelHeaderRef,
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
        return closeRef.current?.focus();
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

  const paneHeader = (
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
  if (isRefresh && (!isOpen || isCopy) && position === 'side') {
    return <></>;
  }

  const centeredMaxWidthClasses = clsx({
    [styles['pane-bottom-center-align']]: isRefresh,
    [styles['pane-bottom-content-nav-padding']]: contentWrapperPaddings?.closedNav,
    [styles['pane-bottom-content-tools-padding']]: contentWrapperPaddings?.closedTools,
  });

  return (
    <Transition in={isOpen ?? false}>
      {(state, transitioningElementRef) => (
        <>
          {position === 'side' && (
            <TransitionContentSide
              baseProps={baseProps}
              isOpen={isOpen}
              splitPanelRef={mergedRef}
              handleRef={handleRef}
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              cappedSize={cappedSize}
              isRefresh={isRefresh}
              onToggle={onToggle}
              i18nStrings={i18nStrings}
              relativeSize={relativeSize}
              onKeyDown={onKeyDown}
              onSliderPointerDown={onSliderPointerDown}
              focusVisible={focusVisible}
              toggleRef={toggleRef}
              paneHeader={paneHeader}
              wrappedChildren={wrappedChildren}
              panelHeaderId={panelHeaderId}
            ></TransitionContentSide>
          )}

          {position === 'bottom' && (
            <TransitionContentBottom
              baseProps={baseProps}
              isOpen={isOpen}
              splitPanelRef={mergedRef}
              handleRef={handleRef}
              bottomOffset={bottomOffset}
              cappedSize={cappedSize}
              isRefresh={isRefresh}
              onToggle={onToggle}
              i18nStrings={i18nStrings}
              relativeSize={relativeSize}
              onKeyDown={onKeyDown}
              onSliderPointerDown={onSliderPointerDown}
              focusVisible={focusVisible}
              paneHeader={paneHeader}
              wrappedChildren={wrappedChildren}
              isMobile={isMobile}
              disableContentPaddings={disableContentPaddings}
              state={state}
              leftOffset={leftOffset}
              rightOffset={rightOffset}
              transitioningElementRef={transitioningElementRef}
              centeredMaxWidthClasses={centeredMaxWidthClasses}
              splitPanelHeaderRef={splitPanelHeaderRef}
              appLayoutMaxWidth={appLayoutMaxWidth}
              panelHeaderId={panelHeaderId}
            ></TransitionContentBottom>
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
