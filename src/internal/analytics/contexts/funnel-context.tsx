// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode, useContext, useMemo } from 'react';
import { createContext } from 'react';

import { Funnel, FunnelFactory } from '../funnel';

export const FunnelContext = createContext<{ funnel?: Funnel | null; allowNesting?: boolean; dedupe?: boolean }>({});

interface WithChildren {
  children?: ReactNode;
}

export const FunnelProvider = ({
  allowNesting = true,
  dedupe = false,
  children,
}: WithChildren & { allowNesting?: boolean; dedupe?: boolean }) => {
  const parentFunnel = useContext(FunnelContext);
  const funnel = useMemo(() => {
    if (!parentFunnel.funnel) {
      return FunnelFactory.create();
    }

    if (!parentFunnel.allowNesting) {
      return null;
    } else if (parentFunnel.dedupe) {
      return parentFunnel.funnel;
    } else {
      return FunnelFactory.create();
    }
  }, [parentFunnel]);

  return <FunnelContext.Provider value={{ allowNesting, dedupe, funnel }}>{children}</FunnelContext.Provider>;
};
