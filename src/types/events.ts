// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// This is a part of our public types API. We cannot change this in the current major version
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type NonCancelableEventHandler<Detail = {}> = (event: NonCancelableCustomEvent<Detail>) => void;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type CancelableEventHandler<Detail = {}> = (event: CustomEvent<Detail>) => void;

export type NonCancelableCustomEvent<DetailType> = Omit<CustomEvent<DetailType>, 'preventDefault'>;

export interface BaseKeyDetail {
  keyCode: number;
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  isComposing: boolean;
}

export interface ClickDetail {
  button: number;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}

export interface BaseNavigationDetail {
  href: string | undefined;
  external?: boolean;
  target?: string;
}
