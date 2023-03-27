// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Option from '../internal/components/option';
import { fireNonCancelableEvent } from '../internal/events';
import checkControlled from '../internal/hooks/check-controlled';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

import { TokenGroupProps } from './interfaces';

import { SomeRequired } from '../internal/types';
import GenericTokenGroup from './generic-token-group';

type InternalTokenGroupProps = SomeRequired<TokenGroupProps, 'items' | 'alignment'> & InternalBaseComponentProps;

export default function InternalTokenGroup({ items, onDismiss, __internalRootRef, ...props }: InternalTokenGroupProps) {
  checkControlled('TokenGroup', 'items', items, 'onDismiss', onDismiss);

  return (
    <GenericTokenGroup
      ref={__internalRootRef}
      {...props}
      items={items}
      renderItem={item => <Option option={item} />}
      getItemAttributes={(item, itemIndex) => ({
        disabled: item.disabled,
        dismiss: {
          label: item.dismissLabel,
        },
        onDismiss: () => fireNonCancelableEvent(onDismiss, { itemIndex }),
      })}
    />
  );
}
