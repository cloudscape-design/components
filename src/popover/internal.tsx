// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState, useImperativeHandle } from 'react';
import clsx from 'clsx';

import { KeyCode } from '../internal/keycode';
import { getBaseProps } from '../internal/base-component';
import { FormFieldContext } from '../internal/context/form-field-context';

import Arrow from './arrow';
import Portal from '../internal/components/portal';
import { PopoverProps } from './interfaces';
import PopoverContainer from './container';
import PopoverBody from './body';

import styles from './styles.css.js';
import { NonCancelableEventHandler, fireNonCancelableEvent } from '../internal/events/index';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { usePortalModeClasses } from '../internal/hooks/use-portal-mode-classes';
import { useInternalI18n } from '../internal/i18n/context';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { getFirstFocusable } from '../internal/components/focus-lock/utils';

export interface InternalPopoverProps extends PopoverProps, InternalBaseComponentProps {
  __onOpen?: NonCancelableEventHandler<null>;
}

export interface InternalPopoverRef {
  dismissPopover: () => void;
}

export default React.forwardRef(InternalPopover);

function InternalPopover(
  {
    position = 'right',
    size = 'medium',
    fixedWidth = false,
    triggerType = 'text',
    dismissButton = true,

    children,
    header,
    content,

    renderWithPortal = false,

    __onOpen,
    __internalRootRef = null,
    ...restProps
  }: InternalPopoverProps,
  ref: React.Ref<InternalPopoverRef>
) {
  const baseProps = getBaseProps(restProps);
  const triggerRef = useRef<HTMLElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const clickFrameId = useRef<number | null>(null);

  const i18n = useInternalI18n('popover');
  const dismissAriaLabel = i18n('dismissAriaLabel', restProps.dismissAriaLabel);

  const [visible, setVisible] = useState(false);

  const focusTrigger = useCallback(() => {
    if (triggerType === 'text') {
      triggerRef.current?.focus();
    } else {
      triggerRef.current && getFirstFocusable(triggerRef.current)?.focus();
    }
  }, [triggerType]);

  const onTriggerClick = useCallback(() => {
    fireNonCancelableEvent(__onOpen);
    setVisible(true);
  }, [__onOpen]);

  const onDismiss = useCallback(() => {
    setVisible(false);
    focusTrigger();
  }, [focusTrigger]);

  const onTriggerKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.keyCode === KeyCode.tab || event.keyCode === KeyCode.escape) {
      setVisible(false);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    dismissPopover: onDismiss,
  }));

  useEffect(() => {
    if (!triggerRef.current) {
      return;
    }
    const document = triggerRef.current.ownerDocument;

    const onDocumentClick = () => {
      // Dismiss popover unless there was a click inside within the last animation frame.
      if (clickFrameId.current === null) {
        setVisible(false);
      }
    };

    // useCapture=false makes sure this listener is called after the one attached to the element.
    // the options.capture notation is unsupported by IE.
    document.addEventListener('mousedown', onDocumentClick, false);

    return () => {
      document.removeEventListener('mousedown', onDocumentClick, false);
    };
  }, []);

  const popoverClasses = usePortalModeClasses(triggerRef);

  const triggerProps = {
    // https://github.com/microsoft/TypeScript/issues/36659
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: triggerRef as any,
    onClick: onTriggerClick,
    onKeyDown: onTriggerKeyDown,
    className: clsx(styles.trigger, styles[`trigger-type-${triggerType}`]),
  };

  const referrerId = useUniqueId();
  const popoverContent = (
    <div
      aria-live={dismissButton ? undefined : 'polite'}
      aria-atomic={dismissButton ? undefined : true}
      className={clsx(popoverClasses, styles['popover-content'])}
      data-awsui-referrer-id={referrerId}
    >
      {visible && (
        <PopoverContainer
          size={size}
          fixedWidth={fixedWidth}
          position={position}
          trackRef={triggerRef}
          arrow={position => <Arrow position={position} />}
          renderWithPortal={renderWithPortal}
          zIndex={renderWithPortal ? 7000 : undefined}
        >
          <PopoverBody
            dismissButton={dismissButton}
            dismissAriaLabel={dismissAriaLabel}
            header={header}
            onDismiss={onDismiss}
            overflowVisible="both"
          >
            {content}
          </PopoverBody>
        </PopoverContainer>
      )}
    </div>
  );

  const mergedRef = useMergeRefs(popoverRef, __internalRootRef);

  return (
    <span
      {...baseProps}
      className={clsx(styles.root, baseProps.className)}
      ref={mergedRef}
      onMouseDown={() => {
        // Indicate there was a click inside popover recently, including nested portals.
        clickFrameId.current = requestAnimationFrame(() => {
          clickFrameId.current = null;
        });
      }}
    >
      {triggerType === 'text' ? (
        <button {...triggerProps} type="button" aria-haspopup="dialog" id={referrerId}>
          <span className={styles['trigger-inner-text']}>{children}</span>
        </button>
      ) : (
        <span {...triggerProps} id={referrerId}>
          {children}
        </span>
      )}
      <FormFieldContext.Provider value={{}}>
        {renderWithPortal ? <Portal>{popoverContent}</Portal> : popoverContent}
      </FormFieldContext.Provider>
    </span>
  );
}
