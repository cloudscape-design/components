// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { createContext, useContext } from 'react';

const HelpPanelContext = createContext<((newContent: React.ReactNode) => void) | null>(null);

export const HelpPanelProvider = HelpPanelContext.Provider;

export function useHelpPanel() {
  const ctx = useContext(HelpPanelContext);
  if (!ctx) {
    throw new Error('Missing HelpPanelProvider');
  }
  return ctx;
}
