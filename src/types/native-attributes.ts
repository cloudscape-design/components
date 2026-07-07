// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export type NativeAttributes<T extends React.HTMLAttributes<HTMLElement>> =
  | (Omit<T, 'children'> & Record<`data-${string}`, string>)
  | undefined;
