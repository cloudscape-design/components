// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { InternalButton } from '../button/internal';
import InternalHeader from '../header/internal';
import { useInternalI18n } from '../i18n/context';
import { PerformanceMetrics } from '../internal/analytics';
import {
  FunnelNameSelectorContext,
  FunnelStepContextValue,
  FunnelSubStepContextValue,
} from '../internal/analytics/context/analytics-context';
import { FunnelProps, useFunnel, useFunnelStep, useFunnelSubStep } from '../internal/analytics/hooks/use-funnel';
import { getBaseProps } from '../internal/base-component';
import FocusLock from '../internal/components/focus-lock';
import Portal from '../internal/components/portal';
import { ButtonContext, ButtonContextProps } from '../internal/context/button-context';
import { ModalContext } from '../internal/context/modal-context';
import ResetContextsForModal from '../internal/context/reset-contexts-for-modal';
import { fireNonCancelableEvent } from '../internal/events';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useIntersectionObserver } from '../internal/hooks/use-intersection-observer';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { KeyCode } from '../internal/keycode';
import { SomeRequired } from '../internal/types';
import {
  GeneratedAnalyticsMetadataModalComponent,
  GeneratedAnalyticsMetadataModalDismiss,
} from './analytics-metadata/interfaces';
import { disableBodyScrolling, enableBodyScrolling } from './body-scroll';
import { ModalProps } from './interfaces';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

export function InternalModalAsFunnel(props: InternalModalProps) {
  const { funnelProps, funnelSubmit, funnelNextOrSubmitAttempt } = useFunnel();
  const { funnelStepProps } = useFunnelStep();
  const { subStepRef, funnelSubStepProps } = useFunnelSubStep();
  const onButtonClick: ButtonContextProps['onClick'] = ({ variant }) => {
    if (variant === 'primary') {
      funnelNextOrSubmitAttempt();
      funnelSubmit();
    }
  };

  return (
    <InternalModal
      __funnelProps={funnelProps}
      __funnelStepProps={funnelStepProps}
      __subStepRef={subStepRef}
      __subStepFunnelProps={funnelSubStepProps}
      onButtonClick={onButtonClick}
      {...props}
    />
  );
}

type InternalModalProps = SomeRequired<ModalProps, 'size'> &
  InternalBaseComponentProps & {
    __funnelProps?: FunnelProps;
    __funnelStepProps?: FunnelStepContextValue['funnelStepProps'];
    __subStepRef?: FunnelSubStepContextValue['subStepRef'];
    __subStepFunnelProps?: FunnelSubStepContextValue['funnelSubStepProps'];
    __injectAnalyticsComponentMetadata?: boolean;
    onButtonClick?: ButtonContextProps['onClick'];
    referrerId?: string;
  };

export default function InternalModal({ modalRoot, getModalRoot, removeModalRoot, ...rest }: InternalModalProps) {
  return (
    <Portal container={modalRoot} getContainer={getModalRoot} removeContainer={removeModalRoot}>
      <PortaledModal {...rest} />
    </Portal>
  );
}

type PortaledModalProps = Omit<InternalModalProps, 'modalRoot' | 'getModalRoot' | 'removeModalRoot'>;

// Separate component to prevent the Portal from getting in the way of refs, as it needs extra cycles to render the inner components.
// useContainerQuery needs its targeted element to exist on the first render in order to work properly.
function PortaledModal({
  size,
  visible,
  header,
  children,
  footer,
  disableContentPaddings,
  onButtonClick = () => {},
  onDismiss,
  __internalRootRef = null,
  __injectAnalyticsComponentMetadata,
  __funnelProps,
  __funnelStepProps,
  __subStepRef,
  __subStepFunnelProps,
  referrerId,
  ...rest
}: PortaledModalProps) {
  const instanceUniqueId = useUniqueId();
  const headerId = `${rest.id || instanceUniqueId}-header`;
  const lastMouseDownElementRef = useRef<HTMLElement | null>(null);
  const [breakpoint, breakpointsRef] = useContainerBreakpoints(['xs']);

  const i18n = useInternalI18n('modal');
  const closeAriaLabel = i18n('closeAriaLabel', rest.closeAriaLabel);

  const refObject = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(breakpointsRef, refObject, __internalRootRef);

  const isRefresh = useVisualRefresh();

  const baseProps = getBaseProps(rest);

  const analyticsComponentMetadata: GeneratedAnalyticsMetadataModalComponent = {
    name: 'awsui.Modal',
    label: `.${analyticsSelectors.header} h2`,
  };
  const metadataAttribute = __injectAnalyticsComponentMetadata
    ? getAnalyticsMetadataAttribute({ component: analyticsComponentMetadata })
    : {};
  const loadStartTime = useRef<number>(0);
  const loadCompleteTime = useRef<number>(0);
  const componentLoadingCount = useRef<number>(0);
  const performanceMetricLogged = useRef<boolean>(false);

  // enable body scroll and restore focus if unmounting while visible
  useEffect(() => {
    return () => {
      enableBodyScrolling();
    };
  }, []);

  const resetModalPerformanceData = () => {
    loadStartTime.current = performance.now();
    loadCompleteTime.current = 0;
    performanceMetricLogged.current = false;
  };

  const emitTimeToContentReadyInModal = (loadCompleteTime: number) => {
    if (
      componentLoadingCount.current === 0 &&
      loadStartTime.current &&
      loadStartTime.current !== 0 &&
      !performanceMetricLogged.current
    ) {
      const timeToContentReadyInModal = loadCompleteTime - loadStartTime.current;
      PerformanceMetrics.modalPerformanceData({
        timeToContentReadyInModal,
        instanceIdentifier: instanceUniqueId,
        componentIdentifier: headerRef.current?.textContent || '',
      });
      performanceMetricLogged.current = true;
    }
  };

  const MODAL_READY_TIMEOUT = 100;
  /**
   * This useEffect is triggered when the visible attribute of modal changes.
   * When modal becomes visible, modal performance metrics are reset marking the beginning loading process.
   * To ensure that the modal component ready metric is always emitted, a setTimeout is implemented.
   * This setTimeout automatically emits the component ready metric after a specified duration.
   */
  useEffect(() => {
    if (visible) {
      disableBodyScrolling();
      resetModalPerformanceData();
      setTimeout(() => {
        emitTimeToContentReadyInModal(loadStartTime.current);
      }, MODAL_READY_TIMEOUT);
    } else {
      enableBodyScrolling();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Because we hide the element with styles (and not actually detach it from DOM), we need to scroll to top
  useEffect(() => {
    if (visible && refObject.current) {
      refObject.current.scrollTop = 0;
    }
  }, [visible]);

  const dismiss = (reason: string) => fireNonCancelableEvent(onDismiss, { reason });

  const onOverlayMouseDown = (event: React.MouseEvent) => {
    lastMouseDownElementRef.current = event.target as HTMLElement;
  };
  const onOverlayClick = (event: React.MouseEvent) => {
    const overlay = refObject.current;
    const lastClicked = lastMouseDownElementRef.current;

    if (event.target === overlay && lastClicked === overlay) {
      dismiss('overlay');
    }
  };
  const onCloseButtonClick = () => dismiss('closeButton');
  const escKeyHandler = (event: React.KeyboardEvent) => {
    if (event.keyCode === KeyCode.escape) {
      dismiss('keyboard');
    }
  };

  // We use an empty div element at the end of the content slot as a sentinel
  // to detect when the user has scrolled to the bottom.
  const { ref: stickySentinelRef, isIntersecting: footerStuck } = useIntersectionObserver();

  // Add extra scroll padding to account for the height of the sticky footer,
  // to prevent it from covering focused elements.
  const [footerHeight, footerRef] = useContainerQuery(rect => rect.borderBoxHeight);
  const headerRef = useRef<HTMLDivElement>(null);
  const { subStepRef } = useFunnelSubStep();

  return (
    <FunnelNameSelectorContext.Provider value={`.${styles['header--text']}`}>
      <ResetContextsForModal>
        <ModalContext.Provider
          value={{
            isInModal: true,
            componentLoadingCount,
            emitTimeToContentReadyInModal,
          }}
        >
          <div
            {...baseProps}
            {...__funnelProps}
            {...__funnelStepProps}
            className={clsx(
              styles.root,
              { [styles.hidden]: !visible },
              baseProps.className,
              isRefresh && styles.refresh
            )}
            role="dialog"
            aria-labelledby={headerId}
            onMouseDown={onOverlayMouseDown}
            onClick={onOverlayClick}
            ref={mergedRef}
            style={footerHeight ? { scrollPaddingBottom: footerHeight } : undefined}
            data-awsui-referrer-id={subStepRef.current?.id || referrerId}
          >
            <FocusLock disabled={!visible} autoFocus={true} restoreFocus={true} className={styles['focus-lock']}>
              <div
                className={clsx(
                  styles.dialog,
                  styles[size],
                  styles[`breakpoint-${breakpoint}`],
                  isRefresh && styles.refresh
                )}
                onKeyDown={escKeyHandler}
                {...metadataAttribute}
              >
                <div className={styles.container}>
                  <div className={clsx(styles.header, analyticsSelectors.header)}>
                    <InternalHeader
                      variant="h2"
                      __disableActionsWrapping={true}
                      actions={
                        <div
                          {...getAnalyticsMetadataAttribute({
                            action: 'dismiss',
                          } as Partial<GeneratedAnalyticsMetadataModalDismiss>)}
                        >
                          <InternalButton
                            ariaLabel={closeAriaLabel}
                            className={styles['dismiss-control']}
                            variant="modal-dismiss"
                            iconName="close"
                            formAction="none"
                            onClick={onCloseButtonClick}
                          />
                        </div>
                      }
                    >
                      <span ref={headerRef} id={headerId} className={styles['header--text']}>
                        {header}
                      </span>
                    </InternalHeader>
                  </div>
                  <div
                    ref={__subStepRef}
                    {...__subStepFunnelProps}
                    className={clsx(styles.content, { [styles['no-paddings']]: disableContentPaddings })}
                  >
                    {children}
                    <div ref={stickySentinelRef} />
                  </div>
                  {footer && (
                    <ButtonContext.Provider value={{ onClick: onButtonClick }}>
                      <div ref={footerRef} className={clsx(styles.footer, footerStuck && styles['footer--stuck'])}>
                        {footer}
                      </div>
                    </ButtonContext.Provider>
                  )}
                </div>
              </div>
            </FocusLock>
          </div>
        </ModalContext.Provider>
      </ResetContextsForModal>
    </FunnelNameSelectorContext.Provider>
  );
}
