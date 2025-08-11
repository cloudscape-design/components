// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { ToggleProps } from './interfaces.js';
import InternalToggle from './internal.js';

export { ToggleProps };

const Toggle = React.forwardRef<ToggleProps.Ref, ToggleProps>((props, ref) => {
  const baseComponentProps = useBaseComponent('Toggle', { props: { readOnly: props.readOnly } });
  return <InternalToggle {...props} {...baseComponentProps} ref={ref} __injectAnalyticsComponentMetadata={true} />;
});

applyDisplayName(Toggle, 'Toggle');
export default Toggle;
