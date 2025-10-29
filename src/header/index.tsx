// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { HeaderProps } from './interfaces';
import InternalHeader from './internal';

export { HeaderProps };

export default function Header({ variant = 'h2', ...props }: HeaderProps) {
  const baseComponentProps = useBaseComponent('Header', {
    props: { headingTagOverride: props.headingTagOverride, variant },
  });

  /**
   * We are adding a special tabindex -1 for heading variant h1 to allow the focus behavior of flashbars
   * when closed to programmatically focus the h1 after the last item is closed.
   */
  const tabIndex = variant === 'h1' ? -1 : undefined;
  return <InternalHeader __headingTagTabIndex={tabIndex} variant={variant} {...props} {...baseComponentProps} />;
}

applyDisplayName(Header, 'Header');
