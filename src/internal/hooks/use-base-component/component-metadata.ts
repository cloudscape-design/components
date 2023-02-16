// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';

// TODO: move to component-toolkit/internal/base-component

export const COMPONENT_METADATA_KEY = '__awsuiMetadata__';

export function useComponentMetadata<T = any>(componentName: string, packageVersion: string) {
  interface AwsUiMetadata {
    name: string;
    version: string;
  }

  interface HTMLMetadataElement extends HTMLElement {
    [COMPONENT_METADATA_KEY]: AwsUiMetadata;
  }

  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (elementRef.current && !Object.prototype.hasOwnProperty.call(elementRef.current, COMPONENT_METADATA_KEY)) {
      const node = elementRef.current as unknown as HTMLMetadataElement;
      const metadata = { name: componentName, version: packageVersion };

      Object.freeze(metadata);
      Object.defineProperty(node, COMPONENT_METADATA_KEY, { value: metadata, writable: false });
    }
    // Some component refs change dynamically. E.g. The Modal component where
    // the content gets rendered conditionally inside a Portal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef.current]);

  return elementRef;
}
