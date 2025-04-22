// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { getGlobalFlag } from '@cloudscape-design/component-toolkit/internal';

import { useVisualRefresh } from '../hooks/use-visual-mode';

// Built-in React.FunctionComponent has always present `children` property which is not desired
export type FunctionComponent<Props> = (props: Props) => JSX.Element;
type PropsType<Component extends FunctionComponent<any>> =
  Component extends FunctionComponent<infer Props> ? Props : never;

export function createWidgetizedComponent<Component extends FunctionComponent<any>>(
  Implementation: Component,
  Skeleton?: React.ForwardRefExoticComponent<PropsType<Component> & React.RefAttributes<HTMLElement>>
) {
  return (Loader?: Component): Component => {
    return (props => {
      const isRefresh = useVisualRefresh();
      if (isRefresh && getGlobalFlag('appLayoutWidget') && Loader) {
        return <Loader Skeleton={Skeleton} {...(props as any)} />;
      }

      return <Implementation {...(props as any)} />;
    }) as Component;
  };
}

export default function useImportedHook(importPromise: any, args: any, defaultReturn: any) {
  const [loaded, setLoaded] = useState(false);
  const isLoading = useRef(false);
  const importedHook = useRef<((props: any) => void) | null>(null);
  const isMounted = useRef(true);
  useEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  if (importPromise && !loaded && !isLoading.current) {
    isLoading.current = true;
    importPromise.then((module: any) => {
      if (isMounted.current) {
        importedHook.current = module;
        setLoaded(true);
      }
    });
  }

  if (!loaded) {
    return defaultReturn;
  }

  return importedHook.current?.(args);
}

export function createWidgetizedFunction<F extends (...args: any[]) => any>(
  fn: F,
  defaultFn: F = (() => null) as F
): () => F {
  return (): F => {
    return ((...args: Parameters<F>): ReturnType<F> => {
      return useImportedHook(
        new Promise(resolve => {
          setTimeout(() => {
            return resolve(fn);
          }, 0);
        }),
        args,
        defaultFn(...args)
      );
    }) as F;
  };
}
