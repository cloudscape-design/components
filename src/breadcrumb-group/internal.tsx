// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { BreadcrumbGroupImplementation, createWidgetizedBreadcrumbGroup } from './implementation';

export const InternalBreadcrumbGroup = createWidgetizedBreadcrumbGroup(
  createAppLayoutPart({ Component: BreadcrumbGroupImplementation })
);

const enableDelayedComponents = false;
const enableSyncComponents = true;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createAppLayoutPart({ Component }: { Component: React.JSXElementConstructor<any> }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AppLayoutPartLoader = ({ Skeleton, ...props }: any) => {
    const [mount, setMount] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setTimeout(() => {
        setMount(true);
      }, 1000);
    }, []);

    if (enableSyncComponents || (mount && enableDelayedComponents)) {
      return <Component {...props} />;
    }

    if (Skeleton) {
      return <Skeleton ref={ref} {...props} />;
    }
    return <div ref={ref} />;
  };
  return AppLayoutPartLoader;
}
