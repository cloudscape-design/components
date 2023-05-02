// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BaseComponentProps } from '../internal/base-component';
import { SplitTrigger } from './trigger';
import { SplitButtonProps } from './interfaces';
import InternalButtonDropdown from '../button-dropdown/internal';

interface InternalSplitButtonProps extends SplitButtonProps, BaseComponentProps {}

const InternalSplitButton = React.forwardRef(
  (
    { children, loading, variant = 'normal', ...props }: InternalSplitButtonProps,
    ref: React.Ref<SplitButtonProps.Ref>
  ) => {
    const trigger = (clickHandler: () => void, ref: React.Ref<any>, isDisabled: boolean, isExpanded: boolean) => {
      return (
        <SplitTrigger
          loading={!!loading}
          variant={variant}
          isOpen={isExpanded}
          onClick={event => {
            event.preventDefault();
            clickHandler();
          }}
        >
          {children}
        </SplitTrigger>
      );
    };

    return <InternalButtonDropdown ref={ref} {...props} variant={variant} customTriggerBuilder={trigger} />;
  }
);

export default InternalSplitButton;
