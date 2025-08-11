// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import CollapsibleFlashbar from './collapsible-flashbar.js';
import { FlashbarProps } from './interfaces.js';
import NonCollapsibleFlashbar from './non-collapsible-flashbar.js';

export { FlashbarProps };

export default function Flashbar(props: FlashbarProps) {
  if (props.stackItems) {
    return <CollapsibleFlashbar {...props} />;
  } else {
    return <NonCollapsibleFlashbar {...props} />;
  }
}

applyDisplayName(Flashbar, 'Flashbar');
