// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { awsuiPluginsInternal } from '../api';
import { getGlobalFlag } from '../../utils/global-flags';
import { BreadcrumbGroupProps } from '../../../breadcrumb-group/interfaces';
import { BreadcrumbsGlobalRegistration } from '../controllers/breadcrumbs';

function useSetGlobalBreadcrumbsImplementation(props: BreadcrumbGroupProps<any>) {
  const registrationRef = useRef<BreadcrumbsGlobalRegistration<BreadcrumbGroupProps> | null>();
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const registration = awsuiPluginsInternal.breadcrumbs.registerBreadcrumbs(props, () => setRegistered(true));
    registrationRef.current = registration;

    return () => {
      registration.cleanup();
    };
    // subsequent prop changes are handled by another effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    registrationRef.current?.update(props);
  });

  return registered;
}

export function useSetGlobalBreadcrumbs<T extends BreadcrumbGroupProps.Item>(props: BreadcrumbGroupProps<T>) {
  // avoid additional side effects when this feature is not active
  if (!getGlobalFlag('appLayoutWidget')) {
    return false;
  }
  // getGlobalFlag() value does not change without full page reload
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSetGlobalBreadcrumbsImplementation(props);
}

export function useGetGlobalBreadcrumbs() {
  const [discoveredBreadcrumbs, setDiscoveredBreadcrumbs] = useState<BreadcrumbGroupProps<any> | null>(null);

  useEffect(() => {
    return awsuiPluginsInternal.breadcrumbs.registerAppLayout(breadcrumbs => {
      setDiscoveredBreadcrumbs(breadcrumbs);
    });
  }, []);

  return discoveredBreadcrumbs;
}
