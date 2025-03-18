// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { funnelCache } from '../cache';
import { Handler } from '../interfaces';

export const mount: Handler = () => {
  funnelCache.values().forEach(funnel => {
    funnel.start();
  });
};
