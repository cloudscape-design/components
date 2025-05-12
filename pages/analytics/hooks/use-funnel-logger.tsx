// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useLayoutEffect } from 'react';

import { setComponentMetrics, setFunnelMetrics } from '~components/internal/analytics';

import { ComponentMetricsLogger, FunnelLogger } from './mock-analytics';

export const useFunnelLogger = () => {
  useLayoutEffect(() => {
    setFunnelMetrics(FunnelLogger);
    setComponentMetrics(ComponentMetricsLogger);
  }, []);
};
