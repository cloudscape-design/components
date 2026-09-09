// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { BreadcrumbGroupProps } from '../../../breadcrumb-group/interfaces';
import { awsuiPluginsInternal } from '../../../internal/plugins/api';
import { BreadcrumbsGlobalRegistration } from '../../../internal/plugins/controllers/breadcrumbs';
import {
  BreadcrumbsConsumer,
  getBreadcrumbsConsumer,
  subscribeBreadcrumbsConsumer,
} from '../../../internal/plugins/widget/core';

interface UseBreadcrumbsProps {
  hasToolbar: boolean;
  isVisible: boolean;
  ownBreadcrumbs: React.ReactNode;
}

function getComponentName(type: React.ReactElement['type']) {
  if (typeof type === 'string') {
    return type;
  }
  const component = type as { displayName?: string; name?: string };
  return component.displayName ?? component.name;
}

function extractBreadcrumbGroupProps(node: React.ReactNode): BreadcrumbGroupProps | null {
  let result: BreadcrumbGroupProps | null = null;

  React.Children.forEach(node, child => {
    if (result || !React.isValidElement(child)) {
      return;
    }

    if (child.type === React.Fragment) {
      result = extractBreadcrumbGroupProps(child.props.children);
      return;
    }

    const props = child.props as Partial<BreadcrumbGroupProps>;
    if (getComponentName(child.type) !== 'BreadcrumbGroup' && !Array.isArray(props.items)) {
      return;
    }

    const { items = [], ariaLabel, expandAriaLabel, onClick, onFollow } = props;
    result = { items, ariaLabel, expandAriaLabel, onClick, onFollow };
  });

  return result;
}

function useBreadcrumbsConsumer() {
  const [consumer, setConsumer] = useState<BreadcrumbsConsumer | undefined>(() => getBreadcrumbsConsumer());

  useEffect(() => {
    setConsumer(getBreadcrumbsConsumer());
    return subscribeBreadcrumbsConsumer(setConsumer);
  }, []);

  return consumer;
}

export function useBreadcrumbs({ hasToolbar, isVisible, ownBreadcrumbs }: UseBreadcrumbsProps) {
  const consumer = useBreadcrumbsConsumer();
  const consumerRef = useRef(consumer);
  consumerRef.current = consumer;

  const ownBreadcrumbsProps = useMemo(() => extractBreadcrumbGroupProps(ownBreadcrumbs), [ownBreadcrumbs]);
  const ownBreadcrumbsPropsRef = useRef(ownBreadcrumbsProps);
  ownBreadcrumbsPropsRef.current = ownBreadcrumbsProps;
  const hasOwnBreadcrumbsProps = !!ownBreadcrumbsProps;
  const canRenderExternally = !ownBreadcrumbs || !!ownBreadcrumbsProps;
  const isExternallyOwned = !!consumer && hasToolbar && canRenderExternally;
  const shouldRegisterAppLayout = hasToolbar && isVisible && (!ownBreadcrumbs || isExternallyOwned);
  const [discoveredBreadcrumbs, setDiscoveredBreadcrumbs] = useState<BreadcrumbGroupProps | null>(null);

  useEffect(() => {
    if (!shouldRegisterAppLayout) {
      setDiscoveredBreadcrumbs(null);
      return;
    }

    const unregister = awsuiPluginsInternal.breadcrumbs.registerAppLayout(breadcrumbs => {
      setDiscoveredBreadcrumbs(breadcrumbs);
      consumerRef.current?.onBreadcrumbsChange(breadcrumbs);
    });

    return () => {
      unregister?.();
      setDiscoveredBreadcrumbs(null);
    };
  }, [shouldRegisterAppLayout]);

  const ownRegistrationRef = useRef<BreadcrumbsGlobalRegistration<BreadcrumbGroupProps> | null>(null);
  useEffect(() => {
    if (!consumer || !hasToolbar || !ownBreadcrumbsPropsRef.current || !isVisible) {
      return;
    }

    const registration = awsuiPluginsInternal.breadcrumbs.registerBreadcrumbs(ownBreadcrumbsPropsRef.current, () => {});
    ownRegistrationRef.current = registration;
    return () => {
      ownRegistrationRef.current = null;
      registration.cleanup();
    };
  }, [consumer, hasOwnBreadcrumbsProps, hasToolbar, isVisible]);

  useLayoutEffect(() => {
    if (ownBreadcrumbsProps) {
      ownRegistrationRef.current?.update(ownBreadcrumbsProps);
    }
  }, [ownBreadcrumbsProps]);

  useLayoutEffect(() => {
    if (consumer && hasToolbar && isVisible) {
      consumer.onBreadcrumbsChange(canRenderExternally ? discoveredBreadcrumbs : null);
    }
  }, [canRenderExternally, consumer, discoveredBreadcrumbs, hasToolbar, isVisible]);

  return {
    breadcrumbs: isExternallyOwned ? null : ownBreadcrumbs,
    discoveredBreadcrumbs: isExternallyOwned ? null : discoveredBreadcrumbs,
  };
}
