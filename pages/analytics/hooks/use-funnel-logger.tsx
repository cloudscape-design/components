// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useLayoutEffect } from 'react';

import { FunnelTestAPI } from '~components/internal/analytics/funnel/test-api';

declare global {
  interface Window {
    __funnelTestAPI?: FunnelTestAPI;
  }
}

export const useFunnelLogger = () => {
  useLayoutEffect(() => {
    (window as any).__funnelLogAttached = true;
    const handleFunnelEvent = (event: any) => {
      console.log(event.detail);

      window.__funnelTestAPI?.events.push(event.detail);
    };

    document.addEventListener('log-funnel-event', handleFunnelEvent);

    return () => {
      document.removeEventListener('log-funnel-event', handleFunnelEvent);
      (window as any).__funnelLogAttached = false;
    };
  }, []);
};
