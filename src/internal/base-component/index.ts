// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { initAwsUiVersions } from '@cloudscape-design/component-toolkit/internal';
import { PACKAGE_SOURCE, PACKAGE_VERSION } from '../environment';

// these styles needed to be imported for every public component
import './styles.css.js';
import { AnalyticsMetadata } from '../analytics/interfaces';

initAwsUiVersions(PACKAGE_SOURCE, PACKAGE_VERSION);

export interface BaseComponentProps {
  /**
   * Adds the specified classes to the root element of the component.
   * @deprecated Custom CSS is not supported. For other use cases, use [data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes).
   */
  className?: string;
  /**
   * Adds the specified ID to the root element of the component.
   * @deprecated Custom CSS is not supported. For other use cases, use [data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes).
   */
  id?: string;
  // we also support data-* attributes, but they are always implicitly allowed by typescript
  // http://www.typescriptlang.org/docs/handbook/jsx.html#attribute-type-checking
  // "Note: If an attribute name is not a valid JS identifier (like a data-* attribute), it is not considered to be an error"
}

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
  __analyticsMetadata?: AnalyticsMetadata;
}

export function getAnalyticsMetadataProps(props?: unknown) {
  return (props as BasePropsWithAnalyticsMetadata | undefined)?.__analyticsMetadata;
}
