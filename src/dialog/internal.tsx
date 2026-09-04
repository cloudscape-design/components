// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { InternalButton } from '../button/internal';
import { getBaseProps } from '../internal/base-component';
import { getFirstFocusable } from '../internal/components/focus-lock/utils';
import { fireNonCancelableEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { DialogProps } from './interfaces';

import styles from './styles.css.js';
import testStyles from './test-classes/styles.css.js';

export interface InternalDialogProps extends DialogProps, InternalBaseComponentProps {}

const InternalDialog = React.forwardRef(
  (
    {
      header,
      children,
      footer,
      headerActions,
      i18nStrings,
      onDismiss,
      __internalRootRef,
      ...restProps
    }: InternalDialogProps,
    ref: React.Ref<DialogProps.Ref>
  ) => {
    const baseProps = getBaseProps(restProps);
    const isRefresh = useVisualRefresh();
    const headerId = useUniqueId('dialog-header-');
    const headerRef = useRef<HTMLSpanElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const mergedRootRef = useMergeRefs(dialogRef, __internalRootRef);

    useForwardFocus(ref, headerRef);

    useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) {
        return;
      }

      const activeElement = dialog.ownerDocument.activeElement;
      const HTMLElementConstructor = dialog.ownerDocument.defaultView?.HTMLElement;
      const restoreTarget =
        HTMLElementConstructor && activeElement instanceof HTMLElementConstructor && !dialog.contains(activeElement)
          ? activeElement
          : null;

      // Focus the first headerActions control when present, otherwise the
      // always-present close button. The heading is not a focus target.
      getFirstFocusable(dialog)?.focus();

      return () => {
        if (!restoreTarget) {
          return;
        }

        const activeElement = dialog.ownerDocument.activeElement;
        const shouldRestore =
          !activeElement || activeElement === dialog.ownerDocument.body || dialog.contains(activeElement);
        if (shouldRestore && restoreTarget.isConnected) {
          restoreTarget.focus();
        }
      };
    }, []);

    const onKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        fireNonCancelableEvent(onDismiss, { reason: 'keyboard' });
      }
    };

    const dismissButton = (
      <InternalButton
        className={testStyles['dismiss-button']}
        variant="icon"
        iconName="close"
        formAction="none"
        ariaLabel={i18nStrings?.dismissAriaLabel}
        onClick={() => fireNonCancelableEvent(onDismiss, { reason: 'closeButton' })}
      />
    );

    return (
      <div
        {...baseProps}
        ref={mergedRootRef}
        role="dialog"
        aria-labelledby={header ? headerId : undefined}
        className={clsx(baseProps.className, styles.root, testStyles.root, isRefresh && styles.refresh)}
        onKeyDown={onKeyDown}
      >
        <div className={styles.header}>
          {header && (
            <div className={styles['header-content']}>
              <span id={headerId} tabIndex={-1} ref={headerRef} className={testStyles.header}>
                {header}
              </span>
            </div>
          )}
          <div className={styles['header-actions']}>
            {headerActions}
            {dismissButton}
          </div>
        </div>
        {children && <div className={clsx(styles.content, testStyles.content)}>{children}</div>}
        {footer && <div className={clsx(styles.footer, testStyles.footer)}>{footer}</div>}
      </div>
    );
  }
);

export default InternalDialog;
