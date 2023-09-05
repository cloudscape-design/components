// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TableProps } from '../interfaces';
import { getTrackableValue } from '../utils';

export const SELECTION_ITEM = 'selection-item';
export const SELECTION_ROOT = 'selection-root';

// A set, that compares items by their "trackables" (the results of applying `trackBy` to them)
export class ItemSet<T> {
  constructor(trackBy: TableProps.TrackBy<T> | undefined, items: ReadonlyArray<T>) {
    this.trackBy = trackBy;
    items.forEach(this.put);
  }
  private trackBy: TableProps.TrackBy<T> | undefined;
  private map: Map<unknown, T> = new Map();
  put = (item: T) => this.map.set.call(this.map, getTrackableValue(this.trackBy, item), item);
  has = (item: T) => this.map.has.call(this.map, getTrackableValue(this.trackBy, item));
  forEach = this.map.forEach.bind(this.map);
}

export const focusMarkers = {
  item: { ['data-' + SELECTION_ITEM]: 'item' },
  all: { ['data-' + SELECTION_ITEM]: 'all' },
  root: { ['data-' + SELECTION_ROOT]: 'true' },
};
