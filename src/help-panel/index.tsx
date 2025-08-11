// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { HelpPanelProps } from './interfaces.js';
import { InternalHelpPanel } from './internal.js';

export { HelpPanelProps };

export default function HelpPanel(props: HelpPanelProps) {
  const internalProps = useBaseComponent('HelpPanel');
  return <InternalHelpPanel {...props} {...internalProps} />;
}

applyDisplayName(HelpPanel, 'HelpPanel');
