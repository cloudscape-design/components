// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface ReorderOptions<Option> {
  sortedOptions: readonly Option[];
  getId(option: Option): string;
}

export interface ReorderAnnouncements {
  liveAnnouncementDndStarted?: (position: number, total: number) => string;
  liveAnnouncementDndItemReordered?: (initialPosition: number, currentPosition: number, total: number) => string;
  liveAnnouncementDndItemCommitted?: (initialPosition: number, finalPosition: number, total: number) => string;
  liveAnnouncementDndDiscarded?: string;
}
