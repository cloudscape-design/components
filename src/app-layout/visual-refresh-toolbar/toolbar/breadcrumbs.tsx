// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import { BreadcrumbGroupImplementation } from '../../../breadcrumb-group/implementation';
import { BreadcrumbGroupProps } from '../../../breadcrumb-group/interfaces';

import styles from './styles.css.js';

interface BreadcrumbsSlotProps {
  ownBreadcrumbs: React.ReactNode;
  discoveredBreadcrumbs: BreadcrumbGroupProps | null;
}

export function BreadcrumbsSlot({ ownBreadcrumbs, discoveredBreadcrumbs }: BreadcrumbsSlotProps) {
  const [ownBreadcrumbsExist, ref] = useContainerQuery(entry => entry.borderBoxHeight > 0);
  return (
    <>
      <div ref={ref}>{ownBreadcrumbs}</div>
      {discoveredBreadcrumbs && (
        <div className={clsx(ownBreadcrumbsExist && styles['breadcrumbs-discovered-hide'])}>
          <BreadcrumbGroupImplementation
            {...discoveredBreadcrumbs}
            data-awsui-discovered-breadcrumbs={true}
            __injectAnalyticsComponentMetadata={true}
          />
        </div>
      )}
    </>
  );
}
