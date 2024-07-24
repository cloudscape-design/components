// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AppLayoutProps } from '../interfaces';
import { togglesConfig } from '../toggles';
import { FocusControlRefs } from '../utils/use-focus-control';

export interface DesktopDrawerProps {
  id?: string;
  contentClassName: string;
  toggleClassName: string;
  closeClassName: string;
  toggleRefs: {
    toggle: React.Ref<{ focus(): void }>;
    close: React.Ref<{ focus(): void }>;
  };
  width: number;
  topOffset: number | undefined;
  bottomOffset: number | undefined;
  ariaLabels: {
    mainLabel: string | undefined;
    closeLabel: string | undefined;
    openLabel: string | undefined;
    resizeHandle?: string;
  };
  children: React.ReactNode;
  hideOpenButton?: boolean;
  type: keyof typeof togglesConfig;
  isMobile: boolean;
  isOpen: boolean;
  isHidden?: boolean;
  onToggle: (isOpen: boolean) => void;
  onClick?: (event: React.MouseEvent) => void;
  onLoseFocus?: (event: React.FocusEvent) => void;
  resizeHandle?: React.ReactNode;
}

export interface ResizableDrawerProps extends DesktopDrawerProps {
  activeDrawer: AppLayoutProps.Drawer | undefined;
  onResize: (resizeDetail: { size: number; id: string }) => void;
  minWidth: number;
  maxWidth: number;
  refs: FocusControlRefs;
  toolsContent: React.ReactNode;
}

export interface DrawerTriggersBarProps {
  topOffset: number | undefined;
  bottomOffset: number | undefined;
  isMobile: boolean;
  drawers: Array<AppLayoutProps.Drawer>;
  activeDrawerId: string | null;
  onDrawerChange: (newDrawerId: string | null) => void;
  ariaLabels: AppLayoutProps['ariaLabels'];
  drawerRefs: FocusControlRefs;
}
