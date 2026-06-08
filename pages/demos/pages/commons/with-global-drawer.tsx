// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { ReactNode, useEffect, useRef } from 'react';

import { registerGlobalDrawer } from './global-drawer-plugin';

interface WithGlobalDrawerProps {
  children: ReactNode;
}

export function WithGlobalDrawer({ children }: WithGlobalDrawerProps) {
  const registered = useRef(false);

  useEffect(() => {
    if (!registered.current) {
      registerGlobalDrawer();
      registered.current = true;
    }
  }, []);

  return <>{children}</>;
}
