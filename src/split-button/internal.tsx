// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BaseComponentProps } from '../internal/base-component';
import { TriggerLeft, TriggerRight } from './trigger';
import { SplitButtonProps } from './interfaces';
import InternalButtonDropdown from '../button-dropdown/internal';
import { fireCancelableEvent } from '../internal/events';
import styles from './styles.css.js';

interface InternalSplitButtonProps extends SplitButtonProps, BaseComponentProps {}

const InternalSplitButton = React.forwardRef(
  (
    { children, loading, variant = 'normal', ...props }: InternalSplitButtonProps,
    ref: React.Ref<SplitButtonProps.Ref>
  ) => {
    const trigger = (clickHandler: () => void, ref: React.Ref<any>, isDisabled: boolean, isExpanded: boolean) => {
      return (
        <TriggerRight
          dropdownRef={ref}
          loading={!!loading}
          variant={variant}
          isOpen={isExpanded}
          onClick={event => {
            event.preventDefault();
            clickHandler();
          }}
        />
      );
    };

    return (
      <div className={styles.root} role="group" aria-label="Instance actions">
        <TriggerLeft
          loading={!!loading}
          variant={variant}
          onClick={() => fireCancelableEvent(props.onItemClick, { id: props.items[0].id ?? 'undefined' } as any)}
        >
          {children}
        </TriggerLeft>
        <InternalButtonDropdown
          ref={ref}
          {...props}
          variant={variant}
          customTriggerBuilder={trigger}
          preferCenter={true}
        />
      </div>
    );
  }
);

export default InternalSplitButton;
