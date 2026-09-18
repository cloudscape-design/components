// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import { BreadcrumbGroupProps } from '../../../breadcrumb-group/interfaces';
import { BreadcrumbsGlobalRegistration } from '../../../internal/plugins/controllers/breadcrumbs';

export function useOwnBreadcrumbsProps() {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbGroupProps | null>(null);

  const extractOwnBreadcrumbs = useStableCallback(
    (props: BreadcrumbGroupProps): BreadcrumbsGlobalRegistration<BreadcrumbGroupProps> => {
      let active = true;
      setBreadcrumbs(props);

      return {
        update: nextProps => {
          if (active) {
            setBreadcrumbs(nextProps);
          }
        },
        cleanup: () => {
          if (active) {
            active = false;
            setBreadcrumbs(null);
          }
        },
      };
    }
  );

  return { breadcrumbs, extractOwnBreadcrumbs };
}
