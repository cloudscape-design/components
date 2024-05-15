// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { getBaseProps } from '../internal/base-component';
import { useSplitPanelContext } from '../internal/context/split-panel-context';

import { SplitPanelProps } from './interfaces';
import ResizeHandler from './icons/resize-handler';
import PreferencesModal from './preferences-modal';
import { usePointerEvents } from '../app-layout/utils/use-pointer-events';
import { useKeyboardEvents } from '../app-layout/utils/use-keyboard-events';
import { SizeControlProps } from '../app-layout/utils/interfaces';

import styles from './styles.css.js';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { Transition } from '../internal/components/transition';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { SplitPanelContentSide } from './side';
import { SplitPanelContentBottom } from './bottom';
import { useInternalI18n } from '../i18n/context';
import globalVars from '../internal/styles/global-vars';
import { createWidgetizedForwardRef } from '../internal/widgets';

export { SplitPanelProps };

export const SplitPanelImplementation = React.forwardRef<HTMLElement, SplitPanelProps>(
  (
    { header, children, hidePreferencesButton = false, closeBehavior = 'collapse', i18nStrings, ...restProps },
    __internalRootRef
  ) => {
    const isRefresh = useVisualRefresh();

    const {
      position,
      topOffset,
      bottomOffset,
      rightOffset,
      contentWidthStyles,
      isOpen,
      isForcedPosition,
      onPreferencesChange,
      onResize,
      onToggle,
      size,
      relativeSize,
      setSplitPanelToggle,
      refs,
    } = useSplitPanelContext();
    const baseProps = getBaseProps(restProps);
    const i18n = useInternalI18n('split-panel');
    const [isPreferencesOpen, setPreferencesOpen] = useState<boolean>(false);

    const appLayoutMaxWidth = isRefresh && position === 'bottom' ? contentWidthStyles : undefined;

    const openButtonAriaLabel = i18n('i18nStrings.openButtonAriaLabel', i18nStrings?.openButtonAriaLabel);
    useEffect(() => {
      setSplitPanelToggle({ displayed: closeBehavior === 'collapse', ariaLabel: openButtonAriaLabel });
    }, [setSplitPanelToggle, openButtonAriaLabel, closeBehavior]);

    const splitPanelRefObject = useRef<HTMLDivElement>(null);

    const sizeControlProps: SizeControlProps = {
      position,
      panelRef: splitPanelRefObject,
      handleRef: refs.slider,
      onResize,
    };
    const onSliderPointerDown = usePointerEvents(sizeControlProps);
    const onKeyDown = useKeyboardEvents(sizeControlProps);

    const contentStyle = {
      [globalVars.stickyVerticalTopOffset]: topOffset,
      [globalVars.stickyVerticalBottomOffset]: bottomOffset,
    };

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
                ariaLabel={i18n('i18nStrings.preferencesTitle', i18nStrings?.preferencesTitle)}
                ref={refs.preferences}
              />
              <span className={styles.divider} />
            </>
          )}

          {isOpen ? (
            <InternalButton
              className={styles['close-button']}
              iconName={
                isRefresh && closeBehavior === 'collapse'
                  ? position === 'side'
                    ? 'angle-right'
                    : 'angle-down'
                  : 'close'
              }
              variant="icon"
              onClick={onToggle}
              formAction="none"
              ariaLabel={i18n('i18nStrings.closeButtonAriaLabel', i18nStrings?.closeButtonAriaLabel)}
              ariaExpanded={isOpen}
            />
          ) : position === 'side' ? null : (
            <InternalButton
              className={styles['open-button']}
              iconName="angle-up"
              variant="icon"
              formAction="none"
              ariaLabel={i18n('i18nStrings.openButtonAriaLabel', i18nStrings?.openButtonAriaLabel)}
              ref={refs.toggle}
              ariaExpanded={isOpen}
            />
          )}
        </div>
      </div>
    );

    const resizeHandle = (
      <div
        ref={refs.slider}
        role="slider"
        tabIndex={0}
        aria-label={i18n('i18nStrings.resizeHandleAriaLabel', i18nStrings?.resizeHandleAriaLabel)}
        aria-valuemax={100}
        aria-valuemin={0}
        // Allows us to use the logical left/right keys to move the slider left/right,
        // but match aria keyboard behavior of using left/right to decrease/increase
        // the slider value.
        aria-valuenow={position === 'bottom' ? relativeSize : 100 - relativeSize}
        className={clsx(styles.slider, styles[`slider-${position}`])}
        onKeyDown={onKeyDown}
        onPointerDown={onSliderPointerDown}
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
      const root = splitPanelRefObject.current;

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

    const mergedRef = useMergeRefs(splitPanelRefObject, __internalRootRef);

    if (closeBehavior === 'hide' && !isOpen) {
      return <></>;
    }

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
                style={contentStyle}
                resizeHandle={resizeHandle}
                baseProps={baseProps}
                isOpen={isOpen}
                splitPanelRef={mergedRef}
                cappedSize={size}
                onToggle={onToggle}
                openButtonAriaLabel={i18n('i18nStrings.openButtonAriaLabel', i18nStrings?.openButtonAriaLabel)}
                toggleRef={refs.toggle}
                header={wrappedHeader}
                panelHeaderId={panelHeaderId}
              >
                {children}
              </SplitPanelContentSide>
            )}

            {position === 'bottom' && (
              <SplitPanelContentBottom
                style={contentStyle}
                resizeHandle={resizeHandle}
                baseProps={baseProps}
                isOpen={isOpen}
                splitPanelRef={mergedRef}
                cappedSize={size}
                onToggle={onToggle}
                header={wrappedHeader}
                panelHeaderId={panelHeaderId}
                state={state}
                transitioningElementRef={transitioningElementRef}
                appLayoutMaxWidth={appLayoutMaxWidth}
              >
                {children}
              </SplitPanelContentBottom>
            )}
            {isPreferencesOpen && (
              <PreferencesModal
                visible={true}
                preferences={{ position }}
                disabledSidePosition={position === 'bottom' && isForcedPosition}
                isRefresh={isRefresh}
                i18nStrings={{
                  header: i18n('i18nStrings.preferencesTitle', i18nStrings?.preferencesTitle),
                  confirm: i18n('i18nStrings.preferencesConfirm', i18nStrings?.preferencesConfirm),
                  cancel: i18n('i18nStrings.preferencesCancel', i18nStrings?.preferencesCancel),
                  positionLabel: i18n('i18nStrings.preferencesPositionLabel', i18nStrings?.preferencesPositionLabel),
                  positionDescription: i18n(
                    'i18nStrings.preferencesPositionDescription',
                    i18nStrings?.preferencesPositionDescription
                  ),
                  positionBottom: i18n('i18nStrings.preferencesPositionBottom', i18nStrings?.preferencesPositionBottom),
                  positionSide: i18n('i18nStrings.preferencesPositionSide', i18nStrings?.preferencesPositionSide),
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
);

export const createWidgetizedSplitPanel = createWidgetizedForwardRef<
  SplitPanelProps,
  HTMLElement,
  typeof SplitPanelImplementation
>(SplitPanelImplementation);
