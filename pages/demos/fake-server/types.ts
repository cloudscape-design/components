// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { PropertyFilterOption, PropertyFilterProperty, PropertyFilterQuery } from '@cloudscape-design/collection-hooks';

import { fetchContentOrigins } from './content-origins';
import { GetResources, GetTagKeys, GetTagValues } from './tags';

// Types for distribution.json and content-origins.json mocks
export interface Distribution {
  id: string;
  deliveryMethod: string;
  domainName: string;
  origin: string;
  state: string;
  priceClass: string;
  logging: string;
  sslCertificate: string;
  tags: {
    [key: string]: string[];
  };
  date: Date;
}

export interface ContentOrigin {
  value: string;
  label: string;
}

/**
 * Combining all the fake server types here instead
 * of creating types per utility and this also will
 * make types automatic (if we changed the params or return type.)
 *
 * If you added new fake server utility, add it here
 * and add it to the window.FakeServer object
 */

type FetchContentOriginsParams = Parameters<typeof fetchContentOrigins>[0];
type FetchContentOriginsReturn = ReturnType<typeof fetchContentOrigins>;

type GetResourcesReturn = ReturnType<typeof GetResources>;

type GetTagKeysReturn = ReturnType<typeof GetTagKeys>;

type GetTagValuesReturn = ReturnType<typeof GetTagValues>;

export interface FetchDistributionsParams {
  filteringText?: string;
  filteringTokens?: PropertyFilterQuery['tokens'] | PropertyFilterQuery['tokenGroups'];
  filteringOperation?: PropertyFilterQuery['operation'];
  pageSize?: number;
  currentPageIndex?: number;
  sortingDescending?: boolean;
  sortingColumn?: string;
}

export interface FetchDistributionsResponse {
  items: Distribution[];
  pagesCount: number;
  currentPageIndex: number;
}

export interface FetchDistributionFilteringOptionsParams {
  filteringText: string;
  filteringPropertyKey?: string;
}

export interface FetchDistributionFilteringOptionsResponse {
  filteringOptions: PropertyFilterOption[];
  filteringProperties: PropertyFilterProperty[];
}
declare global {
  interface Window {
    FakeServer: {
      fetchContentOrigins: (params: FetchContentOriginsParams) => FetchContentOriginsReturn;
      GetResources: () => GetResourcesReturn;
      GetTagKeys: () => GetTagKeysReturn;
      GetTagValues: (params: string) => GetTagValuesReturn;
      fetchDistributions: (
        params: FetchDistributionsParams,
        callback: (response: FetchDistributionsResponse) => void
      ) => void;
      fetchDistributionFilteringOptions: (
        params: FetchDistributionFilteringOptionsParams,
        callback: (response: FetchDistributionFilteringOptionsResponse) => void
      ) => void;
    };
  }
}
