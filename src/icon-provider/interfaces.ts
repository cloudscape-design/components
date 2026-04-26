// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';

import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';

// Why not enums? Explained there
// https://stackoverflow.com/questions/52393730/typescript-string-literal-union-type-from-enum
export type BuiltInIconName =
  | 'add-plus'
  | 'anchor-link'
  | 'angle-left-double'
  | 'angle-left'
  | 'angle-right-double'
  | 'angle-right'
  | 'angle-up'
  | 'angle-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'arrow-down'
  | 'at-symbol'
  | 'audio-full'
  | 'audio-half'
  | 'audio-off'
  | 'backward-10-seconds'
  | 'bug'
  | 'call'
  | 'calendar'
  | 'caret-down-filled'
  | 'caret-down'
  | 'caret-left-filled'
  | 'caret-right-filled'
  | 'caret-up-filled'
  | 'caret-up'
  | 'check'
  | 'contact'
  | 'close'
  | 'closed-caption'
  | 'closed-caption-unavailable'
  | 'copy'
  | 'command-prompt'
  | 'delete-marker'
  | 'dot'
  | 'download'
  | 'drag-indicator'
  | 'edit'
  | 'edit-gen-ai'
  | 'ellipsis'
  | 'envelope'
  | 'exit-full-screen'
  | 'expand'
  | 'external'
  | 'face-happy'
  | 'face-happy-filled'
  | 'face-neutral'
  | 'face-neutral-filled'
  | 'face-sad'
  | 'face-sad-filled'
  | 'file-open'
  | 'file'
  | 'filter'
  | 'flag'
  | 'folder-open'
  | 'folder'
  | 'forward-10-seconds'
  | 'full-screen'
  | 'gen-ai'
  | 'globe'
  | 'grid-view'
  | 'group-active'
  | 'group'
  | 'heart'
  | 'heart-filled'
  | 'history'
  | 'insert-row'
  | 'key'
  | 'keyboard'
  | 'light-dark'
  | 'list-view'
  | 'location-pin'
  | 'lock-private'
  | 'map'
  | 'menu'
  | 'microphone'
  | 'microphone-off'
  | 'mini-player'
  | 'multiscreen'
  | 'notification'
  | 'pause'
  | 'play'
  | 'redo'
  | 'refresh'
  | 'remove'
  | 'resize-area'
  | 'script'
  | 'search'
  | 'search-gen-ai'
  | 'security'
  | 'settings'
  | 'send'
  | 'share'
  | 'shrink'
  | 'slash'
  | 'star-filled'
  | 'star-half'
  | 'star'
  | 'status-in-progress'
  | 'status-info'
  | 'status-negative'
  | 'status-not-started'
  | 'status-pending'
  | 'status-positive'
  | 'status-stopped'
  | 'status-warning'
  | 'stop-circle'
  | 'subtract-minus'
  | 'suggestions'
  | 'suggestions-gen-ai'
  | 'support'
  | 'thumbs-down-filled'
  | 'thumbs-down'
  | 'thumbs-up-filled'
  | 'thumbs-up'
  | 'ticket'
  | 'transcript'
  | 'treeview-collapse'
  | 'treeview-expand'
  | 'undo'
  | 'unlocked'
  | 'upload-download'
  | 'upload'
  | 'user-profile-active'
  | 'user-profile'
  | 'video-off'
  | 'video-on'
  | 'video-unavailable'
  | 'video-camera-off'
  | 'video-camera-on'
  | 'video-camera-unavailable'
  | 'view-full'
  | 'view-horizontal'
  | 'view-vertical'
  | 'zoom-in'
  | 'zoom-out'
  | 'zoom-to-fit';

/**
 * Augment this interface using `declare module` to register custom icon names.
 * Registered names become valid across all icon-accepting components.
 *
 * @example
 * declare module "@cloudscape-design/components/icon-provider" {
 *   interface IconRegistry extends IconMap<typeof myIcons> {}
 * }
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IconRegistry {}

/** Union of all icon names in the {@link IconRegistry}. */
export type IconRegistryIconName = keyof IconRegistry & string;

export type DefineIconsInput = Partial<Record<BuiltInIconName | (string & {}), ReactNode>>;

/** Extracts the keys of a `defineIcons` result into the shape that {@link IconRegistry} expects. */
export type IconMap<T> = { [K in keyof T & string]: T[K] };

export interface IconProviderProps extends BaseComponentProps {
  children: ReactNode;

  /**
   * Specifies icon overrides using existing icon names, for example, `{'add-plus': <svg>...</svg>}`.
   *
   * These icon overrides will automatically be applied to any component that is a descendant of this provider, including nested providers.
   *
   * Set to `null` to reset the icons to the default set or set specific icon names to `null` to change them back to the default set.
   *
   * For example, override `AppLayout` icons but not icons in the content slot by wrapping content with an `IconProvider` with this property set to `null`.
   *
   * `<Icon ... />` component can be used as an override (for example, `{'close': <Icon name='arrow-left' />}`).
   * However, if the icon name is the same as the key, for example, `{'close': <Icon name='close' />}` an infinite loop will be created.
   * The same applies to switching icons in the same configuration (for example, `{'close': <Icon name='arrow-left' />, 'arrow-left': <Icon name='close' />}`).
   */
  icons: IconProviderProps.Icons | null;
}

export namespace IconProviderProps {
  export type Icons = {
    [name in IconProps.Name]?: ReactNode | null;
  };
}
