// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useAppLayoutFlagEnabled } from '../../../app-layout/utils/feature-flags';
import {
  AppLayoutVisibilityContext,
  BreadcrumbsSlotContext,
} from '../../../app-layout/visual-refresh-toolbar/contexts';
import { BreadcrumbGroupProps } from '../../../breadcrumb-group/interfaces';
import { metrics } from '../../metrics';
import { awsuiPluginsInternal } from '../api';
import { BreadcrumbsGlobalRegistration } from '../controllers/breadcrumbs';

function useSetGlobalBreadcrumbsImplementation(
  props: BreadcrumbGroupProps<any> & { __disableGlobalization?: boolean },
  enabled: boolean = false
) {
  const { __disableGlobalization, ...breadcrumbProps } = props;
  const { isInToolbar } = useContext(BreadcrumbsSlotContext) ?? {};
  const isLayoutVisible = useContext(AppLayoutVisibilityContext) ?? true;
  const registrationRef = useRef<BreadcrumbsGlobalRegistration<BreadcrumbGroupProps> | null>();
  const [registered, setRegistered] = useState(false);

  const shouldRegister = enabled && !isInToolbar && !__disableGlobalization && isLayoutVisible;

  useEffect(() => {
    if (!shouldRegister) {
      return;
    }
    const registration = awsuiPluginsInternal.breadcrumbs.registerBreadcrumbs(breadcrumbProps, isRegistered => {
      setRegistered(isRegistered ?? true);
      if (isRegistered) {
        const breadcrumbs = breadcrumbProps.items.map(item => item.text).join(' > ');
        metrics.sendOpsMetricObject('awsui-global-breadcrumbs-used', { breadcrumbs });
      }
    });
    registrationRef.current = registration;

    return () => {
      registration.cleanup();
    };
    // subsequent prop changes are handled by another effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRegister]);

  useLayoutEffect(() => {
    if (shouldRegister) {
      registrationRef.current?.update(breadcrumbProps);
    }
  });

  return registered;
}

export function useSetGlobalBreadcrumbs<T extends BreadcrumbGroupProps.Item>(props: BreadcrumbGroupProps<T>) {
  const enabled = useAppLayoutFlagEnabled() ?? false;
  return useSetGlobalBreadcrumbsImplementation(props, enabled);
}

export function useGetGlobalBreadcrumbs(enabled: boolean) {
  const [discoveredBreadcrumbs, setDiscoveredBreadcrumbs] = useState<BreadcrumbGroupProps<any> | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const unregisterAppLayout = awsuiPluginsInternal.breadcrumbs.registerAppLayout(breadcrumbs => {
      setDiscoveredBreadcrumbs(breadcrumbs);
    });
    return () => {
      unregisterAppLayout?.();
      setDiscoveredBreadcrumbs(null);
    };
  }, [enabled]);

  return discoveredBreadcrumbs;
}
