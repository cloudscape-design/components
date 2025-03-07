// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { createWidgetizedComponent } from '../internal/widgets';
import CollapsibleFlashbar from './collapsible-flashbar';
import { InternalFlashbarProps } from './interfaces';
import NonCollapsibleFlashbar from './non-collapsible-flashbar';

export function FlashbarImplementation(props: InternalFlashbarProps) {
  if (props.stackItems) {
    return <CollapsibleFlashbar {...props} />;
  } else {
    return <NonCollapsibleFlashbar {...props} />;
  }
}

export const createWidgetizedFlashbar = createWidgetizedComponent(FlashbarImplementation);
