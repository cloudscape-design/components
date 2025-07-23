// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import { FunctionComponent, PropsType } from './index';

const getCustomFlag = (flagName: string) => {
  const flagHolder: any = typeof window !== 'undefined' ? window : globalThis;
  const awsuiCustomFlagsSymbol = Symbol.for('awsui-custom-flags');
  return flagHolder?.[awsuiCustomFlagsSymbol as any]?.[flagName as any];
};

const isAppLayoutDelayedWidget = () => {
  return !!getCustomFlag('appLayoutDelayedWidget');
};

const enableDelayedComponents = isAppLayoutDelayedWidget();

export function createLoadableComponent<ComponentType extends FunctionComponent<any>>(
  Component: ComponentType
): ComponentType | undefined {
  if (!enableDelayedComponents) {
    return;
  }
  return ((props: PropsType<ComponentType>) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      const timeoutId = setTimeout(() => setMounted(true), 1000);
      return () => clearTimeout(timeoutId);
    }, []);

    if (mounted) {
      return <Component {...props} />;
    }
    // this prop is injected in `createWidgetizedComponent` and is not a part of the component signature
    const { Skeleton } = props as any;

    return Skeleton ? <Skeleton {...props} /> : <div />;
  }) as ComponentType;
}
