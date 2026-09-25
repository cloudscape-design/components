// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export type NativeAttributes<ET extends HTMLElement, AT extends React.HTMLAttributes<ET>> = Omit<AT, 'children'> &
  Record<`data-${string}`, string> & { readonly ref?: React.Ref<ET> };
