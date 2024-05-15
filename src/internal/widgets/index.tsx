// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { getGlobalFlag } from '../utils/global-flags';
import { useVisualRefresh } from '../hooks/use-visual-mode';

export function createWidgetizedComponent<Props, Component extends React.ComponentType<Props>>(
  Implementation: Component
) {
  return (Loader?: Component): Component => {
    return (props => {
      const isRefresh = useVisualRefresh();
      if (isRefresh && getGlobalFlag('appLayoutWidget') && Loader) {
        return <Loader {...(props as any)} />;
      }

      return <Implementation {...(props as any)} />;
    }) as Component;
  };
}

export function createWidgetizedForwardRef<
  Props,
  RefType,
  Component extends React.ForwardRefExoticComponent<Props & React.RefAttributes<RefType>>,
>(Implementation: Component) {
  return (Loader?: Component): Component => {
    return React.forwardRef<RefType, Props>((props, ref) => {
      const isRefresh = useVisualRefresh();
      if (isRefresh && getGlobalFlag('appLayoutWidget') && Loader) {
        return <Loader ref={ref} {...(props as any)} />;
      }

      return <Implementation ref={ref} {...(props as any)} />;
    }) as Component;
  };
}
