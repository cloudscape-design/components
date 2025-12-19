// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef } from 'react';

import { ButtonGroupProps, ItemRuntime } from '../../button-group/interfaces';
import { IconProps } from '../../icon/interfaces';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../../internal/events';
import {
  DrawerConfig as RuntimeDrawerConfig,
  DrawerStateChangeParams,
} from '../../internal/plugins/controllers/drawers';
import { sortByPriority } from '../../internal/plugins/helpers/utils';
import { DrawerPayload as RuntimeAiDrawerConfig, Feature } from '../../internal/plugins/widget/interfaces';
import { AppLayoutProps } from '../interfaces';
import { ActiveDrawersContext } from '../utils/visibility-context';

import styles from './styles.css.js';

export interface RuntimeDrawer extends AppLayoutProps.Drawer {
  onToggle?: NonCancelableEventHandler<DrawerStateChangeParams>;
  position?: 'side' | 'bottom';
  __features?: Array<Feature<unknown>>;
}

export interface DrawersLayout {
  global: Array<RuntimeDrawer>;
  localBefore: Array<RuntimeDrawer>;
  localAfter: Array<RuntimeDrawer>;
}

type VisibilityCallback = (isVisible: boolean) => void;

interface RuntimeContentWrapperProps {
  id?: string;
  mountContent: RuntimeDrawerConfig['mountContent'];
  unmountContent: RuntimeDrawerConfig['unmountContent'];
}

function RuntimeDrawerWrapper({ mountContent, unmountContent, id }: RuntimeContentWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const visibilityChangeCallback = useRef<VisibilityCallback | null>(null);
  const activeDrawersIds = useContext(ActiveDrawersContext);
  const isVisible = !!id && activeDrawersIds.includes(id);

  useEffect(() => {
    const container = ref.current!;
    mountContent(container, {
      onVisibilityChange: cb => {
        visibilityChangeCallback.current = cb;
      },
    });
    return () => {
      unmountContent(container);
      visibilityChangeCallback.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    visibilityChangeCallback.current?.(isVisible);
  }, [isVisible]);

  return <div ref={ref} className={styles['runtime-content-wrapper']} data-awsui-runtime-drawer-root-id={id}></div>;
}

interface RuntimeContentHeaderProps {
  mountHeader: (container: HTMLElement) => void;
  unmountHeader?: (container: HTMLElement) => void;
}

function RuntimeDrawerHeader({ mountHeader, unmountHeader }: RuntimeContentHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current!;
    mountHeader?.(container);
    return () => {
      unmountHeader?.(container);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className={styles['runtime-header-wrapper']} ref={ref} />;
}

function mapRuntimeHeaderActionsToHeaderActions(
  runtimeHeaderActions: ReadonlyArray<ItemRuntime>
): ReadonlyArray<ButtonGroupProps.Item> {
  return runtimeHeaderActions.map(runtimeHeaderAction => {
    return {
      ...runtimeHeaderAction,
      ...('iconSvg' in runtimeHeaderAction &&
        runtimeHeaderAction.iconSvg && {
          iconSvg: convertRuntimeTriggerToReactNode(runtimeHeaderAction.iconSvg),
        }),
      ...('pressedIconSvg' in runtimeHeaderAction &&
        runtimeHeaderAction.pressedIconSvg && {
          iconSvg: convertRuntimeTriggerToReactNode(runtimeHeaderAction.pressedIconSvg),
        }),
    };
  });
}

const convertRuntimeTriggerToReactNode = (runtimeTrigger?: string) => {
  if (!runtimeTrigger) {
    return undefined;
  }
  // eslint-disable-next-line react/no-danger
  return <span style={{ lineHeight: 0 }} dangerouslySetInnerHTML={{ __html: runtimeTrigger }} />;
};

export const mapRuntimeConfigToDrawer = (
  runtimeConfig: RuntimeDrawerConfig
): AppLayoutProps.Drawer & {
  orderPriority?: number;
  onToggle?: NonCancelableEventHandler<DrawerStateChangeParams>;
  headerActions?: ReadonlyArray<ButtonGroupProps.Item>;
} => {
  const { trigger, mountContent, unmountContent, __content, ...runtimeDrawer } = runtimeConfig;

  return {
    ...runtimeDrawer,
    ariaLabels: { drawerName: runtimeDrawer.ariaLabels.content ?? '', ...runtimeDrawer.ariaLabels },
    trigger: trigger
      ? {
          ...(trigger.iconSvg && {
            iconSvg: convertRuntimeTriggerToReactNode(trigger.iconSvg),
          }),
          ...(trigger.__iconName && {
            iconName: trigger.__iconName as IconProps.Name,
          }),
        }
      : undefined,
    content: __content ?? (
      <RuntimeDrawerWrapper
        key={runtimeDrawer.id}
        mountContent={mountContent}
        unmountContent={unmountContent}
        id={runtimeDrawer.id}
      />
    ),
    onResize: event => {
      fireNonCancelableEvent(runtimeDrawer.onResize, { size: event.detail.size, id: runtimeDrawer.id });
    },
    headerActions: runtimeDrawer.headerActions
      ? mapRuntimeHeaderActionsToHeaderActions(runtimeDrawer.headerActions)
      : undefined,
  };
};

export const mapRuntimeConfigToAiDrawer = (
  runtimeConfig: RuntimeAiDrawerConfig
): AppLayoutProps.Drawer & {
  orderPriority?: number;
  onToggle?: NonCancelableEventHandler<DrawerStateChangeParams>;
  headerActions?: ReadonlyArray<ButtonGroupProps.Item>;
  exitExpandedModeTrigger?: React.ReactNode;
  onToggleFocusMode?: NonCancelableEventHandler<{ isExpanded: boolean }>;
} => {
  const { mountContent, unmountContent, trigger, exitExpandedModeTrigger, ...runtimeDrawer } = runtimeConfig;

  return {
    ...runtimeDrawer,
    ariaLabels: { drawerName: runtimeDrawer.ariaLabels.content ?? '', ...runtimeDrawer.ariaLabels },
    ...(trigger && {
      trigger: {
        customIcon: convertRuntimeTriggerToReactNode(trigger?.customIcon),
        iconSvg: convertRuntimeTriggerToReactNode(trigger?.iconSvg),
      },
    }),
    exitExpandedModeTrigger: exitExpandedModeTrigger
      ? {
          customIcon: convertRuntimeTriggerToReactNode(exitExpandedModeTrigger?.customIcon),
        }
      : undefined,
    content: (
      <RuntimeDrawerWrapper
        key={runtimeDrawer.id}
        mountContent={mountContent}
        unmountContent={unmountContent}
        id={runtimeDrawer.id}
      />
    ),
    ...(runtimeDrawer.mountHeader && {
      header: (
        <RuntimeDrawerHeader mountHeader={runtimeDrawer.mountHeader} unmountHeader={runtimeDrawer.unmountHeader} />
      ),
    }),
    onResize: event => {
      fireNonCancelableEvent(runtimeDrawer.onResize, { size: event.detail.size, id: runtimeDrawer.id });
    },
    headerActions: runtimeDrawer.headerActions
      ? mapRuntimeHeaderActionsToHeaderActions(runtimeDrawer.headerActions)
      : undefined,
  };
};

export function convertRuntimeDrawers(
  localDrawers: Array<RuntimeDrawerConfig>,
  globalDrawers: Array<RuntimeDrawerConfig>
): DrawersLayout {
  const converted = localDrawers.map(mapRuntimeConfigToDrawer);
  const sorted = sortByPriority(converted);
  return {
    global: sortByPriority(globalDrawers.map(mapRuntimeConfigToDrawer)),
    localBefore: sorted.filter(item => (item.orderPriority ?? 0) > 0),
    localAfter: sorted.filter(item => (item.orderPriority ?? 0) <= 0),
  };
}
