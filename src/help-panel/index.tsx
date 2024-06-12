// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { HelpPanelProps } from './interfaces';
import { InternalHelpPanel } from './internal';

export { HelpPanelProps };

export default function HelpPanel(props: HelpPanelProps) {
  const internalProps = useBaseComponent('HelpPanel');
  return <InternalHelpPanel {...props} {...internalProps} />;
}

applyDisplayName(HelpPanel, 'HelpPanel');
