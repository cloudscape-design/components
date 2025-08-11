// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { Portal, useMergeRefs, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { useInternalI18n } from '../i18n/context.js';
import { getBaseProps } from '../internal/base-component';
import { getFirstFocusable } from '../internal/components/focus-lock/utils.js';
import { LinkDefaultVariantContext } from '../internal/context/link-default-variant-context.js';
import ResetContextsForModal from '../internal/context/reset-contexts-for-modal.js';
import { useSingleTabStopNavigation } from '../internal/context/single-tab-stop-navigation-context.js';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events/index.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { usePortalModeClasses } from '../internal/hooks/use-portal-mode-classes';
import { KeyCode } from '../internal/keycode.js';
import Arrow from './arrow.js';
import PopoverBody from './body.js';
import ConditionalLiveRegion from './conditional-live-region.js';
import PopoverContainer from './container.js';
import { PopoverProps } from './interfaces.js';

import styles from './styles.css.js';

export interface InternalPopoverProps extends Omit<PopoverProps, 'triggerType' | 'size'>, InternalBaseComponentProps {
  __onOpen?: NonCancelableEventHandler<null>;
  triggerType?: PopoverProps.TriggerType | 'filtering-token';
  size: PopoverProps.Size | 'content';
  __closeAnalyticsAction?: string;
  isInline?: boolean;
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
    triggerAriaLabel,

    wrapTriggerText = true,
    isInline = false,
    renderWithPortal = false,

    __onOpen,
    __internalRootRef = null,
    __closeAnalyticsAction,

    ...restProps
  }: InternalPopoverProps,
  ref: React.Ref<PopoverProps.Ref>
) {
  const baseProps = getBaseProps(restProps);
  const triggerRef = useRef<HTMLElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const clickFrameId = useRef<number | null>(null);

  const i18n = useInternalI18n('popover');
  const dismissAriaLabel = i18n('dismissAriaLabel', restProps.dismissAriaLabel);

  const [visible, setVisible] = useState(false);

  const focusTrigger = useCallback(() => {
    if (['text', 'text-inline'].includes(triggerType)) {
      triggerRef.current?.focus();
    } else if (triggerRef.current) {
      getFirstFocusable(triggerRef.current)?.focus();
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

  const onTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const isEscapeKey = event.keyCode === KeyCode.escape;
      const isTabKey = event.keyCode === KeyCode.tab;
      if (isEscapeKey && visible) {
        event.stopPropagation();
      }
      if (isTabKey || isEscapeKey) {
        setVisible(false);
      }
    },
    [visible]
  );

  useImperativeHandle(ref, () => ({
    dismiss: () => {
      setVisible(false);
    },
    focus: () => {
      setVisible(false);
      focusTrigger();
    },
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

    document.addEventListener('mousedown', onDocumentClick);

    return () => {
      document.removeEventListener('mousedown', onDocumentClick);
    };
  }, []);

  const popoverClasses = usePortalModeClasses(triggerRef);

  const triggerProps = {
    // https://github.com/microsoft/TypeScript/issues/36659
    ref: triggerRef as any,
    onClick: onTriggerClick,
    onKeyDown: onTriggerKeyDown,
    className: clsx(styles.trigger, styles[`trigger-type-${triggerType}`]),
  };
  const { tabIndex: triggerTabIndex } = useSingleTabStopNavigation(triggerRef);

  const referrerId = useUniqueId();

  const popoverContent = (
    <div
      className={clsx(popoverClasses, !renderWithPortal && styles['popover-inline-content'])}
      data-awsui-referrer-id={referrerId}
    >
      <PopoverContainer
        size={size}
        fixedWidth={fixedWidth}
        position={position}
        trackRef={triggerRef}
        arrow={position => <Arrow position={position} />}
        renderWithPortal={renderWithPortal}
        zIndex={renderWithPortal ? 7000 : undefined}
      >
        <LinkDefaultVariantContext.Provider value={{ defaultVariant: 'primary' }}>
          <PopoverBody
            dismissButton={dismissButton}
            dismissAriaLabel={dismissAriaLabel}
            header={header}
            onDismiss={onDismiss}
            overflowVisible="both"
            closeAnalyticsAction={__closeAnalyticsAction}
          >
            <ConditionalLiveRegion condition={!dismissButton}>{content}</ConditionalLiveRegion>
          </PopoverBody>
        </LinkDefaultVariantContext.Provider>
      </PopoverContainer>
    </div>
  );

  const mergedRef = useMergeRefs(popoverRef, __internalRootRef);

  return (
    <span
      {...baseProps}
      className={clsx(
        styles.root,
        baseProps.className,
        triggerType === 'filtering-token' && styles['root-filtering-token'],
        isInline && styles['no-wrap']
      )}
      ref={mergedRef}
      onMouseDown={() => {
        // Indicate there was a click inside popover recently, including nested portals.
        clickFrameId.current = requestAnimationFrame(() => {
          clickFrameId.current = null;
        });
      }}
    >
      {['text', 'text-inline'].includes(triggerType) ? (
        <button
          {...triggerProps}
          className={clsx(triggerProps.className, wrapTriggerText === false && styles['overflow-ellipsis'])}
          tabIndex={triggerTabIndex}
          type="button"
          aria-haspopup="dialog"
          id={referrerId}
          aria-label={triggerAriaLabel}
        >
          {children}
        </button>
      ) : (
        <span {...triggerProps} id={referrerId}>
          {children}
        </span>
      )}
      {visible && (
        <ResetContextsForModal>
          {renderWithPortal ? <Portal>{popoverContent}</Portal> : popoverContent}
        </ResetContextsForModal>
      )}
    </span>
  );
}
