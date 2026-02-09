// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonGroupProps, ItemRuntime } from '../../../button-group/interfaces';
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
  headerActions?: ReadonlyArray<ItemRuntime>;
  onHeaderActionClick?: NonCancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
  onToggleFocusMode?: NonCancelableEventHandler<{ isExpanded: boolean }>;
  position?: 'side' | 'bottom';
}

type Destructor = () => void;
export type MountContentPart<T> = (container: HTMLElement, data: T) => Destructor | void;

export interface Feature<T> {
  id: string;
  header: T;
  content: T;
  contentCategory?: T;
  releaseDate: Date;
}

export interface FeatureNotificationsPersistenceConfig {
  uniqueKey: string;
}

export interface FeatureNotificationsPayload<T> {
  id: string;
  suppressFeaturePrompt?: boolean;
  features: Array<Feature<T>>;
  mountItem?: MountContentPart<T>;
  featuresPageLink?: string;
  filterFeatures?: (item: Feature<T>) => boolean;
  persistenceConfig?: FeatureNotificationsPersistenceConfig;
}

export type RegisterDrawerMessage = Message<'registerLeftDrawer' | 'registerBottomDrawer', DrawerPayload>;
export type RegisterFeatureNotificationsMessage<T> = Message<
  'registerFeatureNotifications',
  FeatureNotificationsPayload<T>
>;
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

export type AppLayoutUpdateMessage<T = unknown> =
  | UpdateDrawerConfigMessage
  | OpenDrawerMessage
  | CloseDrawerMessage
  | ResizeDrawerMessage
  | ExpandDrawerMessage
  | ExitExpandedModeMessage
  | RegisterFeatureNotificationsMessage<T>
  | ShowFeaturePromptIfPossible;

export type InitialMessage<T> = RegisterDrawerMessage | RegisterFeatureNotificationsMessage<T>;

export type WidgetMessage<T = unknown> = InitialMessage<T> | AppLayoutUpdateMessage<T>;
