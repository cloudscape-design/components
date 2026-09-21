// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import { BreadcrumbGroupProps } from '../../../breadcrumb-group/interfaces';
import { BreadcrumbsGlobalRegistration } from '../../../internal/plugins/controllers/breadcrumbs';

export function useOwnBreadcrumbsProps() {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbGroupProps | null>(null);

  const reportOwnBreadcrumbs = useStableCallback(
    (props: BreadcrumbGroupProps): BreadcrumbsGlobalRegistration<BreadcrumbGroupProps> => {
      setBreadcrumbs(props);

      return {
        update: setBreadcrumbs,
        cleanup: () => setBreadcrumbs(null),
      };
    }
  );

  return { breadcrumbs, reportOwnBreadcrumbs };
}
