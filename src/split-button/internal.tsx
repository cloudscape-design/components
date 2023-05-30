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
  ({ segments, loading, variant = 'normal', ...props }: InternalSplitButtonProps) =>
    // TODO: support ref
    // ref: React.Ref<SplitButtonProps.Ref>
    {
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
          {segments.map(segment => (
            <TriggerLeft
              key={segment.id}
              disabled={!!(segment.disabled || loading)}
              variant={variant}
              onClick={() => fireCancelableEvent(props.onItemClick, { id: segment.id } as any)}
            >
              {segment.text}
            </TriggerLeft>
          ))}
          <InternalButtonDropdown
            // ref={ref}
            {...props}
            loading={loading}
            variant={variant}
            customTriggerBuilder={trigger}
            preferCenter={true}
          />
        </div>
      );
    }
);

export default InternalSplitButton;
