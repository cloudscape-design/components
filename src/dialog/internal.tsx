// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { InternalButton } from '../button/internal';
import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import { getFirstFocusable } from '../internal/components/focus-lock/utils';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { DialogProps } from './interfaces';

import styles from './styles.css.js';
import testStyles from './test-classes/styles.css.js';

export interface InternalDialogProps extends DialogProps, InternalBaseComponentProps {}

export default function InternalDialog({
  header,
  children,
  footer,
  headerActions,
  i18nStrings,
  onDismiss,
  __internalRootRef,
  ...restProps
}: InternalDialogProps) {
  const baseProps = getBaseProps(restProps);
  const isRefresh = useVisualRefresh();
  const i18n = useInternalI18n('dialog');
  const dismissAriaLabel = i18n('i18nStrings.dismissAriaLabel', i18nStrings?.dismissAriaLabel);
  const headerId = useUniqueId('dialog-header-');
  const dialogRef = useRef<HTMLDivElement>(null);
  const mergedRootRef = useMergeRefs(dialogRef, __internalRootRef);

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
      if (restoreTarget?.isConnected) {
        // Cleanup can run synchronously while onDismiss is still executing. Defer
        // restoration so focus reliably returns to the original trigger after the handler finishes.
        dialog.ownerDocument.defaultView?.setTimeout(() => {
          if (restoreTarget.isConnected) {
            restoreTarget.focus();
          }
        }, 0);
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
      ariaLabel={dismissAriaLabel}
      onClick={() => fireNonCancelableEvent(onDismiss, { reason: 'closeButton' })}
    />
  );

  return (
    <div
      {...baseProps}
      ref={mergedRootRef}
      role="dialog"
      aria-labelledby={headerId}
      className={clsx(baseProps.className, styles.root, testStyles.root, isRefresh && styles.refresh)}
      onKeyDown={onKeyDown}
    >
      <div className={styles.header}>
        <div className={styles['header-content']}>
          <span id={headerId} className={testStyles.header}>
            {header}
          </span>
        </div>
        <div className={clsx(styles['header-actions'], headerActions && testStyles['header-actions'])}>
          {headerActions}
          {dismissButton}
        </div>
      </div>
      {children && <div className={clsx(styles.content, testStyles.content)}>{children}</div>}
      {footer && <div className={clsx(styles.footer, testStyles.footer)}>{footer}</div>}
    </div>
  );
}
