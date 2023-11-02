// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { togglesConfig } from '../toggles';
import { PublicAriaLabelsWithDrawers, PublicDrawer } from '../interfaces';
import { IconProps } from '../../icon/interfaces';
import { NonCancelableEventHandler } from '../../internal/events';

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
  activeDrawer?: PublicDrawer;
  onResize: (resizeDetail: { size: number; id: string }) => void;
  size: number;
  getMaxWidth: () => number;
  refs: FocusControlRefs;
  toolsContent?: React.ReactNode;
}

export interface DrawerTriggersBarProps {
  topOffset: number | undefined;
  bottomOffset: number | undefined;
  isMobile: boolean;
  drawers: Array<PublicDrawer>;
  activeDrawerId: string | null;
  onDrawerChange: (newDrawerId: string | null) => void;
  ariaLabels: PublicAriaLabelsWithDrawers | undefined;
  drawerRefs: FocusControlRefs;
}

// Beta interfaces
// TODO: remove after beta consumers migrate to prod API
interface BetaDrawerItemAriaLabels {
  content?: string;
  closeButton?: string;
  triggerButton?: string;
  resizeHandle?: string;
}

interface BetaDrawerItem {
  id: string;
  content: React.ReactNode;
  trigger: {
    iconName?: IconProps.Name;
    iconSvg?: React.ReactNode;
  };
  ariaLabels: BetaDrawerItemAriaLabels;
  resizable?: boolean;
  defaultSize?: number;
  onResize?: NonCancelableEventHandler<{ size: number; id: string }>;
  badge?: boolean;
}

export interface BetaDrawersProps {
  items: Array<BetaDrawerItem>;
  activeDrawerId?: string | null;
  onChange?: NonCancelableEventHandler<string | null>;
  onResize?: NonCancelableEventHandler<{ size: number; id: string }>;
  ariaLabel?: string;
  overflowAriaLabel?: string;
  overflowWithBadgeAriaLabel?: string;
}
// Beta interfaces end
