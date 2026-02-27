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

let loadPromise: Promise<void>;

export function createLoadableComponent<ComponentType extends FunctionComponent<any>>(
  Component: ComponentType
): ComponentType | undefined {
  return ((props: PropsType<ComponentType>) => {
    const [mounted, setMounted] = useState(() => {
      return !isAppLayoutDelayedWidget();
    });

    useEffect(() => {
      if (mounted) {
        return;
      }
      if (!loadPromise) {
        loadPromise = new Promise(resolve => setTimeout(() => resolve(), 1000));
      }
      let isMounted = true;
      loadPromise.then(() => {
        if (isMounted) {
          setMounted(true);
        }
      });
      return () => {
        isMounted = false;
      };
    }, [mounted]);

    if (mounted) {
      return <Component {...props} />;
    }
    // this prop is injected in `createWidgetizedComponent` and is not a part of the component signature
    const { Skeleton } = props as any;

    return Skeleton ? <Skeleton {...props} /> : <div />;
  }) as ComponentType;
}
