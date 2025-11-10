// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import clsx from 'clsx';

import { Portal } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
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

export function InternalFeaturePrompt({
  visible,
  onDismiss,
  children,
  header,
  content,
  dismissAriaLabel,
  fixedWidth,
  size,
  position,
  __internalRootRef,
  ...restProps
}: InternalFeaturePromptProps) {
  const baseProps = getBaseProps(restProps);
  const trackRef = useRef<HTMLSpanElement>(null);
  return (
    <span {...baseProps} className={clsx(styles.root)} ref={__internalRootRef}>
      <span ref={trackRef}>{children}</span>
      {visible && (
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
              dismissButton={true}
              dismissAriaLabel={dismissAriaLabel}
              header={header}
              onDismiss={() => fireNonCancelableEvent(onDismiss)}
              variant="annotation"
              overflowVisible="content"
            >
              {content}
            </PopoverBody>
          </PopoverContainer>
        </Portal>
      )}
    </span>
  );
}
