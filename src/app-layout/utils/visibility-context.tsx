// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext } from 'react';

type VisibilityCallback = (isVisible: boolean) => void;

export const ActiveDrawersContext = createContext<React.MutableRefObject<
  Record<string, VisibilityCallback | null>
> | null>({ current: {} });
