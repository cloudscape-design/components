// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

export const CustomHeaderStyle = React.createContext(() => {});

export function useHeaderStyle() {
  return useContext(CustomHeaderStyle);
}
