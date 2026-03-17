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

/**
 * Describes a single feature entry in the notification drawer.
 *
 * The generic type `T` determines how feature text content is provided:
 * - When `T` is `string`, the values are rendered as plain text.
 * - When `T` is `ReactNode`, you must also provide `mountItem` on the parent
 *   `FeatureNotificationsPayload` so the framework can mount the React content
 *   into the DOM container.
 */
export interface Feature<T> {
  /** Unique identifier used for persistence tracking (seen/unseen state) and list keying. */
  id: string;
  /** Primary title displayed as the feature heading in both the notification drawer and the feature prompt popover. */
  header: T;
  /** Descriptive body rendered below the header in the notification drawer and the feature prompt popover. */
  content: T;
  /** Optional category label rendered between the release date and the content in the notification drawer. */
  contentCategory?: T;
  /** Publication date of the feature. Used for default filtering (last 90 days), descending sort order, and display formatting. */
  releaseDate: Date;
}

export interface FeatureNotificationsPersistenceConfig {
  uniqueKey: string;
}

type FeatureId = string;
type FeatureReleaseDateString = string;
export type PersistedFeaturesDict = Record<FeatureId, FeatureReleaseDateString>;
export type PersistFeatureNotifications = (
  persistenceConfig: FeatureNotificationsPersistenceConfig,
  value: PersistedFeaturesDict
) => Promise<void>;
export type RetrieveFeatureNotifications = (
  persistenceConfig: FeatureNotificationsPersistenceConfig
) => Promise<PersistedFeaturesDict>;

export interface FeatureNotificationsPayload<T> {
  /**
   * Unique identifier for the feature notifications.
   */
  id: string;
  /**
   * When set to `true`, prevents the feature prompt from automatically appearing
   * when unseen features are detected during registration. The prompt can still
   * be shown programmatically via the `showFeaturePromptIfPossible` message.
   *
   * @default false
   */
  suppressFeaturePrompt?: boolean;
  /**
   * List of features to display in the notification drawer. Each feature is filtered
   * by `filterFeatures` (or a default 90-day recency filter), sorted by `releaseDate`
   * in descending order, and tracked for seen/unseen state via persistence. The latest
   * unseen feature is used to populate the feature prompt, and opening the drawer marks
   * all features as seen.
   */
  features: Array<Feature<T>>;
  /**
   * Mounting function used to render each feature's `header`, `content`, and
   * `contentCategory` values into the DOM. Required when `T` is `ReactNode`
   * (or any non-string type) so the framework can mount the content into the
   * provided container element. When `T` is `string`, this can be omitted and
   * values are rendered as plain text.
   *
   * The function receives the target `container` element and the `data` value
   * (one of the feature's text fields), and should return an optional destructor
   * that will be called on unmount to clean up resources (e.g. `root.unmount()`).
   *
   * @example
   * ```ts
   * import { createRoot } from 'react-dom/client';
   *
   * mountItem: (container, data) => {
   *   const root = createRoot(container);
   *   root.render(data);
   *   return () => root.unmount();
   * }
   * ```
   */
  mountItem?: MountContentPart<T>;
  /**
   * Optional URL rendered as a "View all feature releases" link at the bottom of the notification
   * drawer, allowing users to navigate to a dedicated page with the full list of
   * features.
   */
  featuresPageLink?: string;
  /**
   * Optional predicate to control which features are displayed. Applied to each
   * feature before sorting. When omitted, a default filter is used that only
   * keeps features with a `releaseDate` within the last 90 days.
   */
  filterFeatures?: (item: Feature<T>) => boolean;
  /**
   * Configuration for persisting seen/unseen state of features. The `uniqueKey`
   * is used as the storage key when saving and retrieving which features the user
   * has already viewed. When omitted, a default key (`'awsui-feature-notifications'`)
   * is used.
   */
  persistenceConfig?: FeatureNotificationsPersistenceConfig;
  /**
   * @internal
   * Optional override for saving the seen/unseen state of features. When provided,
   * this function is called instead of the built-in persistence mechanism when the
   * user opens the notification drawer and all features are marked as seen.
   * Receives the `persistenceConfig` and a dictionary mapping feature IDs to their
   * release date strings.
   */
  __persistFeatureNotifications?: PersistFeatureNotifications;
  /**
   * @internal
   * Optional override for retrieving the previously persisted seen/unseen state of
   * features. When provided, this function is called instead of the built-in retrieval
   * mechanism during registration to determine which features the user has already viewed.
   * Should return a dictionary mapping feature IDs to their release date strings.
   */
  __retrieveFeatureNotifications?: RetrieveFeatureNotifications;
}

export type FeatureNotificationsPayloadPublic<T> = Omit<
  FeatureNotificationsPayload<T>,
  '__persistFeatureNotifications' | '__retrieveFeatureNotifications'
>;

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
export interface ClearFeatureNotifications {
  type: 'clearFeatureNotifications';
}

export type AppLayoutUpdateMessage<T = unknown> =
  | UpdateDrawerConfigMessage
  | OpenDrawerMessage
  | CloseDrawerMessage
  | ResizeDrawerMessage
  | ExpandDrawerMessage
  | ExitExpandedModeMessage
  | RegisterFeatureNotificationsMessage<T>
  | ShowFeaturePromptIfPossible
  | ClearFeatureNotifications;

export type InitialMessage<T> = RegisterDrawerMessage | RegisterFeatureNotificationsMessage<T>;

export type WidgetMessage<T = unknown> = InitialMessage<T> | AppLayoutUpdateMessage<T>;
