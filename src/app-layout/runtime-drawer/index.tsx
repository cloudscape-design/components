// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef } from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { ButtonGroupProps } from '../../button-group/interfaces';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../../internal/events';
import {
  DrawerConfig as RuntimeDrawerConfig,
  DrawerStateChangeParams,
} from '../../internal/plugins/controllers/drawers';
import { sortByPriority } from '../../internal/plugins/helpers/utils';
import { DrawerPayload as RuntimeAiDrawerConfig } from '../../internal/plugins/widget/interfaces';
import { AppLayoutProps } from '../interfaces';
import { ActiveDrawersContext } from '../utils/visibility-context';

import styles from './styles.css.js';

export interface RuntimeDrawer extends AppLayoutProps.Drawer {
  onToggle?: NonCancelableEventHandler<DrawerStateChangeParams>;
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

function checkForUnsupportedProps(headerActions: ReadonlyArray<ButtonGroupProps.Item>) {
  const unsupportedProps = new Set([
    'iconSvg',
    'popoverFeedback',
    'pressedIconSvg',
    'popoverFeedback',
    'pressedPopoverFeedback',
  ]);
  for (const item of headerActions) {
    const unsupported = Object.keys(item).filter(key => unsupportedProps.has(key));
    if (unsupported.length > 0) {
      warnOnce('AppLayout', `The headerActions properties are not supported for runtime api: ${unsupported.join(' ')}`);
    }
  }
  return headerActions;
}

export const mapRuntimeConfigToDrawer = (
  runtimeConfig: RuntimeDrawerConfig
): AppLayoutProps.Drawer & {
  orderPriority?: number;
  onToggle?: NonCancelableEventHandler<DrawerStateChangeParams>;
  headerActions?: ReadonlyArray<ButtonGroupProps.Item>;
} => {
  const { mountContent, unmountContent, trigger, ...runtimeDrawer } = runtimeConfig;

  return {
    ...runtimeDrawer,
    ariaLabels: { drawerName: runtimeDrawer.ariaLabels.content ?? '', ...runtimeDrawer.ariaLabels },
    trigger: trigger
      ? {
          ...(trigger.iconSvg && {
            iconSvg: (
              // eslint-disable-next-line react/no-danger
              <span dangerouslySetInnerHTML={{ __html: trigger.iconSvg }} />
            ),
          }),
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
    onResize: event => {
      fireNonCancelableEvent(runtimeDrawer.onResize, { size: event.detail.size, id: runtimeDrawer.id });
    },
    headerActions: runtimeDrawer.headerActions ? checkForUnsupportedProps(runtimeDrawer.headerActions) : undefined,
  };
};

const convertRuntimeTriggerToReactNode = (runtimeTrigger?: string) => {
  if (!runtimeTrigger) {
    return undefined;
  }
  // eslint-disable-next-line react/no-danger
  return <span style={{ lineHeight: 0 }} dangerouslySetInnerHTML={{ __html: runtimeTrigger }} />;
};

export const mapRuntimeConfigToAiDrawer = (
  runtimeConfig: RuntimeAiDrawerConfig
): AppLayoutProps.Drawer & {
  orderPriority?: number;
  onToggle?: NonCancelableEventHandler<DrawerStateChangeParams>;
  headerActions?: ReadonlyArray<ButtonGroupProps.Item>;
  exitExpandedModeTrigger?: React.ReactNode;
} => {
  const { mountContent, unmountContent, trigger, exitExpandedModeTrigger, ...runtimeDrawer } = runtimeConfig;

  return {
    ...runtimeDrawer,
    ariaLabels: { drawerName: runtimeDrawer.ariaLabels.content ?? '', ...runtimeDrawer.ariaLabels },
    trigger: trigger
      ? {
          customIcon: convertRuntimeTriggerToReactNode(trigger?.customIcon),
          iconSvg: convertRuntimeTriggerToReactNode(trigger?.iconSvg),
        }
      : undefined,
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
    headerActions: runtimeDrawer.headerActions ? checkForUnsupportedProps(runtimeDrawer.headerActions) : undefined,
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
