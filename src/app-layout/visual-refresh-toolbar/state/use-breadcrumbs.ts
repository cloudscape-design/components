// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import { BreadcrumbGroupProps } from '../../../breadcrumb-group/interfaces';
import { BreadcrumbsGlobalRegistration } from '../../../internal/plugins/controllers/breadcrumbs';
import { useGetGlobalBreadcrumbs } from '../../../internal/plugins/helpers/use-global-breadcrumbs';
import {
  BreadcrumbsConsumer,
  getBreadcrumbsConsumer,
  isBreadcrumbsOwnedExternally,
  subscribeBreadcrumbsConsumer,
} from '../../../internal/plugins/widget/core';

interface UseBreadcrumbsProps {
  hasToolbar: boolean;
  hasOwnBreadcrumbs: boolean;
  isVisible: boolean;
}

function arePropsEqual(first: BreadcrumbGroupProps | null, second: BreadcrumbGroupProps | null) {
  if (first === second) {
    return true;
  }
  if (!first || !second) {
    return false;
  }
  const firstKeys = Object.keys(first);
  const secondKeys = Object.keys(second);
  return (
    firstKeys.length === secondKeys.length &&
    firstKeys.every(key => first[key as keyof BreadcrumbGroupProps] === second[key as keyof BreadcrumbGroupProps])
  );
}

function useBreadcrumbsConsumer() {
  const [consumer, setConsumer] = useState<BreadcrumbsConsumer | undefined>(() => getBreadcrumbsConsumer());

  useEffect(() => {
    setConsumer(getBreadcrumbsConsumer());
    return subscribeBreadcrumbsConsumer(setConsumer);
  }, []);

  return consumer;
}

function useOwnBreadcrumbs() {
  const instancesRef = useRef<Array<{ props: BreadcrumbGroupProps }>>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbGroupProps | null>(null);

  const updateBreadcrumbs = useStableCallback(() => {
    const latest = instancesRef.current[instancesRef.current.length - 1]?.props ?? null;
    setBreadcrumbs(current => (arePropsEqual(current, latest) ? current : latest));
  });

  const registerBreadcrumbs = useStableCallback(
    (props: BreadcrumbGroupProps): BreadcrumbsGlobalRegistration<BreadcrumbGroupProps> => {
      const instance = { props };
      instancesRef.current.push(instance);
      updateBreadcrumbs();

      return {
        update: nextProps => {
          if (!arePropsEqual(instance.props, nextProps)) {
            instance.props = nextProps;
            updateBreadcrumbs();
          }
        },
        cleanup: () => {
          const index = instancesRef.current.indexOf(instance);
          if (index !== -1) {
            instancesRef.current.splice(index, 1);
            updateBreadcrumbs();
          }
        },
      };
    }
  );

  return { breadcrumbs, registerBreadcrumbs };
}

export function useBreadcrumbs({ hasToolbar, hasOwnBreadcrumbs, isVisible }: UseBreadcrumbsProps) {
  const consumer = useBreadcrumbsConsumer();

  const { breadcrumbs: ownBreadcrumbs, registerBreadcrumbs } = useOwnBreadcrumbs();
  const discoveredBreadcrumbs = useGetGlobalBreadcrumbs(hasToolbar && !hasOwnBreadcrumbs);
  const currentBreadcrumbs = hasOwnBreadcrumbs ? ownBreadcrumbs : discoveredBreadcrumbs;
  const canRenderExternally = !hasOwnBreadcrumbs || !!ownBreadcrumbs;
  const ownershipReserved = isBreadcrumbsOwnedExternally();
  const breadcrumbsExternallyOwned = hasToolbar && (ownershipReserved || (!!consumer && canRenderExternally));

  useLayoutEffect(() => {
    if (consumer && hasToolbar) {
      consumer.onBreadcrumbsChange(isVisible && canRenderExternally ? currentBreadcrumbs : null);
    }
  }, [canRenderExternally, consumer, currentBreadcrumbs, hasToolbar, isVisible]);

  useEffect(() => {
    if (!consumer || !hasToolbar) {
      return;
    }
    return () => {
      if (getBreadcrumbsConsumer()?.token === consumer.token) {
        consumer.onBreadcrumbsChange(null);
      }
    };
  }, [consumer, hasToolbar]);

  return {
    breadcrumbsExternallyOwned,
    discoveredBreadcrumbs,
    registerBreadcrumbs,
  };
}
