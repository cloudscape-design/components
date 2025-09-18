// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FlashbarProps } from './interfaces';
import { InternalFlashbar } from './internal';

export { FlashbarProps };

export default function Flashbar(props: FlashbarProps) {
  const { __internalRootRef } = useBaseComponent('Flashbar', {
    props: { stackItems: props.stackItems },
  });
  return <InternalFlashbar __internalRootRef={__internalRootRef} {...props} />;
}

applyDisplayName(Flashbar, 'Flashbar');
