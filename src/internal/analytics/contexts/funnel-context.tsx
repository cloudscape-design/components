// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode, useContext, useMemo } from 'react';
import { createContext } from 'react';

import { Funnel, FunnelFactory } from '../funnel';

export interface FunnelContextProps {
  name?: string;
  controller?: Funnel | null;
  allowNesting?: boolean;
  dedupe?: boolean;
  rootComponent: 'form' | 'wizard' | 'modal';
}

export const FunnelContext = createContext<FunnelContextProps | null>(null);

interface WithChildren {
  children?: ReactNode;
}
export const FunnelProvider = ({
  name,
  allowNesting = true,
  dedupe = false,
  rootComponent,
  children,
}: WithChildren & FunnelContextProps) => {
  const parentFunnel = useContext(FunnelContext);
  const controller = useMemo(() => {
    if (!parentFunnel || !parentFunnel.controller) {
      return FunnelFactory.create({ name });
    } else if (!parentFunnel.allowNesting) {
      return null;
    } else if (dedupe && parentFunnel.rootComponent === rootComponent) {
      return parentFunnel.controller;
    }

    return FunnelFactory.create({ name, context: parentFunnel.controller });
  }, [parentFunnel, rootComponent, dedupe, name]);

  return (
    <FunnelContext.Provider value={{ allowNesting, dedupe, controller, rootComponent }}>
      {children}
    </FunnelContext.Provider>
  );
};
