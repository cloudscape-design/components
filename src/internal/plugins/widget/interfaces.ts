// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonGroupProps } from '../../../button-group/interfaces';
import { NonCancelableEventHandler } from '../../events';

interface Message<Type, Payload> {
  type: Type;
  payload: Payload;
}

type DrawerVisibilityChange = (callback: (isVisible: boolean) => void) => void;

interface MountContentContext {
  onVisibilityChange: DrawerVisibilityChange;
}

interface DrawerStateChangeParams {
  isOpen: boolean;
  initiatedByUserAction?: boolean;
}

export interface DrawerPayload {
  id: string;
  ariaLabels: {
    content?: string;
    closeButton?: string;
    triggerButton?: string;
    resizeHandle?: string;
    resizeHandleTooltipText?: string;
    expandedModeButton?: string;
    exitExpandedModeButton?: string;
  };
  isExpandable?: boolean;
  resizable?: boolean;
  defaultSize?: number;
  onResize?: NonCancelableEventHandler<{ size: number; id: string }>;
  defaultActive?: boolean;
  trigger?: {
    iconSvg?: string;
    customIcon?: string;
  };
  exitExpandedModeTrigger?: {
    customIcon?: string;
  };
  mountContent: (container: HTMLElement, mountContext: MountContentContext) => void;
  unmountContent: (container: HTMLElement) => void;
  preserveInactiveContent?: boolean;
  onToggle?: NonCancelableEventHandler<DrawerStateChangeParams>;
  mountHeader?: (container: HTMLElement) => void;
  unmountHeader?: (container: HTMLElement) => void;
  headerActions?: ReadonlyArray<ButtonGroupProps.Item>;
  onHeaderActionClick?: NonCancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
  onToggleFocusMode?: NonCancelableEventHandler<{ isExpanded: boolean }>;
  position?: 'side' | 'bottom';
}

export interface Feature {
  id: string;
  header: string;
  content: string;
  releaseDate?: string;
}

export interface FeatureNotificationsPayload {
  id: string;
  type?: 'local' | 'global';
  suppressFeaturePrompt?: boolean;
  features: Array<Feature>;
}

export type RegisterDrawerMessage = Message<'registerLeftDrawer' | 'registerBottomDrawer', DrawerPayload>;
export type RegisterFeatureNotificationsMessage = Message<'registerFeatureNotifications', FeatureNotificationsPayload>;
export type UpdateDrawerConfigMessage = Message<
  'updateDrawerConfig',
  Pick<DrawerPayload, 'id'> &
    Partial<Omit<DrawerPayload, 'mountContent' | 'unmountContent' | 'mountHeader' | 'unmountHeader'>>
>;
export type OpenDrawerMessage = Message<'openDrawer', { id: string }>;
export type CloseDrawerMessage = Message<'closeDrawer', { id: string }>;
export type ResizeDrawerMessage = Message<'resizeDrawer', { id: string; size: number }>;
export type ExpandDrawerMessage = Message<'expandDrawer', { id: string }>;
export interface ExitExpandedModeMessage {
  type: 'exitExpandedMode';
}
export interface ShowFeaturePromptIfPossible {
  type: 'showFeaturePromptIfPossible';
}

export type AppLayoutUpdateMessage =
  | UpdateDrawerConfigMessage
  | OpenDrawerMessage
  | CloseDrawerMessage
  | ResizeDrawerMessage
  | ExpandDrawerMessage
  | ExitExpandedModeMessage
  | RegisterFeatureNotificationsMessage
  | ShowFeaturePromptIfPossible;

export type InitialMessage = RegisterDrawerMessage | RegisterFeatureNotificationsMessage;

export type WidgetMessage = InitialMessage | AppLayoutUpdateMessage;
