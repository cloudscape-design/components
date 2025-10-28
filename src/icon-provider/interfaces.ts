// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';

import { BaseComponentProps } from '../internal/base-component';

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
  export interface Icons {
    // TODO: Update documenter to support mapped types to replace pedantic key declaration with [name in keyof typeof generatedIcons]: AWSUI-61054
    // Option 1: [name in keyof typeof generatedIcons]?: ReactNode | null;
    // Option 2: [name in IconProps.Name]?: ReactNode | null;
    'add-plus'?: ReactNode | null;
    'anchor-link'?: ReactNode | null;
    'angle-left-double'?: ReactNode | null;
    'angle-left'?: ReactNode | null;
    'angle-right-double'?: ReactNode | null;
    'angle-right'?: ReactNode | null;
    'angle-up'?: ReactNode | null;
    'angle-down'?: ReactNode | null;
    'arrow-left'?: ReactNode | null;
    'arrow-right'?: ReactNode | null;
    'arrow-up'?: ReactNode | null;
    'arrow-down'?: ReactNode | null;
    'at-symbol'?: ReactNode | null;
    'audio-full'?: ReactNode | null;
    'audio-half'?: ReactNode | null;
    'audio-off'?: ReactNode | null;
    'backward-10-seconds'?: ReactNode | null;
    bug?: ReactNode | null;
    call?: ReactNode | null;
    calendar?: ReactNode | null;
    'caret-down-filled'?: ReactNode | null;
    'caret-down'?: ReactNode | null;
    'caret-left-filled'?: ReactNode | null;
    'caret-right-filled'?: ReactNode | null;
    'caret-up-filled'?: ReactNode | null;
    'caret-up'?: ReactNode | null;
    check?: ReactNode | null;
    contact?: ReactNode | null;
    close?: ReactNode | null;
    'closed-caption'?: ReactNode | null;
    'closed-caption-unavailable'?: ReactNode | null;
    copy?: ReactNode | null;
    'command-prompt'?: ReactNode | null;
    'delete-marker'?: ReactNode | null;
    download?: ReactNode | null;
    'drag-indicator'?: ReactNode | null;
    edit?: ReactNode | null;
    ellipsis?: ReactNode | null;
    envelope?: ReactNode | null;
    'exit-full-screen'?: ReactNode | null;
    expand?: ReactNode | null;
    external?: ReactNode | null;
    'face-happy'?: ReactNode | null;
    'face-happy-filled'?: ReactNode | null;
    'face-neutral'?: ReactNode | null;
    'face-neutral-filled'?: ReactNode | null;
    'face-sad'?: ReactNode | null;
    'face-sad-filled'?: ReactNode | null;
    'file-open'?: ReactNode | null;
    file?: ReactNode | null;
    filter?: ReactNode | null;
    flag?: ReactNode | null;
    'folder-open'?: ReactNode | null;
    folder?: ReactNode | null;
    'forward-10-seconds'?: ReactNode | null;
    'full-screen'?: ReactNode | null;
    'gen-ai'?: ReactNode | null;
    globe?: ReactNode | null;
    'grid-view'?: ReactNode | null;
    'group-active'?: ReactNode | null;
    group?: ReactNode | null;
    heart?: ReactNode | null;
    'heart-filled'?: ReactNode | null;
    history?: ReactNode | null;
    'insert-row'?: ReactNode | null;
    key?: ReactNode | null;
    keyboard?: ReactNode | null;
    'list-view'?: ReactNode | null;
    'location-pin'?: ReactNode | null;
    'lock-private'?: ReactNode | null;
    map?: ReactNode | null;
    menu?: ReactNode | null;
    microphone?: ReactNode | null;
    'microphone-off'?: ReactNode | null;
    'mini-player'?: ReactNode | null;
    multiscreen?: ReactNode | null;
    notification?: ReactNode | null;
    pause?: ReactNode | null;
    play?: ReactNode | null;
    redo?: ReactNode | null;
    refresh?: ReactNode | null;
    remove?: ReactNode | null;
    'resize-area'?: ReactNode | null;
    script?: ReactNode | null;
    search?: ReactNode | null;
    security?: ReactNode | null;
    settings?: ReactNode | null;
    send?: ReactNode | null;
    share?: ReactNode | null;
    shrink?: ReactNode | null;
    slash?: ReactNode | null;
    'star-filled'?: ReactNode | null;
    'star-half'?: ReactNode | null;
    star?: ReactNode | null;
    'status-in-progress'?: ReactNode | null;
    'status-info'?: ReactNode | null;
    'status-negative'?: ReactNode | null;
    'status-not-started'?: ReactNode | null;
    'status-pending'?: ReactNode | null;
    'status-positive'?: ReactNode | null;
    'status-stopped'?: ReactNode | null;
    'status-warning'?: ReactNode | null;
    'subtract-minus'?: ReactNode | null;
    suggestions?: ReactNode | null;
    support?: ReactNode | null;
    'thumbs-down-filled'?: ReactNode | null;
    'thumbs-down'?: ReactNode | null;
    'thumbs-up-filled'?: ReactNode | null;
    'thumbs-up'?: ReactNode | null;
    ticket?: ReactNode | null;
    transcript?: ReactNode | null;
    'treeview-collapse'?: ReactNode | null;
    'treeview-expand'?: ReactNode | null;
    undo?: ReactNode | null;
    unlocked?: ReactNode | null;
    'upload-download'?: ReactNode | null;
    upload?: ReactNode | null;
    'user-profile-active'?: ReactNode | null;
    'user-profile'?: ReactNode | null;
    'video-off'?: ReactNode | null;
    'video-on'?: ReactNode | null;
    'video-unavailable'?: ReactNode | null;
    'video-camera-off'?: ReactNode | null;
    'video-camera-on'?: ReactNode | null;
    'video-camera-unavailable'?: ReactNode | null;
    'view-full'?: ReactNode | null;
    'view-horizontal'?: ReactNode | null;
    'view-vertical'?: ReactNode | null;
    'zoom-in'?: ReactNode | null;
    'zoom-out'?: ReactNode | null;
    'zoom-to-fit'?: ReactNode | null;
  }
}
