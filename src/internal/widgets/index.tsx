// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getGlobalFlag } from '@cloudscape-design/component-toolkit/internal';

import { useVisualRefresh } from '../hooks/use-visual-mode';

// Built-in React.FunctionComponent has always present `children` property which is not desired
type FunctionComponent<Props> = (props: Props) => JSX.Element;

export function createWidgetizedComponent<Component extends FunctionComponent<any>>(Implementation: Component) {
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
