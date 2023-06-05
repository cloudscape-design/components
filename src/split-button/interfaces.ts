// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import { CancelableEventHandler } from '../internal/events';
import { BaseComponentProps } from '../internal/base-component';
import { ButtonProps } from '../button/interfaces';
import { IconProps } from '../icon/interfaces';

// TODO: api-docs
export interface SplitButtonProps extends BaseComponentProps {
  items: ReadonlyArray<SplitButtonProps.Item>;

  variant?: SplitButtonProps.Variant;

  expandToViewport?: boolean;

  expandableGroups?: boolean;
}

export namespace SplitButtonProps {
  export type Variant = 'normal' | 'primary';

  export type Item = ButtonItem | LinkItem | ButtonDropdownItem;

  export interface BaseItem {
    id: string;
    ariaLabel?: string;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
  }

  export interface BaseItemIcon {
    iconName?: IconProps.Name;
    iconAlt?: string;
    iconUrl?: string;
    iconSvg?: string;
  }

  export interface ButtonItem extends BaseItem, BaseItemIcon {
    type: 'button';
    text?: string;
    onClick?: CancelableEventHandler;
  }

  export interface LinkItem extends BaseItem, BaseItemIcon {
    type: 'link';
    text?: string;
    href?: string;
    target?: string;
    rel?: string;
    download?: boolean | string;
    external?: boolean;
    onClick?: CancelableEventHandler;
    onFollow?: CancelableEventHandler<ButtonProps.FollowDetail>;
  }

  export interface ButtonDropdownItem extends BaseItem {
    type: 'button-dropdown';
    ariaLabel: string;
    items: ButtonDropdownProps.Items;
    onItemClick?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
    onItemFollow?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  }

  export interface Ref {
    /**
     * Focuses the underlying native button corresponding the given id.
     */
    focus(id: string): void;
  }
}
