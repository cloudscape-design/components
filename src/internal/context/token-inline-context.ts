// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';

export interface TokenInlineContextProps {
  isInlineToken: boolean;
}

export const defaultValue: TokenInlineContextProps = {
  isInlineToken: false,
};

export const TokenInlineContext = createContext<TokenInlineContextProps>(defaultValue);

export function useTokenInlineContext() {
  return useContext(TokenInlineContext);
}
