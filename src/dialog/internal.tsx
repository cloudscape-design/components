// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { InternalButton } from '../button/internal';
import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import { getFirstFocusable } from '../internal/components/focus-lock/utils';
import { fireNonCancelableEvent } from '../internal/events';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
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
  const i18n = useInternalI18n('dialog');
  const dismissAriaLabel = i18n('i18nStrings.dismissAriaLabel', i18nStrings?.dismissAriaLabel);
  const headerId = useUniqueId('dialog-header-');
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusTargetRef = useRef<HTMLOrSVGElement | null>(null);
  const [breakpoint, breakpointsRef] = useContainerBreakpoints(['xxs']);
  const isNarrow = breakpoint === 'default';

  const restoreFocusHandler = useCallback((element: HTMLDivElement | null) => {
    if (element === null) {
      restoreFocusTargetRef.current?.focus();
      restoreFocusTargetRef.current = null;
    }
  }, []);

  const mergedRootRef = useMergeRefs(dialogRef, breakpointsRef, __internalRootRef);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const activeElement = dialog.ownerDocument.activeElement;
    if (activeElement && !dialog.contains(activeElement)) {
      restoreFocusTargetRef.current = activeElement as unknown as HTMLOrSVGElement;
    }
    getFirstFocusable(dialog)?.focus();
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      fireNonCancelableEvent(onDismiss);
    }
  };

  const dismissButton = (
    <InternalButton
      className={clsx(styles['dismiss-button'], testStyles['dismiss-button'])}
      variant="icon"
      iconName="close"
      formAction="none"
      ariaLabel={dismissAriaLabel}
      onClick={() => fireNonCancelableEvent(onDismiss)}
    />
  );

  return (
    <div
      {...baseProps}
      ref={mergedRootRef}
      role="dialog"
      aria-labelledby={headerId}
      className={clsx(baseProps.className, styles.root, testStyles.root)}
      onKeyDown={onKeyDown}
    >
      <div
        ref={restoreFocusHandler}
        className={clsx(
          styles.header,
          headerActions && styles['header-with-actions'],
          headerActions && isNarrow && styles['header-narrow']
        )}
      >
        <div className={styles['header-content']}>
          <span id={headerId} className={testStyles.header}>
            {header}
          </span>
        </div>
        {headerActions && (
          <div className={clsx(styles['header-actions'], testStyles['header-actions'])}>{headerActions}</div>
        )}
        {dismissButton}
      </div>
      {children && <div className={clsx(styles.content, testStyles.content)}>{children}</div>}
      {footer && <div className={clsx(styles.footer, testStyles.footer)}>{footer}</div>}
    </div>
  );
}
