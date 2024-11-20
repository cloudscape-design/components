// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BreadcrumbGroupImplementation } from '../../../../breadcrumb-group/implementation';
import { BreadcrumbGroupProps } from '../../../../breadcrumb-group/interfaces';
import { BreadcrumbsSlotContext } from '../../contexts';

import styles from './styles.css.js';

interface BreadcrumbsSlotProps {
  ownBreadcrumbs: React.ReactNode;
  discoveredBreadcrumbs: BreadcrumbGroupProps | null;
}

export function BreadcrumbsSlot({ ownBreadcrumbs, discoveredBreadcrumbs }: BreadcrumbsSlotProps) {
  return (
    <BreadcrumbsSlotContext.Provider value={{ isInToolbar: true }}>
      <div className={styles['breadcrumbs-own']}>{ownBreadcrumbs}</div>
      {discoveredBreadcrumbs && (
        <div className={styles['breadcrumbs-discovered']}>
          <BreadcrumbGroupImplementation
            {...discoveredBreadcrumbs}
            data-awsui-discovered-breadcrumbs={true}
            __injectAnalyticsComponentMetadata={true}
          />
        </div>
      )}
    </BreadcrumbsSlotContext.Provider>
  );
}
