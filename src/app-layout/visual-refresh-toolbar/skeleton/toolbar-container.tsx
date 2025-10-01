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

interface ToolbarBreadcrumbsWrapperProps {
  children: React.ReactNode;
  includeTestUtils?: boolean;
}

export function ToolbarBreadcrumbsWrapper({ children, includeTestUtils = false }: ToolbarBreadcrumbsWrapperProps) {
  return (
    <div
      className={clsx(toolbarStyles['universal-toolbar-breadcrumbs'], includeTestUtils && testutilStyles.breadcrumbs)}
    >
      {children}
    </div>
  );
}

export function ToolbarDrawersWrapper() {
  return <div className={toolbarStyles['universal-toolbar-drawers']} />;
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
    <ToolbarBreadcrumbsWrapper includeTestUtils={includeTestUtils}>
      <BreadcrumbsSlot ownBreadcrumbs={ownBreadcrumbs} discoveredBreadcrumbs={discoveredBreadcrumbs} />
    </ToolbarBreadcrumbsWrapper>
  );
}

interface ToolbarSkeletonStructureProps {
  ownBreadcrumbs: React.ReactNode;
  discoveredBreadcrumbs?: BreadcrumbGroupProps | null;
}

export const ToolbarSkeletonStructure = React.forwardRef<HTMLElement, ToolbarSkeletonStructureProps>(
  ({ ownBreadcrumbs, discoveredBreadcrumbs }, ref) => (
    <ToolbarSlot ref={ref}>
      <ToolbarContainer>
        <ToolbarBreadcrumbsSection ownBreadcrumbs={ownBreadcrumbs} discoveredBreadcrumbs={discoveredBreadcrumbs} />
        <ToolbarDrawersWrapper />
      </ToolbarContainer>
    </ToolbarSlot>
  )
);
