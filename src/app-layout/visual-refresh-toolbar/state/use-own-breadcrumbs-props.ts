// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useRef, useState } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import { BreadcrumbGroupProps } from '../../../breadcrumb-group/interfaces';
import { BreadcrumbsGlobalRegistration } from '../../../internal/plugins/controllers/breadcrumbs';

export function useOwnBreadcrumbsProps() {
  const instancesRef = useRef<Array<{ props: BreadcrumbGroupProps }>>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbGroupProps | null>(null);

  const publishLatestBreadcrumbs = useStableCallback(() => {
    setBreadcrumbs(instancesRef.current[instancesRef.current.length - 1]?.props ?? null);
  });

  const registerBreadcrumbs = useStableCallback(
    (props: BreadcrumbGroupProps): BreadcrumbsGlobalRegistration<BreadcrumbGroupProps> => {
      const instance = { props };
      instancesRef.current.push(instance);
      publishLatestBreadcrumbs();

      return {
        update: nextProps => {
          instance.props = nextProps;
          if (instancesRef.current[instancesRef.current.length - 1] === instance) {
            setBreadcrumbs(nextProps);
          }
        },
        cleanup: () => {
          const index = instancesRef.current.indexOf(instance);
          if (index !== -1) {
            instancesRef.current.splice(index, 1);
            publishLatestBreadcrumbs();
          }
        },
      };
    }
  );

  return { breadcrumbs, registerBreadcrumbs };
}
