// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
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
  return <InternalHeader variant={variant} {...props} {...baseComponentProps} />;
}

applyDisplayName(Header, 'Header');
