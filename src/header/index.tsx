// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { HeaderProps } from './interfaces.js';
import InternalHeader from './internal.js';

export { HeaderProps };

export default function Header({ variant = 'h2', ...props }: HeaderProps) {
  const baseComponentProps = useBaseComponent('Header', {
    props: { headingTagOverride: props.headingTagOverride, variant },
  });
  return <InternalHeader variant={variant} {...props} {...baseComponentProps} />;
}

applyDisplayName(Header, 'Header');
