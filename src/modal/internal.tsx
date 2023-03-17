// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { KeyCode } from '../internal/keycode';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { InternalButton } from '../button/internal';
import InternalHeader from '../header/internal';
import Portal from '../internal/components/portal';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { FormFieldContext } from '../internal/context/form-field-context';

import { disableBodyScrolling, enableBodyScrolling } from './body-scroll';
import { ModalProps } from './interfaces';
import styles from './styles.css.js';
import { SomeRequired } from '../internal/types';
import FocusLock from '../internal/components/focus-lock';

type InternalModalProps = SomeRequired<ModalProps, 'size' | 'closeAriaLabel'> & InternalBaseComponentProps;

export default function InternalModal({
  size,
  visible,
  closeAriaLabel,
  header,
  children,
  footer,
  disableContentPaddings,
  onDismiss,
  modalRoot,
  __internalRootRef = null,
  ...rest
}: InternalModalProps) {
  const instanceUniqueId = useUniqueId();
  const headerId = `${rest.id || instanceUniqueId}-header`;
  const lastMouseDownElementRef = useRef<HTMLElement | null>(null);
  const [breakpoint, breakpointsRef] = useContainerBreakpoints(['xs']);

  const refObject = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(breakpointsRef, refObject, __internalRootRef);

  const isRefresh = useVisualRefresh();

  const baseProps = getBaseProps(rest);

  // enable body scroll and restore focus if unmounting while visible
  useEffect(() => {
    return () => {
      enableBodyScrolling();
    };
  }, []);

  // enable / disable body scroll
  useEffect(() => {
    if (visible) {
      disableBodyScrolling();
    } else {
      enableBodyScrolling();
    }
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

  return (
    <Portal container={modalRoot}>
      <FormFieldContext.Provider value={{}}>
        <div
          {...baseProps}
          className={clsx(styles.root, { [styles.hidden]: !visible }, baseProps.className, isRefresh && styles.refresh)}
          role="dialog"
          aria-modal={true}
          aria-labelledby={headerId}
          onMouseDown={onOverlayMouseDown}
          onClick={onOverlayClick}
          ref={mergedRef}
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
              tabIndex={-1}
            >
              <div className={styles.container}>
                <div className={styles.header}>
                  <InternalHeader
                    variant="h2"
                    __disableActionsWrapping={true}
                    actions={
                      <InternalButton
                        ariaLabel={closeAriaLabel}
                        className={styles['dismiss-control']}
                        variant="modal-dismiss"
                        iconName="close"
                        formAction="none"
                        onClick={onCloseButtonClick}
                      />
                    }
                  >
                    <span id={headerId} className={styles['header--text']}>
                      {header}
                    </span>
                  </InternalHeader>
                </div>
                <div className={clsx(styles.content, { [styles['no-paddings']]: disableContentPaddings })}>
                  {children}
                </div>
                {footer && <div className={styles.footer}>{footer}</div>}
              </div>
            </div>
          </FocusLock>
        </div>
      </FormFieldContext.Provider>
    </Portal>
  );
}
