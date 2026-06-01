// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { createWidgetizedComponent } from '../internal/widgets';
import CollapsibleFlashbar from './collapsible-flashbar';
import { FlashbarProps, InternalFlashbarProps } from './interfaces';
import NonCollapsibleFlashbar from './non-collapsible-flashbar';

function resolveSlot(
  slot: string | ((args: { item: FlashbarProps.MessageDefinition }) => string) | undefined,
  item: FlashbarProps.MessageDefinition,
  fallback: string | undefined
): string | undefined {
  if (slot === undefined) {
    return fallback;
  }
  return typeof slot === 'function' ? slot({ item }) : slot;
}

export function FlashbarImplementation({ items, classNames, ...rest }: InternalFlashbarProps) {
  const resolvedItems =
    classNames?.item !== undefined || classNames?.dismissButton !== undefined
      ? items.map(item => ({
          ...item,
          className: resolveSlot(classNames.item, item, item.className),
          dismissButtonClassName: resolveSlot(classNames.dismissButton, item, item.dismissButtonClassName),
        }))
      : items;

  const props = { ...rest, items: resolvedItems, classNames };

  if (rest.stackItems) {
    return <CollapsibleFlashbar {...props} />;
  } else {
    return <NonCollapsibleFlashbar {...props} />;
  }
}

export const createWidgetizedFlashbar = createWidgetizedComponent(FlashbarImplementation);
