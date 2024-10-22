// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useContext } from 'react';

import { FunnelContext } from '../contexts/funnel-context';

export const useFunnelContext = () => {
  return useContext(FunnelContext);
};

export interface PageContext {
  getPageName: () => string | undefined;
  getResourceType: () => string | undefined;
}

export const useFunnel = (): {
  funnelContext: ReturnType<typeof useFunnelContext>;
  pageContext: PageContext;
} => {
  const funnelContext = useFunnelContext();

  // Move to global plugin
  const pageContext = {
    getPageName: () => {
      return document.querySelector<HTMLElement>('[data-analytics-funnel-key="funnel-name"]')?.innerText;
    },
    getResourceType: () => {
      return document.querySelector<HTMLElement>('[data-analytics-funnel-key="resource-type"]')?.innerText;
    },
  };

  return { funnelContext, pageContext };
};
