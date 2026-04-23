// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { AppLayoutProps } from '../../../app-layout/interfaces';
import { BreadcrumbGroupProps } from '../../../breadcrumb-group/interfaces';
import TriggerButton from '../toolbar/trigger-button';
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
  ariaLabels?: AppLayoutProps.Labels;
  expandedDrawerId?: string | null;
  navigation?: React.ReactNode;
  navigationOpen?: boolean;
  ownBreadcrumbs: React.ReactNode;
  discoveredBreadcrumbs?: BreadcrumbGroupProps | null;
}

export const ToolbarSkeletonStructure = React.forwardRef<HTMLElement, ToolbarSkeletonStructureProps>(
  ({ ariaLabels, expandedDrawerId, navigation, navigationOpen, ownBreadcrumbs, discoveredBreadcrumbs }, ref) => {
    const drawerExpandedMode = !!expandedDrawerId;
    return (
      <ToolbarSlot ref={ref}>
        <ToolbarContainer>
          {navigation && (
            <nav className={toolbarStyles['universal-toolbar-nav']}>
              <TriggerButton
                ariaLabel={ariaLabels?.navigationToggle ?? undefined}
                ariaExpanded={!drawerExpandedMode && navigationOpen}
                iconName="menu"
                className={testutilStyles['navigation-toggle']}
                onClick={() => {}}
                selected={!drawerExpandedMode && navigationOpen}
              />
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
    );
  }
);
