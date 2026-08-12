// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useStableCallback, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { InternalButton } from '../button/internal';
import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useEffectOnUpdate } from '../internal/hooks/use-effect-on-update';
import InternalItemCard from '../item-card/internal';
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
      open,
      initialFocus = 'header',
      i18nStrings,
      onDismiss,
      __internalRootRef,
      ...restProps
    }: InternalDialogProps,
    ref: React.Ref<DialogProps.Ref>
  ) => {
    const baseProps = getBaseProps(restProps);
    const headerId = useUniqueId('dialog-header-');
    const headerRef = useRef<HTMLSpanElement>(null);
    const returnFocusTargetRef = useRef<HTMLElement | null>(null);

    useForwardFocus(ref, headerRef);

    const focusIn = useStableCallback(() => {
      if (initialFocus === 'header') {
        headerRef.current?.focus();
      }
    });

    // Focus moves in whenever the dialog becomes visible: on mount if it starts
    // open, and on every false→true transition. The dialog never traps focus.
    useEffect(() => {
      if (open) {
        returnFocusTargetRef.current = document.activeElement as HTMLElement | null;
        focusIn();
      }
      // Mount only; open transitions are handled below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // On open transitions: focus in on show, restore focus to the previously
    // focused element on hide.
    useEffectOnUpdate(() => {
      if (open) {
        returnFocusTargetRef.current = document.activeElement as HTMLElement | null;
        focusIn();
      } else {
        const target = returnFocusTargetRef.current;
        if (target && target.isConnected) {
          target.focus();
        }
        returnFocusTargetRef.current = null;
      }
    }, [open, focusIn]);

    const onKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        fireNonCancelableEvent(onDismiss);
      }
    };

    const dismissButton = (
      <InternalButton
        className={testStyles['dismiss-button']}
        variant="icon"
        iconName="close"
        formAction="none"
        ariaLabel={i18nStrings?.dismissAriaLabel}
        onClick={() => fireNonCancelableEvent(onDismiss)}
      />
    );

    return (
      <div
        {...baseProps}
        ref={__internalRootRef}
        role="dialog"
        aria-labelledby={header ? headerId : undefined}
        className={clsx(baseProps.className, styles.root, testStyles.root, !open && styles.hidden)}
        onKeyDown={onKeyDown}
      >
        <InternalItemCard
          variant="embedded"
          header={
            header ? (
              <span id={headerId} tabIndex={-1} ref={headerRef} className={testStyles.header}>
                {header}
              </span>
            ) : undefined
          }
          actions={dismissButton}
          footer={footer}
        >
          {children}
        </InternalItemCard>
      </div>
    );
  }
);

export default InternalDialog;
