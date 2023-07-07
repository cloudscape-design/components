// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import { DrawerConfig as RuntimeDrawerConfig } from '../internal/plugins/drawers-controller';
import { DrawerItem } from './drawer/interfaces';

interface RuntimeContentWrapperProps {
  mountContent: RuntimeDrawerConfig['mountContent'];
  unmountContent: RuntimeDrawerConfig['unmountContent'];
}

function RuntimeContentWrapper({ mountContent, unmountContent }: RuntimeContentWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current!;
    mountContent(container);
    return () => unmountContent(container);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref}></div>;
}

export interface DrawersLayout {
  before: Array<DrawerItem>;
  after: Array<DrawerItem>;
}

export function convertRuntimeDrawers(drawers: Array<RuntimeDrawerConfig>): DrawersLayout {
  const converted = drawers.map(({ mountContent, unmountContent, trigger, ...runtimeDrawer }) => ({
    ...runtimeDrawer,
    trigger: {
      iconSvg: (
        // eslint-disable-next-line react/no-danger
        <span dangerouslySetInnerHTML={{ __html: trigger.iconSvg }} />
      ),
    },
    content: (
      <RuntimeContentWrapper key={runtimeDrawer.id} mountContent={mountContent} unmountContent={unmountContent} />
    ),
  }));
  converted.sort((a, b) => {
    if (b.orderPriority !== a.orderPriority) {
      return Math.sign((b.orderPriority ?? 0) - (a.orderPriority ?? 0));
    }
    return b.id < a.id ? 1 : -1;
  });
  return {
    before: converted.filter(item => (item.orderPriority ?? 0) > 0),
    after: converted.filter(item => (item.orderPriority ?? 0) <= 0),
  };
}
