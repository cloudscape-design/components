// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext } from 'react';

export const DynamicOverlapContext = createContext<(overlapHeight: number) => void>(() => {});
