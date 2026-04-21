// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { BreadcrumbGroupProps } from '../../../breadcrumb-group/interfaces';
import { BreadcrumbsSlot, ToolbarSlot } from './slots';

import testutilStyles from '../../test-classes/styles.css.js';
import toolbarStyles from '../toolbar/styles.css.js';

interface ToolbarContainerProps {
  children: React.ReactNode;
  hasAiDrawer?: boolean;
}

export function ToolbarContainer({ children, hasAiDrawer }: ToolbarContainerProps) {
  return (
    <div className={clsx(toolbarStyles['toolbar-container'], hasAiDrawer && toolbarStyles['with-ai-drawer'])}>
      {children}
    </div>
  );
}

interface ToolbarBreadcrumbsSectionProps {
  ownBreadcrumbs: React.ReactNode;
  discoveredBreadcrumbs?: BreadcrumbGroupProps | null;
  includeTestUtils?: boolean;
}

export function ToolbarBreadcrumbsSection({
  ownBreadcrumbs,
  discoveredBreadcrumbs,
  includeTestUtils = false,
}: ToolbarBreadcrumbsSectionProps) {
  return (
    <div
      className={clsx(toolbarStyles['universal-toolbar-breadcrumbs'], includeTestUtils && testutilStyles.breadcrumbs)}
    >
      <BreadcrumbsSlot ownBreadcrumbs={ownBreadcrumbs} discoveredBreadcrumbs={discoveredBreadcrumbs} />
    </div>
  );
}

interface ToolbarSkeletonStructureProps {
  ownBreadcrumbs: React.ReactNode;
  discoveredBreadcrumbs?: BreadcrumbGroupProps | null;
  hasNavigation?: boolean;
}

export const ToolbarSkeletonStructure = React.forwardRef<HTMLElement, ToolbarSkeletonStructureProps>(
  ({ ownBreadcrumbs, discoveredBreadcrumbs, hasNavigation }, ref) => (
    <ToolbarSlot ref={ref}>
      <ToolbarContainer>
        {hasNavigation && (
          <nav className={toolbarStyles['universal-toolbar-nav']}>
            <button
              type="button"
              className={testutilStyles['navigation-toggle']}
              aria-label="Open navigation"
              aria-expanded={false}
            >
              <span aria-hidden="true">☰</span>
            </button>
          </nav>
        )}
        <ToolbarBreadcrumbsSection
          ownBreadcrumbs={ownBreadcrumbs}
          discoveredBreadcrumbs={discoveredBreadcrumbs}
          includeTestUtils={true}
        />
        <div className={toolbarStyles['universal-toolbar-drawers']} />
      </ToolbarContainer>
    </ToolbarSlot>
  )
);
