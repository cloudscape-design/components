// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { Portal } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { getFirstFocusable } from '../internal/components/focus-lock/utils';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { SomeRequired } from '../internal/types';
import Arrow from '../popover/arrow';
import PopoverBody from '../popover/body';
import PopoverContainer from '../popover/container';
import { FeaturePromptProps } from './interfaces';

import styles from './styles.css.js';

interface InternalFeaturePromptProps
  extends SomeRequired<FeaturePromptProps, 'fixedWidth' | 'size' | 'position'>,
    InternalBaseComponentProps {}

function InternalFeaturePrompt(
  {
    visible,
    onDismiss,
    children,
    header,
    content,
    dismissAriaLabel,
    fixedWidth,
    size,
    position,
    onBlur,
    __internalRootRef,
    ...restProps
  }: InternalFeaturePromptProps,
  ref: React.Ref<FeaturePromptProps.Ref>
) {
  const baseProps = getBaseProps(restProps);
  const [show, setShow] = useState(visible);

  const trackRef = useRef<HTMLSpanElement>(null);
  const popoverBodyRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => ({
    dismiss: () => {
      setShow(false);
    },
    focus: () => {
      getFirstFocusable(popoverBodyRef.current!)?.focus();
    },
    show: () => {
      setShow(true);
    },
  }));

  return (
    <span {...baseProps} className={clsx(styles.root)} ref={__internalRootRef}>
      <span ref={trackRef}>{children}</span>
      {show && (
        <Portal>
          <PopoverContainer
            size={size}
            fixedWidth={fixedWidth}
            position={position}
            trackRef={trackRef}
            variant="annotation"
            arrow={position => <Arrow position={position} variant="info" />}
            zIndex={7000}
            renderWithPortal={true}
          >
            <PopoverBody
              ref={popoverBodyRef}
              dismissButton={true}
              dismissAriaLabel={dismissAriaLabel}
              header={header}
              onDismiss={() => {
                setShow(false);
                fireNonCancelableEvent(onDismiss);
              }}
              variant="annotation"
              overflowVisible="content"
              onBlur={() => {
                fireNonCancelableEvent(onBlur);
              }}
            >
              {content}
            </PopoverBody>
          </PopoverContainer>
        </Portal>
      )}
    </span>
  );
}

export default React.forwardRef(InternalFeaturePrompt);
