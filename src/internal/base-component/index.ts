// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { initAwsUiVersions } from '@cloudscape-design/component-toolkit/internal';

import { AnalyticsMetadata } from '../../types/analytics';
import { BaseComponentProps } from '../../types/base-component';
import { PACKAGE_SOURCE, PACKAGE_VERSION } from '../environment';

// these styles needed to be imported for every public component
import './styles.css.js';

initAwsUiVersions(PACKAGE_SOURCE, PACKAGE_VERSION);

export function getBaseProps(props: BaseComponentProps) {
  const baseProps: Record<string, any> = {};
  Object.keys(props).forEach(prop => {
    if (prop === 'id' || prop === 'className' || prop.match(/^data-/)) {
      baseProps[prop] = (props as Record<string, any>)[prop];
    }
  });
  return baseProps as BaseComponentProps;
}

export interface BasePropsWithAnalyticsMetadata {
  analyticsMetadata?: AnalyticsMetadata;
  __analyticsMetadata?: AnalyticsMetadata;
}

/**
 * Helper function to merge beta analytics metadata with the public analytics metadata api.
 * Beta analytics metadata will override the public values to allow for safe migration.
 */
export function getAnalyticsMetadataProps<T extends BasePropsWithAnalyticsMetadata>(
  props?: T
): NonNullable<T['analyticsMetadata'] & T['__analyticsMetadata']> {
  return { ...props?.analyticsMetadata, ...props?.__analyticsMetadata };
}
