// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { ButtonProps } from '../../button/interfaces';
import { togglesConfig } from '../toggles';
import { AppLayoutProps } from '../interfaces';
import { IconProps } from '../../icon/interfaces';
import { NonCancelableEventHandler } from '../../internal/events';

import { DrawerFocusControlRefs } from '../utils/use-drawer-focus-control';

export interface DesktopDrawerProps {
  contentClassName: string;
  toggleClassName: string;
  closeClassName: string;
  toggleRefs: {
    toggle: React.Ref<ButtonProps.Ref>;
    close: React.Ref<ButtonProps.Ref>;
  };
  width: number;
  topOffset: number | undefined;
  bottomOffset: number | undefined;
  ariaLabels: AppLayoutProps.Labels | undefined;
  drawersAriaLabels?: DrawerItemAriaLabels | undefined;
  children: React.ReactNode;
  type: keyof typeof togglesConfig;
  isMobile: boolean;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onClick?: (event: React.MouseEvent) => void;
  onLoseFocus?: (event: React.FocusEvent) => void;
  drawers?: {
    items: Array<DrawerItem>;
    activeDrawerId: string | undefined;
    onChange: (changeDetail: { activeDrawerId: string | undefined }) => void;
  };
  resizeHandle?: React.ReactNode;
}

export interface ResizableDrawerProps extends DesktopDrawerProps {
  activeDrawer?: DrawerItem;
  onResize: (resizeDetail: { size: number; id: string }) => void;
  size: number;
  getMaxWidth: () => number;
  refs: DrawerFocusControlRefs;
}

export interface DrawerTriggersBarProps {
  contentClassName: string;
  toggleClassName: string;
  topOffset: number | undefined;
  bottomOffset: number | undefined;
  isMobile: boolean;
  drawers?: {
    items: Array<DrawerItem>;
    activeDrawerId?: string;
    onChange: (changeDetail: { activeDrawerId: string | undefined }) => void;
    ariaLabel?: string;
  };
}

export interface DrawerItemAriaLabels {
  content?: string;
  closeButton?: string;
  triggerButton?: string;
  resizeHandle?: string;
}

export interface DrawerItem {
  id: string;
  content: React.ReactNode;
  trigger: {
    iconName?: IconProps.Name;
    iconSvg?: React.ReactNode;
  };
  ariaLabels: DrawerItemAriaLabels;
  resizable?: boolean;
  size?: number;
}

export interface SizeControlProps {
  position: 'side';
  splitPanelRef?: React.RefObject<HTMLDivElement>;
  handleRef?: React.RefObject<HTMLDivElement>;
  setSidePanelWidth: (width: number) => void;
  setBottomPanelHeight: (height: number) => void;
}

export interface InternalDrawerProps {
  drawers?: {
    items: Array<DrawerItem>;
    activeDrawerId?: string;
    onChange?: NonCancelableEventHandler<string>;
    onResize?: NonCancelableEventHandler<{ size: number; id: string }>;
    ariaLabel?: string;
  };
}
