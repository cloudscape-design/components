// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

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
      const [mount, setMount] = useState(false);

      useEffect(() => {
        setTimeout(() => {
          setMount(true);
        }, 500);
      }, []);

      return mount ? <Implementation {...(props as any)} /> : <div>{props?.content}</div>;
    }) as Component;
  };
}
