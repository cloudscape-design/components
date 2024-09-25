// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';

import { ComponentMetrics } from '../../analytics';

export function useComponentAnalytics(
  componentName: string,
  getDetails: () => Record<string, string | boolean | number | undefined>
) {
  useEffect(() => {
    ComponentMetrics.componentMounted({ componentName, details: getDetails() });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
