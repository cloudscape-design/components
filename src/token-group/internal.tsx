// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Option from '../internal/components/option';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { TokenGroupProps } from './interfaces';
import { SomeRequired } from '../internal/types';
import AbstractTokenGroup from './abstract-token-group';
import checkControlled from '../internal/hooks/check-controlled';
import { fireNonCancelableEvent } from '../internal/events';

type InternalTokenGroupProps = SomeRequired<TokenGroupProps, 'items' | 'alignment'> & InternalBaseComponentProps;

export default function InternalTokenGroup({ items, onDismiss, __internalRootRef, ...props }: InternalTokenGroupProps) {
  checkControlled('TokenGroup', 'items', items, 'onDismiss', onDismiss);

  return (
    <AbstractTokenGroup
      __internalRootRef={__internalRootRef}
      {...props}
      items={items}
      renderItem={item => <Option option={item} />}
      getItemAttributes={item => ({ disabled: item.disabled, dismissLabel: item.dismissLabel })}
      onDismiss={itemIndex => fireNonCancelableEvent(onDismiss, { itemIndex })}
    />
  );
}
