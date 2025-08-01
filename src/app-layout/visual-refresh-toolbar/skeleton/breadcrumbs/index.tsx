// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BreadcrumbGroupImplementation } from '../../../../breadcrumb-group/implementation';
import { BreadcrumbGroupProps } from '../../../../breadcrumb-group/interfaces';
import { BreadcrumbsSlotContext } from '../../contexts';

interface BreadcrumbsSlotProps {
  ownBreadcrumbs: React.ReactNode;
  discoveredBreadcrumbs?: BreadcrumbGroupProps | null;
}

export function BreadcrumbsSlot({ ownBreadcrumbs, discoveredBreadcrumbs }: BreadcrumbsSlotProps) {
  return (
    <BreadcrumbsSlotContext.Provider value={{ isInToolbar: true }}>
      {ownBreadcrumbs}
      {discoveredBreadcrumbs && (
        <BreadcrumbGroupImplementation
          {...discoveredBreadcrumbs}
          data-awsui-discovered-breadcrumbs={true}
          __injectAnalyticsComponentMetadata={true}
        />
      )}
    </BreadcrumbsSlotContext.Provider>
  );
}
