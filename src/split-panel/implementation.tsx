// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { isAppLayoutToolbarEnabled } from '../app-layout/utils/feature-flags';
import { SizeControlProps } from '../app-layout/utils/interfaces';
import { useKeyboardEvents } from '../app-layout/utils/use-keyboard-events';
import { usePointerEvents } from '../app-layout/utils/use-pointer-events';
import { InternalButton } from '../button/internal';
import { getBaseProps } from '../internal/base-component';
import PanelResizeHandle from '../internal/components/panel-resize-handle';
import { Transition } from '../internal/components/transition';
import { useSplitPanelContext } from '../internal/context/split-panel-context';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import globalVars from '../internal/styles/global-vars';
import { createWidgetizedForwardRef } from '../internal/widgets';
import { SplitPanelContentBottom } from './bottom';
import { SplitPanelProps } from './interfaces';
import PreferencesModal from './preferences-modal';
import { SplitPanelContentSide } from './side';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

export { SplitPanelProps };

export const SplitPanelImplementation = React.forwardRef<HTMLElement, SplitPanelProps>(
  (
    { header, children, hidePreferencesButton = false, closeBehavior = 'collapse', i18nStrings = {}, ...restProps },
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
    const [isPreferencesOpen, setPreferencesOpen] = useState<boolean>(false);

    const appLayoutMaxWidth = isRefresh && position === 'bottom' ? contentWidthStyles : undefined;

    const openButtonAriaLabel = i18nStrings.openButtonAriaLabel;
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
      <div
        className={clsx(styles.header, isAppLayoutToolbarEnabled() && styles['with-toolbar'])}
        style={appLayoutMaxWidth}
      >
        <h2 className={clsx(styles['header-text'], testUtilStyles['header-text'])} id={panelHeaderId}>
          {header}
        </h2>
        <div className={styles['header-actions']}>
          {!hidePreferencesButton && isOpen && (
            <>
              <InternalButton
                className={testUtilStyles['preferences-button']}
                iconName="settings"
                variant="icon"
                onClick={() => setPreferencesOpen(true)}
                formAction="none"
                ariaLabel={i18nStrings.preferencesTitle}
                ref={refs.preferences}
              />
              <span className={styles.divider} />
            </>
          )}

          {isOpen ? (
            <InternalButton
              className={testUtilStyles['close-button']}
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
              ariaLabel={i18nStrings.closeButtonAriaLabel}
              ariaExpanded={isOpen}
            />
          ) : position === 'side' ? null : (
            <InternalButton
              className={testUtilStyles['open-button']}
              iconName="angle-up"
              variant="icon"
              formAction="none"
              ariaLabel={i18nStrings.openButtonAriaLabel}
              ref={refs.toggle}
              ariaExpanded={isOpen}
            />
          )}
        </div>
      </div>
    );

    const resizeHandle = (
      <PanelResizeHandle
        ref={refs.slider}
        className={testUtilStyles.slider}
        ariaLabel={i18nStrings.resizeHandleAriaLabel}
        // Allows us to use the logical left/right keys to move the slider left/right,
        // but match aria keyboard behavior of using left/right to decrease/increase
        // the slider value.
        ariaValuenow={position === 'bottom' ? relativeSize : 100 - relativeSize}
        position={position}
        onKeyDown={onKeyDown}
        onPointerDown={onSliderPointerDown}
      />
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
                openButtonAriaLabel={openButtonAriaLabel}
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
);

export const createWidgetizedSplitPanel = createWidgetizedForwardRef<
  SplitPanelProps,
  HTMLElement,
  typeof SplitPanelImplementation
>(SplitPanelImplementation);
