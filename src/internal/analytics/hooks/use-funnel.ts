// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useContext } from 'react';

import { FunnelContext } from '../contexts/funnel-context';

export const useFunnelContext = () => {
  return useContext(FunnelContext);
};

export const useFunnel = () => {
  return useContext(FunnelContext);
};
