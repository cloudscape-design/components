// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext } from 'react';

export interface AppContextProps {
  rootElement?: React.Ref<HTMLElement> | string;
}

export const AppContext = createContext<AppContextProps>({});
