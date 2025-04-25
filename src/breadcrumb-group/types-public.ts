// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseNavigationDetail } from '../internal/events';

export interface Item {
  text: string;
  href: string;
}

export interface ClickDetail<T extends Item = Item> extends BaseNavigationDetail {
  item: T;
  text: string;
  href: string;
}
