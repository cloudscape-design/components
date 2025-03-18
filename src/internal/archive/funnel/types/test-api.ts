// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { FunnelEvent } from '.';

export interface FunnelTestAPI {
  events: FunnelEvent[];
  getEventsByName: (name: string) => FunnelEvent[];
  getLastEvent: () => FunnelEvent | undefined;
  clear: () => void;
}
