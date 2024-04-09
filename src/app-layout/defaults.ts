// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AppLayoutProps } from './interfaces';

const defaultContentTypeState: AppLayoutState = {
  navigationOpen: true,
  minContentWidth: 280,
  maxContentWidth: undefined,
};

const defaults: Record<AppLayoutProps.ContentType, AppLayoutState> = {
  default: {
    ...defaultContentTypeState,
  },
  dashboard: {
    ...defaultContentTypeState,
  },
  cards: {
    navigationOpen: true,
    minContentWidth: 280,
    maxContentWidth: undefined,
  },
  form: {
    navigationOpen: false,
    minContentWidth: 280,
    maxContentWidth: 800,
  },
  table: {
    navigationOpen: true,
    minContentWidth: 280,
    maxContentWidth: undefined,
  },
  wizard: {
    navigationOpen: false,
    minContentWidth: 280,
    maxContentWidth: 1080,
  },
};

export interface AppLayoutState {
  navigationOpen?: boolean;
  minContentWidth: number;
  maxContentWidth?: number | undefined;
}

export function applyDefaults(
  contentType: AppLayoutProps.ContentType,
  stateFromProps: Pick<AppLayoutProps, 'minContentWidth' | 'maxContentWidth' | 'navigationOpen' | 'toolsOpen'>,
  isRefresh: boolean
): AppLayoutState {
  const contentTypeDefaults = isRefresh
    ? { ...defaults[contentType], maxContentWidth: undefined }
    : defaults[contentType];

  return {
    maxContentWidth: stateFromProps.maxContentWidth ?? contentTypeDefaults.maxContentWidth,
    minContentWidth: stateFromProps.minContentWidth ?? contentTypeDefaults.minContentWidth,
    navigationOpen: stateFromProps.navigationOpen ?? contentTypeDefaults.navigationOpen,
  };
}
