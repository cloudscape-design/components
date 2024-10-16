// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useLayoutEffect } from 'react';

export const useFunnelLogger = () => {
  useLayoutEffect(() => {
    (window as any).__funnelLogAttached = true;
    const handleFunnelEvent = (event: any) => {
      console.log(event.detail);
    };

    document.addEventListener('log-funnel-event', handleFunnelEvent);

    return () => {
      document.removeEventListener('log-funnel-event', handleFunnelEvent);
      (window as any).__funnelLogAttached = false;
    };
  }, []);
};
